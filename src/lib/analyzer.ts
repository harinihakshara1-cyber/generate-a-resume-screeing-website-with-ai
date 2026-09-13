// ---------------------------------------------------------------------------
// Lumina resume analysis engine.
// A fully client-side "AI" screening model: it scores a resume against a role
// / job description the way an ATS + a human recruiter would, and produces
// structured, explainable feedback. No network, no keys required.
// ---------------------------------------------------------------------------

export type Severity = 'good' | 'warn' | 'bad';

export interface Insight {
  id: string;
  label: string;
  detail: string;
  severity: Severity;
}

export interface SubScore {
  key: string;
  label: string;
  score: number; // 0-100
  weight: number; // relative weight
  summary: string;
}

export interface AnalysisResult {
  overall: number; // 0-100
  verdict: string;
  tone: Severity;
  subScores: SubScore[];
  matched: string[];
  missing: string[];
  detectedSkills: string[];
  sections: { name: string; present: boolean }[];
  insights: Insight[];
  stats: {
    words: number;
    bullets: number;
    actionVerbs: number;
    quantified: number;
    readingEase: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinks: boolean;
    longestSentence: number;
  };
  role: string;
}

// --- Knowledge base -------------------------------------------------------

export interface RolePreset {
  id: string;
  title: string;
  emoji: string;
  keywords: string[];
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    emoji: '🎨',
    keywords: [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'html', 'css',
      'tailwind', 'redux', 'next.js', 'webpack', 'vite', 'accessibility',
      'responsive', 'jest', 'cypress', 'graphql', 'rest', 'ui', 'ux',
      'performance', 'figma', 'sass', 'storybook',
    ],
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    emoji: '🛠️',
    keywords: [
      'node', 'python', 'java', 'go', 'ruby', 'sql', 'postgresql', 'mysql',
      'mongodb', 'redis', 'kafka', 'microservices', 'api', 'rest', 'graphql',
      'docker', 'kubernetes', 'aws', 'ci/cd', 'testing', 'scalability',
      'authentication', 'caching', 'grpc',
    ],
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Engineer',
    emoji: '⚡',
    keywords: [
      'javascript', 'typescript', 'react', 'node', 'python', 'sql', 'api',
      'rest', 'graphql', 'docker', 'aws', 'ci/cd', 'testing', 'postgresql',
      'mongodb', 'redis', 'html', 'css', 'microservices', 'git',
    ],
  },
  {
    id: 'data',
    title: 'Data Scientist',
    emoji: '📊',
    keywords: [
      'python', 'r', 'sql', 'pandas', 'numpy', 'scikit-learn', 'tensorflow',
      'pytorch', 'machine learning', 'deep learning', 'statistics', 'nlp',
      'visualization', 'tableau', 'spark', 'etl', 'a/b testing', 'regression',
      'clustering', 'feature engineering',
    ],
  },
  {
    id: 'pm',
    title: 'Product Manager',
    emoji: '🧭',
    keywords: [
      'roadmap', 'stakeholder', 'user research', 'analytics', 'a/b testing',
      'prioritization', 'agile', 'scrum', 'kpi', 'metrics', 'strategy',
      'go-to-market', 'wireframe', 'user story', 'okr', 'discovery',
      'backlog', 'pricing', 'segmentation',
    ],
  },
  {
    id: 'design',
    title: 'Product Designer',
    emoji: '🖌️',
    keywords: [
      'figma', 'sketch', 'prototyping', 'wireframe', 'user research',
      'usability', 'design system', 'interaction', 'accessibility', 'ux',
      'ui', 'typography', 'visual design', 'user flow', 'persona',
      'information architecture', 'motion',
    ],
  },
  {
    id: 'marketing',
    title: 'Growth Marketer',
    emoji: '📈',
    keywords: [
      'seo', 'sem', 'content', 'email', 'campaign', 'analytics', 'conversion',
      'funnel', 'ppc', 'social media', 'branding', 'copywriting', 'crm',
      'hubspot', 'google analytics', 'a/b testing', 'retention', 'roi',
    ],
  },
  {
    id: 'devops',
    title: 'DevOps / SRE',
    emoji: '☁️',
    keywords: [
      'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ansible',
      'ci/cd', 'jenkins', 'prometheus', 'grafana', 'monitoring', 'linux',
      'bash', 'observability', 'incident', 'reliability', 'automation',
      'helm', 'networking',
    ],
  },
];

