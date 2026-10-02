import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Building2,
  BookOpen,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Compass,
  Calendar,
  Layers,
  ThermometerSnowflake,
  Activity,
  Award
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';

export default function About() {
  useEffect(() => {
    document.title = 'About Polaris — India’s Polar Science Portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      {/* 1. Header */}
      <div className="space-y-4 max-w-3xl">
        <Tag variant="aurora">About the Initiative</Tag>
        <SectionHeading
          kicker="MINISTRY OF EARTH SCIENCES (MoES) & NCPOR"
          title="India’s Polar Outreach & Knowledge Portal"
          description="A centralized, open-access national repository uniting scientific publications, calibrated datasets, voyage logs, and educational media across Earth’s three polar frontiers."
        />
      </div>

      {/* 2. Institutional Mandate & SIH26063 Context */}
      <div className="p-8 sm:p-10 rounded-2xl border border-glacier-border bg-glacier-50 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 text-aurora-700">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">Institutional Mandate & Mission</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
          Connecting Indian Polar Discoveries with the Citizen Public
        </h2>
        <div className="space-y-4 text-base sm:text-lg text-polar-800 leading-relaxed font-normal">
          <p>
            Developed under Smart India Hackathon problem statement <strong>SIH26063</strong>, Polaris directly addresses the challenge of siloed polar knowledge. For more than four decades, Indian scientists have endured minus-50-degree cold, eight-month polar nights, and treacherous pack-ice voyages to conduct world-class cryospheric, atmospheric, and oceanographic research.
          </p>
          <p className="text-sm sm:text-base text-polar-700">
            Historically, valuable findings were scattered across specialized institutional archives, technical annual reports, and physical libraries. Polaris integrates archival records from the <strong>National Centre for Polar and Ocean Research (NCPOR), Goa</strong> with an intelligent media synthesis studio, ensuring that discoveries made on the polar ice reach classrooms, researchers, policy planners, and global citizens without technical jargon.
          </p>
        </div>

        {/* Legal & Governance Highlight */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-glacier-border space-y-2">
          <div className="flex items-center gap-2 text-polar-900 font-semibold text-sm">
            <Award className="w-4 h-4 text-aurora-600" />
            <span>The Indian Antarctic Act, 2022</span>
          </div>
          <p className="text-xs sm:text-sm text-polar-600 leading-relaxed">
            Passed by the Parliament of India, this historic legislation provides a comprehensive national legal framework for India's scientific operations in Antarctica. It establishes rigorous environmental protection standards, regulates expedition permits, mandates zero-waste repatriation, and extends Indian judicial jurisdiction to national stations and vessels operating south of 60°S latitude.
          </p>
        </div>
      </div>

      {/* 3. The Three Polar Realms & Research Stations */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            STRATEGIC HIGH-LATITUDE PRESENCE
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            India’s Polar & Cryosphere Research Stations
          </h2>
          <p className="text-base text-polar-700 max-w-3xl leading-relaxed">
            India is among an elite group of nations maintaining year-round research stations across Earth’s poles: Antarctica, the Arctic, and the Himalayan 'Third Pole'.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bharati Station */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ice-100 text-ice-800">
                Antarctica &bull; Operational
              </span>
              <span className="text-xs font-mono text-polar-500">69°24′S, 76°11′E</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-polar-950">Bharati Station (2012)</h3>
            <p className="text-xs text-polar-500 font-mono">Larsemann Hills &bull; Elevation: 35 m</p>
            <p className="text-sm text-polar-700 leading-relaxed">
              India’s state-of-the-art third Antarctic base, constructed from 134 modular prefabricated containers wrapped in an aerodynamic thermal envelope. It houses 47 scientists year-round, powered by a computerized combined heat-and-power microgrid. Bharati serves as a primary ground station for ISRO earth observation satellites (Cartosat, RISAT) via high-speed satellite broadband direct to NRSC Shadnagar.
            </p>
          </div>

          {/* Maitri Station */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ice-100 text-ice-800">
                Antarctica &bull; Operational
              </span>
              <span className="text-xs font-mono text-polar-500">70°46′S, 11°44′E</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-polar-950">Maitri Station (1989)</h3>
            <p className="text-xs text-polar-500 font-mono">Schirmacher Oasis &bull; Elevation: 117 m</p>
            <p className="text-sm text-polar-700 leading-relaxed">
              Located on an ice-free rocky plateau, Maitri has operated uninterrupted for over 35 years. Adjacent to the pristine freshwater Lake Priyadarshini, it accommodates 25 winter-over personnel conducting critical experiments in geomagnetism, seismology, atmospheric chemistry, meteorology, and human physiological adaptation to prolonged isolation.
            </p>
          </div>

          {/* Himadri Station & IndARC */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-aurora-100 text-aurora-800">
                The Arctic &bull; Operational
              </span>
              <span className="text-xs font-mono text-polar-500">78°55′N, 11°56′E</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-polar-950">Himadri Station & IndARC (2008 / 2014)</h3>
            <p className="text-xs text-polar-500 font-mono">Ny-Ålesund, Svalbard, Norway &bull; Kongsfjorden</p>
            <p className="text-sm text-polar-700 leading-relaxed">
              India’s high-Arctic research facility in the international science village of Ny-Ålesund, just 1,200 km from the North Pole. In 2014, India deployed IndARC—our first multi-sensor underwater moored observatory in Kongsfjorden fjord—measuring year-round salinity, temperature, and sea-current profiles down to 192 meters depth.
            </p>
          </div>

          {/* Himansh Station */}
          <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-polar-100 text-polar-800">
                Himalayas (Third Pole) &bull; Operational
              </span>
              <span className="text-xs font-mono text-polar-500">32°24′N, 77°37′E</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-polar-950">Himansh Station (2016)</h3>
            <p className="text-xs text-polar-500 font-mono">Chandra Basin, Spiti Valley &bull; Elevation: 4,080 m</p>
            <p className="text-sm text-polar-700 leading-relaxed">
              India’s dedicated high-altitude glaciological station in Himachal Pradesh. Himansh monitors the mass balance of major glaciers (such as Batal and Samudra Tapu) feeding the Indus river basin, deploying automatic weather towers, ice-penetrating radar, and water discharge flumes to model glacial retreat and assess downstream flood hazards.
            </p>
          </div>
        </div>

        {/* Historic Footnote: Dakshin Gangotri */}
        <div className="p-5 rounded-xl border border-dashed border-polar-300 bg-polar-50/60 text-xs sm:text-sm text-polar-700 space-y-1">
          <p className="font-semibold text-polar-900">
            Historic Landmark: Dakshin Gangotri (1983–1990)
          </p>
          <p className="leading-relaxed">
            Erected in an astonishing 60 days on the Princess Astrid Ice Shelf during India’s 3rd Antarctic Expedition, Dakshin Gangotri was India’s maiden permanent station. After serving as an active wintering base for seven years, it was gradually submerged beneath accumulating snow and ice. Today, it stands preserved as Antarctic Historic Site and Monument No. 44 (HSM-44) under the Antarctic Treaty system.
          </p>
        </div>
      </div>

      {/* 4. Four Core Scientific Priorities */}
      <div className="space-y-8 pt-4 border-t border-glacier-border">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            SCIENTIFIC HORIZONS
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Why India Researches the Polar Regions
          </h2>
          <p className="text-base text-polar-700 max-w-3xl leading-relaxed">
            Polar processes do not stay at the poles; they drive global oceanic currents, modulate the Indian monsoon, and govern sea level along India’s 7,516-kilometer coastline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-3">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <ThermometerSnowflake className="w-5 h-5 text-aurora-600" />
              <span>1. Polar Teleconnections & The Indian Monsoon</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Rapid Arctic sea-ice loss and warming in the high northern latitudes weaken the circumpolar jet stream, creating persistent atmospheric wave patterns (Rossby waves). These planetary waves alter the path of the subtropical jet stream and modulate the Madden-Julian Oscillation (MJO), directly influencing the onset, intensity, and distribution of the Southwest Monsoon rainfall across India.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-3">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Layers className="w-5 h-5 text-aurora-600" />
              <span>2. Paleoclimatology & Deep Ice Coring</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              By drilling cylindrical ice cores hundreds of meters into the Antarctic ice cap, Indian glaciologists extract atmospheric air bubbles trapped for over 100,000 years. Analyzing oxygen isotope ratios (δ18O and δD) reveals past atmospheric temperatures, greenhouse gas concentrations, and volcanic ash deposits, unlocking baseline benchmarks for future climate modeling.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-3">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Activity className="w-5 h-5 text-aurora-600" />
              <span>3. Southern Ocean Carbon Sequestration</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              The Southern Ocean absorbs more than 40% of all anthropogenic carbon dioxide absorbed by Earth's oceans and over 75% of excess oceanic heat. Indian oceanographic cruises map phytoplankton blooms, nutrient limitation (iron fertilization), and the biological carbon pump across oceanic fronts between 40°S and 65°S.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-3">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Sparkles className="w-5 h-5 text-aurora-600" />
              <span>4. Cold-Adapted Extremophile Biotechnology</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Microbial life surviving in polar permafrost and subglacial lakes produces unique cold-active enzymes (lipases, proteases, and cellulases) that function efficiently at low temperatures. Indian biotechnologists isolate these psychrophiles to develop industrial detergents that save energy, cold-tolerant agricultural crops, and novel antibiotic compounds.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Polaris Portal Architecture */}
      <div className="space-y-6 pt-4 border-t border-glacier-border">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            PORTAL CAPABILITIES
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Engineered for Accessibility, Education & Public Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <BookOpen className="w-4 h-4 text-aurora-600" />
              <span>1. Curated National Knowledge Archive</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Searchable, cataloged database indexing scientific reports, raw telemetry datasets, publications, field photography, and video records with full-text search, region filters, and instant keyword facet counters.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <MapPin className="w-4 h-4 text-aurora-600" />
              <span>2. Interactive High-Precision Mapping</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Realistic satellite cartography and ocean bathymetry synchronized with chronological voyage logs, letting visitors explore true polar terrain and trace scientists’ footsteps across historic field waypoints.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Sparkles className="w-4 h-4 text-aurora-600" />
              <span>3. Zero-Hallucination Content Studio</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Client-side outreach engine that instantly crafts fact-anchored website blurbs, press notes, social posts, and email bulletins formatted to strict character limits with zero hallucination.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-2.5">
            <div className="flex items-center gap-2 text-polar-900 font-semibold text-base">
              <Globe2 className="w-4 h-4 text-aurora-600" />
              <span>4. Self-Explaining Orientation Layer</span>
            </div>
            <p className="text-sm text-polar-700 leading-relaxed">
              Plain-English tooltips backed by a comprehensive polar glossary, guided coach-mark tours, and an interactive judge walkthrough mode tailored for non-technical evaluators.
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
            Expeditions Index &rarr;
          </Link>
          <span className="text-polar-300">|</span>
          <Link
            to="/sources"
            className="text-aurora-700 hover:text-aurora-800 transition-colors"
          >
            Official Sources & Provenance &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
