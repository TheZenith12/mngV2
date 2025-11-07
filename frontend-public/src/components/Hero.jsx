import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl mt-4 bg-gradient-to-r from-emerald-200 via-sky-100 to-green-100 shadow-xl"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative container mx-auto px-6 py-20 text-center bg-white/70 backdrop-blur-sm rounded-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-md">
          Тавтай морил 🌿
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-700">
          Байгаль, тайван амралт, тохилог байр
        </p>

        <h2 className="text-3xl font-bold mt-10 text-gray-800">
          🏕 Амралтын газрууд
        </h2>
      </div>
    </section>
  );
}
