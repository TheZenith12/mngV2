import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // илүү цэвэрхэн болгож өгдөг
      lowercase: true, // бүх email-ийг жижиг үсгээр хадгална
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt нэмнэ
);

// Модель үүсгэнэ (нэрийг нэг мөр “Admin” гэж нэрлэх нь илүү зөв)
export default mongoose.model("Admin", adminSchema);
