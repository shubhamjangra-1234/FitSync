import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-sm bg-transparent px-10  text-white flex justify-between items-center shadow-sm z-50">
        {/* Logo and Brand Name */}
        <div className="flex items-center">
          <img
            src="../../../Images/logo.png"
            alt="FitSync Logo"
            className="h-18 w-18"
          />
          <h1 className="text-2xl text-mono text-[#4cdc0d]">FitSync</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex flex-row items-center justify-center">
          <Link
            to="/"
            className="font-mono hover:text-black text-gray-600 mx-8 text-xl"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="font-mono hover:text-black text-gray-600 mx-8 text-xl"
          >
            Track
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black text-xl">
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute p-2 top-16 right-0 bg-green-400 w-full flex flex-col items-center space-y-4 md:hidden">
            <Link
              to="/"
              className="font-mono hover:text-black text-white"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/login"
              className="font-mono hover:text-black text-white"
              onClick={toggleMenu}
            >
              Track
            </Link>
          </div>
        )}
      </nav>
      <div className="mt-20">{/* Content below the navbar */}</div>
    </>
  );
}
