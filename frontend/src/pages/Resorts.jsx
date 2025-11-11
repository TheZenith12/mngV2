import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function Resorts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Resort жагсаалт авах
  async function fetchResorts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`);
      if (!res.ok) throw new Error("Failed to fetch resorts");
      const data = await res.json();
      setList(data.resorts || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResorts();
  }, []);

  // 🔹 Resort устгах
  async function removeResort(id) {
    if (!confirm("Та энэ амралтын газрыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete resort");
      setList(list.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-800 text-center sm:text-left">
          🏕 Амралтын газрууд
        </h2>
        <Link
          to="/resorts/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition text-center"
        >
          + Add Resort
        </Link>
      </div>

      {loading && <div className="text-center py-6">Loading resorts...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col"
          >
            <img
                src={r.image}
                alt={r.name}
                className="w-full h-48 object-cover"
                onError={(e) => (e.currentTarget.src = '/no-image.png')}
              />
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-800 mb-1">
                {r.name}
              </div>
              <div className="text-gray-600 text-sm mb-2 line-clamp-2">
                {r.description || "No description"}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                💰 Үнэ:{" "}
                <span className="font-semibold">
                  {r.price ? `${r.price} ₮` : "—"}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                📍 Байршил: {r.location || "—"}
              </div>
            </div>

            <div className="flex justify-between sm:justify-end gap-2 mt-3">
              <Link
                to={`/resorts/edit/${r._id}`}
                className="flex-1 sm:flex-none px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 text-center"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => removeResort(r._id)}
                className="flex-1 sm:flex-none px-3 py-1.5 border border-red-400 rounded text-sm text-red-600 hover:bg-red-50 text-center"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && list.length === 0 && (
          <div className="text-gray-500 text-center col-span-full py-6">
            No resorts found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Resorts;
