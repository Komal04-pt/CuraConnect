import webmessageModel from "../models/webMessage.js";
import { getPagination, pageInfo } from "../utils/paginate.js";

export const createMessage = async (req, res) => {
  try {
    const { name, contact, message, type } = req.body;
    if (!name || !contact || !message) {
      return res.status(402).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    const webMessage = new webmessageModel({
      name,
      contact,
      message,
      type: type || "Enquiry",
    });
    await webMessage.save();
    res.status(201).send({
      success: true,
      message: "Your Message Sent Successfully",
      webMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Web Message Api",
      error,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const pg = getPagination(req);
    const totalCount = await webmessageModel.countDocuments({});
    let query = webmessageModel.find({}).sort({ createdAt: -1 });
    if (pg) query = query.skip(pg.skip).limit(pg.limit);
    const webMessages = await query;
    res.status(200).send({
      success: true,
      message: "all web messages",
      totalCount,
      ...pageInfo(pg, totalCount),
      webMessages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In get all Web Message Api",
      error,
    });
  }
};

export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;
    if (!adminReply) {
      return res.status(400).send({
        success: false,
        message: "Please provide a reply",
      });
    }
    const webMessage = await webmessageModel.findByIdAndUpdate(
      id,
      { $set: { adminReply, status: "resolved" } },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Reply sent successfully",
      webMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In reply Web Message Api",
      error,
    });
  }
};

export const deleteWebMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please Provide message id",
      });
    }
    await webmessageModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Message has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In delete Web Message Api",
      error,
    });
  }
};