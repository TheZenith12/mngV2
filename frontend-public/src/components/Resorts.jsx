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

  async function fetchResorts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`);
      const data = await res.json();

      const resorts = (data.resorts || data).map((r) => {
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

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        ⏳ Мэдээлэл ачаалж байна...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600 text-lg">
        ⚠️ Алдаа гарлаа: {error}
      </div>
    );

  return (
    <div className="relative w-full bg-gradient-to-b from-sky-50 to-green-50 py-10">
      <div className="container mx-auto px-6">
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((p) => (
              <article
                key={p._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1 hover:scale-105 duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                    onError={(e) => (e.currentTarget.src = "/no-image.png")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 text-center line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm text-center flex-1 line-clamp-3">
                    {p.description || "Тайлбар байхгүй"}
                  </p>
                  <p className="mt-3 text-green-700 font-semibold text-center">
                    {p.price ? `${parseInt(p.price).toLocaleString()} ₮` : "—"}
                  </p>
                  <div className="mt-5 flex justify-center">
                    <Link
                      to={`/details/${p._id}`}
                      className="px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-transform hover:scale-105 shadow-md"
                    >
                      Дэлгэрэнгүй үзэх
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10 text-lg">
            😕 Тохирох амралт олдсонгүй.
          </p>
        )}
      </div>

      {/* Floating Search Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="p-4 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
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
