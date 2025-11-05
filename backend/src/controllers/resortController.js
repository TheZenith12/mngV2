import mongoose from "mongoose";
import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import { v2 as cloudinary } from "cloudinary";

// ============================
// ✅ Cloudinary Config
// ============================
cloudinary.config({
  cloud_name: process.env.dl9bp4ja3,
  api_key: process.env.HIl2RWE42Q10phihm3k20U,
  api_secret: process.env.228483613417514,
});

// ============================
// ✅ GET ALL RESORTS (List)
// ============================
export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "resortsId",
          as: "files",
        },
      },
      {
        $addFields: {
          image: { $arrayElemAt: ["$files.images", 0] },
        },
      },
      {
        $project: { files: 0, __v: 0 },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ success: true, count: resorts.length, resorts });
  } catch (err) {
    console.error("❌ getResorts алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// ✅ GET Resort by ID
// ============================
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort)
      return res.status(404).json({ message: "Resort олдсонгүй" });

    const files = await File.find({ resortsId: resort._id });
    res.json({ resort, files });
  } catch (err) {
    console.error("❌ getResortById алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================
// ✅ CREATE Resort
// ============================
export const createResort = async (req, res) => {
  try {
    const { name, description, price, location } = req.body;

    // Resort үүсгэх
    const newResort = new Resort({ name, description, price, location });
    const savedResort = await newResort.save();

    // Файл хадгалах (Cloudinary URL)
    if (req.files && (req.files.images || req.files.videos)) {
      const images = req.files.images ? req.files.images.map((f) => f.path) : [];
      const videos = req.files.videos ? req.files.videos.map((f) => f.path) : [];

      const newFile = new File({
        resortsId: savedResort._id,
        images,
        videos,
      });
      await newFile.save();
    }

    res.status(201).json({
      success: true,
      message: "🏕️ Resort амжилттай нэмэгдлээ",
      resort: savedResort,
    });
  } catch (error) {
    console.error("❌ Resort үүсгэхэд алдаа:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// ✅ UPDATE Resort
// ============================
export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      location,
      removedImages,
      removedVideos,
    } = req.body;

    const parsedRemovedImages = removedImages ? JSON.parse(removedImages) : [];
    const parsedRemovedVideos = removedVideos ? JSON.parse(removedVideos) : [];

    const resort = await Resort.findById(id);
    if (!resort)
      return res.status(404).json({ message: "Resort олдсонгүй" });

    // Resort мэдээлэл шинэчлэх
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    await resort.save();

    // 🗑️ Cloudinary дээрх устгах зураг/видео
    const deleteFromCloudinary = async (url, type) => {
      try {
        const publicId = url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `resorts/${type === "video" ? "videos/" : ""}${publicId}`,
          { resource_type: type }
        );
      } catch (err) {
        console.error("Cloudinary устгалын алдаа:", err.message);
      }
    };

    for (const img of parsedRemovedImages)
      await deleteFromCloudinary(img, "image");
    for (const vid of parsedRemovedVideos)
      await deleteFromCloudinary(vid, "video");

    // DB-с устгах
    if (parsedRemovedImages.length > 0)
      await File.updateMany(
        { resortsId: id },
        { $pull: { images: { $in: parsedRemovedImages } } }
      );
    if (parsedRemovedVideos.length > 0)
      await File.updateMany(
        { resortsId: id },
        { $pull: { videos: { $in: parsedRemovedVideos } } }
      );

    // Шинэ файлууд нэмэх
    if (req.files?.images?.length) {
      const images = req.files.images.map((f) => f.path);
      await File.updateOne(
        { resortsId: id },
        { $push: { images: { $each: images } } },
        { upsert: true }
      );
    }

    if (req.files?.videos?.length) {
      const videos = req.files.videos.map((f) => f.path);
      await File.updateOne(
        { resortsId: id },
        { $push: { videos: { $each: videos } } },
        { upsert: true }
      );
    }

    const files = await File.find({ resortsId: id });
    res.json({
      success: true,
      message: "✅ Resort шинэчлэгдлээ",
      resort,
      files,
    });
  } catch (err) {
    console.error("❌ Resort update алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================
// ✅ DELETE Resort
// ============================
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;
    const resort = await Resort.findById(id);
    if (!resort)
      return res.status(404).json({ message: "Resort олдсонгүй" });

    const files = await File.find({ resortsId: id });

    // Cloudinary дээрх бүх зургийг устгах
    for (const f of files) {
      if (f.images) {
        for (const img of f.images) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`resorts/${publicId}`, {
            resource_type: "image",
          });
        }
      }
      if (f.videos) {
        for (const vid of f.videos) {
          const publicId = vid.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`resorts/videos/${publicId}`, {
            resource_type: "video",
          });
        }
      }
    }


    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "🏕️ Resort болон холбогдсон Cloudinary файл устлаа",
    });
  } catch (err) {
    console.error("❌ Resort устгахад алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};
