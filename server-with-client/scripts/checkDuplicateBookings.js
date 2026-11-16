// Run BEFORE deploying the unique index. Lists slots that are already double-booked.
// node scripts/checkDuplicateBookings.js
import dotenv from "dotenv";
dotenv.config({ override: true });
import mongoose from "mongoose";
import appointmentModel from "../models/appointmentsModel.js";

await mongoose.connect(`${process.env.MONGO_LOCAL_URI}/doctorapp`);
const dups = await appointmentModel.aggregate([
  { $match: { visitStatus: "scheduled" } },
  {
    $group: {
      _id: { doctorId: "$doctorId", slotDate: "$slotDate", slotTime: "$slotTime" },
      ids: { $push: "$_id" },
      count: { $sum: 1 },
    },
  },
  { $match: { count: { $gt: 1 } } },
]);
if (dups.length === 0) console.log("No duplicate bookings. Safe to deploy.");
else {
  console.log(`${dups.length} double-booked slot(s). Cancel/fix these first:`);
  dups.forEach((d) => console.log(JSON.stringify(d)));
}
await mongoose.disconnect();
