import express from "express";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";
import upload from "../middleware/upload.js"; // Cloudinary upload middleware

const router = express.Router();

// === Routes ===

// Бүх resort авах
router.get("/", getResorts);

// Нэг resort авах
router.get("/:id", getResortById);

// Шинэ resort нэмэх
router.post(
  "/new",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createResort
);

// Resort шинэчлэх
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  updateResort
);

// Resort устгах
router.delete("/:id", deleteResort);

export default router;
