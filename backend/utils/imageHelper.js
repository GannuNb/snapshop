export const formatImage = (image) => {
  if (!image || !image.data) return null;

  return `data:${image.contentType};base64,${image.data.toString(
    "base64"
  )}`;
};
