import { reduceImageSize } from "./reduceImageSize";

interface Params {
  image: File;
  maxWidth: number;
  maxHeight: number;
}

export const imgToBase64 = async ({ image, maxWidth, maxHeight }: Params) => {
  const reduced = await reduceImageSize({
    image,
    maxWidth,
    maxHeight,
  });

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(reduced as File);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
