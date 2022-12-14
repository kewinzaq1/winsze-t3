import { reduceImageSize } from "./reduceImageSize";

export const imgToBase64 = async (file: File) => {
  const reduced = await reduceImageSize({
    image: file,
    maxWidth: 500,
    maxHeight: 500,
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
