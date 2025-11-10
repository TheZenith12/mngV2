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
      console.log("data:", data);
      setList(data.resorts || data); // хэрэв backend data.resorts буцаадаг бол
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
    console.log("Deleting ID:", id);
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🏕 Амралтын газрууд</h2>
        <Link
          to="/resorts/new"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Resort
        </Link>
      </div>

      {loading && <div>Loading resorts...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="space-y-3">
  {list.map((r) => (
    <div
      key={r._id}
      className="p-4 bg-white rounded-lg shadow flex flex-col sm:flex-row justify-between items-start gap-4"
    >
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <img
          src={r.image && r.image.length > 0 ? `${API_BASE}${r.image[0]}` : "/placeholder.jpg"}
          alt={r.name}
          className="w-full sm:w-32 h-32 sm:h-20 rounded object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <div className="font-semibold text-lg">{r.name}</div>
          <div className="text-gray-600 text-sm mb-1 line-clamp-2">
            {r.description || "No description"}
          </div>
          <div className="text-gray-800 text-sm">
            💰 Үнэ: <span className="font-semibold">{r.price ? `${r.price} ₮` : "—"}</span>
          </div>
          <div className="text-gray-800 text-sm">
            📍 Байршил: {r.location || "—"}
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
        <Link
          to={`/resorts/edit/${r._id}`}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-50 text-center"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={() => removeResort(r._id)}
          className="px-3 py-1 border rounded text-sm text-red-600 hover:bg-red-50 text-center"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  ))}
        {!loading && list.length === 0 && (
          <div className="text-gray-500">No resorts found.</div>
        )}
      </div>
    </div>
  );
}

export default Resorts;
