import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-auto" 
                src="/logo.png" 
                alt="FootScan3D" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/50?text=FS3D';
                }}
              />
              <span className="ml-2 text-xl font-bold text-primary-700">FootScan3D</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium text-secondary-500 hover:text-secondary-700"
            >
              Home
            </Link>
            <Link 
              to="/scan" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium text-secondary-500 hover:text-secondary-700"
            >
              Scan Foot
            </Link>
            <a 
              href="https://stridelabs.com/about" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium text-secondary-500 hover:text-secondary-700"
              target="_blank"
              rel="noreferrer"
            >
              About Us
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-secondary-50 hover:border-primary-500 text-base font-medium text-secondary-500 hover:text-secondary-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/scan"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-secondary-50 hover:border-primary-500 text-base font-medium text-secondary-500 hover:text-secondary-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Scan Foot
            </Link>
            <a
              href="https://stridelabs.com/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-secondary-50 hover:border-primary-500 text-base font-medium text-secondary-500 hover:text-secondary-700"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 