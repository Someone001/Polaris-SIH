# ❄️ POLARIS — National Polar Outreach & Knowledge Portal

> **Smart India Hackathon 2026** — Problem Statement: **SIH26063**  
> **Apex Ministry:** Ministry of Earth Sciences (MoES), Government of India  
> **Partner Institution:** National Centre for Polar and Ocean Research (NCPOR), Goa  
> **Theme:** Citizen Science Outreach, Cryospheric Knowledge Repository & Automated Media Studio  
> **Tagline:** *Everything India has learned at the poles, in one place.*

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%201.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Someone001%2FPolaris--SIH-181717?logo=github)](https://github.com/Someone001/Polaris-SIH)

---

## 🧭 Executive Summary for Evaluators & Judges

**Polaris** is an integrated, production-grade web portal built specifically to address **Problem Statement SIH26063**. For over four decades, Indian scientists have mounted annual expeditions across Antarctica, the Arctic, the Southern Ocean, and the Himalayan 'Third Pole'. However, these vital discoveries have historically remained siloed in technical annual gazettes, physical monographs, and dense research databases.

Polaris breaks down institutional silos by creating an **open-access, self-explaining, and media-rich portal** that turns complex high-latitude cryosphere science into accessible, captivating knowledge for students, researchers, journalists, and everyday citizens.

---

## 🏆 Key Features & Innovation Highlights

| Feature | Description | Technical Implementation |
|---|---|---|
| 🌊 **Vibrant Hero Navigation Video** | Real 4K navigation footage through Antarctica's **Lemaire Channel ("Kodak Alley")** capturing vivid sapphire waters, cyan ice shelves, and alpine peaks. | Dual WebM/MP4 with `faststart` progressive streaming under 2MB, with instant photographic poster fallback. |
| ✨ **Full-Site Scroll-to-Reveal** | Smooth GPU-accelerated motion reveals all sections, cards, and data facets dynamically as the user scrolls. | Custom `useScrollReveal` hook powered by `IntersectionObserver` with automatic disconnect to ensure zero runtime overhead. |
| 🗺️ **Realistic Orbital Satellite Maps** | Interactive GIS maps depicting exact deployment paths, polar coordinates, and stations using authentic satellite imagery. | Leaflet 1.9 with **Esri World Imagery** and **Esri Nautical Bathymetry** tiles, synchronized waypoint timelines, and polar popups. |
| 📚 **Curated Knowledge Archive** | 40+ authentic records spanning Reports, Datasets, Publications, Photos, Videos, and Educational Activities. | Zero-latency instant multi-faceted filtering (search, region, expedition, type, year, and sorting) with clean URL synchronization. |
| ✍️ **Zero-Hallucination Content Studio** | Deterministic outreach studio converting dense expedition records into social posts (X, LinkedIn, Instagram), website blurbs, and press notes. | Client-side rules engine adhering to strict platform character limits and zero-waste fact preservation. |
| 🛡️ **Authentic Government Provenance** | Dedicated verification page (`/sources`) citing official datasets, peer-reviewed DOIs, and statutory frameworks (Indian Antarctic Act 2022). | Comprehensive metadata cross-linking NCPOR, MoES, IMD, GSI, NIO, IIG, and ISRO-NRSC. |
| 💡 **Interactive Judge & Citizen Orientation** | Multi-step interactive Coach-Mark tour, Judge Walkthrough mode, and polar jargon tooltip glossary. | Custom `ExplainingContext` with state persistence, keyboard accessibility, and WCAG AA contrast compliance. |

---

## 🎯 5-Minute Evaluation Walkthrough Guide for Judges

To experience the full capabilities of Polaris during evaluation, we recommend following this guided sequence:

### Step 1: The Home Experience (`/`)
1. **Notice the Colorful Background Video**: Observe the authentic 4K voyage through Antarctica's Lemaire Channel featuring glowing cyan icebergs and deep blue waters (not black and white).
2. **Scroll Down to Experience Scroll-to-Reveal**: Notice how each content block—the live counts strip, the three asymmetrical action containers, and the three national climate significance pillars—smoothly animates into view.
3. **Launch the Judge Walkthrough**: Click the **`?` (Orientation & Help)** button in the top navigation bar and select **"Start Guided Tour"** or **"Judge Walkthrough"**.

### Step 2: The Multi-Faceted Knowledge Archive (`/archive`)
1. **Instant Search & Facet Counters**: Type `Bharati`, `ozone`, `salinity`, or `microbe` in the search bar. Observe the live filter count update instantly.
2. **Tag & Type Filters**: Toggle between *Datasets*, *Reports*, *Photographs*, and *Videos*.
3. **Interactive Slide-Over Inspector**: Click any record card to open the slide-over inspector. Review the authentic government citation, calibrated parameters, and related expedition details. Use your keyboard arrow keys (`←` / `→`) to step through records.

### Step 3: Interactive Geographic Expeditions (`/expeditions` & `/expeditions/:id`)
1. **Interactive Research Station Network**: On the Expeditions Index, toggle **"Show Station Map"** to explore India's permanent installations: **Bharati** (Antarctica), **Maitri** (Antarctica), **Himadri** (Svalbard Arctic), and **Himansh** (Himalayas).
2. **Synchronized Route & Timeline**: Open an individual expedition (e.g., *43rd Indian Scientific Expedition to Antarctica*). Click on numbered waypoints on the satellite map to watch the chronological log synchronize automatically to that campsite or ice shelf mooring!

### Step 4: Zero-Hallucination Content Studio (`/studio`)
1. **Pick an Expedition Record**: Select any archival record from the visual picker.
2. **Switch Formats**: Toggle between **Social Media (X / LinkedIn / Instagram)**, **Website Blurb**, **Press Release Note**, and **Outreach Email**.
3. **Customize Tone & Audience**: Change the tone (Academic, Conversational, Journalistic) and target audience (School Students, Policy Makers, General Public). Notice how the text transforms deterministically while preserving 100% scientific factual accuracy with zero hallucination.
4. **Export**: Click **"Copy to Clipboard"** or **"Download Text File"**.

### Step 5: Provenance & Legal Governance (`/sources` & `/about`)
1. Visit `/sources` to verify that every dataset, station coordinate, and telemetry log traces directly to verified Government of India repositories (NCPOR, MoES, IMD, GSI, NIO, IIG, ISRO).
2. Review the statutory briefing on **The Indian Antarctic Act, 2022** and the environmental protection mandates under the Antarctic Treaty system.

---

## 🏗️ Technical Architecture & Design Principles

```
polaris-portal/
├── public/
│   ├── videos/              # Optimized MP4, WebM & Poster frames of Antarctic navigation
│   └── _redirects           # Netlify SPA routing fallback
├── src/
│   ├── components/          # Reusable UI primitives & modules
│   │   ├── ExpeditionMap.jsx    # Leaflet realistic orbital satellite mapping
│   │   ├── PolarOverviewMap.jsx # Interactive station network map
│   │   ├── ItemCard.jsx         # Card component with scroll-reveal integration
│   │   ├── SectionHeading.jsx   # Editorial typography with motion reveal
│   │   ├── Reveal.jsx           # Declarative scroll-to-reveal wrapper
│   │   ├── CoachMarkTour.jsx    # Guided multi-step interactive onboarding
│   │   └── HelpMenu.jsx         # Orientation modal with glossary & walkthrough
│   ├── hooks/
│   │   └── useScrollReveal.js   # IntersectionObserver scroll-to-reveal engine
│   ├── context/
│   │   └── ExplainingContext.jsx # Orientation layer state & tour control
│   ├── data/
│   │   ├── items.json           # 40 authentic scientific records with full metadata
│   │   └── expeditions.json     # Chronological expedition records, stops & events
│   ├── lib/
│   │   ├── archiveLogic.js      # Multi-dimensional filtering, searching & sorting
│   │   ├── generate.js          # Deterministic zero-hallucination studio templates
│   │   └── dataLoader.js        # Strongly typed data access layer
│   ├── pages/
│   │   ├── Home.jsx             # Hero with dynamic video & scientific pillars
│   │   ├── Archive.jsx          # Knowledge archive with facet filters & slide-over
│   │   ├── ExpeditionsIndex.jsx # Station map & expedition catalog
│   │   ├── ExpeditionDetail.jsx # Synchronized satellite map & chronological logs
│   │   ├── ContentStudio.jsx    # Multi-format deterministic media generator
│   │   ├── About.jsx            # Institutional mandate & station dossiers
│   │   └── Sources.jsx          # Government sources, DOIs & legal acts
│   ├── index.css            # Tailwind directives, polar design tokens & reveal keyframes
│   └── App.jsx              # React Router DOM routing configuration
├── vercel.json              # Vercel SPA rewrites & security headers
├── netlify.toml             # Netlify SPA redirects & build config
└── package.json
```

### Architectural Guarantees:
1. **100% Client-Side Independence**: Zero server maintenance required, zero cold-starts, zero external database latency, and immune to API rate limits.
2. **Deterministic Fact Preservation**: Outreach summaries generated in the Content Studio extract directly from validated field parameters, preventing AI hallucination.
3. **Accessibility First (WCAG 2.1 AA)**: High-contrast color palette, standard serif/sans-serif pairing (`Fraunces` + `Inter`), explicit ARIA attributes, full keyboard navigability (`Tab`, `Enter`, `Escape`, `Arrow keys`), and strict respect for `prefers-reduced-motion`.

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

### 4. Run Automated Verification Test Suite
```bash
node testFullAudit.cjs
```
*Validates static build artifacts, deployment configs (Vercel/Netlify), 1,440 Content Studio permutations, accessibility standards, and all HTTP route statuses.*

---

## 🚀 One-Click Deployment Guide

Polaris is production-ready for deployment on any modern static hosting provider:

### Option A: Vercel Deployment
The repository includes a production-tested [`vercel.json`](./vercel.json):
```bash
npm install -g vercel
vercel
```
Or connect your GitHub repository directly in the Vercel dashboard:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Option B: Netlify Deployment
The repository includes [`netlify.toml`](./netlify.toml) with pre-configured single-page application rewrites:
1. Connect your repository to Netlify.
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Or drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop).

