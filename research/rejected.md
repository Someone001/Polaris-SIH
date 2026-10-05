# Rejected Candidates & Data Provenance Failures

This document provides a complete, honest audit of all candidate items, individuals, and identifiers that were examined during the research phase but **rejected** because they could not be verified by a primary source URL, cross-checked API response, or official government gazette.

---

## 1. Fictional / Composite Personas (11 Rejected)

The previous demo iteration of Polaris contained 11 named individuals as expedition leaders, primary authors, and photographers. None of these personas were supported by an official roster, gazette notification, or published paper from NCPOR/MoES:

| Rejected Name | Attributed Role in Demo | Reason for Rejection |
| :--- | :--- | :--- |
| **Dr. Kavita Nambiar** | Leader, 43rd ISEA (`exp-ant-43`) | **Fictional persona.** Sourced from memory. Official PIB and NCPOR announcements for the 43rd ISEA do not list this individual as expedition leader. |
| **Dr. Rajeshwar Sen** | Leader, 42nd ISEA (`exp-ant-42`) | **Fictional persona.** Sourced from memory. No MoES/NCPOR record validates this attribution. |
| **Dr. Suniti Verma** | Leader, 44th ISEA (`exp-ant-44`) | **Fictional persona.** Sourced from memory. |
| **Dr. Tashi Dorjee** | Leader, Arctic Winter 2024 (`exp-arc-16`) | **Fictional persona.** Sourced from memory. The maiden Arctic winter mission was flagged off by Union Minister Shri Kiren Rijiju; the contingent roster was composed of institutional scientists from NCPOR, IIT Mandi, IIA, and RRI, none of whom match this name. |
| **Dr. Ananya Bhowmick** | Leader, Arctic Summer 2025 (`exp-arc-17`) | **Fictional persona.** Speculative future campaign leadership with no official announcement. |
| **Dr. Manojit Kulkarni** | Leader, Arctic Summer 2023 (`exp-arc-15`) | **Fictional persona.** Sourced from memory. |
| **Dr. Vikramaditya Joshi**| Leader, 12th Southern Ocean (`exp-so-12`) | **Fictional persona.** Sourced from memory. |
| **Dr. Deepali Chitnis** | Leader, 13th Southern Ocean (`exp-so-13`) | **Fictional persona.** Sourced from memory. |
| **Dr. K. Sharma** | Primary Author, Polar Biology (`item-003`) | **Synthetic author.** Invented name attached to a modeled DOI. |
| **Dr. A. Sengupta** | Avian Ecologist / Photographer (`item-004`) | **Synthetic photographer.** Invented credit attached to a Wikimedia Commons Adélie penguin photo. |
| **Dr. P. Nair** | Primary Author, Biogeochemistry (`item-025`) | **Synthetic author.** Invented name attached to an Elsevier DOI. |

*Action Taken:* Completely omitted from `sources-ledger.json`. Any person named in the ledger (e.g., Shri Kiren Rijiju, Dr. Prakash Chauhan, Prof. Shekhar C. Mande, Col. Pavan Nair, Dr. Manish Tiwari, Dr. Rohit Thapliyal) is directly corroborated by a fetched PIB release or CrossRef/Zenodo API record.

---

## 2. Fabricated & Mismatched DOIs (11 Rejected)

All 11 DOIs present in the original `items.json` and `Sources.jsx` were tested against the live CrossRef REST API (`https://api.crossref.org/works/<doi>`). None of them matched the displayed paper titles or authors:

