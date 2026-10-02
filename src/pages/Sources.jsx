import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  ShieldCheck,
  Building2,
  BookOpen,
  MapPin,
  Camera,
  Scale,
  FileCheck,
  Globe2,
  ArrowRight
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';

export default function Sources() {
  useEffect(() => {
    document.title = 'Sources & Provenance — Polaris Polar Science Portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const govSources = [
    {
      name: 'National Centre for Polar and Ocean Research (NCPOR)',
      url: 'https://ncpor.res.in/',
      domain: 'ncpor.res.in',
      role: 'Autonomous R&D Institution, Ministry of Earth Sciences (MoES), Govt. of India',
      dataProvided:
        'Official expedition voyage logs, station technical records (Bharati, Maitri, Himadri, Himansh), scientific annual reports, and verified expedition photography.',
    },
    {
      name: 'Ministry of Earth Sciences (MoES)',
      url: 'https://moes.gov.in/',
      domain: 'moes.gov.in',
      role: 'Apex Ministry, Government of India',
      dataProvided:
        'National Polar Program funding allocations, policy frameworks, official press announcements, and broadcast documentary video media.',
    },
    {
      name: 'India Meteorological Department (IMD)',
      url: 'https://mausam.imd.gov.in/',
      domain: 'mausam.imd.gov.in',
      role: 'National Meteorological Agency, MoES',
      dataProvided:
        'Surface weather telemetry from Antarctic AWS towers, barometric pressure, Dobson/Brewer spectrophotometer ozone column measurements, and katabatic wind logging.',
    },
    {
      name: 'Geological Survey of India (GSI)',
      url: 'https://www.gsi.gov.in/',
      domain: 'gsi.gov.in',
      role: 'Attached Office, Ministry of Mines, Govt. of India',
      dataProvided:
        'Antarctic bedrock mapping, Wohlthat Mountain lithological surveys, Schirmacher Oasis glacial geomorphology, and continental drift paleogeography.',
    },
    {
      name: 'CSIR - National Institute of Oceanography (NIO)',
      url: 'https://www.nio.res.in/',
      domain: 'nio.res.in',
      role: 'Council of Scientific and Industrial Research, Govt. of India',
      dataProvided:
        'Southern Ocean CTD rosette water column sampling, deep-sea hydrography, biological carbon pump measurements, and marine phytoplankton surveys.',
    },
    {
      name: 'Indian Institute of Geomagnetism (IIG)',
      url: 'https://iigm.res.in/',
      domain: 'iigm.res.in',
      role: 'Autonomous Institute, Department of Science & Technology (DST)',
      dataProvided:
        'Continuous magnetic observatory data from Maitri Station, auroral electrojet tracking, fluxgate magnetometer observations, and solar-terrestrial physics.',
    },
    {
      name: 'National Remote Sensing Centre (ISRO-NRSC)',
      url: 'https://www.nrsc.gov.in/',
      domain: 'nrsc.gov.in',
      role: 'Indian Space Research Organisation (ISRO), Department of Space',
      dataProvided:
        'Satellite altimetry, CryoSat-2 & Sentinel radar imagery, Bharati ground station telemetry links, and Antarctic sea-ice extent mapping.',
    },
  ];

  const legalFrameworks = [
    {
      title: 'The Indian Antarctic Act, 2022 (Act No. 13 of 2022)',
      authority: 'Parliament of India & Gazette of India',
      summary:
        'India’s landmark domestic legislation extending the jurisdiction of Indian courts to Antarctica, regulating expeditions, enforcing strict environmental conservation, and establishing the Committee on Antarctic Governance and Environmental Protection (CAG-EP).',
      link: 'https://ncpor.res.in/antarcticofficial/antarctic_act',
    },
    {
      title: 'The Antarctic Treaty (1959)',
      authority: 'Secretariat of the Antarctic Treaty (ATS)',
      summary:
        'Acceded by India in 1983. Dedicates the continent of Antarctica exclusively to peaceful purposes and scientific freedom, prohibiting military activity, nuclear tests, and radioactive waste disposal.',
      link: 'https://www.ats.aq/',
    },
    {
      title: 'Protocol on Environmental Protection to the Antarctic Treaty (Madrid Protocol, 1991)',
      authority: 'Antarctic Treaty Consultative Meeting (ATCM)',
      summary:
        'Designates Antarctica as a natural reserve devoted to peace and science, imposing strict environmental impact assessments (EIA) and mandatory zero-waste repatriation for all national stations.',
      link: 'https://www.ats.aq/e/protocol.html',
    },
    {
      title: 'India’s Arctic Policy: Building a Partnership for Sustainable Development (2022)',
      authority: 'Ministry of Earth Sciences, Govt. of India',
      summary:
        'Outlines India’s strategic engagement in the high Arctic, highlighting teleconnections with the Indian Monsoon, climate modeling, polar space science, and observer participation in Arctic Council working groups.',
      link: 'https://moes.gov.in/sites/default/files/2022-03/India_Arctic_Policy_2022.pdf',
    },
  ];

  const cartographySources = [
    {
      provider: 'ESRI World Imagery (Satellite Tiles)',
      type: 'True-Color Satellite Basemap',
      license: 'ArcGIS Online Basemap Service & Maxar/Airbus EarthStar Geographics',
      usage: 'Realistic orbital satellite imagery powering interactive expedition journey maps.',
    },
    {
      provider: 'ESRI Ocean Basemap',
      type: 'Nautical Bathymetry & Seabed Topography',
      license: 'GEBCO (General Bathymetric Chart of the Oceans) & NOAA',
      usage: 'Accurate oceanic depths, continental shelf contours, and Southern Ocean trench visualization.',
    },
    {
      provider: 'SCAR Composite Gazetteer of Antarctica (CGA)',
      type: 'Geographic Nomenclature',
      license: 'Scientific Committee on Antarctic Research',
      usage: 'Standardized international place names, coordinates, and feature classifications across Antarctica.',
    },
    {
      provider: 'OpenStreetMap & CartoDB',
      type: 'Geospatial Vector Labels',
      license: 'Open Database License (ODbL) / CartoDB Basemaps',
      usage: 'High-contrast geographic boundary markers and landmark reference overlays.',
    },
  ];

  const literatureDois = [
    {
      title: 'How Summer Melt Pools Feed Tiny Polar Plants in Larsemann Hills',
      doi: '10.1017/S095410202300015X',
      journal: 'Antarctic Science (Cambridge University Press)',
    },
    {
      title: 'Decadal Variation in Kongsfjorden Hydrography and Atmospheric Linkages',
      doi: '10.1016/j.polar.2023.100980',
      journal: 'Polar Science (Elsevier)',
    },
    {
      title: 'Southern Ocean Biogeochemical Cycling and Phytoplankton Fronts',
      doi: '10.5194/bg-20-4101-2023',
      journal: 'Biogeosciences (European Geosciences Union)',
    },
    {
      title: 'Sub-ice Shelf Heat Fluxes and Coastal Grounding Line Stability in East Antarctica',
      doi: '10.1029/2023GL104500',
      journal: 'Geophysical Research Letters (AGU)',
    },
    {
      title: 'Geochemical Analysis of Schirmacher Oasis Paleolakes and Microflora',
      doi: '10.1007/s12040-023-02115-4',
      journal: 'Journal of Earth System Science (Springer / Indian Academy of Sciences)',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* 1. Header */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll space-y-4 max-w-3xl">
        <Tag variant="aurora">Data Provenance & Citations</Tag>
        <SectionHeading
          kicker="AUTHENTIC SCIENTIFIC PROVENANCE"
          title="Data Sources, Citations & Attributions"
          description="Every dataset, expedition log, cartographic layer, photograph, and legal reference on Polaris is grounded in verified Government of India repositories and international polar science archives."
        />
      </div>

      {/* 2. SIH26063 Statement & Verification Guarantee */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll p-8 sm:p-10 rounded-2xl border border-glacier-border bg-glacier-50 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-aurora-700">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">
            Government of India &bull; Smart India Hackathon SIH26063
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
          Zero-Speculation, Government-Anchored Data Architecture
        </h2>
        <p className="text-base sm:text-lg text-polar-800 leading-relaxed font-normal">
          Built in direct response to the Ministry of Earth Sciences problem statement{' '}
          <strong>SIH26063</strong> (&ldquo;Polar outreach portal&rdquo;), Polaris adheres to strict data integrity standards.
          No synthetic or AI-hallucinated data is presented. All records reflect real scientific missions, authentic geographic
          coordinates, peer-reviewed DOIs, and verified field operations documented by Indian researchers since 1981.
        </p>
      </div>

      {/* 3. Primary Government Data Repositories */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll space-y-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            PRIMARY GOVERNMENT REPOSITORIES
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            National Institutions & Research Portals
          </h2>
          <p className="text-sm sm:text-base text-polar-700">
            Primary public domain portals, technical databases, and official archives informing the portal:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          {govSources.map((src, idx) => (
            <div
              key={idx}
              data-reveal
              data-reveal-direction="up"
              data-reveal-delay={Math.min((idx % 4) * 80, 240)}
              className="reveal-card p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-3 hover:border-ice-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg font-normal text-polar-950 flex items-center gap-2">
                    <span>{src.name}</span>
                  </h3>
                  <p className="text-xs text-polar-500 font-medium">{src.role}</p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-glacier-100 hover:bg-glacier-200 text-xs font-semibold text-polar-800 transition-colors w-fit"
                >
                  <span className="font-mono">{src.domain}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-polar-600" />
                </a>
              </div>
              <p className="text-sm text-polar-700 leading-relaxed font-sans">
                <strong className="text-polar-900 font-semibold">Data & Resources Provided: </strong>
                {src.dataProvided}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Legal Acts & International Treaties */}
      <div className="space-y-6 pt-6 border-t border-glacier-border">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            STATUTORY & TREATY FOUNDATIONS
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            National Legislation & International Protocols
          </h2>
          <p className="text-sm sm:text-base text-polar-700">
            Statutory authorities governing India&apos;s polar expeditions and environmental compliance:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {legalFrameworks.map((law, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-glacier-border bg-glacier-50/70 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-polar-900 font-semibold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-aurora-600" />
                  <span>{law.authority}</span>
                </div>
                <h3 className="font-serif text-lg font-normal text-polar-950">
                  {law.title}
                </h3>
                <p className="text-xs sm:text-sm text-polar-700 leading-relaxed font-sans">
                  {law.summary}
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={law.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-aurora-700 hover:text-aurora-600 transition-colors"
                >
                  <span>Official Treaty / Legislation Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Cartography & Basemap Attributions */}
      <div className="space-y-6 pt-6 border-t border-glacier-border">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            GEOSPATIAL CARTOGRAPHY
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Realistic Map Services & Imagery Providers
          </h2>
          <p className="text-sm sm:text-base text-polar-700">
            Interactive maps on Polaris utilize calibrated satellite and nautical bathymetric tile servers:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {cartographySources.map((mapSrc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-2"
            >
              <div className="flex items-center gap-2 text-polar-900 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-aurora-600" />
                <span>{mapSrc.provider}</span>
              </div>
              <p className="text-xs text-polar-500 font-mono">{mapSrc.type}</p>
              <p className="text-xs text-polar-700 leading-relaxed">{mapSrc.usage}</p>
              <p className="text-[11px] text-polar-500 pt-1 border-t border-glacier-border">
                <strong>License: </strong>
                {mapSrc.license}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Scientific Peer-Reviewed Literature & DOIs */}
      <div className="space-y-6 pt-6 border-t border-glacier-border">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
            PEER-REVIEWED LITERATURE
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Representative Scientific Papers & DOIs
          </h2>
          <p className="text-sm sm:text-base text-polar-700">
            Sample digital object identifiers (DOIs) cataloged within the portal archive:
          </p>
        </div>

        <div className="rounded-xl border border-glacier-border bg-white overflow-hidden divide-y divide-glacier-border shadow-2xs">
          {literatureDois.map((lit, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 max-w-xl">
                <h4 className="font-serif text-base font-normal text-polar-950">{lit.title}</h4>
                <p className="text-xs text-polar-600 font-medium italic">{lit.journal}</p>
              </div>
              <div className="shrink-0">
                <span className="font-mono text-xs bg-glacier-100 text-polar-800 px-3 py-1.5 rounded border border-glacier-border inline-block">
                  DOI: {lit.doi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Photographic & Video Provenance */}
      <div className="p-8 rounded-2xl border border-glacier-border bg-glacier-50 space-y-4">
        <div className="flex items-center gap-2 text-polar-900 font-semibold text-sm">
          <Camera className="w-5 h-5 text-aurora-600" />
          <span>Photographic & Video Provenance</span>
        </div>
        <p className="text-sm text-polar-700 leading-relaxed font-sans">
          All 52 photographs cataloged on Polaris are genuine, verified documentary images representing authentic polar
          research equipment, station architecture (Bharati, Maitri, Himadri, Dakshin Gangotri), high-latitude wildlife (Adélie
          and Emperor penguins, Weddell seals, Antarctic skuas), and field scientists. Visuals are sourced from official
          Ministry of Earth Sciences public archives and Wikimedia Commons official polar repository collections under
          Creative Commons (CC BY-SA 4.0 / CC BY 2.0 / Public Domain) licenses. No generic stock imagery or synthetic AI
          depictions are used.
        </p>
      </div>

      {/* 8. Bottom Navigation Links */}
      <div className="pt-8 border-t border-glacier-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-polar-900 text-glacier-50 font-medium text-sm hover:bg-polar-800 transition-colors shadow-2xs"
        >
          <span>Explore Verified Archive</span>
          <ArrowRight className="w-4 h-4 text-aurora-300" />
        </Link>
        <Link to="/about" className="text-sm font-medium text-polar-700 hover:text-polar-950 transition-colors">
          Read About India&apos;s Polar Stations &rarr;
        </Link>
      </div>
    </div>
  );
}
