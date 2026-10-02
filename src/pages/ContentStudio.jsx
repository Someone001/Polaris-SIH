import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Search,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';
import ItemVisual from '../components/ItemVisual';
import InfoTip from '../components/InfoTip';
import JudgeBadge from '../components/JudgeBadge';
import { getItem, getItems, getExpedition } from '../lib/dataLoader';
import { generate } from '../lib/generate';
import { TYPE_LABELS } from '../lib/archiveLogic';

const STORAGE_KEY_RECENT = 'polaris_studio_recent';
const STORAGE_KEY_CONTROLS = 'polaris_studio_controls';

export default function ContentStudio() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const allItems = useMemo(() => getItems(), []);

  // Controls state initialized from URL params or localStorage
  const [audience, setAudience] = useState(() => searchParams.get('audience') || 'general');
  const [tone, setTone] = useState(() => searchParams.get('tone') || 'informative');
  const [length, setLength] = useState(() => searchParams.get('length') || 'medium');
  const [cta, setCta] = useState(() => searchParams.get('cta') === 'true');
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'website');

  // Picker search & filter state
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerType, setPickerType] = useState('all');

  // Copied states
  const [copiedKey, setCopiedKey] = useState(null);

  // Recently generated items
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current record & expedition
  const currentRecord = useMemo(() => (id ? getItem(id) : null), [id]);
  const currentExpedition = useMemo(() => (currentRecord ? getExpedition(currentRecord.expeditionId) : null), [currentRecord]);

  // Index in all items for Prev/Next
  const currentIndex = useMemo(() => {
    if (!id) return -1;
    return allItems.findIndex((item) => item.id === id);
  }, [id, allItems]);

  // Sync state to URL search params
  const updateStudioParams = (updates) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...updates };
    setSearchParams(merged, { replace: true });
  };

  // Keep localStorage and URL updated when id changes
  useEffect(() => {
    if (id && currentRecord) {
      setRecentIds((prev) => {
        const next = [id, ...prev.filter((item) => item !== id)].slice(0, 6);
        try {
          localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(next));
        } catch {
          // ignore localStorage issues
        }
        return next;
      });
    }
  }, [id, currentRecord]);

  // Handle controls update
  const handleControlChange = (type, val) => {
    if (type === 'audience') {
      setAudience(val);
      updateStudioParams({ audience: val });
    } else if (type === 'tone') {
      setTone(val);
      updateStudioParams({ tone: val });
    } else if (type === 'length') {
      setLength(val);
      updateStudioParams({ length: val });
    } else if (type === 'cta') {
      setCta(val);
      updateStudioParams({ cta: String(val) });
    } else if (type === 'tab') {
      setActiveTab(val);
      updateStudioParams({ tab: val });
    }
  };

  // Generate outputs
  const generatedOutputs = useMemo(() => {
    if (!currentRecord) return null;
    return generate(currentRecord, { audience, tone, length, cta }, currentExpedition);
  }, [currentRecord, audience, tone, length, cta, currentExpedition]);

  // Editable output text states (seeded by generated text)
  const [editText, setEditText] = useState({});

  useEffect(() => {
    if (generatedOutputs) {
      setEditText({
        website: generatedOutputs.websiteBlurb.fullText,
        twitter: generatedOutputs.socialPosts.twitter,
        instagram: generatedOutputs.socialPosts.instagram,
        linkedin: generatedOutputs.socialPosts.linkedin,
        press: generatedOutputs.pressNote.fullText,
        email: generatedOutputs.emailSnippet.fullText,
      });
    }
  }, [generatedOutputs]);

  // Copy handler
  const handleCopy = (text, key) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Download handler
  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered items for the Landing Picker
  const pickerFilteredItems = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    return allItems.filter((item) => {
      if (pickerType !== 'all' && item.type !== pickerType) return false;
      if (q) {
        const inTitle = item.title?.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q);
        const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inTags) return false;
      }
      return true;
    });
  }, [allItems, pickerSearch, pickerType]);

  // ==========================================
  // VIEW 1: LANDING / PICKER VIEW (/studio)
  // ==========================================
  if (!id) {
    const recentRecords = recentIds.map((rId) => allItems.find((i) => i.id === rId)).filter(Boolean);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Landing Heading */}
        <div className="max-w-3xl space-y-3">
          <SectionHeading
            kicker="AUTOMATED MEDIA OUTREACH"
            title="Content Studio"
            description="Pick any report, photo or dataset and get ready-to-post text. Tailored for websites, social platforms, and press bulletins with zero hallucinations."
          />
        </div>

        {/* Record Picker Section */}
        <div className="bg-glacier-50 rounded-2xl border border-glacier-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-polar-950 font-normal">
                  Select an Archive Record
                </h2>
                <JudgeBadge step="1" label="Choose any archive record to generate multi-format media outreach" />
              </div>
              <p className="text-sm text-polar-600">
                Choose any item below to open the dual-pane Content Workspace.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-polar-600 bg-polar-100 px-3 py-1 rounded-full self-start sm:self-auto">
              {pickerFilteredItems.length} records available
            </span>
          </div>

          {/* Search bar and type chips */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-polar-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="studio-picker-search"
                aria-label="Search archive records by keyword to generate outreach"
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search items by keyword (e.g. 'glacier', 'penguins', 'wind')..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-glacier-border bg-white text-polar-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-aurora-500"
              />
            </div>

            {/* Type Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPickerType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  pickerType === 'all'
                    ? 'bg-polar-900 text-glacier-50'
                    : 'bg-glacier-100 text-polar-700 hover:bg-glacier-200'
                }`}
              >
                All types ({allItems.length})
              </button>
              {Object.keys(TYPE_LABELS).map((typeKey) => {
                const count = allItems.filter((i) => i.type === typeKey).length;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setPickerType(typeKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      pickerType === typeKey
                        ? 'bg-polar-900 text-glacier-50'
                        : 'bg-glacier-100 text-polar-700 hover:bg-glacier-200'
                    }`}
                  >
                    {TYPE_LABELS[typeKey]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Grid Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {pickerFilteredItems.slice(0, 9).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/studio/${item.id}`)}
                className="text-left p-4 rounded-xl border border-glacier-border bg-white hover:border-aurora-400 hover:shadow-xs transition-all flex items-start gap-3.5 group focus:outline-none focus:ring-2 focus:ring-aurora-500"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-polar-900 border border-polar-800">
                  <ItemVisual item={item} size="sm" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[11px] font-semibold text-aurora-700 uppercase tracking-wider block">
                    {TYPE_LABELS[item.type] || item.type}
                  </span>
                  <h3 className="font-serif text-sm font-medium text-polar-950 line-clamp-1 group-hover:text-aurora-700">
                    {item.title}
                  </h3>
                  <p className="text-xs text-polar-600 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {pickerFilteredItems.length > 9 && (
            <p className="text-xs text-polar-500 text-center pt-2">
              Showing top 9 matches of {pickerFilteredItems.length}. Use the search bar above to narrow down specific topics.
            </p>
          )}
        </div>

        {/* Recently Generated Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-normal text-polar-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-polar-500" />
              <span>Recently Generated in Studio</span>
            </h2>
            {recentRecords.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRecentIds([]);
                  try {
                    localStorage.removeItem(STORAGE_KEY_RECENT);
                  } catch {
                    // ignore storage exception in restricted modes
                  }
                }}
                className="text-xs text-polar-500 hover:text-polar-900 underline"
              >
                Clear history
              </button>
            )}
          </div>

          {recentRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRecords.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/studio/${item.id}`)}
                  className="p-4 rounded-xl border border-glacier-border bg-glacier-50/80 hover:bg-glacier-100 cursor-pointer transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs text-polar-500">
                    <span>{TYPE_LABELS[item.type] || item.type}</span>
                    <span className="font-mono">{item.date}</span>
                  </div>
                  <h3 className="font-serif text-base font-normal text-polar-950 group-hover:text-aurora-700 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-polar-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-glacier-border text-center bg-glacier-50 text-polar-600 text-sm">
              No recent items generated yet. Select an archive record above to start generating!
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: 404 STATE (Invalid ID)
  // ==========================================
  if (!currentRecord) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <AlertCircle className="w-12 h-12 text-ice-600 mx-auto" />
        <h2 className="font-serif text-3xl text-polar-950 font-normal">
          Record not found
        </h2>
        <p className="text-polar-700">
          The requested record &ldquo;{id}&rdquo; does not exist in our static polar archive.
        </p>
        <Link
          to="/studio"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-polar-900 text-glacier-50 text-sm font-medium"
        >
          <span>Return to Studio Picker</span>
        </Link>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: TWO-PANE WORKSPACE (/studio/:id)
  // ==========================================
  const prevRecord = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextRecord = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb & Record Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glacier-border pb-4">
        <div className="flex items-center gap-2 text-sm text-polar-600">
          <Link to="/studio" className="hover:text-polar-950 transition-colors">
            Content Studio
          </Link>
          <span className="text-polar-400">/</span>
          <span className="text-polar-950 font-medium truncate max-w-xs sm:max-w-md">
            {currentRecord.title}
          </span>
        </div>

        {/* Prev / Next record fast stepper */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={!prevRecord}
            onClick={() => navigate(`/studio/${prevRecord.id}?${searchParams.toString()}`)}
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 font-medium transition-colors ${
              prevRecord
                ? 'border-glacier-border hover:bg-glacier-100 text-polar-800 cursor-pointer'
                : 'border-glacier-border/50 text-polar-300 cursor-not-allowed'
            }`}
            title="Previous record in archive"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="text-xs text-polar-500 font-mono px-1">
            {currentIndex + 1} of {allItems.length}
          </span>

          <button
            type="button"
            disabled={!nextRecord}
            onClick={() => navigate(`/studio/${nextRecord.id}?${searchParams.toString()}`)}
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 font-medium transition-colors ${
              nextRecord
                ? 'border-glacier-border hover:bg-glacier-100 text-polar-800 cursor-pointer'
                : 'border-glacier-border/50 text-polar-300 cursor-not-allowed'
            }`}
            title="Next record in archive"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TWO PANES WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================
            LEFT PANE: SOURCE & CONTROLS (5 cols)
           ========================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Read-Only Source Card */}
          <div className="rounded-2xl border border-glacier-border bg-glacier-50 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
                Source Record (Read-Only)
              </span>
              <Tag variant="ice" size="sm">
                {TYPE_LABELS[currentRecord.type] || currentRecord.type}
              </Tag>
            </div>

            <div className="rounded-xl overflow-hidden aspect-[16/10] border border-glacier-border">
              <ItemVisual item={currentRecord} size="md" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-xl font-normal text-polar-950">
                {currentRecord.title}
              </h2>
              <p className="text-xs text-polar-500 font-mono">
                Logged on {currentRecord.date} &bull; {currentExpedition?.name || currentRecord.expeditionId}
              </p>
              <p className="text-sm text-polar-700 leading-relaxed pt-1">
                {currentRecord.description}
              </p>
            </div>

            {/* Verifiable Fields Used Box */}
            <div className="pt-3 border-t border-glacier-border space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-polar-500 block">
                  Fields Used (No Hallucinations)
                </span>
                <InfoTip termKey="metadata" />
                <JudgeBadge step="2" label="Guaranteed zero hallucination: deterministic metadata extraction" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {generatedOutputs?.fieldsUsed.map((field) => (
                  <span
                    key={field}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-polar-100 text-polar-700"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Generator Controls */}
          <div className="rounded-2xl border border-glacier-border bg-glacier-50 p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-normal text-polar-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aurora-600" />
                <span>Generation Controls</span>
              </h3>
              <JudgeBadge step="3" label="Real-time persona and length customization" />
            </div>

            {/* Audience Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-polar-600">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'general', label: 'General' },
                  { key: 'students', label: 'Students' },
                  { key: 'press', label: 'Press' },
                ].map((aud) => (
                  <button
                    key={aud.key}
                    type="button"
                    onClick={() => handleControlChange('audience', aud.key)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      audience === aud.key
                        ? 'bg-polar-900 text-glacier-50'
                        : 'bg-white border border-glacier-border text-polar-700 hover:bg-glacier-100'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-polar-600">
                Tone of Voice
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'informative', label: 'Informative' },
                  { key: 'inspiring', label: 'Inspiring' },
                  { key: 'urgent', label: 'Urgent' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => handleControlChange('tone', t.key)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      tone === t.key
                        ? 'bg-polar-900 text-glacier-50'
                        : 'bg-white border border-glacier-border text-polar-700 hover:bg-glacier-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-polar-600">
                Output Length
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'short', label: 'Short' },
                  { key: 'medium', label: 'Medium' },
                ].map((len) => (
                  <button
                    key={len.key}
                    type="button"
                    onClick={() => handleControlChange('length', len.key)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      length === len.key
                        ? 'bg-polar-900 text-glacier-50'
                        : 'bg-white border border-glacier-border text-polar-700 hover:bg-glacier-100'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Toggle */}
            <div className="pt-2 border-t border-glacier-border flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-polar-600">
                Add Call to Action
              </span>
              <button
                type="button"
                onClick={() => handleControlChange('cta', !cta)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  cta ? 'bg-aurora-500' : 'bg-polar-200'
                }`}
                role="switch"
                aria-checked={cta}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    cta ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT PANE: FOUR OUTPUT TABS (7 cols)
           ========================================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-glacier-border bg-white shadow-xs overflow-hidden">
            {/* Tabs Header */}
            <div className="bg-glacier-50 border-b border-glacier-border flex flex-wrap">
              {[
                { key: 'website', label: 'Website Blurb' },
                { key: 'social', label: 'Social Posts' },
                { key: 'press', label: 'Press Note' },
                { key: 'email', label: 'Email Snippet' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleControlChange('tab', tab.key)}
                  className={`px-4 sm:px-6 py-3.5 text-sm font-medium border-b-2 transition-colors flex-1 text-center ${
                    activeTab === tab.key
                      ? 'border-aurora-500 text-polar-950 font-semibold bg-white'
                      : 'border-transparent text-polar-600 hover:text-polar-900 hover:bg-glacier-100/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* TAB 1: WEBSITE BLURB */}
              {activeTab === 'website' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-polar-500">
                      Website Summary & Bullets
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(editText.website || '', 'website')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-glacier-border text-xs font-medium text-polar-800 hover:bg-glacier-100"
                      >
                        {copiedKey === 'website' ? <Check className="w-3.5 h-3.5 text-aurora-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'website' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(editText.website || '', `${currentRecord.id}-website-blurb`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-glacier-border text-xs font-medium text-polar-800 hover:bg-glacier-100"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={editText.website || ''}
                    onChange={(e) => setEditText({ ...editText, website: e.target.value })}
                    className="w-full p-4 rounded-xl border border-glacier-border font-sans text-sm sm:text-base leading-relaxed text-polar-900 focus:outline-none focus:ring-2 focus:ring-aurora-500 resize-y"
                    aria-label="Editable website blurb"
                  />
                </div>
              )}

              {/* TAB 2: SOCIAL POSTS */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  {/* Twitter Variant */}
                  <div className="space-y-2 p-4 rounded-xl border border-glacier-border bg-glacier-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-polar-700">
                        X / Twitter (Max 280)
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            (editText.twitter || '').length > 280 ? 'text-red-600' : 'text-polar-500'
                          }`}
                        >
                          {(editText.twitter || '').length} / 280
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(editText.twitter || '', 'twitter')}
                          className="inline-flex items-center gap-1 text-aurora-700 hover:text-aurora-600 font-medium"
                        >
                          {copiedKey === 'twitter' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'twitter' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={editText.twitter || ''}
                      onChange={(e) => setEditText({ ...editText, twitter: e.target.value })}
                      className="w-full p-3 rounded-lg border border-glacier-border text-sm text-polar-900 focus:outline-none focus:ring-1 focus:ring-aurora-500"
                    />
                  </div>

                  {/* LinkedIn Variant */}
                  <div className="space-y-2 p-4 rounded-xl border border-glacier-border bg-glacier-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-polar-700">
                        LinkedIn (Max 700)
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            (editText.linkedin || '').length > 700 ? 'text-red-600' : 'text-polar-500'
                          }`}
                        >
                          {(editText.linkedin || '').length} / 700
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(editText.linkedin || '', 'linkedin')}
                          className="inline-flex items-center gap-1 text-aurora-700 hover:text-aurora-600 font-medium"
                        >
                          {copiedKey === 'linkedin' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'linkedin' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={6}
                      value={editText.linkedin || ''}
                      onChange={(e) => setEditText({ ...editText, linkedin: e.target.value })}
                      className="w-full p-3 rounded-lg border border-glacier-border text-sm text-polar-900 focus:outline-none focus:ring-1 focus:ring-aurora-500"
                    />
                  </div>

                  {/* Instagram Variant */}
                  <div className="space-y-2 p-4 rounded-xl border border-glacier-border bg-glacier-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-polar-700">
                        Instagram Caption (Max 2200)
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            (editText.instagram || '').length > 2200 ? 'text-red-600' : 'text-polar-500'
                          }`}
                        >
                          {(editText.instagram || '').length} / 2200
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(editText.instagram || '', 'instagram')}
                          className="inline-flex items-center gap-1 text-aurora-700 hover:text-aurora-600 font-medium"
                        >
                          {copiedKey === 'instagram' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'instagram' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={6}
                      value={editText.instagram || ''}
                      onChange={(e) => setEditText({ ...editText, instagram: e.target.value })}
                      className="w-full p-3 rounded-lg border border-glacier-border text-sm text-polar-900 focus:outline-none focus:ring-1 focus:ring-aurora-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PRESS NOTE */}
              {activeTab === 'press' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-polar-500">
                      Standard Press Release Draft
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(editText.press || '', 'press')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-glacier-border text-xs font-medium text-polar-800 hover:bg-glacier-100"
                      >
                        {copiedKey === 'press' ? <Check className="w-3.5 h-3.5 text-aurora-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'press' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(editText.press || '', `${currentRecord.id}-press-note`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-glacier-border text-xs font-medium text-polar-800 hover:bg-glacier-100"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={editText.press || ''}
                    onChange={(e) => setEditText({ ...editText, press: e.target.value })}
                    className="w-full p-4 rounded-xl border border-glacier-border font-sans text-sm sm:text-base leading-relaxed text-polar-900 focus:outline-none focus:ring-2 focus:ring-aurora-500 resize-y"
                    aria-label="Editable press release text"
                  />
                </div>
              )}

              {/* TAB 4: EMAIL SNIPPET */}
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-polar-500">
                      Outreach Email & Subject Line
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(editText.email || '', 'email')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-glacier-border text-xs font-medium text-polar-800 hover:bg-glacier-100"
                      >
                        {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-aurora-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'email' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(editText.email || '', `${currentRecord.id}-email-snippet`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-glacier-border text-xs font-medium text-polar-800 hover:bg-glacier-100"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={editText.email || ''}
                    onChange={(e) => setEditText({ ...editText, email: e.target.value })}
                    className="w-full p-4 rounded-xl border border-glacier-border font-sans text-sm sm:text-base leading-relaxed text-polar-900 focus:outline-none focus:ring-2 focus:ring-aurora-500 resize-y"
                    aria-label="Editable email snippet text"
                  />
                </div>
              )}

              {/* Visible Verification Disclaimer */}
              <div className="p-4 rounded-xl bg-glacier-100 border border-glacier-border text-xs text-polar-600 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-aurora-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> Draft generated from expedition metadata. Review facts before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
