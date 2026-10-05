import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  BookOpen,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Compass,
  Layers,
  ThermometerSnowflake,
  Activity,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';

export default function About() {
  useEffect(() => {
    document.title = 'About Polaris — Polar Outreach Portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll space-y-4 max-w-3xl">
        <Tag variant="aurora">About the Prototype</Tag>
        <SectionHeading
          kicker="SMART INDIA HACKATHON 2026 &bull; SIH26063"
          title="Polaris: Polar Science Outreach Portal"
          description="A prototype citizen outreach platform organizing scientific publications, research datasets, high-latitude photographs, videos, and institutional activities across the polar regions."
        />
      </div>

      {/* 2. Mandatory Student Prototype Disclaimer */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll p-6 sm:p-7 rounded-2xl border-2 border-aurora-300 bg-aurora-50/60 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-aurora-900 font-semibold text-sm">
          <ShieldAlert className="w-5 h-5 text-aurora-700 shrink-0" />
          <span>Important Notice & Prototype Disclaimer</span>
        </div>
        <p className="text-sm sm:text-base text-polar-900 font-medium leading-relaxed">
          Polaris is a student prototype built for Smart India Hackathon 2026 (problem statement SIH26063). It is not an official website of MoES or NCPOR. Every record links to its public source.
        </p>
      </div>

      {/* 3. Objective & SIH26063 Context */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll p-8 sm:p-10 rounded-2xl border border-glacier-border bg-glacier-50 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 text-aurora-700">
          <Compass className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">Problem Statement Focus</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
          Making Polar Discoveries Accessible to Citizens
        </h2>
        <div className="space-y-4 text-base sm:text-lg text-polar-800 leading-relaxed font-normal">
          <p>
            Developed under Smart India Hackathon problem statement <strong>SIH26063</strong>, Polaris addresses the challenge of making polar research findings accessible and engaging for students, researchers, journalists, and everyday citizens.
          </p>
          <p className="text-sm sm:text-base text-polar-700">
            For decades, Indian researchers have conducted vital scientific expeditions across Antarctica, the Arctic, and the Southern Ocean. Polaris organizes these public records—from peer-reviewed papers and calibrated datasets to documentary photographs and videos—into a searchable, self-explaining knowledge portal with an automated content creation studio.
          </p>
        </div>
      </div>

      {/* 4. Research Bases Featured in Public Records */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            POLAR STATIONS IN PUBLIC RECORDS
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Indian Polar Research Facilities
          </h2>
          <p className="text-base text-polar-700 max-w-3xl leading-relaxed">
            The public records indexed on Polaris document research activities conducted across Indian stations in Antarctica and the Arctic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bharati Station */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ice-100 text-ice-800">
              Antarctica &bull; Larsemann Hills
            </span>
            <h3 className="font-serif text-xl font-normal text-polar-950">Bharati Station</h3>
            <p className="text-sm text-polar-700 leading-relaxed">
              Located in the Larsemann Hills, East Antarctica. Documented in public records for atmospheric observations, stratospheric ozone monitoring, and polar environmental studies.
            </p>
          </div>

          {/* Maitri Station */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ice-100 text-ice-800">
              Antarctica &bull; Schirmacher Oasis
            </span>
            <h3 className="font-serif text-xl font-normal text-polar-950">Maitri Station</h3>
            <p className="text-sm text-polar-700 leading-relaxed">
              Located in the ice-free rocky Schirmacher Oasis, Antarctica. Documented in public meteorological, geomagnetic, and environmental observation datasets.
            </p>
          </div>

          {/* Himadri Station */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-aurora-100 text-aurora-800">
                The Arctic &bull; Ny-Ålesund, Svalbard
              </span>
              <span className="text-xs font-mono text-polar-500">78°55'N, 11°56'E</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-polar-950">Himadri Station</h3>
            <p className="text-sm text-polar-700 leading-relaxed">
              India's Arctic research station located in the international research settlement of Ny-Ålesund, Svalbard (coordinates 78°55'N, 11°56'E), supporting high-latitude atmospheric and marine studies.
            </p>
          </div>

          {/* Dakshin Gangotri */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-polar-100 text-polar-800">
              Antarctica &bull; Ice Shelf
            </span>
            <h3 className="font-serif text-xl font-normal text-polar-950">Dakshin Gangotri</h3>
            <p className="text-sm text-polar-700 leading-relaxed">
              India's maiden permanent Antarctic research base, commemorated in historical expedition photographs and archival documentation.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Core Capabilities */}
      <div className="space-y-6 pt-4 border-t border-glacier-border">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            PORTAL CAPABILITIES
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Platform Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <BookOpen className="w-4 h-4 text-aurora-600" />
              <span>1. Curated Knowledge Archive</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Cataloged database indexing scientific publications, research datasets, photographs, videos, and outreach activities with multi-faceted search and filtering.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <MapPin className="w-4 h-4 text-aurora-600" />
              <span>2. Sourced Geographic Context</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Satellite basemaps showing station positions when coordinates are documented in public release announcements.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Sparkles className="w-4 h-4 text-aurora-600" />
              <span>3. Content Creation Studio</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Client-side synthesis tool generating website blurbs, social media posts, press notes, and email summaries strictly from sourced fields, complete with primary source citations.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Globe2 className="w-4 h-4 text-aurora-600" />
              <span>4. Public Provenance Ledger</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Dedicated sources ledger linking every record to its primary public document, DOI, or repository URL.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Navigation Footer */}
      <div className="pt-8 border-t border-glacier-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-polar-900 text-glacier-50 font-medium text-sm hover:bg-polar-800 transition-colors shadow-2xs"
        >
          <span>Explore Knowledge Archive</span>
          <ArrowRight className="w-4 h-4 text-aurora-300" />
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/expeditions"
            className="text-polar-700 hover:text-polar-950 transition-colors"
          >
            Expeditions &rarr;
          </Link>
          <span className="text-polar-300">|</span>
          <Link
            to="/sources"
            className="text-aurora-700 hover:text-aurora-800 transition-colors"
          >
            Sources Used &rarr;
          </Link>
          <span className="text-polar-300">|</span>
          <Link
            to="/credits"
            className="text-polar-700 hover:text-polar-950 transition-colors"
          >
            Media Credits &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
