import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-semibold">Admin Panel</div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/leads" className="hover:text-gray-300 transition duration-200">
            Leads
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="hover:text-gray-300 transition duration-200">
            Analytics
          </Link>
        </li>
        <li>
          <Link href="/settings" className="hover:text-gray-300 transition duration-200">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
