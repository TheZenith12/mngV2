import React from "react";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl mt-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* Text Container */}
      <div className="relative container mx-auto px-6 py-32 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-400 drop-shadow-lg">
          Тавтай морил 🌿
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-800/90 drop-shadow-md">
          Байгаль, тайван амралт, тохилог байр
        </p>

        <h2 className="text-3xl font-bold mt-10 text-gray-700 drop-shadow-md">
          🏕 Амралтын газрууд
        </h2>

        <a
          href="#resorts"
          className="mt-8 inline-block px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
        >
          🏕 Амралтын газруудыг харах
        </a>
      </div>
    </section>
  );
}