| Candidate DOI | Displayed Title in Demo | CrossRef API Ground Truth | Rejection Reason |
| :--- | :--- | :--- | :--- |
| `10.1017/S095410202300015X` | How Summer Melt Pools Feed Tiny Polar Plants | **HTTP 404 Not Found** | Fabricated Cambridge University Press pattern. |
| `10.1029/2022JD037810` | Keeping the Body Clock Healthy in Total Polar Darkness | **HTTP 404 Not Found** | Fabricated AGU pattern. |
| `10.1007/s00300-023-03140-5` | Atlantic Water Heat Spilling into Arctic Fjords | **HTTP 404 Not Found** | Fabricated Springer pattern. |
| `10.1016/j.atmosenv.2023.119940` | Nutrient Pulses in Arctic Melt Streams | Resolves to: *Global atmospheric deposition of phosphorus* by Blake & Templer | **Severe Mismatch.** Real DOI for an unrelated paper hijacked to look authentic. |
| `10.1016/j.polar.2023.100912` | Cold-Adapted Soil Fungi on Svalbard | **HTTP 404 Not Found** | Fabricated Elsevier Polar Science pattern. |
| `10.1016/j.dsr2.2022.105180` | Storm Waves and Ocean Carbon Absorption | Resolves to: *Chukchi Sea gadid fish lipid storage* by Copeman et al. | **Severe Mismatch.** Real DOI for an unrelated Arctic fish paper. |
| `10.1029/2021JC017990` | Mapping Cold Water Currents Circling Antarctica | **HTTP 404 Not Found** | Fabricated AGU pattern. |
| `10.1016/j.polar.2023.100980` | Decadal Variation in Kongsfjorden Hydrography | Resolves to: *Larsemann Hills crustal imaging* by Rao et al. | **Severe Mismatch.** Real DOI for an unrelated geophysics paper. |
| `10.5194/bg-20-4101-2023` | Southern Ocean Biogeochemical Cycling | **HTTP 404 Not Found** | Fabricated Copernicus pattern. |
| `10.1029/2023GL104500` | Sub-ice Shelf Heat Fluxes and Grounding Line Stability | **HTTP 404 Not Found** | Fabricated AGU GRL pattern. |
| `10.1007/s12040-023-02115-4` | Geochemical Analysis of Schirmacher Oasis Paleolakes | **HTTP 404 Not Found** | Fabricated Springer/IAS pattern. |

*Action Taken:* All 11 rejected and replaced in `sources-ledger.json` with 7 real, peer-reviewed scientific papers that were queried and verified via CrossRef, matching exact titles, authors, and active DOI endpoints.

---

## 3. Synthetic Dataset Tables (8 Rejected)

All 8 dataset items in `items.json` (`item-002`, `item-007`, `item-012`, `item-017`, `item-022`, `item-027`, `item-032`, `item-037`) contained identical 5-row mock metadata specifications:
- `Sampling Interval: 10-minute automated mean`
- `Sensor Calibration Standard: WMO-No. 8 Annex 1B`
- `Data Quality Flag: Level-2 Quality Controlled`
- `Coordinate System: WGS 84`
- `Archival Storage Format: NetCDF-4 / CF-1.8 Compliant & CSV`

**Reason for Rejection:**  
These were boilerplate strings generated from memory rather than empirical time-series data or real open-access repository uploads.

*Action Taken:* Rejected in their entirety. Replaced with 4 verified open-access research datasets deposited on **Zenodo** by Indian and international researchers (`10.5281/zenodo.7773021`, `10.5281/zenodo.14635385`, `10.5281/zenodo.13149317`, `10.5281/zenodo.3540448`).

---

## 4. Third-Party / Personal YouTube Video Candidates (2 Rejected)

| Video URL | Channel Name | Rejection Reason |
| :--- | :--- | :--- |
| `https://www.youtube.com/watch?v=sr7u49jLuKI` | IndiaTV News English (`@IndiaTVNewsEnglish`) | **Not an official government channel.** Produced by commercial news media, not MoES, NCPOR, or DD. |
| `https://www.youtube.com/watch?v=iGVZvuCNZuc` | Priyankar Datta (`@priyankardatta4154`) | **Personal creator account.** Independent travel/expedition upload, not an official ministry broadcast release. |

*Action Taken:* Both rejected. Replaced with verified official uploads from **MoES GoI** (`@MoESGOI`), **DD India** (`@DDIndia`), and **NCPOR Goa Vasco** (`@NCPORGoaVasco`).

---

## 5. Network Access / Unreachable Host Candidate

- **`ncpor.res.in` Direct Scraping:**  
  Attempts to fetch raw HTML pages from `https://ncpor.res.in/` timed out (`connect ETIMEDOUT 14.139.119.7:443`) on the sandbox network interface. In accordance with the hard rules ("If the network fails for a source, say so and skip that record. Do not substitute memory"), direct reliance on `ncpor.res.in` host scraping was discarded in favor of:
  1. Official Government of India Press Information Bureau (PIB) archival releases (`pib.gov.in`).
  2. Public API endpoints (CrossRef, Zenodo, Wikimedia Commons, YouTube oEmbed).
