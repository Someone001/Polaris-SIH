import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import HelpMenu from './HelpMenu';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Archive', path: '/archive' },
    { name: 'Expeditions', path: '/expeditions' },
    { name: 'Content Studio', path: '/studio' },
    { name: 'About', path: '/about' },
    { name: 'Sources', path: '/sources' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-glacier-50/90 backdrop-blur-md border-b border-glacier-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            {/* Abstract polar star icon */}
            <div className="w-10 h-10 rounded-full bg-polar-900 flex items-center justify-center text-aurora-400 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" fill="currentColor" fillOpacity="0.3" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-semibold tracking-tight text-polar-900">
                  Polaris
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-polar-100 text-polar-700">
                  MoES
                </span>
              </div>
              <p className="text-xs text-polar-600 hidden sm:block">
                India's polar science portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation & Help Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <nav className="flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-polar-950 font-semibold bg-polar-100/80 shadow-xs'
                        : 'text-polar-700 hover:text-polar-950 hover:bg-polar-100/40'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            <div className="pl-2 border-l border-glacier-border">
              <HelpMenu />
            </div>
          </div>

          {/* Mobile Right Actions: Help Menu + Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <HelpMenu />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-polar-700 hover:text-polar-900 hover:bg-polar-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-glacier-border bg-glacier-50 px-4 pt-2 pb-5 space-y-1 animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-polar-950 font-semibold bg-polar-100'
                    : 'text-polar-700 hover:text-polar-950 hover:bg-polar-100/50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
