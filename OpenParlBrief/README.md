# OpenParlBrief v0.1

An open-source tool for monitoring Canadian parliamentary committee activity. Pulls live data from [openparliament.ca](https://openparliament.ca) and displays it in a clean, browsable interface.

**Live:** https://commons-tracker.netlify.app

## What it does (v0.1)

- Browse recent House of Commons committee meetings
- Filter by committee (30+ committees)
- View meeting details: date, session, meeting number
- Links to official minutes, notices, and webcasts on ourcommons.ca
- Read full evidence and speeches for meetings where transcripts are available
- Pagination for meetings and speeches
- Responsive design (mobile-friendly)

## Architecture

```
Static HTML/CSS/JS  →  Netlify Functions (API proxy)  →  openparliament.ca API
```

No frameworks, no build step. Netlify Functions proxy the openparliament.ca API to avoid CORS issues and add caching.

### File structure

```
OpenParlBrief/
├── index.html                     # Landing page + meetings list
├── meeting.html                   # Meeting detail + speeches/evidence
├── assets/
│   ├── css/style.css              # House of Commons green palette, Inter font
│   └── js/app.js                  # Vanilla JS — fetch, render, filter, paginate
├── netlify/
│   └── functions/
│       ├── committees.js          # GET /api/committees
│       ├── meetings.js            # GET /api/meetings?committee=X&limit=N&offset=N
│       ├── meeting-detail.js      # GET /api/meeting-detail?path=...
│       └── speeches.js            # GET /api/speeches?document=...&limit=N&offset=N
├── netlify.toml                   # Publish dir, functions, redirects
└── package.json
```

### API endpoints

| Route | Description |
|-------|-------------|
| `/api/committees` | List all committees (cached 24h) |
| `/api/meetings` | List meetings, filterable by `committee` slug (cached 5min) |
| `/api/meeting-detail` | Single meeting details by `path` (cached 1h) |
| `/api/speeches` | Speeches/evidence for a meeting by `document` path (cached 1h) |

## Local development

Requires [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
cd OpenParlBrief
netlify dev
```

Opens at `http://localhost:8888`.

## Deployment

Deployed via Netlify CLI to the `commons-tracker` site:

```bash
netlify deploy --prod --dir=. --site=5425a845-e37d-4830-a7ab-8fd10ea4c578
```

## Roadmap

- [ ] **v0.2** — Supabase integration: store meetings + speeches in PostgreSQL for faster queries and search
- [ ] **v0.3** — Scheduled ingestion: cron job to automatically pull new meetings
- [ ] **v0.4** — AI summaries: generate non-partisan summaries of committee evidence using an LLM
- [ ] **v0.5** — Notifications: RSS feeds and/or email alerts by committee
- [ ] **v1.0** — Social distribution: automated Twitter/X threads with key highlights

## Data source

All parliamentary data is sourced from [openparliament.ca](https://openparliament.ca), which aggregates data from the [House of Commons open data portal](https://www.ourcommons.ca/en/open-data).

## Background

Inspired by [Murad Hemmadi's reporting in The Logic](https://thelogic.co/news/parliament-ai-cohere/) about the federal government's internal ParlBrief AI tool developed by ISED. OpenParlBrief aims to make similar capabilities publicly accessible.

## License

MIT
