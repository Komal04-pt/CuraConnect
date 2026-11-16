import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "doctor",
    },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    amount: { type: String, required: true },

  visitStatus: {
  type: String,
  enum: ["scheduled", "completed", "no-show", "cancelled"],
  default: "scheduled"
},
    payment: { type: Boolean, default: false }, // typo fix: defult -> default
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

// Indexes for faster lookups
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ doctorId: 1, slotDate: 1 });

// Prevent double booking: one *scheduled* appointment per doctor + date + time.
// Cancelled / completed ones don't block the slot, so it can be booked again after a cancel.
appointmentSchema.index(
  { doctorId: 1, slotDate: 1, slotTime: 1 },
  { unique: true, partialFilterExpression: { visitStatus: "scheduled" } }
);

const appointmentModel = mongoose.model("appointment", appointmentSchema);

export default appointmentModel;