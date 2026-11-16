import cloudinary from "../config/cloudinary.js";

// Uploads an in-memory file buffer (from multer) to Cloudinary
// and resolves with the secure image URL.
export const uploadBufferToCloudinary = (buffer, folder = "curaconnect") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 600, height: 600, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

// Deletes an existing Cloudinary image using its secure_url
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;
    const parts = imageUrl.split("/upload/")[1];
    if (!parts) return;
    const withoutVersion = parts.replace(/^v\d+\//, "");
    const publicId = withoutVersion.substring(
      0,
      withoutVersion.lastIndexOf(".")
    );
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Cloudinary delete warning:", error.message);
  }
};