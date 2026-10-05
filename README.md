# ❄️ POLARIS — Polar Outreach & Knowledge Portal

> **Disclaimer**: Polaris is a student prototype built for Smart India Hackathon 2026 (problem statement SIH26063). It is not an official website of MoES or NCPOR. Every record links to its public source.

> **Smart India Hackathon 2026** — Problem Statement: **SIH26063**  
> **Target Theme:** Citizen Science Outreach, Cryospheric Knowledge Repository & Outreach Content Studio  
> **Tagline:** *Polar science outreach and knowledge repository.*

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%201.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Someone001%2FPolaris--SIH-181717?logo=github)](https://github.com/Someone001/Polaris-SIH)

---

## 🧭 Executive Summary for Evaluators & Judges

**Polaris** is an integrated web prototype built for **Problem Statement SIH26063**. Indian researchers have conducted annual scientific expeditions across Antarctica, the Arctic, the Southern Ocean, and the Himalayas.

Polaris organizes and presents public polar research through an **open-access, self-explaining, and media-rich portal** that turns high-latitude cryosphere research into accessible knowledge for students, researchers, journalists, and citizens. Every single record in Polaris is backed by `/research/sources-ledger.json`, linking directly to public sources including Press Information Bureau (PIB) releases, CrossRef journal articles with DOIs, Zenodo repositories, Wikimedia Commons media, and MoES YouTube releases.

---

## 🏆 Key Features

| Feature | Description | Technical Implementation |
|---|---|---|
| 🌊 **Hero Navigation Video** | Drone footage of Antarctica's Lemaire Channel (Blagoj Klincharski, CC BY 3.0 / CC BY-SA 4.0 via Wikimedia Commons). | Dual WebM/MP4 with progressive streaming, with credit link directly on the hero and `/credits`. |
| ✨ **Full-Site Scroll-to-Reveal** | Smooth GPU-accelerated motion reveals sections, cards, and data facets dynamically as the user scrolls. | Custom `useScrollReveal` hook powered by `IntersectionObserver` with automatic disconnect to ensure zero runtime overhead. |
| 🗺️ **Sourced Polar Mapping** | Interactive Leaflet map displaying coordinates where explicitly documented in public sources. | Leaflet 1.9 with OpenStreetMap / Esri satellite basemaps. Un-sourced routes or coordinates are strictly omitted. |
| 📚 **Sourced Knowledge Archive** | Sourced records spanning Publications (CrossRef), Datasets (Zenodo), Photos (Wikimedia Commons), Videos, and Activities (PIB). | Real-time multi-faceted filtering (search, region, expedition, type, year, and sorting) with URL synchronization and visible source links. |
| ✍️ **Sourced Content Studio** | Deterministic outreach studio converting scientific records into social posts (X, LinkedIn, Instagram), website blurbs, press notes, and emails. | Strictly deterministic rules engine extracting only documented fields. Every output includes a source citation link. |
| 🛡️ **Source Ledger & Traceability** | Dedicated pages (`/sources` and `/credits`) listing every primary public source and creative commons attribution. | Strict data ledger architecture in `/research/sources-ledger.json` validated by automated content checks. |
| 💡 **Interactive Tour & Orientation** | Multi-step interactive tour, guide modal, and polar terminology glossary. | Custom `ExplainingContext` with keyboard accessibility and WCAG AA contrast compliance. |

---

## 🎯 5-Minute Evaluation Walkthrough Guide for Judges

To experience Polaris during evaluation, we recommend following this sequence:

### Step 1: The Home Experience (`/`)
1. **Notice the Background Video**: High-definition voyage through Antarctica's Lemaire Channel, credited with its Creative Commons license.
2. **Scroll Down to Experience Scroll-to-Reveal**: Notice how each content block—the dynamic counts strip, the three action containers, and the climate significance pillars—smoothly animates into view.
3. **Launch the Guided Tour**: Click the **`?` (Orientation & Help)** button in the top navigation bar and select **"Start Guided Tour"**.

### Step 2: The Knowledge Archive (`/archive`)
1. **Search & Dynamic Filters**: Type keywords like `salinity`, `Bharati`, `microbial`, or `glacier`. Observe the dynamic item count update.
2. **Type Filters**: Toggle between *Publications*, *Datasets*, *Photos*, *Videos*, and *Activities*.
3. **Detail View**: Click any record card to open the slide-over inspector. Review the primary source link, DOI links, and one-line credit attributions. Use arrow keys (`←` / `→`) to step through records.

### Step 3: Expeditions (`/expeditions` & `/expeditions/:id`)
1. **Expedition Directory**: Review documented expeditions (e.g. 43rd, 42nd, 41st, 40th Indian Scientific Expeditions to Antarctica, and the Arctic Winter Expedition).
2. **Detail View**: View only sourced factual parameters from PIB releases. Sections with un-sourced data (timelines, arbitrary waypoint maps, estimated team counts) are omitted.

### Step 4: Content Studio (`/studio`)
1. **Pick an Archival Record**: Select any record from the visual selector.
2. **Switch Formats**: Toggle between **Social Media (X / LinkedIn / Instagram)**, **Website Blurb**, **Press Note**, and **Outreach Email**.
3. **Adjust Audience & Tone**: Outputs adapt phrasing while preserving factual accuracy without hallucinating quotes, numbers, or unverified claims. Every output includes `Source: <title> (<URL>)`.
4. **Export**: Click **"Copy to Clipboard"** or **"Download Text File"**.

### Step 5: Sources & Attributions (`/sources` & `/credits`)
1. Visit `/sources` to view the comprehensive list of public source records grouped by format.
2. Visit `/credits` to review the photographic and video licensing attributions under Creative Commons.

---

## 🏗️ Technical Architecture & Design Principles

```
polaris-portal/
├── public/
│   ├── videos/              # Video assets and poster fallback
│   └── _redirects           # Netlify SPA routing fallback
├── research/
│   ├── sources-ledger.json  # Single source of truth for all public records
│   └── verify.cjs           # Automated content validation test suite
├── src/
│   ├── components/          # Reusable UI primitives & modules
│   │   ├── ExpeditionMap.jsx    # Leaflet satellite mapping for sourced locations
│   │   ├── ItemCard.jsx         # Card component with visible source & credit
│   │   ├── ItemDetail.jsx       # Inspector slide-over with clickable DOIs & media
│   │   ├── SectionHeading.jsx   # Editorial typography with motion reveal
│   │   ├── Reveal.jsx           # Declarative scroll-to-reveal wrapper
│   │   ├── CoachMarkTour.jsx    # Guided multi-step interactive onboarding
│   │   └── HelpMenu.jsx         # Orientation modal with glossary & tour
│   ├── hooks/
│   │   └── useScrollReveal.js   # IntersectionObserver scroll-to-reveal engine
│   ├── context/
│   │   └── ExplainingContext.jsx # Orientation layer state & tour control
│   ├── data/
│   │   ├── items.json           # 25 sourced public records from ledger
│   │   ├── expeditions.json     # 5 sourced expedition records from ledger
│   │   └── glossary.json        # Cryosphere terminology definitions
│   ├── lib/
│   │   ├── archiveLogic.js      # Multi-dimensional filtering, searching & sorting
│   │   ├── generate.js          # Deterministic studio generator with source links
│   │   └── dataLoader.js        # Data loader and aggregator functions
│   ├── pages/
│   │   ├── Home.jsx             # Hero with dynamic video & scientific pillars
│   │   ├── Archive.jsx          # Knowledge archive with dynamic counts & slide-over
│   │   ├── ExpeditionsIndex.jsx # Sourced expedition catalog
│   │   ├── ExpeditionDetail.jsx # Sourced expedition parameters & primary source link
│   │   ├── ContentStudio.jsx    # Multi-format deterministic media generator
│   │   ├── About.jsx            # Project background, disclaimer & links
│   │   ├── Sources.jsx          # Public sources directory
│   │   └── Credits.jsx          # Image and video attributions
│   ├── index.css            # Tailwind directives, polar design tokens & reveal keyframes
│   └── App.jsx              # React Router DOM routing configuration
├── vercel.json              # Vercel SPA rewrites & security headers
├── netlify.toml             # Netlify SPA redirects & build config
└── package.json
```

### Architectural Guarantees:
1. **100% Client-Side Independence**: Zero server maintenance required, zero cold-starts, zero external database latency, and immune to API rate limits.
2. **Deterministic Fact Preservation**: Outreach summaries generated in the Content Studio extract directly from sourced parameters, avoiding unsupported claims.
3. **Accessibility (WCAG 2.1 AA)**: High-contrast color palette, standard serif/sans-serif pairing (`Fraunces` + `Inter`), explicit ARIA attributes, full keyboard navigability (`Tab`, `Enter`, `Escape`, `Arrow keys`), and strict respect for `prefers-reduced-motion`.

---

## 💻 Local Development & Build Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/Someone001/Polaris-SIH.git

# Enter the project directory
cd "SIH26063 Polar outreach portal (MoES)"

# Install dependencies
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Local Preview
```bash
# Build the production bundle into /dist
npm run build

# Preview the production build locally
npm run preview
```

### 4. Source Ledger Verification
```bash
# Verify all ledger records against live public sources
node research/verify.cjs
```

---

## 🚀 Deployment Guide

Polaris is ready for deployment on static hosting providers:

### Option A: Vercel Deployment
The repository includes a tested [`vercel.json`](./vercel.json):
```bash
npm install -g vercel
vercel
```
Or connect your GitHub repository in the Vercel dashboard:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Option B: Netlify Deployment
The repository includes [`netlify.toml`](./netlify.toml) with single-page application redirects:
1. Connect your repository to Netlify.
2. Set build command: `npm run build`
3. Set publish directory: `dist`

---

## 👥 Smart India Hackathon 2026 Team

- **Problem Statement**: SIH26063 (Ministry of Earth Sciences)
- **Repository**: [https://github.com/Someone001/Polaris-SIH](https://github.com/Someone001/Polaris-SIH)
