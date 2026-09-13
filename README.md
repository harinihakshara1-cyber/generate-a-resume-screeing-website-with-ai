# 🦄 Lumina — AI Resume Screening

A cinematic, fully client-side resume screening web app. Score your resume
against any job in seconds, get tailored advice from an AI co-pilot, and start
from recruiter-approved templates — all wrapped in a little bit of magic
(including a real-time 3D unicorn).

**Vite · React · TypeScript · Tailwind CSS · react-three-fiber**

## Features

- **AI Screener** — Paste or upload a resume (PDF/TXT, parsed in-browser),
  pick a target role or drop in a job description, and get an ATS-style score
  with a full breakdown: keyword match, impact/metrics, structure, clarity and
  contact completeness — plus specific, prioritized recommendations.
- **Nova, the AI assistant** — A context-aware resume coach that reads your
  latest scan and answers questions about keywords, metrics, wording, structure
  and beating the ATS.
- **Templates** — Six recruiter-approved layouts with live previews and a
  one-click download to a clean, printable HTML resume.
- **Cinematic 3D unicorn** — A procedural unicorn built with react-three-fiber:
  glowing spiral horn, flowing rainbow mane, sparkles, and bloom post-processing.

Everything runs 100% in the browser. No accounts, no servers, nothing uploaded.

## Develop

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
npm run build:preview  # emit a single self-contained dist-preview/index.html
```

## Notes

- Resume parsing (including the pdf.js worker) runs entirely client-side; no
  data ever leaves the device.
- No environment variables or API keys are required.
