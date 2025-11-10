import React, { useState } from "react";
import { Link } from "react-router-dom";
import { List, PlusCircle, Menu } from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔹 Mobile Header */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <Link to="/" className="font-bold text-lg text-gray-800">
          Resorts Admin
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* 🔹 Sidebar (Mobile + Desktop) */}
      <aside
        className={`fixed sm:static top-0 left-0 h-full sm:h-auto w-64 bg-white border-r shadow-md sm:shadow-none z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="h-16 hidden sm:flex items-center px-6 border-b">
          <Link to="/" className="font-bold text-lg text-gray-800">
            Resorts Admin
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem to="/resorts" icon={<List size={16} />} onClick={() => setOpen(false)}>
            Resorts
          </NavItem>
          <NavItem to="/resorts/new" icon={<PlusCircle size={16} />} onClick={() => setOpen(false)}>
            Add Resort
          </NavItem>
        </nav>
      </aside>

      {/* 🔹 Background overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 sm:hidden"
        ></div>
      )}
    </>
  );
}

function NavItem({ to, children, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 active:bg-gray-200"
    >
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm font-medium text-gray-800">{children}</span>
    </Link>
  );
}

export default Sidebar;
