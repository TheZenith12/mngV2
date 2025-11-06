// middlewares/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ☁️ Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Folder тохиргоо
    let folder = "resorts";
    if (file.fieldname === "videos") folder = "resorts/videos";

    return {
      folder,
      resource_type: file.fieldname === "videos" ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// ✅ Multer middleware
const upload = multer({ storage });

export default upload;