---

## 📜 Statutory Foundations & Scientific Citations

All records and geographic assets in Polaris are anchored in verified public repositories:
- **Ministry of Earth Sciences (MoES)**: [moes.gov.in](https://moes.gov.in/)
- **National Centre for Polar and Ocean Research (NCPOR)**: [ncpor.res.in](https://ncpor.res.in/)
- **India Meteorological Department (IMD)**: [mausam.imd.gov.in](https://mausam.imd.gov.in/)
- **Geological Survey of India (GSI)**: [gsi.gov.in](https://www.gsi.gov.in/)
- **CSIR - National Institute of Oceanography (NIO)**: [nio.res.in](https://www.nio.res.in/)
- **The Indian Antarctic Act, 2022**: Act No. 13 of 2022, Ministry of Law and Justice, Government of India.
- **The Antarctic Treaty System (ATS)**: Secretariat of the Antarctic Treaty, Buenos Aires ([ats.aq](https://www.ats.aq/)).

---

## 👥 Smart India Hackathon 2026 Team

- **Problem Statement**: SIH26063 (Ministry of Earth Sciences)
- **Repository**: [https://github.com/Someone001/Polaris-SIH](https://github.com/Someone001/Polaris-SIH)
- **Status**: Complete, Verified & Deployment-Ready 🚀
