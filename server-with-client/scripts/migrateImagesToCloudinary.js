// One-time migration: moves old base64 images stored in MongoDB to Cloudinary.
// Run once (from server-with-client):  node scripts/migrateImagesToCloudinary.js
// Safe to re-run: documents whose image already starts with "http" are skipped.
import dotenv from "dotenv";
dotenv.config({ override: true });
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

const migrate = async (Model, folder) => {
  const docs = await Model.find({ image: { $exists: true, $ne: "" } });
  let done = 0;
  for (const doc of docs) {
    if (!doc.image || doc.image.startsWith("http")) continue;
    try {
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${doc.image}`,
        { folder, resource_type: "image" }
      );
      await Model.updateOne({ _id: doc._id }, { $set: { image: result.secure_url } });
      done++;
      console.log(`${Model.modelName} ${doc._id} -> ${result.secure_url}`);
    } catch (e) {
      console.log(`FAILED ${Model.modelName} ${doc._id}:`, e.message);
    }
  }
  console.log(`${Model.modelName}: migrated ${done} of ${docs.length}`);
};

await mongoose.connect(process.env.MONGO_LOCAL_URI);
await migrate(userModel, "curaconnect/users");
await migrate(doctorModel, "curaconnect/doctors");
await mongoose.disconnect();
