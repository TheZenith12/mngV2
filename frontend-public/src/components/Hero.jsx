import React from 'react'


export default function Hero() {
return (
<section className="bg-gradient-to-r from-green-100 to-green-50 py-16 text-center rounded-3xl mt-6 shadow-md">
  <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Тавтай морил 🌿</h1>
  <p className="text-lg text-gray-600">Байгалийн сайхан дунд, тайвнаар амар...</p>
  <button className="mt-6 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition">
    Амралтын газруудыг үзэх
  </button>

{/* Гарчиг */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          🏕 Амралтын газрууд
        </h2>
</section>
)
}