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

// CORS
const allowedOrigins = [
  "https://amaralt-admin.vercel.app",
  "https://amaralt.vercel.app"
];
app.use(cors({ origin: allowedOrigins }));

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Cloudinary-д upload хийхээр тохируулна
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resorts", // Cloudinary-д үүсгэгдэх folder
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage });

// Файл upload endpoint
app.post("/api/admin/upload", parser.single("image"), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path }); // Cloudinary URL-г буцаана
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

// MongoDB холболт
connectDB();

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

// Сервер эхлүүлэх
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
