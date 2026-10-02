import React from 'react';
import { Link } from 'react-router-dom';
import { useExplaining } from '../context/ExplainingContext';

export default function Footer() {
  const { openWelcome } = useExplaining();
  return (
    <footer className="border-t border-glacier-border bg-glacier-50/80 mt-auto text-polar-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mandate */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-normal text-polar-900">
                Polaris
              </span>
              <span className="text-xs text-polar-500">|</span>
              <span className="text-sm font-medium text-polar-600">
                MoES Polar Knowledge Portal
              </span>
            </div>
            <p className="text-base text-polar-600 max-w-md leading-relaxed">
              India&apos;s polar science, all in one place. Documenting expeditions across Antarctica, the Arctic, and the Southern Ocean.
            </p>
          </div>

          {/* Quick Plain Links */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-xs uppercase tracking-widest font-semibold text-polar-500">
              Navigation
            </p>
            <ul className="space-y-1.5 text-base">
              <li>
                <Link to="/" className="text-polar-700 hover:text-polar-950 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/archive" className="text-polar-700 hover:text-polar-950 transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link to="/expeditions" className="text-polar-700 hover:text-polar-950 transition-colors">
                  Expeditions
                </Link>
              </li>
              <li>
                <Link to="/studio" className="text-polar-700 hover:text-polar-950 transition-colors">
                  Content Studio
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-polar-700 hover:text-polar-950 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/sources" className="text-polar-700 hover:text-polar-950 transition-colors">
                  Sources & Citations
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Bases reference */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-xs uppercase tracking-widest font-semibold text-polar-500">
              India&apos;s Polar Bases
            </p>
            <ul className="space-y-1 text-sm text-polar-600">
              <li>Maitri (Antarctica, est. 1989)</li>
              <li>Bharati (Antarctica, est. 2012)</li>
              <li>Himadri (Arctic, Svalbard, est. 2008)</li>
            </ul>
          </div>
        </div>

        {/* SIH Note & Orientation Control */}
        <div className="mt-10 pt-6 border-t border-glacier-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-polar-600">
          <p>
            Demo built for Smart India Hackathon 2026 (SIH26063, Ministry of Earth Sciences). All entries shown are sample data.
          </p>
          <div className="flex flex-wrap items-center gap-4 shrink-0 text-xs">
            <button
              type="button"
              onClick={openWelcome}
              className="text-aurora-700 hover:text-aurora-600 font-semibold underline underline-offset-2 focus:outline-none"
            >
              Show welcome screen again
            </button>
            <div className="flex items-center gap-2 text-polar-500">
              <span className="w-2 h-2 rounded-full bg-aurora-500"></span>
              <span>Polaris Portal Demo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
