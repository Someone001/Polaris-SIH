import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, Compass, Sparkles, X, ArrowRight } from 'lucide-react';
import { useExplaining } from '../context/ExplainingContext';

export default function WelcomeOverlay() {
  const { isWelcomeOpen, closeWelcome, reducedMotion } = useExplaining();
  const navigate = useNavigate();

  if (!isWelcomeOpen) return null;

  const handleCardClick = (path) => {
    closeWelcome(true);
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-polar-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onClick={() => closeWelcome(true)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl bg-glacier-50 rounded-2xl border border-glacier-border p-6 sm:p-8 space-y-6 shadow-2xl my-8 ${
          reducedMotion ? '' : 'transition-transform duration-200'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-aurora-700">
              Welcome to Polaris &bull; SIH26063
            </span>
            <h2 id="welcome-title" className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
              India&apos;s Polar Science, All in One Place
            </h2>
          </div>
          <button
            type="button"
            onClick={() => closeWelcome(true)}
            className="p-1.5 rounded-lg text-polar-500 hover:text-polar-950 hover:bg-glacier-200/70 transition-colors"
            aria-label="Close welcome message"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Short Plain-English Lines */}
        <div className="space-y-2 text-base sm:text-lg text-polar-800 leading-relaxed border-l-2 border-aurora-500 pl-4 bg-aurora-50/40 py-2 rounded-r-lg">
          <p>This portal shows what polar expeditions produced — publications, data, photos, and videos.</p>
          <p>Browse the Archive or follow an Expedition.</p>
          <p>Or pick any item and get ready-to-post text.</p>
        </div>

        {/* Prototype Disclaimer */}
        <p className="text-xs text-polar-600 bg-glacier-100 p-3 rounded-lg border border-glacier-border/70 leading-relaxed">
          Polaris is a student prototype built for Smart India Hackathon 2026 (problem statement SIH26063). It is not an official website of MoES or NCPOR. Every record links to its public source.
        </p>

        {/* 3 Navigational Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <button
            type="button"
            onClick={() => handleCardClick('/archive')}
            className="text-left p-4 rounded-xl border border-glacier-border bg-white hover:border-aurora-500 hover:shadow-xs transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-ice-100 flex items-center justify-center text-ice-700 group-hover:bg-polar-900 group-hover:text-white transition-colors">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base text-polar-950 block font-normal group-hover:text-aurora-700">
                Browse Archive
              </span>
              <span className="text-xs text-polar-600 block mt-0.5">
                Search reports, data, and photos
              </span>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-aurora-700 group-hover:translate-x-1 transition-transform">
              Explore &rarr;
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCardClick('/expeditions')}
            className="text-left p-4 rounded-xl border border-glacier-border bg-white hover:border-aurora-500 hover:shadow-xs transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-ice-100 flex items-center justify-center text-ice-700 group-hover:bg-polar-900 group-hover:text-white transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base text-polar-950 block font-normal group-hover:text-aurora-700">
                Follow an Expedition
              </span>
              <span className="text-xs text-polar-600 block mt-0.5">
                Interactive route maps & timelines
              </span>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-aurora-700 group-hover:translate-x-1 transition-transform">
              Journeys &rarr;
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCardClick('/studio')}
            className="text-left p-4 rounded-xl border border-glacier-border bg-white hover:border-aurora-500 hover:shadow-xs transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-ice-100 flex items-center justify-center text-ice-700 group-hover:bg-polar-900 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base text-polar-950 block font-normal group-hover:text-aurora-700">
                Generate Content
              </span>
              <span className="text-xs text-polar-600 block mt-0.5">
                Ready-to-post blurbs & social posts
              </span>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-aurora-700 group-hover:translate-x-1 transition-transform">
              Studio &rarr;
            </span>
          </button>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-glacier-border flex items-center justify-between text-xs text-polar-600">
          <p>You can re-open this anytime from the footer or help menu.</p>
          <button
            type="button"
            onClick={() => closeWelcome(true)}
            className="px-4 py-2 rounded-lg bg-polar-900 text-glacier-50 font-medium hover:bg-polar-800 transition-colors"
          >
            Skip & Explore
          </button>
        </div>
      </div>
    </div>
  );
}
