import dotenv from "dotenv";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./src/config/db.js";
import upload from "./src/middleware/upload.js"; // multer-storage-cloudinary
import authRoutes from "./src/routes/auth.js";
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from "./src/routes/fileRoutes.js";
import serverless from "serverless-http";

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());

// ✅ CORS тохиргоо
const allowedOrigins = [
  "https://amaralt-admin.vercel.app",
  "https://amaralt.vercel.app",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload route (Cloudinary storage ашиглана)
app.post(
  "/api/admin/upload",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      // multer-storage-cloudinary нь Cloudinary-д upload хийсний дараа file.path = secure_url хэлбэртэй ирдэг
      const images = (req.files["images"] || []).map(
        (f) => f.path || f.secure_url || f.url
      );
      const videos = (req.files["videos"] || []).map(
        (f) => f.path || f.secure_url || f.url
      );

      // Хариу буцаах
      res.json({ images, videos });
    } catch (err) {
      console.error("❌ Upload failed:", err);
      res
        .status(500)
        .json({ message: "Upload failed", error: err.message || err });
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

// Export as serverless function
export default serverless(app);
