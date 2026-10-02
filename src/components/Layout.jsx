import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOverlay from './WelcomeOverlay';
import CoachMarkTour from './CoachMarkTour';
import { ExplainingProvider } from '../context/ExplainingContext';

export default function Layout({ children }) {
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
