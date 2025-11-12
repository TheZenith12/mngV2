import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./src/config/db.js";
import upload from "./src/middleware/upload.js"; // multer-storage-cloudinary
import authRoutes from "./src/routes/auth.js";
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from "./src/routes/fileRoutes.js";
import serverless from "serverless-http";

dotenv.config();

// ✅ MongoDB холболт
await connectDB();

const app = express();
app.use(express.json());

// ✅ CORS тохиргоо
const allowedOrigins = [
  "https://amaralt-admin.vercel.app",
  "https://amaralt.vercel.app",
  "http://localhost:5173" // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload route
app.post(
  "/api/admin/upload",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const images = (req.files["images"] || []).map(
        (f) => f.path || f.secure_url || f.url
      );
      const videos = (req.files["videos"] || []).map(
        (f) => f.path || f.secure_url || f.url
      );

      res.json({ images, videos });
    } catch (err) {
      console.error("❌ Upload failed:", err);
      res.status(500).json({ message: "Upload failed", error: err.message || err });
    }
  }
);

// ✅ Routes
app.use("/api/admin", authRoutes);
app.use("/api/admin/resorts", resortRoutes);
app.use("/api/admin/files", fileRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// ✅ Алдаа барих middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ message: err.message });
});

// ✅ Vercel-д зориулсан handler export
export const handler = serverless(app);   