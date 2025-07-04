import React from 'react';
import Link from 'next.js';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="hidden md:block text-2xl font-bold text-gray-900">
              Jelajah Tamanjaya
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#home"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#event"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Event
              </a>

              <a
                href="#post"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Post
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
