import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, FileText, Globe2, Sparkles, MapPin, Play, Pause } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';
import { getPortalStats, getExpeditions } from '../lib/dataLoader';
import { useExplaining } from '../context/ExplainingContext';

export default function Home() {
  const stats = getPortalStats();
  const sampleExpeditions = getExpeditions().slice(0, 3);
  const { reducedMotion } = useExplaining();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (reducedMotion && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [reducedMotion]);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* HERO SECTION WITH CINEMATIC POLAR BACKGROUND VIDEO */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 border-b border-glacier-border/70 bg-glacier-100">
        {/* Cinematic Polar Video Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {!reducedMotion ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/polar-hero-poster.jpg"
              className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.08] transition-opacity duration-1000"
            >
              <source src="/videos/polar-hero-bg.webm" type="video/webm" />
              <source src="/videos/polar-hero-bg.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/videos/polar-hero-poster.jpg"
              alt="Antarctic ice shelf aerial vista"
              className="w-full h-full object-cover object-center filter brightness-[0.96]"
            />
          )}

          {/* Carefully tuned dual gradient scrim: keeps text 100% accessible while keeping polar ice visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-glacier-50/95 via-glacier-50/80 to-glacier-50/20 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-glacier-100/90 via-transparent to-glacier-50/60" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl backdrop-blur-[2px] bg-glacier-50/70 sm:bg-glacier-50/60 p-6 sm:p-10 rounded-3xl border border-white/60 shadow-xs space-y-6 sm:space-y-8">
            {/* Plain-Language Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-polar-100/90 border border-polar-200 text-polar-800 text-xs sm:text-sm font-medium tracking-wide w-fit">
              <span className="w-2 h-2 rounded-full bg-aurora-500 animate-pulse"></span>
              <span>Ministry of Earth Sciences &bull; National Polar Portal</span>
            </div>

            {/* Confident, Large Serif Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[60px] font-normal text-polar-950 tracking-tight leading-[1.12]">
              Everything India has learned at the poles, in one place.
            </h1>

            {/* Short Supporting Sentence */}
            <p className="text-lg sm:text-xl text-polar-700 leading-relaxed font-normal">
              Read true stories, browse clean field records, and follow Indian scientists working across Antarctica, the Arctic, and the Southern Ocean.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <Link
                to="/archive"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-md bg-polar-900 text-glacier-50 font-medium text-base hover:bg-polar-800 transition-colors shadow-sm focus:outline-none"
              >
                <span>Explore the Archive</span>
                <ArrowRight className="w-4 h-4 text-aurora-300" />
              </Link>
              <Link
                to="/studio"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-md bg-white/90 text-polar-900 border border-polar-300 hover:bg-glacier-100 font-medium text-base transition-colors focus:outline-none shadow-2xs"
              >
                <span>Try the Content Studio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient Video Control Badge */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-polar-950/65 backdrop-blur-md text-[11px] font-medium text-glacier-100 border border-white/10 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-aurora-400 animate-pulse"></span>
            <span>Live Aerial Survey &bull; Antarctic Ice Shelf</span>
          </div>
          {!reducedMotion && (
            <button
              type="button"
              onClick={toggleVideo}
              className="p-2 rounded-full bg-polar-950/70 hover:bg-polar-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105"
              title={isPlaying ? 'Pause background video' : 'Play background video'}
              aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </section>

      {/* LIVE "BY THE NUMBERS" STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-xl bg-glacier-50 border border-glacier-border shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-glacier-border pb-6 md:pb-0 md:pr-8 space-y-1.5">
              <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
                At a Glance
              </p>
              <h2 className="font-serif text-2xl text-polar-900 font-normal">
                Polar science in numbers
              </h2>
              <p className="text-sm text-polar-600">
                Live counts from our bundled expedition records.
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <Link to="/archive" className="group block space-y-1 hover:translate-y-[-2px] transition-transform">
                <span className="block font-serif text-4xl sm:text-5xl font-light text-polar-900 group-hover:text-aurora-700 transition-colors">
                  {stats.expeditionsCount}
                </span>
                <span className="block text-sm font-semibold text-polar-800">
                  Expeditions Documented
                </span>
                <span className="block text-xs text-polar-500">
                  Both ongoing missions and completed voyages
                </span>
              </Link>

              <Link to="/archive" className="group block space-y-1 hover:translate-y-[-2px] transition-transform">
                <span className="block font-serif text-4xl sm:text-5xl font-light text-polar-900 group-hover:text-aurora-700 transition-colors">
                  {stats.itemsCount}
                </span>
                <span className="block text-sm font-semibold text-polar-800">
                  Archive Records
                </span>
                <span className="block text-xs text-polar-500">
                  Reports, datasets, photos, videos, and articles
                </span>
              </Link>

              <Link to="/archive" className="group block space-y-1 hover:translate-y-[-2px] transition-transform">
                <span className="block font-serif text-4xl sm:text-5xl font-light text-polar-900 group-hover:text-aurora-700 transition-colors">
                  {stats.regionsCount}
                </span>
                <span className="block text-sm font-semibold text-polar-800">
                  Polar Regions Covered
                </span>
                <span className="block text-xs text-polar-500">
                  Antarctica, Arctic & Southern Ocean
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN DO HERE SECTION (DELIBERATELY VARIED LAYOUT, NOT 3 IDENTICAL CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          kicker="HOW IT WORKS"
          title="What you can do here"
          description="We built Polaris so anyone can follow India's icy frontiers without wading through technical jargon."
        />

        <div className="space-y-8">
          {/* BLOCK 1: Explore the collection (Full-width editorial split layout) */}
          <div className="rounded-xl border border-glacier-border bg-glacier-50 p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <Tag variant="ice">1. Explore the collection</Tag>
                <h3 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
                  Read expedition logs, view photos, and discover scientific measurements
                </h3>
                <p className="text-polar-700 text-base sm:text-lg leading-relaxed">
                  Browse over forty carefully indexed items collected by scientists in the field. From midnight sun photographs at Bharati Station to real-time wind speed records and ocean salinity checks, each piece comes with a plain explanation of what was found and why it matters.
                </p>
                <div className="pt-2">
                  <Link
                    to="/archive"
                    className="inline-flex items-center gap-2 text-base font-semibold text-aurora-700 hover:text-aurora-600 transition-colors group"
                  >
                    <span>Browse all 40 collection items</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Visual Preview Box */}
              <div className="lg:col-span-5 bg-white border border-polar-200/80 rounded-lg p-6 space-y-4 shadow-2xs">
                <p className="text-xs uppercase tracking-wider font-semibold text-polar-500">
                  Sample Item Types Included
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded bg-glacier-100 border border-glacier-border">
                    <span className="block font-medium text-polar-900">Reports</span>
                    <span className="text-xs text-polar-600">Season field logs</span>
                  </div>
                  <div className="p-3 rounded bg-glacier-100 border border-glacier-border">
                    <span className="block font-medium text-polar-900">Datasets</span>
                    <span className="text-xs text-polar-600">Wind, ice & ocean</span>
                  </div>
                  <div className="p-3 rounded bg-glacier-100 border border-glacier-border">
                    <span className="block font-medium text-polar-900">Photographs</span>
                    <span className="text-xs text-polar-600">Wildlife & bases</span>
                  </div>
                  <div className="p-3 rounded bg-glacier-100 border border-glacier-border">
                    <span className="block font-medium text-polar-900">Activities</span>
                    <span className="text-xs text-polar-600">School links & events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TWO ASYMMETRICAL BLOCKS SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* BLOCK 2: See where expeditions went (Deep Navy, Geographic & Station Focus) */}
            <div className="lg:col-span-6 rounded-xl bg-polar-900 text-glacier-50 p-8 sm:p-10 flex flex-col justify-between space-y-8 border border-polar-800">
              <div className="space-y-4">
                <Tag variant="dark">2. See where expeditions went</Tag>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                  Track journeys to the ends of the Earth
                </h3>
                <p className="text-polar-200 text-base sm:text-lg leading-relaxed">
                  Follow India&apos;s footprint across the frozen continent of Antarctica, the high Arctic archipelago of Svalbard, and the stormy Southern Ocean. Each expedition includes exact coordinates, crew sizes, and three key findings in simple words.
                </p>
              </div>

              {/* Station List Strip */}
              <div className="space-y-3 pt-4 border-t border-polar-700/80">
                <p className="text-xs uppercase tracking-wider font-semibold text-aurora-400">
                  Primary Research Locations
                </p>
                <div className="space-y-2 text-sm text-polar-200">
                  <div className="flex items-center justify-between py-1.5 border-b border-polar-800">
                    <span className="font-medium text-white">Bharati & Maitri Stations</span>
                    <span className="text-xs text-polar-400">Antarctica</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-polar-800">
                    <span className="font-medium text-white">Himadri Station</span>
                    <span className="text-xs text-polar-400">Ny-Ålesund, Arctic</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="font-medium text-white">Prydz Bay & Polar Front</span>
                    <span className="text-xs text-polar-400">Southern Ocean</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCK 3: Create ready-to-post content (Editorial Light Block with Workflow Demonstration) */}
            <div className="lg:col-span-6 rounded-xl border border-aurora-200/70 bg-aurora-50/50 p-8 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <Tag variant="aurora">3. Create ready-to-post content</Tag>
                <h3 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
                  Turn polar science into stories people understand
                </h3>
                <p className="text-polar-700 text-base sm:text-lg leading-relaxed">
                  Our Content Studio converts complex mission logs into clear social media posts, website summaries, and press notes in seconds. Media teams, teachers, and science communicators can share discoveries without needing scientific translation.
                </p>
              </div>

              {/* Instant Output Demonstration Preview */}
              <div className="bg-white/90 border border-aurora-200 rounded-lg p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-xs text-polar-600 font-semibold uppercase tracking-wider">
                  <span>Output Preview</span>
                  <span className="text-aurora-600">Zero Jargon</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-glacier-50 border border-glacier-border text-xs text-polar-800">
                    <strong className="text-polar-900 block mb-0.5">Website Summary:</strong>
                    &ldquo;Indian scientists completed a 300-kilometer overland ice crossing between Maitri and Bharati bases, deploying five new solar weather masts.&rdquo;
                  </div>
                </div>
                <div className="pt-1">
                  <Link
                    to="/studio"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-aurora-700 hover:text-aurora-600 transition-colors"
                  >
                    <span>Launch the Content Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS MATTERS SECTION: EXPANDED WITH AUTHENTIC SCIENTIFIC PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-polar-950 text-glacier-50 p-8 sm:p-12 lg:p-16 relative overflow-hidden space-y-10">
          {/* Subtle aurora green glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-aurora-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative max-w-3xl space-y-6">
            <p className="text-xs uppercase tracking-widest font-semibold text-aurora-400">
              NATIONAL CLIMATE SIGNIFICANCE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
              The poles feel thousands of miles away, but they govern our monsoons, coastlines, and food security.
            </h2>
            <p className="text-base sm:text-lg text-polar-200 leading-relaxed font-normal">
              Changes in polar ice shelves and Arctic sea ice directly alter atmospheric circulation cells that bring life-giving monsoon rains to 1.4 billion people across the Indian subcontinent. By sharing expedition findings openly and in everyday language, Polaris ensures that every citizen understands why high-latitude science safeguards our national climate security.
            </p>
          </div>

          {/* Three Concrete Scientific Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-polar-800">
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-aurora-400">
                1. Monsoon Teleconnections
              </span>
              <h4 className="font-serif text-lg font-normal text-white">
                Arctic Sea Ice & Monsoon Timing
              </h4>
              <p className="text-xs sm:text-sm text-polar-300 leading-relaxed">
                When Arctic sea-ice extent shrinks, planetary Rossby waves wobble, shifting the subtropical jet stream and modulating the Madden-Julian Oscillation (MJO). This directly affects the timing and intensity of rainfall across Punjab, Maharashtra, and the Gangetic plains.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-aurora-400">
                2. Coastal Inundation Risk
              </span>
              <h4 className="font-serif text-lg font-normal text-white">
                Antarctic Ice Mass Balance
              </h4>
              <p className="text-xs sm:text-sm text-polar-300 leading-relaxed">
                The East and West Antarctic Ice Sheets contain enough freshwater to raise global sea levels by over 58 meters. Measuring grounding-line melt in Queen Maud Land provides early warning metrics for India&apos;s 7,516-kilometer coastline and major port cities like Mumbai, Chennai, and Kolkata.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-aurora-400">
                3. The Third Pole Water Tower
              </span>
              <h4 className="font-serif text-lg font-normal text-white">
                Himalayan Cryosphere Health
              </h4>
              <p className="text-xs sm:text-sm text-polar-300 leading-relaxed">
                NCPOR&apos;s Himansh station in the Spiti Valley monitors over 9,500 Himalayan glaciers that feed the Indus, Ganges, and Brahmaputra river basins. Modeling glacier retreat helps mitigate catastrophic Glacial Lake Outburst Floods (GLOFs) and safeguards perennial water supplies.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-aurora-300 hover:text-aurora-200 transition-colors"
            >
              <span>Read the comprehensive history of India&apos;s polar missions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
