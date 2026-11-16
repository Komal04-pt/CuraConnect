import cloudinary from "../config/cloudinary.js";

// Uploads an in-memory file buffer (from multer) to Cloudinary
// and resolves with the secure image URL.
export const uploadBufferToCloudinary = (buffer, folder = "curaconnect") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 600, height: 600, crop: "limit" }, { quality: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
