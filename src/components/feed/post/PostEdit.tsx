import Image from "next/image";
import { FcStackOfPhotos } from "react-icons/fc";
import { GiFlyingDagger } from "react-icons/gi";
import { IoMdRemoveCircle } from "react-icons/io";
import { Button } from "../../common/Button";
import { Textarea } from "../../common/Textarea";
import { usePost } from "./PostContext";

export const PostEdit = () => {
  const { onSubmit, register, isEdit, image, clearImage, isEditLoading, post } =
    usePost();

  return (
    <form onSubmit={onSubmit}>
      {isEdit && (
        <Textarea
          maxLength={255}
          placeholder="What is on your mind?"
          className="!text-2xl"
          {...register("content")}
        />
      )}
      {Boolean(image.length) && isEdit && (
        <>
          <Image
            width={500}
            height={500}
            src={image}
            alt={image}
            className="mt-2 h-full w-full rounded-md object-contain"
          />
          <IoMdRemoveCircle
            onClick={clearImage}
            role="button"
            tabIndex={0}
            aria-label="remove photo"
            className="absolute right-20 bottom-0 h-12 w-12 text-red-500"
          />
        </>
      )}
      <input
        id={`photo${post.id}`}
        accept="image/*"
        className="hidden"
        {...register("image")}
        type="file"
      />
      <label htmlFor={`photo${post.id}`}>
        <FcStackOfPhotos
          role="button"
          tabIndex={0}
          className="absolute right-4 bottom-0 h-12 w-12"
          title="pick a photo"
        />
      </label>
      <Button
        type="submit"
        variant="secondary"
        isLoading={isEditLoading}
        title="save post"
        aria-label="save post"
        className="mt-4 w-max"
      >
        <GiFlyingDagger />
      </Button>
    </form>
  );
};
