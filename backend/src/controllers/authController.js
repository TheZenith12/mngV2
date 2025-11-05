import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔹 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Админ хайна
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Password шалгана
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. JWT token үүсгэнэ
    const token = jwt.sign({ id: admin._id }, "secretkey", { expiresIn: "1d" });

    // 4. Амжилттай хариу буцаана
    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Email бүртгэлтэй эсэхийг шалгана
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Password хашлах
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Шинэ админ үүсгэх
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
