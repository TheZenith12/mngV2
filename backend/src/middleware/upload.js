import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ☁️ Cloudinary тохиргоо
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // upload төрөлд үндэслэн хавтас сонгоно
    let folder = "resorts";
    if (file.fieldname === "videos") folder = "resorts/videos";

    return {
      folder,
      resource_type: file.fieldname === "videos" ? "video" : "image",
      allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({ storage });

export default upload;