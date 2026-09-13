export interface ResumeTemplate {
  id: string;
  name: string;
  vibe: string;
  description: string;
  bestFor: string;
  accent: string; // tailwind gradient classes
  atsSafe: boolean;
  columns: 1 | 2;
  tags: string[];
  preview: PreviewSpec;
}

// A tiny declarative spec used by the on-screen template thumbnail renderer.
export interface PreviewSpec {
  headerStyle: 'bar' | 'centered' | 'sidebar' | 'minimal';
  sidebar: boolean;
  accentBar: boolean;
}

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    vibe: 'Modern & bold',
    description: 'A confident single-column layout with a gradient header bar. Reads beautifully and parses cleanly.',
    bestFor: 'Software & product roles',
    accent: 'from-magic-pink to-magic-violet',
    atsSafe: true,
    columns: 1,
    tags: ['ATS-safe', 'Gradient', 'One-page'],
    preview: { headerStyle: 'bar', sidebar: false, accentBar: true },
  },
  {
    id: 'nebula',
    name: 'Nebula',
    vibe: 'Two-column focus',
    description: 'Skills and contact live in a tidy sidebar while your story leads center stage.',
    bestFor: 'Engineers & designers',
    accent: 'from-magic-indigo to-magic-cyan',
    atsSafe: true,
    columns: 2,
    tags: ['Sidebar', 'Skills-forward'],
    preview: { headerStyle: 'sidebar', sidebar: true, accentBar: false },
  },
  {
    id: 'monarch',
    name: 'Monarch',
    vibe: 'Executive & elegant',
    description: 'Centered serif-style header with generous whitespace — quietly senior.',
    bestFor: 'Leadership & management',
    accent: 'from-magic-gold to-magic-pink',
    atsSafe: true,
    columns: 1,
    tags: ['Executive', 'Elegant', 'Whitespace'],
    preview: { headerStyle: 'centered', sidebar: false, accentBar: false },
  },
  {
    id: 'quartz',
    name: 'Quartz',
    vibe: 'Clean minimal',
    description: 'Pure typography, zero distractions. The most ATS-friendly layout we offer.',
    bestFor: 'Any role, max compatibility',
    accent: 'from-slate-300 to-slate-500',
    atsSafe: true,
    columns: 1,
    tags: ['Minimal', 'ATS-safe', 'Timeless'],
    preview: { headerStyle: 'minimal', sidebar: false, accentBar: false },
  },
  {
    id: 'prism',
    name: 'Prism',
    vibe: 'Creative sidebar',
    description: 'A colourful left rail for creatives who still need to pass the robots.',
    bestFor: 'Design & marketing',
    accent: 'from-magic-violet to-magic-cyan',
    atsSafe: false,
    columns: 2,
    tags: ['Creative', 'Sidebar', 'Colorful'],
    preview: { headerStyle: 'sidebar', sidebar: true, accentBar: true },
  },
  {
    id: 'comet',
    name: 'Comet',
    vibe: 'Startup energy',
    description: 'Punchy accent bar and compact sections built to fit a lot on one page.',
    bestFor: 'Startups & generalists',
    accent: 'from-magic-cyan to-magic-indigo',
    atsSafe: true,
    columns: 1,
    tags: ['Compact', 'One-page', 'Accent'],
    preview: { headerStyle: 'bar', sidebar: false, accentBar: true },
  },
];

export const SAMPLE_RESUME = `Jordan Rivera
San Francisco, CA · jordan.rivera@email.com · (415) 555-0192
linkedin.com/in/jordanrivera · github.com/jrivera

SUMMARY
Full-stack engineer with 6 years building consumer web products at scale. I turn
ambiguous ideas into fast, measurable features and love mentoring teammates.

EXPERIENCE
Senior Software Engineer — Nimbus Labs (2021–Present)
• Led migration to a React + TypeScript design system, cutting UI bugs 38%.
• Architected a Node.js + PostgreSQL service handling 4M requests/day.
• Reduced page load time from 3.1s to 0.9s by optimizing the Vite build and adding Redis caching.
• Mentored 4 engineers; 2 were promoted within a year.

Software Engineer — Brightwave (2018–2021)
• Built the customer analytics dashboard in React and GraphQL, adopted by 12k users.
• Improved checkout conversion 22% through A/B testing and performance work.
• Automated CI/CD with GitHub Actions, cutting deploy time 60%.

SKILLS
JavaScript, TypeScript, React, Node.js, GraphQL, PostgreSQL, Redis, Docker,
AWS, CI/CD, Jest, Tailwind

EDUCATION
B.Sc. Computer Science — UC Berkeley (2018)

PROJECTS
• Open-sourced "swiftgrid", a React data-grid with 1.8k GitHub stars.`;
