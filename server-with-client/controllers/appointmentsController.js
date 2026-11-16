import appointmentModel from "../models/appointmentsModel.js";
import { getPagination, pageInfo } from "../utils/paginate.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import getRazorpayInstance from "../config/razorpay.js";
import crypto from "crypto";

// 1. Create Appointment (Fresh Booking)
export const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, amount } = req.body;
    const slotDate = req.body.slotDate?.trim();
    const slotTime = req.body.slotTime?.trim();

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Please login first to book an appointment.",
      });
    }

    if (!doctorId || !amount || !slotTime || !slotDate) {
      return res.status(400).send({
        success: false,
        message: "Please select a valid date and time slot.",
      });
    }

    // Double-booking check: is this doctor's slot already taken?
    const slotTaken = await appointmentModel.findOne({
      doctorId,
      slotDate,
      slotTime,
      visitStatus: "scheduled",
    });
    if (slotTaken) {
      return res.status(409).send({
        success: false,
        message: "This slot is already booked. Please choose another time.",
      });
    }

    const appointment = new appointmentModel({
      userId,
      doctorId,
      slotDate,
      slotTime,
      amount,
      visitStatus: "scheduled",
    });

    await appointment.save();
    res.status(201).send({
      success: true,
      message: "Appointment Booked Successfully",
      appointment,
    });
  } catch (error) {
    // Two people booking at the same moment: the unique index rejects the second one
    if (error.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "This slot is already booked. Please choose another time.",
      });
    }
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Unable to book appointment. Please try again.",
    });
  }
};

// 2. Get All Appointments (Admin Panel)
export const getAllAppointments = async (req, res) => {
  try {
    const pg = getPagination(req);
    const totalCount = await appointmentModel.countDocuments({});
    let query = appointmentModel.find({}).sort({ createdAt: -1 });
    if (pg) query = query.skip(pg.skip).limit(pg.limit);
    const appointments = await query;
    res.status(200).send({
      success: true,
      message: "All Appointments Fetched",
      totalCount,
      ...pageInfo(pg, totalCount),
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In get all appointment API",
      error,
    });
  }
};

// 3. Get Appointment Details (Admin View)
export const getAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Appointment ID",
      });
    }
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No Appointment found with this ID",
      });
    }

    const user = await userModel.findOne({ _id: appointment?.userId });
    const doctor = await doctorModel.findOne({ _id: appointment?.doctorId });

    res.status(200).send({
      success: true,
      message: "Appointment Details Fetched Successfully",
      appointmentDetails: {
        clientName: user?.name,
        clientPhone: user?.phone,
        clientEmail: user?.email,
        doctorName: doctor?.name,
        doctorPhone: doctor?.phone,
        doctorEmail: doctor?.email,
        bookingDate: appointment?.slotDate,
        bookingTime: appointment?.slotTime,
        amount: appointment?.amount,
        bookingStatus: appointment?.visitStatus,
        paymentMode: appointment?.payment,
        createdAt: appointment?.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In get appointment details API",
      error,
    });
  }
};

// 4. Change Status (Admin Update Action)
export const updateAppointmentSattus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Appointment ID",
      });
    }
    const { appointmentStatus } = req.body;
    if (!appointmentStatus) {
      return res.status(404).send({
        success: false,
        message: "Please Provide appointment Status",
      });
    }

    const validStatuses = ["scheduled", "completed", "no-show", "cancelled"];
    if (!validStatuses.includes(appointmentStatus)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Status Value",
      });
    }

    await appointmentModel.findByIdAndUpdate(
      id,
      { $set: { visitStatus: appointmentStatus } },
      { returnOriginal: false }
    );

    res.status(200).send({
      success: true,
      message: "Appointment Status Has Been Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update status appointment API",
      error,
    });
  }
};

// 5. Get User Appointments (User Panel Dashboard)
export const getUserAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please Provide User ID",
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const appoinmtent = await appointmentModel
      .find({ userId: user?._id })
      .populate("doctorId");
    res.status(200).send({
      success: true,
      message: "Your Appointments",
      totalCount: appoinmtent.length,
      appoinmtent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In get User appointment API",
      error,
    });
  }
};

// 6. Get User Appointment Details
export const getUserAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Appointment ID",
      });
    }

    const appointment = await appointmentModel.findById(id).populate("doctorId");

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No Appointment found with this ID",
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointment Details Fetched Successfully",
      appointmentDetails: {
        doctorName: appointment.doctorId?.name || "Not Available",
        doctorPhone: appointment.doctorId?.phone || "Not Available",
        doctorEmail: appointment.doctorId?.email || "Not Available",
        bookingDate: appointment?.slotDate,
        bookingTime: appointment?.slotTime,
        amount: appointment?.amount,
        bookingStatus: appointment?.visitStatus,
        paymentMode: appointment?.payment,
        createdAt: appointment?.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In get appointment details API",
      error,
    });
  }
};

// 7. Cancel Appointment (User Action)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Appointment ID",
      });
    }
    const appoinmtent = await appointmentModel.findById(id);
    if (!appoinmtent) {
      return res.status(404).send({
        success: false,
        message: "No Appointment found with this ID",
      });
    }

    await appoinmtent.updateOne({ $set: { visitStatus: "cancelled" } });
    res.status(200).send({
      success: true,
      message: "Appointment Cancelled Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In cancel appointment API",
      error,
    });
  }
};

// 8. Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).send({
        success: false,
        message: "Please Provide Appointment ID",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No Appointment found with this ID",
      });
    }

    const options = {
      amount: Number(appointment.amount) * 100,
      currency: "INR",
      receipt: `receipt_${appointmentId}`,
    };

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);

    res.status(200).send({
      success: true,
      message: "Order Created Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In create payment order API",
      error,
    });
  }
};

// 9. Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !appointmentId
    ) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Payment Details",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).send({
        success: false,
        message: "Payment Verification Failed - Invalid Signature",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      $set: {
        payment: true,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    res.status(200).send({
      success: true,
      message: "Payment Verified Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In verify payment API",
      error,
    });
  }
};