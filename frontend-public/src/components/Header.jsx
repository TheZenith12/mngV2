import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 shadow-lg py-4 backdrop-blur-md bg-opacity-90 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform duration-300">
          🌿 AmraltinGazar
        </h1>
        <nav className="space-x-6">
          <Link
            to="/About"
            className="relative font-semibold text-white hover:text-yellow-200 transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-300 hover:after:w-full after:transition-all after:duration-300"
          >
            Бидний тухай
          </Link>
        </nav>
      </div>
    </header>
  );
}
