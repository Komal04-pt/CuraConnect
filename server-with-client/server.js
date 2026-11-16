import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "colors";
import morgan from "morgan";
import cors from "cors";
import testRoutes from "./routes/testRoutes.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import webMessageRoutes from "./routes/webMessageRoutes.js";

console.log("AFTER dotenv:", process.env.MONGO_LOCAL_URI);

//database
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/webmessage", webMessageRoutes);

app.get("/", (req, res) => {
  res.send("<h1> Node Server Running </h1>");
});

//upload / generic error handler (e.g. file too large, not an image)
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).send({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Image too large (max 2 MB)"
          : err.message || "Something went wrong",
    });
  }
  next();
});

//port
const PORT = process.env.PORT || 5000;

//run server
app.listen(PORT, () => {
  console.log(
    `Node Server Ruuning in ${process.env.NODE_ENV} Mode On Port ${PORT}`.bgCyan
      .white
  );
});