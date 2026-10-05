import React, { useEffect } from 'react';
import { ExternalLink, Camera, Film } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';

export default function Credits() {
  useEffect(() => {
    document.title = 'Media Credits & Attribution — Polaris';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const heroVideo = {
    title: 'Time-lapse of navigation through Lemaire Channel, Antarctica',
    author: 'Blagoj Klincharski',
    license: 'CC BY 3.0',
    attribution: 'Blagoj Klincharski, CC BY 3.0, via Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Time-lapse_of_navigation_through_Lemaire_Channel,_Antarctica.webm',
    notes: 'Used as the background video asset on the homepage hero section. Sourced from Wikimedia Commons and shared under Creative Commons Attribution 3.0.',
  };

  const photos = [
    {
      id: 'photo-001',
      title: 'Bharati permanent Antarctic research station',
      author: 'Author unknown',
      license: 'Public domain',
      attribution: 'Author unknown, Public domain, via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Bharati_permanent_Antarctic_research_station.jpg',
      preview: '/images/bharati-station.jpg',
    },
    {
      id: 'photo-002',
      title: 'Aerial view of Indian Station Maitri, Antarctica (February 2, 2005)',
      author: 'Ministry of Science and Technology',
      license: 'GODL-India',
      attribution: 'Ministry of Science and Technology, Government Open Data License - India (GODL-India), via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:An_aerial_view_of_the_Indian_Station_Maitri,_Antarctica_on_February_2,_2005.jpg',
      preview: '/images/maitri-station.jpg',
    },
    {
      id: 'photo-003',
      title: 'Himadri Research Station at Ny-Ålesund, Svalbard',
      author: 'Superchilum',
      license: 'CC BY-SA 3.0',
      attribution: 'Superchilum, CC BY-SA 3.0, via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Indian_station_1.JPG',
      preview: '/images/himadri-station.JPG',
    },
    {
      id: 'photo-004',
      title: 'Dakshin Gangotri Research Station',
      author: 'Pavan Nair',
      license: 'CC BY-SA 4.0',
      attribution: 'Pavan Nair, CC BY-SA 4.0, via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Dakshin_Gangotri_station.jpg',
      preview: '/images/dakshin-gangotri.jpg',
    },
    {
      id: 'photo-005',
      title: 'Oceanographic Research Vessel ORV Sagar Kanya',
      author: 'Anipilot',
      license: 'Public domain',
      attribution: 'Anipilot, Public domain, via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Sagar_kanya3.jpg',
      preview: '/images/orv-sagar-kanya.jpg',
    },
    {
      id: 'photo-006',
      title: 'Arctic Willow (Salix polaris) in Longyeardalen, Svalbard',
      author: 'Bjoertvedt',
      license: 'CC BY-SA 3.0',
      attribution: 'Bjoertvedt, CC BY-SA 3.0, via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Salix_polaris_IMG_3686_polarvier_longyeardalen.JPG',
      preview: '/images/salix-polaris-arctic-willow.jpg',
    },
    {
      id: 'photo-007',
      title: 'Aerial view of Schirmacher Oasis',
      author: 'Pavan Nair',
      license: 'CC BY-SA 4.0',
      attribution: 'Pavan Nair, CC BY-SA 4.0, via Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:An_aerial_view_of_Schirmacher_Hills.jpg',
      preview: '/images/schirmacher-oasis.jpg',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <Tag variant="ice">Attribution & Licenses</Tag>
        <SectionHeading
          kicker="OPEN-ACCESS MEDIA ATTRIBUTIONS"
          title="Media Credits"
          description="Full author attribution, license statements, and public repository links for all photographs and video media used across Polaris."
        />
      </div>

      {/* Hero Video Credit Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-glacier-border pb-2">
          <Film className="w-5 h-5 text-aurora-600" />
          <h2 className="font-serif text-2xl font-normal text-polar-950">
            Hero Background Video
          </h2>
        </div>

        <div className="p-6 rounded-2xl border border-glacier-border bg-glacier-50 space-y-3 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-polar-200 text-polar-800">
              hero-video-001
            </span>
            <a
              href={heroVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-aurora-700 hover:text-aurora-800 transition-colors"
            >
              <span>Wikimedia Commons File Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <h3 className="font-serif text-xl font-normal text-polar-950">
            {heroVideo.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-polar-800 pt-1">
            <div>
              <span className="text-xs text-polar-500 block">Author / Creator</span>
              <span className="font-medium text-polar-900">{heroVideo.author}</span>
            </div>
            <div>
              <span className="text-xs text-polar-500 block">License</span>
              <span className="font-mono text-xs text-polar-900">{heroVideo.license}</span>
            </div>
          </div>

          <p className="text-xs text-polar-600 leading-relaxed pt-2 border-t border-glacier-border/70">
            {heroVideo.notes}
          </p>
        </div>
      </section>

      {/* Photographs Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-glacier-border pb-2">
          <Camera className="w-5 h-5 text-aurora-600" />
          <h2 className="font-serif text-2xl font-normal text-polar-950">
            Photographs ({photos.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="rounded-xl border border-glacier-border bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-polar-950">
                  <img
                    src={photo.preview}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-polar-500">
                    <span className="font-mono font-semibold">{photo.id}</span>
                    <span className="font-mono">{photo.license}</span>
                  </div>
                  <h3 className="font-serif text-base font-normal text-polar-950 leading-snug">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-polar-600">
                    <span className="font-medium text-polar-700">Author:</span> {photo.author}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-aurora-700 hover:text-aurora-800 transition-colors"
                >
                  <span>Commons File Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
