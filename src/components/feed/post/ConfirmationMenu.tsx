import { useCallback } from "react";
import { Button } from "../../common/Button";
import { usePost } from "./PostContext";

export const PostConfirmationMenu = () => {
  const {
    setOpenConfirm,
    isDeleting,
    deletePost,
    setMode,
    setOpenComments,
    setImage,
    setValue,
    setOpenMenu,
    post,
  } = usePost();

  const cancelEdit = useCallback(() => {
    setMode("preview");
    setOpenComments(false);
    setOpenMenu(false);
    setImage(post.image || "");
    setValue("content", post.content);
  }, [
    post.content,
    post.image,
    setImage,
    setMode,
    setOpenComments,
    setOpenMenu,
    setValue,
  ]);

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/20"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpenConfirm(false);
        }
      }}
    >
      <div className="z-50 mx-4 flex h-max w-full max-w-xl flex-col gap-4 rounded-md bg-white p-4 shadow-md">
        <header>
          <p className="text-2xl font-semibold">Are you sure?</p>
          <p>To delete this post</p>
        </header>
        <footer className="flex w-full items-center justify-end gap-2">
          <Button variant="secondary" className="p-2" onClick={cancelEdit}>
            cancel
          </Button>
          <Button
            variant="error"
            className="p-2"
            isLoading={isDeleting}
            onClick={deletePost}
          >
            delete
          </Button>
        </footer>
      </div>
    </div>
  );
};
