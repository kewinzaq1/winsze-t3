export const base64ToBuffer = (base64: string) => {
  const base64Image = base64.split(";base64,").pop() as string;
  const buffer = Buffer.from(base64Image, "base64");
  return buffer;
};
