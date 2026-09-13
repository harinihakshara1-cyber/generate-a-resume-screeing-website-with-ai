import type { AnalysisResult } from './analyzer';
import { uid } from './uid';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chips?: string[];
}

// Deterministic, context-aware assistant. It reads the latest analysis (when
// available) and answers common resume questions with specific, useful advice.
export function assistantReply(question: string, analysis: AnalysisResult | null): ChatMessage {
  const q = question.toLowerCase().trim();
  const id = uid();
  const has = (...terms: string[]) => terms.some((t) => q.includes(t));

  const mk = (content: string, chips?: string[]): ChatMessage => ({ id, role: 'assistant', content, chips });

  // Greetings / meta
  if (has('hello', 'hi ', 'hey', 'yo ') || q === 'hi' || q === 'hey') {
    return mk(
      "Hi! I'm Nova, your resume co-pilot. ✨ Paste your resume into the Screener and I'll score it against any job — then ask me anything: keywords, wording, metrics, structure, or how to beat the ATS.",
      ['How do I beat the ATS?', 'Improve my summary', 'Add metrics'],
    );
  }

  if (has('who are you', 'what can you do', 'help')) {
    return mk(
      "I'm Nova. I can: 1) explain your score, 2) suggest missing keywords, 3) rewrite bullets to be punchier, 4) fix formatting for ATS, and 5) tailor your resume to a specific job. Run a scan first, then ask away.",
      ['Explain my score', 'What keywords am I missing?', 'Rewrite a bullet'],
    );
  }

  // Score explanation
  if (has('score', 'rating', 'how did i do', 'how good')) {
    if (!analysis) return mk('Run a scan in the Screener first (paste your resume, pick a role or paste a job description) and I\'ll break down exactly why you got the score you did.');
    const weakest = [...analysis.subScores].sort((a, b) => a.score - b.score)[0];
    return mk(
      `You scored ${analysis.overall}/100 — "${analysis.verdict}". Breakdown: ${analysis.subScores
        .map((s) => `${s.label} ${s.score}`)
        .join(', ')}. Your biggest opportunity is **${weakest.label}** (${weakest.score}/100): ${weakest.summary}. Want me to help fix that one?`,
      [`Fix ${weakest.label}`, 'What keywords am I missing?'],
    );
  }

  // Keywords
  if (has('keyword', 'ats', 'applicant tracking', 'get past', 'beat the')) {
    if (!analysis) return mk('ATS systems rank you on keyword overlap with the job post. Paste the job description in the Screener and I\'ll tell you the exact terms to add.');
    if (analysis.missing.length === 0) return mk('Your keyword coverage is already excellent — nothing critical missing. Focus next on quantifying results.');
    return mk(
      `To beat the ATS, mirror the job's language. You're currently missing: ${analysis.missing
        .slice(0, 8)
        .map((m) => `“${m}”`)
        .join(', ')}. Only add the ones you genuinely have — bury them naturally inside experience bullets, not just a skills list.`,
      ['Rewrite a bullet with keywords', 'Explain my score'],
    );
  }

  // Metrics / impact
  if (has('metric', 'number', 'quantif', 'impact', 'result', 'achievement')) {
    const n = analysis?.stats.quantified ?? 0;
    return mk(
      `Recruiters skim for impact. ${analysis ? `I found ${n} quantified result${n === 1 ? '' : 's'} in yours. ` : ''}Turn duties into outcomes with this formula: **[Action verb] + [what] + [measurable result]**. Examples:\n• "Cut API latency 45% by adding Redis caching."\n• "Grew activation 3× by redesigning onboarding."\n• "Led a team of 6 to ship a $1.2M product line."`,
      ['Rewrite a bullet', 'What verbs should I use?'],
    );
  }

  // Rewrite bullet
  if (has('rewrite', 'bullet', 'reword', 'make it better', 'stronger', 'improve a line')) {
    return mk(
      "Paste the bullet you want improved and I'll sharpen it. In general: start with a power verb, cut “responsible for”, and end with a number. Before: “Responsible for the website.” After: “Rebuilt the marketing site in React, lifting conversion 28% and cutting load time to under 1s.”",
      ['What verbs should I use?', 'Add metrics'],
    );
  }

  // Verbs
  if (has('verb', 'action word', 'power word')) {
    return mk(
      'Strong opening verbs by intent:\n• Built: architected, engineered, developed, launched, shipped\n• Led: spearheaded, drove, orchestrated, mentored, owned\n• Improved: optimized, streamlined, accelerated, reduced, boosted\n• Grew: scaled, expanded, generated, increased\nAvoid: “responsible for”, “worked on”, “helped with”.',
      ['Rewrite a bullet', 'Add metrics'],
    );
  }

  // Summary
  if (has('summary', 'profile', 'objective', 'headline', 'about me')) {
    const skills = analysis?.detectedSkills.slice(0, 3).join(', ');
    return mk(
      `A great summary is 2–3 lines: **[Title] with [X yrs] building [domain]. Known for [signature strength]. Looking to [goal].** ${
        skills ? `Yours could lead with ${skills}. ` : ''
      }Example: “Full-stack engineer with 6 years shipping consumer products at scale. I turn ambiguous ideas into fast, measurable features — most recently growing retention 22%.”`,
      ['Improve my score', 'Add metrics'],
    );
  }

  // Length / format
  if (has('length', 'how long', 'one page', 'pages', 'format', 'layout', 'template')) {
    return mk(
      `Keep it to one page (≈450–650 words) unless you have 10+ years. Use a clean, single-column, ATS-safe layout — avoid tables, text boxes, and images for the parsed version. ${
        analysis ? `Yours is ${analysis.stats.words} words. ` : ''
      }Check out the Templates section for recruiter-approved, ATS-friendly designs.`,
      ['Browse templates', 'Explain my score'],
    );
  }

  // Skills / gap
  if (has('skill', 'missing', 'gap', 'learn')) {
    if (!analysis) return mk('Run a scan and I\'ll map your detected skills against the role and flag the gaps worth closing.');
    return mk(
      `Detected skills: ${analysis.detectedSkills.slice(0, 10).join(', ') || 'none yet'}. ${
        analysis.missing.length
          ? `Highest-value gaps for ${analysis.role}: ${analysis.missing.slice(0, 6).join(', ')}.`
          : 'You cover the core skills for this role well.'
      }`,
      ['What keywords am I missing?', 'Improve my score'],
    );
  }

  // Cover letter
  if (has('cover letter', 'linkedin', 'interview')) {
    return mk(
      "Happy to help beyond the resume too. For a cover letter: one hook line, one paragraph proving you've solved their exact problem (with a metric), one on why this company. For interviews, prep 5 STAR stories tied to your top bullets. Want a template to start from?",
      ['Browse templates', 'Improve my summary'],
    );
  }

  if (has('thank', 'thanks', 'awesome', 'great')) {
    return mk("Anytime! 🦄 Keep iterating — re-run the scan after each edit and watch your score climb. You've got this.");
  }

  // Fallback — try to be helpful using the analysis.
  if (analysis) {
    const weakest = [...analysis.subScores].sort((a, b) => a.score - b.score)[0];
    return mk(
      `Good question. Based on your latest scan (score ${analysis.overall}/100), the fastest win is **${weakest.label}** — ${weakest.summary}. Ask me to "fix ${weakest.label.toLowerCase()}", or try: keywords, metrics, summary, or rewriting a bullet.`,
      [`Fix ${weakest.label}`, 'What keywords am I missing?', 'Add metrics'],
    );
  }
  return mk(
    "I can help with keywords, metrics, wording, structure, and beating the ATS. Paste your resume in the Screener for tailored advice, or ask me something like “how do I quantify my impact?”",
    ['How do I beat the ATS?', 'Add metrics', 'Improve my summary'],
  );
}

export const STARTER_PROMPTS = [
  'How do I beat the ATS?',
  'What keywords am I missing?',
  'Add metrics to my resume',
  'Improve my summary',
  'What action verbs should I use?',
];