// A broad skill lexicon used for skill extraction / highlighting.
const SKILL_LEXICON = [
  'javascript', 'typescript', 'react', 'vue', 'angular', 'svelte', 'node',
  'node.js', 'express', 'next.js', 'nuxt', 'python', 'django', 'flask',
  'fastapi', 'java', 'spring', 'kotlin', 'swift', 'go', 'golang', 'rust',
  'ruby', 'rails', 'php', 'laravel', 'c++', 'c#', '.net', 'scala', 'elixir',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'redux', 'graphql', 'rest',
  'grpc', 'websocket', 'sql', 'postgresql', 'mysql', 'sqlite', 'mongodb',
  'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'dynamodb', 'firebase',
  'supabase', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins',
  'github actions', 'ci/cd', 'aws', 'gcp', 'azure', 'lambda', 's3',
  'cloudflare', 'nginx', 'linux', 'bash', 'git', 'jira', 'figma', 'sketch',
  'adobe xd', 'photoshop', 'illustrator', 'pandas', 'numpy', 'scikit-learn',
  'tensorflow', 'pytorch', 'keras', 'spark', 'hadoop', 'tableau', 'power bi',
  'looker', 'machine learning', 'deep learning', 'nlp', 'computer vision',
  'statistics', 'jest', 'cypress', 'playwright', 'selenium', 'mocha',
  'webpack', 'vite', 'babel', 'storybook', 'accessibility', 'seo', 'agile',
  'scrum', 'kanban', 'prometheus', 'grafana', 'datadog', 'sentry', 'stripe',
  'oauth', 'jwt', 'microservices', 'serverless', 'a/b testing', 'etl',
];

const ACTION_VERBS = [
  'led', 'built', 'created', 'designed', 'developed', 'launched', 'shipped',
  'improved', 'increased', 'reduced', 'optimized', 'architected', 'drove',
  'delivered', 'implemented', 'managed', 'owned', 'scaled', 'automated',
  'spearheaded', 'orchestrated', 'streamlined', 'migrated', 'mentored',
  'accelerated', 'transformed', 'engineered', 'pioneered', 'established',
  'generated', 'boosted', 'cut', 'grew', 'negotiated', 'analyzed',
  'coordinated', 'collaborated', 'facilitated', 'resolved', 'refactored',
];

const WEAK_PHRASES = [
  'responsible for', 'duties included', 'worked on', 'helped with',
  'in charge of', 'tasked with', 'participated in', 'assisted with',
  'hard worker', 'team player', 'go-getter', 'detail-oriented',
  'think outside the box', 'self-starter', 'results-driven',
];

const SECTION_MATCHERS: { name: string; patterns: RegExp[] }[] = [
  { name: 'Contact', patterns: [/@|\bphone\b|linkedin|github|portfolio/i] },
  { name: 'Summary', patterns: [/\b(summary|profile|objective|about)\b/i] },
  { name: 'Experience', patterns: [/\b(experience|employment|work history|professional)\b/i] },
  { name: 'Education', patterns: [/\b(education|university|college|b\.?sc|m\.?sc|bachelor|master|degree)\b/i] },
  { name: 'Skills', patterns: [/\b(skills|technologies|tech stack|competencies|tools)\b/i] },
  { name: 'Projects', patterns: [/\b(projects|portfolio|open source|side projects)\b/i] },
];

// --- Helpers --------------------------------------------------------------

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function countMatches(text: string, term: string): number {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundary = /^[a-z0-9]/i.test(term) ? '\\b' : '';
  const re = new RegExp(`${boundary}${escaped}${/[a-z0-9]$/i.test(term) ? '\\b' : ''}`, 'gi');
  const m = text.match(re);
  return m ? m.length : 0;
}

