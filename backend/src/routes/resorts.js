import express from "express";
import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import upload from "../middlewares/upload.js"; // Cloudinary upload middleware
import {
  getResorts,
  getResortById,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";

const router = express.Router();

// ================================
// 1️⃣ Шинэ Resort + File үүсгэх
// ================================
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, description, price, location } = req.body;

      // Resort create
      const resort = await Resort.create({ name, description, price, location });

      // Cloudinary URL-ууд
      const images = (req.files["images"] || []).map(f => f.path || f.secure_url);
      const videos = (req.files["videos"] || []).map(f => f.path || f.secure_url);

      // File document
      const fileDoc = await File.create({
        resortId: resort._id,
        images,
        videos,
      });

      res.status(201).json({ resort, files: fileDoc });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Create resort failed", error: err.message });
    }
  }
);

// ================================
// 2️⃣ Бүх Resort авах
// ================================
router.get("/", getResorts);

// ================================
// 3️⃣ Нэг Resort авах
// ================================
router.get("/:id", getResortById);

// ================================
// 4️⃣ Resort update (шинэ зураг/видео upload боломжтой)
// ================================
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  updateResort
);

// ================================
// 5️⃣ Resort устгах
// ================================
router.delete("/:id", deleteResort);

export default router;
