import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Local imports
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from './src/routes/fileRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "https://amaralt-admin.vercel.app", // Admin панель
    "https://amaralt.vercel.app"        // Public сайт
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Cloudinary-д upload хийхээр тохируулна
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resorts",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage });

// Файл upload endpoint
app.post(
  "/api/admin/upload",
  parser.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const uploadedImages = req.files["images"] || [];
      const uploadedVideos = req.files["videos"] || [];

      // Зураг upload хийх
      const imageUrls = await Promise.all(
        uploadedImages.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "resorts" })
        )
      );

      // Видео upload хийх (resource_type = "video" заавал!)
      const videoUrls = await Promise.all(
        uploadedVideos.map((file) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: "video",
            folder: "resorts",
          })
        )
      );

      res.json({ images: imageUrls.map((r) => r.secure_url), videos: videoUrls.map((r) => r.secure_url) });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error });
    }
  }
);


// __dirname тохиргоо
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API маршрутууд
app.use('/api/admin/resorts', resortRoutes);
app.use("/api/admin/files", fileRoutes);
app.use("/api/admin", authRoutes);

// Алдаа барих middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

const PORT = process.env.PORT || 5000;

// Сервер эхлүүлэх
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

startServer();
