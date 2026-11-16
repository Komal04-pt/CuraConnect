export const getImageSrc = (img, fallback = "") => {
  if (!img) return fallback;
  if (img.startsWith("http")) return img; // Cloudinary URL
  return `data:image/jpeg;base64,${img}`; // legacy base64 (before migration)
};
