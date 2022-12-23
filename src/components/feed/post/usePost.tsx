import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNotifier } from "src/components/notifier";
import { useClickAway } from "src/hooks/useClickAway";
import { imgToBase64 } from "src/utils/imgToBase64";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export const usePost = (post: RouterOutputs["posts"]["getPosts"][number]) => {
  const queryClient = useQueryClient();
  const { show } = useNotifier();
  const utils = trpc.useContext();
  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openComments, setOpenComments] = useState(false);

  const [mode, setMode] = useState<"edit" | "preview">("preview");
  const [image, setImage] = useState(post.image ?? "");
  const { data: session } = useSession();

  const {
    mutate: editPost,
    error: editError,
    isLoading: isEditLoading,
  } = trpc.posts.editPost.useMutation({
    onSuccess: () => {
      setMode("preview");
      utils.posts.getPosts.invalidate({});
      show({
        message: "Post edited",
        description: "Your post has been edited successfully",
        type: "success",
      });
    },
    onError: (err) => {
      show({
        message: err.message,
        description: err?.message,
        type: "error",
      });
    },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
    resetField,
    setFocus,
  } = useForm({
    resolver: zodResolver(
      z.object({ content: z.string(), image: z.any().optional() })
    ),
    defaultValues: {
      content: post.content,
      image: [] as unknown as FileList,
    },
  });

  const isAuthor = post.userId === session?.user?.id;

  const isEdit = mode === "edit";
  const isPreview = mode === "preview";
  const setEdit = () => {
    setMode("edit");
    setTimeout(() => setFocus("content"), 100);
    setOpenMenu(false);
  };

  const clearImage = () => {
    setImage("");
    resetField("image");
  };

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
      if (!value.image?.[0]) {
        return;
      }
      const url = URL.createObjectURL(value.image[0]);
      setImage(url);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit(async (values) => {
    if (!values.image.length) {
      editPost({
        id: post.id,
        content: values.content,
        removePhoto: !Boolean(image.length),
      });
      return;
    }
    const sendingImage = await imgToBase64(values.image[0] as File);
    editPost({
      id: post.id,
      content: values.content,
      image: sendingImage as string,
      removePhoto: !Boolean(image.length),
    });
  });

  const menuRef = createRef<HTMLElement>();
  useClickAway(menuRef, () => setOpenMenu(false));

  const { mutate: deletePost, isLoading: isDeleting } =
    trpc.posts.deletePost.useMutation({
      onSuccess: () => {
        utils.posts.getPosts.invalidate({});
        setOpenConfirm(false);
        setOpenMenu(false);
        show({
          message: "Post deleted",
          description: "Your post has been deleted successfully",
          type: "success",
        });
      },
      onError: (err) => {
        show({
          message: err.message,
          description: err?.message,
          type: "error",
        });
      },
    });

  const userLike = post.Like.find((like) => like.userId === session?.user?.id);

  const { mutate: toggleLike } = trpc.posts.toggleLike.useMutation({
    onMutate: async () => {
      const QUERY = [["posts", "getPosts"], { input: {}, type: "query" }];

      await queryClient.cancelQueries(QUERY);
      const previousValue = queryClient.getQueryData([
        ["posts", "getPosts"],
        { input: {}, type: "query" },
      ]);
      queryClient.setQueryData(QUERY, (old) => {
        type GetPosts = RouterOutputs["posts"]["getPosts"];
        const postIndex = (old as GetPosts).findIndex((p) => p.id === post.id);
        const updatedPost = (old as GetPosts)[postIndex];
        const likeIndex = updatedPost?.Like.findIndex(
          (like) => like.userId === session?.user?.id
        );
        if (!likeIndex || !updatedPost) {
          return;
        }
        if (likeIndex !== -1) {
          updatedPost?.Like.splice(likeIndex, 1);
          updatedPost._count.Like--;
        } else {
          updatedPost.Like.push({
            userId: session?.user?.id ?? "",
            id: "",
            postId: post.id,
          });
          updatedPost._count.Like++;
        }
        (old as GetPosts)[postIndex] = updatedPost;
        return old;
      });
      return previousValue;
    },
  });

  const { mutate: reportPost } = trpc.posts.reportPost.useMutation({
    onSuccess: () => {
      setOpenMenu(false);
    },
  });

  const saveLink = () => {
    navigator.clipboard.writeText(`${window.origin}/post/${post.id}`);
    show({
      message: "Link copied",
      description: "The link has been copied to your clipboard",
      type: "success",
    });
  };

  return {
    isAuthor,
    isEdit,
    isPreview,
    isEditLoading,
    isDeleting,
    openMenu,
    openConfirm,
    openComments,
    setOpenMenu,
    setOpenConfirm,
    setOpenComments,
    menuRef,
    editError,
    errors,
    register,
    onSubmit,
    setEdit,
    clearImage,
    image,
    deletePost,
    userLike,
    toggleLike,
    reportPost,
    saveLink,
    setMode,
  };
};
