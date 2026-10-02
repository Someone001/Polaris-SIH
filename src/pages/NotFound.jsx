import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Database, MapPin, Sparkles } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — Polaris';
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-ice-100 flex items-center justify-center mx-auto text-ice-700 shadow-xs border border-ice-200">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <div className="space-y-3 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-aurora-700">
          404 — Coordinate Out of Range
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-polar-950 font-normal">
          Lost in the Whiteout
        </h1>
        <p className="text-base sm:text-lg text-polar-700 leading-relaxed">
          The page or dataset you are looking for does not exist in our polar records. Check the link or navigate back to one of our primary hubs below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 text-left">
        <Link
          to="/"
          className="p-5 rounded-xl border border-glacier-border bg-glacier-50 hover:bg-glacier-100 hover:border-ice-300 transition-all space-y-2 group shadow-2xs"
        >
          <Home className="w-5 h-5 text-polar-600 group-hover:text-aurora-700" />
          <h2 className="font-serif text-base font-medium text-polar-950">Home Portal</h2>
          <p className="text-xs text-polar-600 leading-relaxed">Return to the portal overview and key highlights.</p>
        </Link>

        <Link
          to="/archive"
          className="p-5 rounded-xl border border-glacier-border bg-glacier-50 hover:bg-glacier-100 hover:border-ice-300 transition-all space-y-2 group shadow-2xs"
        >
          <Database className="w-5 h-5 text-polar-600 group-hover:text-aurora-700" />
          <h2 className="font-serif text-base font-medium text-polar-950">Knowledge Archive</h2>
          <p className="text-xs text-polar-600 leading-relaxed">Search all 40 reports, datasets, and photo records.</p>
        </Link>

        <Link
          to="/expeditions"
          className="p-5 rounded-xl border border-glacier-border bg-glacier-50 hover:bg-glacier-100 hover:border-ice-300 transition-all space-y-2 group shadow-2xs"
        >
          <MapPin className="w-5 h-5 text-polar-600 group-hover:text-aurora-700" />
          <h2 className="font-serif text-base font-medium text-polar-950">Expeditions</h2>
          <p className="text-xs text-polar-600 leading-relaxed">Track India’s voyage routes, maps, and field logs.</p>
        </Link>

        <Link
          to="/studio"
          className="p-5 rounded-xl border border-glacier-border bg-glacier-50 hover:bg-glacier-100 hover:border-ice-300 transition-all space-y-2 group shadow-2xs"
        >
          <Sparkles className="w-5 h-5 text-polar-600 group-hover:text-aurora-700" />
          <h2 className="font-serif text-base font-medium text-polar-950">Content Studio</h2>
          <p className="text-xs text-polar-600 leading-relaxed">Generate instant social media & press bulletins.</p>
        </Link>
      </div>
    </main>
  );
}
