import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

function Resorts() {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🏕️ Амралтын газруудыг авах
  async function fetchResorts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`);
      const data = await res.json();
      setList(data);

      const resorts = (data.resorts || data).map((r) => {
        // 🖼️ Зургийн логик (array, object, string аль ч тохиолдолд)
        let imgSrc = "";
        if (Array.isArray(r.image)) {
          imgSrc = r.image[0];
        } else if (typeof r.image === "string") {
          imgSrc = r.image;
        } else if (r.image && typeof r.image === "object") {
          imgSrc = r.image.url || r.image.path || Object.values(r.image)[0];
        }

        const fullImg = imgSrc
          ? /^https?:\/\//i.test(imgSrc)
            ? imgSrc
            : `${API_BASE}${imgSrc.startsWith("/") ? imgSrc : `/${imgSrc}`}`
          : "/no-image.png";

        return { ...r, image: fullImg };
      });

      setList(resorts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResorts();
  }, []);

  // 🔍 Хайлтын систем
  const filteredList = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.price?.toString().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [searchTerm, list]);

  // 🌀 Ачаалж байгаа эсвэл алдаа
   if (loading)
    return <div className="text-center py-20 text-lg text-gray-600">⏳ Мэдээлэл ачаалж байна...</div>;

  if (error)
    return <div className="text-center py-20 text-red-600 text-lg">⚠️ Алдаа гарлаа: {error}</div>;

  return (
    <div className="relative w-full bg-gradient-to-b from-green-50 via-sky-50 to-emerald-100 py-16">
      <div className="absolute inset-0 bg-[url('/resort-bg.jpg')] bg-cover bg-center opacity-20"></div>

      <div className="relative container mx-auto px-6">
        {filteredList.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {filteredList.map((p) => (
              <motion.article
                key={p._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = '/no-image.png')}
                />
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-green-800 text-center">{p.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 text-center flex-1 line-clamp-2">{p.description || "Тайлбар байхгүй"}</p>
                  <p className="mt-3 text-green-700 font-semibold text-center">
                    Үнэ: {p.price ? `${parseInt(p.price).toLocaleString()} ₮` : "—"}
                  </p>
                  <div className="mt-5 flex justify-center">
                    <Link
                      to={`/details/${p._id}`}
                      className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:scale-110 transition-transform duration-300"
                    >
                      Дэлгэрэнгүй үзэх
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600 mt-10 text-lg">😕 Тохирох амралт олдсонгүй.</p>
        )}
      </div>

      {/* Floating search button */}
      <div className="fixed bottom-8 right-8 z-50">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="p-4 bg-green-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
          >
            <Search className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-2 animate-slide-left">
            <input
              type="text"
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Бүгдийг харах
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className="ml-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resorts;
