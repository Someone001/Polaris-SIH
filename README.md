# Polaris — India's Polar Science Knowledge & Outreach Portal

> **Smart India Hackathon 2026 — Problem Statement SIH26063**  
> **Issued by:** Ministry of Earth Sciences (MoES), Government of India  
> **Topic:** Integrated Polar Science Outreach, Knowledge Repository, and Media Portal  
> **Tagline:** *India’s polar science, all in one place.*

---

## 1. Project Overview

**Polaris** is a unified, accessible digital portal designed to bring India's polar research from Antarctica, the Arctic, and the Southern Ocean to students, researchers, journalists, and citizens worldwide without technical jargon.

The portal solves the challenge of fragmented polar scientific data by bringing together:
1. **Curated Knowledge Repository**: Unified archive of expedition reports, datasets, academic publications, field photographs, and station videos.
2. **Interactive Expedition Route Mapping**: Equirectangular SVG maps synchronized with chronological voyage logs.
3. **Automated Content Studio**: Offline deterministic generator creating website blurbs, social media posts (X, LinkedIn, Instagram), press notes, and outreach email snippets.
4. **Self-Explaining Orientation Layer**: Plain-English tooltips backed by a comprehensive glossary, interactive coach-mark tours, and an interactive Judge Walkthrough mode.

---

## 2. Technical Stack & Architectural Guarantees

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom polar design tokens (`polar`, `glacier`, `ice`, `aurora`)
- **Typography**: Inter (body typography $\ge$ 16px, line-height $\ge$ 1.6) & Fraunces (editorial serif headings)
- **Icons**: Lucide React
- **Static Guarantee**: 100% client-side, zero backend dependencies, zero API keys required, zero paid services. Builds cleanly to a static `dist/` directory.

---

## 3. Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (starts on http://localhost:5173/)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 4. Deployment Guide

### A. Deploy to Vercel

1. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
2. **Via Vercel Dashboard (Git)**:
   - Push your repository to GitHub / GitLab.
   - Import the project into Vercel.
   - Framework preset: **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - The included [`vercel.json`](./vercel.json) automatically handles single-page app (SPA) routing rewrites and immutable asset caching.

### B. Deploy to Netlify

1. **Via Netlify Dashboard (Git)**:
   - Link your GitHub repository.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - The included [`netlify.toml`](./netlify.toml) configures the SPA fallback redirect (`/* -> /index.html 200`) and security headers.
2. **Via Drag & Drop**:
   - Run `npm run build`.
   - Drag and drop the generated `dist/` folder into Netlify Drop.

---

## 5. Guide: Swapping Sample Data for Live MoES / NCPOR Data

All data in Polaris is decoupled and strictly typed in JSON format under `/src/data/`:

1. **Expedition Records**: [`src/data/expeditions.json`](./src/data/expeditions.json)
   - To add or update an expedition, append an object following the schema:
     ```json
     {
       "id": "exp-ant-44",
       "name": "44th Indian Scientific Expedition to Antarctica",
       "region": "Antarctic",
       "start": "2024-11-15",
       "end": "2025-03-30",
       "status": "completed",
       "locationName": "Maitri & Bharati Stations",
       "institution": "NCPOR / MoES",
       "leaderName": "Expedition Leader Name",
       "teamSize": 45,
       "summary": "Plain-English description...",
       "keyFindings": ["Finding 1", "Finding 2"],
       "stops": [
         { "id": "stop-1", "name": "Cape Town Staging", "lat": -33.92, "lon": 18.42, "date": "2024-11-15" }
       ],
       "events": [
         { "stopId": "stop-1", "date": "2024-11-15", "title": "Departure", "description": "..." }
       ]
     }
     ```
2. **Archive Items**: [`src/data/items.json`](./src/data/items.json)
   - Follows the 6 supported types: `Report`, `Dataset`, `Publication`, `Photo`, `Video`, `Activity`.
   - All records reference an `expeditionId` that links directly to the map and journey log.

---

## 6. Guide: Connecting Live LLMs to Content Studio

Currently, [`src/lib/generate.js`](./src/lib/generate.js) operates deterministically on the client with zero network requests and zero hallucinations.

If your team wishes to connect an LLM (such as OpenAI GPT-4o, Anthropic Claude 3.5, or Google Gemini):

1. **Add environment variables**:
   Create a `.env` file (do not commit to public repositories):
   ```env
   VITE_AI_PROVIDER="gemini" # or "openai", "anthropic"
   VITE_AI_API_KEY="your-api-key-here"
   ```
2. **Update [`src/lib/generate.js`](./src/lib/generate.js)**:
   Add an asynchronous generation method that passes the structured record fields as context in a system prompt:
   ```javascript
   export async function generateWithAI(record, options, apiKey) {
     const prompt = `You are a science communicator for India's Ministry of Earth Sciences.
     Using ONLY the following verified facts, draft an outreach summary:
     Title: ${record.title}
     Type: ${record.type}
     Date: ${record.date}
     Details: ${record.description}
     DO NOT fabricate numbers or facts not in this text.`;
     
     // Make fetch call to chosen API endpoint...
   }
   ```
3. Keep the deterministic templates in `generate.js` as an instant offline fallback!

---

## 7. License & Credits

Built for Smart India Hackathon 2026 (Problem Statement SIH26063).  
Data structures modeled on public records from the **Ministry of Earth Sciences (MoES)** and the **National Centre for Polar and Ocean Research (NCPOR)**.
