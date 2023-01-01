import { zodResolver } from "@hookform/resolvers/zod";
import type { Post } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNotifier } from "src/components/notifier";
import { useClickAway } from "src/hooks/useClickAway";
import { imgToBase64 } from "src/utils/imgToBase64";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

interface Params {
  post: RouterOutputs["posts"]["getPosts"][number];
  userId?: string;
  singlePost?: boolean;
}

export const usePost = ({ post, userId, singlePost }: Params) => {
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
    const sendingImage = await imgToBase64({
      image: values.image[0] as File,
      maxWidth: 500,
      maxHeight: 500,
    });
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
      if (singlePost && session) {
        return updateQuerySinglePost({
          post,
          session,
          queryClient,
        });
      }

      if (!userId && session) {
        return updateQueryPosts({
          post,
          session,
          queryClient,
        });
      }
      if (userId && session) {
        return updateQueryUser({
          userId,
          post,
          session,
          queryClient,
        });
      }
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

const updateQueryPosts = async ({
  queryClient,
  post,
  session,
}: {
  queryClient: QueryClient;
  post: Post;
  session: Session;
}) => {
  const QUERY = [["posts", "getPosts"], { input: {}, type: "query" }];
  await queryClient.cancelQueries(QUERY);

  const previousValue = queryClient.getQueryData([
    ["posts", "getPosts"],
    { input: {}, type: "query" },
  ]);
  queryClient.setQueryData(QUERY, (old: unknown) => {
    const modified = old as RouterOutputs["posts"]["getPosts"];
    const postIndex = modified.findIndex((p) => p.id === post.id);
    const updatedPost = modified[postIndex];
    const likeIndex = updatedPost?.Like.findIndex(
      (like) => like.userId === session?.user?.id
    );

    if (!updatedPost) {
      return old;
    }

    if (likeIndex === undefined) {
      return old;
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
    modified[postIndex] = updatedPost;
    return modified;
  });
  return previousValue;
};

const updateQueryUser = async ({
  queryClient,
  userId,
  post,
  session,
}: {
  queryClient: QueryClient;
  userId: string;
  post: Post;
  session: Session;
}) => {
  const QUERY = [
    ["users", "getUser"],
    { input: { id: userId }, type: "query" },
  ];
  await queryClient.cancelQueries(QUERY);
  console.log(QUERY);

  queryClient.setQueryData(QUERY, (old) => {
    const modified = old as RouterOutputs["users"]["getUser"];
    console.log("modified", modified);
    if (!modified) {
      return old;
    }

    const postIndex = modified.Post.findIndex((p) => p.id === post.id);
    console.log("postIndex", postIndex);
    if (postIndex === undefined) return;

    const updatedPost = modified.Post[postIndex];
    const likeIndex = updatedPost?.Like.findIndex(
      (like) => like.userId === session?.user?.id
    );
    if (likeIndex === undefined || updatedPost === undefined) {
      return old;
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
    modified.Post[postIndex] = updatedPost;

    console.log(modified);
    return modified;
  });

  const previousValue = queryClient.getQueryData(QUERY);
  return previousValue;
};

const updateQuerySinglePost = async ({
  queryClient,
  post,
  session,
}: {
  queryClient: QueryClient;
  post: Post;
  session: Session;
}) => {
  const QUERY = [
    ["posts", "getPost"],
    { input: { id: post.id }, type: "query" },
  ];
  await queryClient.cancelQueries(QUERY);

  const previousValue = queryClient.getQueryData(QUERY);
  queryClient.setQueryData(QUERY, (old: unknown) => {
    const modified = old as RouterOutputs["posts"]["getPost"];
    if (!modified) {
      return old;
    }
    const likeIndex = modified.Like.findIndex(
      (like) => like.userId === session?.user?.id
    );

    if (likeIndex === undefined) {
      return old;
    }
    console.log(likeIndex);

    if (likeIndex !== -1) {
      modified.Like.splice(likeIndex, 1);
      modified._count.Like--;
    } else {
      modified.Like.push({
        userId: session?.user?.id ?? "",
        id: "",
        postId: post.id,
      });
      modified._count.Like++;
    }

    return modified;
  });
  return previousValue;
};
