import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from './src/routes/fileRoutes.js';

dotenv.config();
await connectDB(); // ⚠️ энэ мөрийг шууд await хэлбэрээр

const app = express();

// ✅ CORS тохиргоо
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://amaralt-admin.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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

const parser = multer({ dest: "uploads/" });

// Upload route
app.post(
  "/api/admin/upload",
  parser.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const uploadedImages = req.files["images"] || [];
      const uploadedVideos = req.files["videos"] || [];

      const imageUrls = await Promise.all(
        uploadedImages.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "resorts" })
        )
      );
      const videoUrls = await Promise.all(
        uploadedVideos.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "resorts",
            resource_type: "video",
          })
        )
      );

      res.json({
        images: imageUrls.map((r) => r.secure_url),
        videos: videoUrls.map((r) => r.secure_url),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed", error });
    }
  }
);

// API routes
app.use("/api/admin/resorts", resortRoutes);
app.use("/api/admin/files", fileRoutes);
app.use("/api/admin", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

export default app;
