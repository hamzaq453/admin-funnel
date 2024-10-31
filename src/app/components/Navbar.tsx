import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-semibold">Admin-Bereich</div>
      <ul className="flex space-x-6 mx-auto">
        <li>
          <Link href="/" className="hover:text-gray-300 transition duration-200">
            Startseite
          </Link>
        </li>
        <li>
          <Link href="/leads" className="hover:text-gray-300 transition duration-200">
            Leads
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="hover:text-gray-300 transition duration-200">
            Analysen
          </Link>
        </li>
      </ul>
      <div className="w-16"></div> {/* Placeholder div for spacing on the right side */}
    </nav>
  );
};

export default Navbar;
