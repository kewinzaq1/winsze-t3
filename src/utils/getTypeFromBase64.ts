export const getTypeFromBase64 = (base64: string) => {
  const base64Data = base64.split(",")[0];
  const type = base64Data?.match(/:(.*?);/)?.[1];
  return type;
};
