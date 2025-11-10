import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { LogOut, List, PlusCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import auth from "../utils/auth";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  function doLogout() {
    auth.logout();
    navigate("/login");
  }

  // Sidebar link-үүдийг Topbar-д шилжүүлж байна
  const navItems = [
    { to: "/resorts", label: "Resorts", icon: <List size={16} /> },
    { to: "/resorts/new", label: "Add Resort", icon: <PlusCircle size={16} /> },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white">
      {/* Logo + nav */}
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-lg">
          Resorts Admin
        </Link>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1 px-3 py-2 rounded text-sm ${
                location.pathname === item.to
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Admin menu */}
      <div className="flex items-center gap-4">
        <Menu as="div" className="relative">
          <Menu.Button className="px-3 py-1 rounded bg-gray-100">Admin</Menu.Button>
          <Transition>
            <Menu.Items className="absolute right-0 mt-2 bg-white border rounded shadow">
              <Menu.Item>
                <button
                  onClick={doLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}

export default Topbar;