function extractKeywordsFromJD(jd: string): string[] {
  const lower = jd.toLowerCase();
  const found = new Set<string>();
  for (const skill of SKILL_LEXICON) {
    if (countMatches(lower, skill) > 0) found.add(skill);
  }
  // Also pull capitalised / notable nouns that repeat.
  const words = lower.replace(/[^a-z0-9+.#/\- ]/g, ' ').split(/\s+/);
  const freq = new Map<string, number>();
  const stop = new Set([
    'the', 'and', 'for', 'with', 'you', 'our', 'are', 'will', 'have', 'this',
    'that', 'work', 'team', 'role', 'your', 'who', 'not', 'all', 'can', 'has',
    'from', 'they', 'their', 'about', 'into', 'more', 'other', 'such', 'able',
    'looking', 'strong', 'years', 'experience', 'skills', 'ability', 'plus',
    'want', 'need', 'help', 'join', 'build', 'across', 'within', 'using',
  ]);
  for (const w of words) {
    if (w.length < 4 || stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  [...freq.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([w]) => found.add(w));
  return uniq([...found]);
}

function fleschReadingEase(text: string): number {
  const sentences = text.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  if (!sentences.length || !words.length) return 60;
  const syllables = words.reduce((sum, w) => sum + estimateSyllables(w), 0);
  const wps = words.length / sentences.length;
  const spw = syllables / words.length;
  return clamp(206.835 - 1.015 * wps - 84.6 * spw, 0, 100);
}

function estimateSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  const groups = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

// --- Main analyze ---------------------------------------------------------

export function analyzeResume(input: {
  resume: string;
  jobDescription?: string;
  roleId?: string;
}): AnalysisResult {
  const resume = (input.resume || '').trim();
  const lower = resume.toLowerCase();
  const words = resume.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const preset = ROLE_PRESETS.find((r) => r.id === input.roleId);
  const roleTitle = preset?.title || 'General role';

  // Build target keyword set from JD (priority) and/or role preset.
  let targetKeywords: string[] = [];
  if (input.jobDescription && input.jobDescription.trim().length > 40) {
    targetKeywords = extractKeywordsFromJD(input.jobDescription);
  }
  if (preset) targetKeywords = uniq([...targetKeywords, ...preset.keywords]);
  if (!targetKeywords.length) targetKeywords = SKILL_LEXICON.slice(0, 20);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of targetKeywords) {
    if (countMatches(lower, kw) > 0) matched.push(kw);
    else missing.push(kw);
  }
  const keywordScore = clamp(Math.round((matched.length / Math.max(1, targetKeywords.length)) * 100));

  // Detected skills across the whole lexicon.
  const detectedSkills = uniq(SKILL_LEXICON.filter((s) => countMatches(lower, s) > 0));

  // Sections.
  const sections = SECTION_MATCHERS.map((s) => ({
    name: s.name,
    present: s.patterns.some((p) => p.test(resume)),
  }));
  const sectionScore = clamp(Math.round((sections.filter((s) => s.present).length / sections.length) * 100));

  // Bullets & impact.
  const bulletLines = resume.split(/\n+/).filter((l) => /^\s*([•\-*·▪◦‣]|\d+\.)\s+/.test(l));
  const bullets = bulletLines.length;
  const actionVerbCount = ACTION_VERBS.reduce((acc, v) => acc + countMatches(lower, v), 0);
  const quantified = (resume.match(/\b\d+(\.\d+)?\s?(%|percent|x|k|m|bn|million|billion|users|customers|hours|days|weeks|\$)/gi) || []).length
    + (resume.match(/\$\s?\d/g) || []).length;

  const impactScore = clamp(
    Math.round(
      Math.min(60, quantified * 12) +
      Math.min(25, actionVerbCount * 3) +
      Math.min(15, bullets * 1.5),
    ),
  );

  // Readability & length.
  const readingEase = Math.round(fleschReadingEase(resume));
  const sentences = resume.split(/[.!?\n]+/).map((s) => s.trim()).filter(Boolean);
  const longestSentence = sentences.reduce((m, s) => Math.max(m, s.split(/\s+/).length), 0);
  let lengthScore = 100;
  if (wordCount < 200) lengthScore = clamp(30 + (wordCount / 200) * 50);
  else if (wordCount > 900) lengthScore = clamp(100 - (wordCount - 900) / 18);
  const weakCount = WEAK_PHRASES.reduce((acc, p) => acc + countMatches(lower, p), 0);
  const readabilityScore = clamp(Math.round(0.5 * readingEase + 0.5 * lengthScore - weakCount * 5));

  // Contact / completeness.
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(resume);
  const hasPhone = /(\+?\d[\d\s().-]{7,}\d)/.test(resume);
  const hasLinks = /(linkedin\.com|github\.com|https?:\/\/|[\w-]+\.(io|dev|me|com)\/)/i.test(resume);
  const completenessScore = clamp(
    (hasEmail ? 40 : 0) + (hasPhone ? 25 : 0) + (hasLinks ? 35 : 0),
  );

  const subScores: SubScore[] = [
    {
      key: 'keywords',
      label: 'Keyword Match',
      score: keywordScore,
      weight: 0.32,
      summary: `${matched.length}/${targetKeywords.length} target keywords found`,
    },
    {
      key: 'impact',
      label: 'Impact & Results',
      score: impactScore,
      weight: 0.24,
      summary: `${quantified} quantified result${quantified === 1 ? '' : 's'}, ${actionVerbCount} action verbs`,
    },
    {
      key: 'structure',
      label: 'Structure & Sections',
      score: sectionScore,
      weight: 0.16,
      summary: `${sections.filter((s) => s.present).length}/${sections.length} key sections detected`,
    },
    {
      key: 'readability',
      label: 'Clarity & Length',
      score: readabilityScore,
      weight: 0.16,
      summary: `${wordCount} words · reading ease ${readingEase}`,
    },
    {
      key: 'contact',
      label: 'Contact & Links',
      score: completenessScore,
      weight: 0.12,
      summary: [hasEmail && 'email', hasPhone && 'phone', hasLinks && 'links'].filter(Boolean).join(', ') || 'none found',
    },
  ];

  const overall = clamp(
    Math.round(subScores.reduce((acc, s) => acc + s.score * s.weight, 0)),
  );

  // Verdict.
  let verdict = 'Needs work before applying';
  let tone: Severity = 'bad';
  if (overall >= 82) {
    verdict = 'Interview-ready — a standout resume';
    tone = 'good';
  } else if (overall >= 68) {
    verdict = 'Strong candidate with a few gaps to close';
    tone = 'good';
  } else if (overall >= 50) {
    verdict = 'Promising, but the screener may pass';
    tone = 'warn';
  }

  // Insights.
  const insights: Insight[] = [];
  const push = (i: Insight) => insights.push(i);

  if (missing.length) {
    push({
      id: 'kw',
      label: `Add ${Math.min(6, missing.length)} missing keywords`,
      detail: `Recruiters & ATS scan for terms like ${missing.slice(0, 6).map((m) => `“${m}”`).join(', ')}. Weave the ones you honestly have into your experience bullets.`,
      severity: missing.length > targetKeywords.length / 2 ? 'bad' : 'warn',
    });
  } else {
    push({ id: 'kw', label: 'Excellent keyword coverage', detail: 'Your resume mirrors the role\'s language well — great for passing automated screens.', severity: 'good' });
  }

  if (quantified < 3) {
    push({
      id: 'impact',
      label: 'Quantify your achievements',
      detail: `Only ${quantified} measurable result${quantified === 1 ? '' : 's'} detected. Add numbers: “reduced load time by 40%”, “grew signups 3×”, “managed $2M budget”.`,
      severity: quantified === 0 ? 'bad' : 'warn',
    });
  } else {
    push({ id: 'impact', label: 'Great use of metrics', detail: `${quantified} quantified results make your impact concrete and credible.`, severity: 'good' });
  }

  if (weakCount > 0) {
    push({
      id: 'weak',
      label: 'Replace weak / filler phrases',
      detail: `Found ${weakCount} passive or cliché phrase${weakCount === 1 ? '' : 's'} (e.g. “responsible for”, “team player”). Lead with strong verbs like “led”, “shipped”, “drove”.`,
      severity: 'warn',
    });
  }

  const missingSections = sections.filter((s) => !s.present).map((s) => s.name);
  if (missingSections.length) {
    push({
      id: 'sections',
      label: `Add missing section${missingSections.length === 1 ? '' : 's'}`,
      detail: `Consider adding: ${missingSections.join(', ')}. A clear structure helps parsers and recruiters find what they need fast.`,
      severity: missingSections.includes('Experience') || missingSections.includes('Skills') ? 'bad' : 'warn',
    });
  }

  if (!hasEmail || !hasLinks) {
    push({
      id: 'contact',
      label: 'Complete your contact block',
      detail: `${!hasEmail ? 'No email detected. ' : ''}${!hasLinks ? 'Add a LinkedIn or portfolio link. ' : ''}Make it effortless for recruiters to reach and vet you.`,
      severity: 'warn',
    });
  }

  if (wordCount < 200) {
    push({ id: 'len', label: 'Resume looks thin', detail: `At ${wordCount} words it may read as under-experienced. Expand your top roles with impact-driven bullets.`, severity: 'warn' });
  } else if (wordCount > 950) {
    push({ id: 'len', label: 'Consider trimming', detail: `At ${wordCount} words it may run long. Aim for one page (≈450–650 words) unless you're senior.`, severity: 'warn' });
  }

  if (longestSentence > 40) {
    push({ id: 'sentence', label: 'Break up long sentences', detail: `Your longest line is ${longestSentence} words. Short, punchy bullets scan better.`, severity: 'warn' });
  }

  if (actionVerbCount >= 8 && quantified >= 3 && overall >= 75) {
    push({ id: 'shine', label: 'This resume shines', detail: 'Strong verbs, real metrics, and good coverage — you\'re presenting like a top applicant.', severity: 'good' });
  }

  return {
    overall,
    verdict,
    tone,
    subScores,
    matched: uniq(matched),
    missing: uniq(missing).slice(0, 24),
    detectedSkills,
    sections,
    insights,
    stats: {
      words: wordCount,
      bullets,
      actionVerbs: actionVerbCount,
      quantified,
      readingEase,
      hasEmail,
      hasPhone,
      hasLinks,
      longestSentence,
    },
    role: roleTitle,
  };
}
