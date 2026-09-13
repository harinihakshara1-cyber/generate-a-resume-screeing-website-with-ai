export interface ResumeData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  links: string[];
  summary: string;
  experience: { role: string; company: string; period: string; bullets: string[] }[];
  skills: string[];
  education: { degree: string; school: string; year: string }[];
}

export const SAMPLE_DATA: ResumeData = {
  name: 'Jordan Rivera',
  title: 'Senior Full-Stack Engineer',
  location: 'San Francisco, CA',
  email: 'jordan.rivera@email.com',
  phone: '(415) 555-0192',
  links: ['linkedin.com/in/jordanrivera', 'github.com/jrivera'],
  summary:
    'Full-stack engineer with 6 years building consumer web products at scale. I turn ambiguous ideas into fast, measurable features and love mentoring teammates.',
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Nimbus Labs',
      period: '2021 — Present',
      bullets: [
        'Led migration to a React + TypeScript design system, cutting UI bugs 38%.',
        'Architected a Node.js + PostgreSQL service handling 4M requests/day.',
        'Reduced page load from 3.1s to 0.9s via build optimization and Redis caching.',
        'Mentored 4 engineers; 2 were promoted within a year.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Brightwave',
      period: '2018 — 2021',
      bullets: [
        'Built the customer analytics dashboard in React + GraphQL, adopted by 12k users.',
        'Improved checkout conversion 22% through A/B testing and performance work.',
        'Automated CI/CD with GitHub Actions, cutting deploy time 60%.',
      ],
    },
  ],
  skills: [
    'TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Redis',
    'Docker', 'AWS', 'CI/CD', 'Jest', 'Tailwind',
  ],
  education: [{ degree: 'B.Sc. Computer Science', school: 'UC Berkeley', year: '2018' }],
};

const ACCENTS: Record<string, string> = {
  aurora: '#a855f7',
  nebula: '#22d3ee',
  monarch: '#c98a3a',
  quartz: '#475569',
  prism: '#7c3aed',
  comet: '#0ea5e9',
};

// Produce a standalone, printable HTML resume in the chosen template style.
export function buildResumeHtml(templateId: string, d: ResumeData): string {
  const accent = ACCENTS[templateId] ?? '#a855f7';
  const twoCol = templateId === 'nebula' || templateId === 'prism';
  const centered = templateId === 'monarch';
  const bar = templateId === 'aurora' || templateId === 'comet';

  const skills = d.skills.map((s) => `<span class="chip">${s}</span>`).join('');
  const exp = d.experience
    .map(
      (e) => `
      <div class="job">
        <div class="job-head">
          <strong>${e.role}</strong> · ${e.company}
          <span class="period">${e.period}</span>
        </div>
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>`,
    )
    .join('');
  const edu = d.education
    .map((e) => `<div class="edu"><strong>${e.degree}</strong><br/>${e.school} · ${e.year}</div>`)
    .join('');

  const header = centered
    ? `<header class="centered">
         <h1>${d.name}</h1>
         <div class="title">${d.title}</div>
         <div class="contact">${d.location} · ${d.email} · ${d.phone} · ${d.links.join(' · ')}</div>
       </header>`
    : `<header class="${bar ? 'bar' : ''}">
         <div><h1>${d.name}</h1><div class="title">${d.title}</div></div>
         <div class="contact">${d.location}<br/>${d.email}<br/>${d.phone}<br/>${d.links.join('<br/>')}</div>
       </header>`;

  const main = twoCol
    ? `<div class="cols">
         <aside>
           <section><h2>Skills</h2><div class="chips">${skills}</div></section>
           <section><h2>Education</h2>${edu}</section>
           <section><h2>Contact</h2><div class="small">${d.email}<br/>${d.phone}<br/>${d.links.join('<br/>')}</div></section>
         </aside>
         <div class="body">
           <section><h2>Summary</h2><p>${d.summary}</p></section>
           <section><h2>Experience</h2>${exp}</section>
         </div>
       </div>`
    : `<section><h2>Summary</h2><p>${d.summary}</p></section>
       <section><h2>Experience</h2>${exp}</section>
       <section><h2>Skills</h2><div class="chips">${skills}</div></section>
       <section><h2>Education</h2>${edu}</section>`;

  return `<!doctype html><html><head><meta charset="utf-8"/>
  <title>${d.name} — Resume</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1c2333; margin: 0; background: #f3f4f8; }
    .page { max-width: 820px; margin: 24px auto; background: #fff; padding: 46px 52px; box-shadow: 0 10px 40px rgba(0,0,0,.12); }
    header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 18px; margin-bottom: 22px; border-bottom: 3px solid ${accent}; }
    header.bar { background: ${accent}; color: #fff; margin: -46px -52px 24px; padding: 32px 52px; border: 0; border-radius: 0; }
    header.bar .contact { color: rgba(255,255,255,.9); }
    header.centered { display: block; text-align: center; border-bottom: 1px solid #e5e7eb; }
    h1 { margin: 0; font-size: 30px; letter-spacing: -.5px; }
    .title { color: ${accent}; font-weight: 600; margin-top: 4px; }
    header.bar .title { color: #fff; }
    .contact { font-size: 12.5px; color: #55607a; line-height: 1.6; text-align: right; }
    header.centered .contact { text-align: center; margin-top: 8px; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: ${accent}; border-bottom: 1px solid #eceef4; padding-bottom: 5px; margin: 22px 0 10px; }
    p { line-height: 1.55; font-size: 14px; margin: 0 0 8px; }
    .job { margin-bottom: 14px; }
    .job-head { font-size: 14px; }
    .period { float: right; color: #7b8499; font-size: 12.5px; font-weight: 500; }
    ul { margin: 6px 0 0; padding-left: 18px; }
    li { font-size: 13.5px; line-height: 1.5; margin-bottom: 3px; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { background: ${accent}1a; color: ${accent}; border: 1px solid ${accent}44; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
    .cols { display: flex; gap: 28px; }
    aside { width: 210px; flex-shrink: 0; }
    .body { flex: 1; }
    .edu { font-size: 13px; line-height: 1.5; margin-bottom: 8px; }
    .small { font-size: 12.5px; color: #55607a; line-height: 1.7; }
    @media print { body { background: #fff; } .page { box-shadow: none; margin: 0; } }
  </style></head>
  <body><div class="page">${header}${main}</div></body></html>`;
}
