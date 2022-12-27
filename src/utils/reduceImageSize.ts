import type { Blob } from "buffer";

interface ReduceImageSize {
  image: File;
  maxWidth: number;
  maxHeight: number;
}

export const reduceImageSize = ({
  image,
  maxWidth,
  maxHeight,
}: ReduceImageSize) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const elem = document.createElement("canvas");
        elem.width = maxWidth;
        elem.height = maxHeight;
        const ctx = elem.getContext("2d");
        ctx?.drawImage(img, 0, 0, maxWidth, maxHeight);
        ctx?.canvas.toBlob(
          (blob) => {
            const file = new File([blob as BlobPart], image.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(file);
          },
          "image/jpeg",
          1
        );
      };
      reader.onerror = (error) => reject(error);
    };
  });
};
