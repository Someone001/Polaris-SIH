import React, { useEffect, useMemo } from 'react';
import { ExternalLink, BookOpen, Database, Camera, Film, Radio, Compass } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';
import ledger from '../../research/sources-ledger.json';

export default function Sources() {
  useEffect(() => {
    document.title = 'Sources Used — Polaris';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Group records by type
  const grouped = useMemo(() => {
    const groups = {
      Expedition: { title: 'Expeditions', icon: Compass, items: [] },
      Publication: { title: 'Scientific Publications', icon: BookOpen, items: [] },
      Dataset: { title: 'Research Datasets', icon: Database, items: [] },
      Video: { title: 'Video Records', icon: Film, items: [] },
      Photo: { title: 'Photographs', icon: Camera, items: [] },
      Activity: { title: 'Outreach & Institutional Activities', icon: Radio, items: [] },
    };

    ledger.forEach((record) => {
      const type = record.type;
      if (groups[type]) {
        groups[type].items.push(record);
      }
    });

    return groups;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <Tag variant="aurora">Data Provenance</Tag>
        <SectionHeading
          kicker="PUBLIC SOURCES LEDGER"
          title="Sources Used"
          description="A complete list of the actual public sources used to populate records across Polaris. Every record on the portal links directly to an entry below."
        />
      </div>

      {/* Disclaimers & Methodology Note */}
      <div className="p-5 rounded-xl border border-glacier-border bg-glacier-50 text-sm text-polar-800 space-y-2">
        <p className="font-semibold text-polar-950">
          Source Traceability Principle
        </p>
        <p className="leading-relaxed">
          Polaris is a student prototype built for Smart India Hackathon 2026 (problem statement SIH26063). It is not an official website of MoES or NCPOR. Every record links to its public source. No unsourced estimates, synthetic numbers, or placeholder leaders are included.
        </p>
      </div>

      {/* Source Groups */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([key, group]) => {
          const Icon = group.icon;
          if (group.items.length === 0) return null;

          return (
            <section key={key} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-glacier-border/80 pb-2">
                <Icon className="w-5 h-5 text-aurora-600" />
                <h2 className="font-serif text-2xl font-normal text-polar-950">
                  {group.title} ({group.items.length})
                </h2>
              </div>

              <div className="divide-y divide-glacier-border/60 rounded-xl border border-glacier-border bg-white overflow-hidden shadow-2xs">
                {group.items.map((item) => {
                  const title = item.fields.title || item.fields.name;
                  const primarySource = item.sources?.[0];

                  return (
                    <article key={item.id} className="p-5 sm:p-6 space-y-2.5 hover:bg-glacier-50/50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs text-polar-500 font-semibold">
                          {item.id}
                        </span>
                        {primarySource?.url && (
                          <a
                            href={primarySource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-aurora-700 hover:text-aurora-800 transition-colors"
                          >
                            <span>Open Source URL</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-normal text-polar-950 leading-snug">
                        {title}
                      </h3>

                      {/* Excerpt */}
                      {primarySource?.excerpt && (
                        <div className="text-xs text-polar-700 bg-glacier-100/70 p-3 rounded-lg border border-glacier-border/70">
                          <span className="font-semibold text-polar-800 block text-[11px] uppercase tracking-wider mb-1">
                            Source Excerpt:
                          </span>
                          <p className="italic leading-relaxed">&ldquo;{primarySource.excerpt}&rdquo;</p>
                        </div>
                      )}

                      {/* Metadata Notes */}
                      {item.notes && (
                        <p className="text-xs text-polar-600">
                          <span className="font-medium text-polar-700">Notes:</span> {item.notes}
                        </p>
                      )}

                      {/* URL String */}
                      {primarySource?.url && (
                        <p className="text-[11px] font-mono text-polar-500 truncate pt-1">
                          {primarySource.url}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
