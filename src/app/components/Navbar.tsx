'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-semibold">Admin-Bereich</div>
      
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="block md:hidden text-white focus:outline-none"
      >
        {isOpen ? <FiX size={24} className="text-white" /> : <FiMenu size={24} className="text-white" />}
      </button>

      {/* Full-screen overlay menu */}
      <ul
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col items-center justify-center space-y-6 fixed inset-0 bg-gray-900 bg-opacity-95 md:relative md:bg-transparent md:space-y-0 md:flex md:flex-row md:space-x-6 z-50`}
      >
        {/* Close button for mobile menu */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none md:hidden"
        >
          <FiX size={32} className="text-white" />
        </button>

        <li>
          <Link href="/" onClick={closeMenu} className="text-2xl hover:text-gray-300 transition duration-200">
            Startseite
          </Link>
        </li>
        <li>
          <Link href="/leads" onClick={closeMenu} className="text-2xl hover:text-gray-300 transition duration-200">
            Leads
          </Link>
        </li>
        <li>
          <Link href="/analytics" onClick={closeMenu} className="text-2xl hover:text-gray-300 transition duration-200">
            Analysen
          </Link>
        </li>
      </ul>

      <div className="hidden md:block w-16"></div> {/* Placeholder for spacing on larger screens */}
    </nav>
  );
};

export default Navbar;
