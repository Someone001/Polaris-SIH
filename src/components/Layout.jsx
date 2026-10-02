import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOverlay from './WelcomeOverlay';
import CoachMarkTour from './CoachMarkTour';
import { ExplainingProvider } from '../context/ExplainingContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Layout({ children }) {
  // Global scroll-to-reveal observer for all components & sections across the entire website
  useScrollReveal();

  return (
    <ExplainingProvider>
      <div className="min-h-screen flex flex-col bg-glacier-100 text-polar-900 selection:bg-ice-200 selection:text-polar-950 font-sans">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <WelcomeOverlay />
        <CoachMarkTour />
      </div>
    </ExplainingProvider>
  );
}
