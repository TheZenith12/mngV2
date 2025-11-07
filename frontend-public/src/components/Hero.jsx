import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl mt-4 bg-gradient-to-r from-emerald-200 via-sky-100 to-green-100 shadow-xl">
      {/* 🔹 Background animated gradient blur */}
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-40 animate-slow-zoom"></div>

      <div className="relative container mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-md"
        >
          Тавтай морил 🌿
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg md:text-xl text-gray-700"
        >
          Байгаль, тайван амралт, тохилог байр
        </motion.p>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-3xl font-bold mt-10 text-gray-800"
        >
          🏕 Амралтын газрууд
        </motion.h2>
      </div>
    </section>
  );
}
