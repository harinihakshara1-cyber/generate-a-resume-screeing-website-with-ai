import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Wand2, Loader2, CheckCircle2, AlertTriangle, XCircle,
  Sparkles, Target, Braces, Trash2,
} from 'lucide-react';
import { analyzeResume, ROLE_PRESETS, type AnalysisResult, type Severity } from '../lib/analyzer';
import { extractTextFromFile } from '../lib/pdf';
import { SAMPLE_RESUME } from '../lib/templates';
import ScoreRing from './ScoreRing';

const sevIcon: Record<Severity, JSX.Element> = {
  good: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
  warn: <AlertTriangle className="h-5 w-5 text-amber-300" />,
  bad: <XCircle className="h-5 w-5 text-rose-300" />,
};
const sevBorder: Record<Severity, string> = {
  good: 'border-emerald-400/25 bg-emerald-400/5',
  warn: 'border-amber-400/25 bg-amber-400/5',
  bad: 'border-rose-400/25 bg-rose-400/5',
};

function barColor(score: number) {
  if (score >= 68) return 'from-emerald-400 to-teal-300';
  if (score >= 50) return 'from-amber-400 to-yellow-300';
  return 'from-rose-400 to-pink-300';
}

export default function Screener({
  onAnalyze,
  result,
}: {
  onAnalyze: (r: AnalysisResult) => void;
  result: AnalysisResult | null;
}) {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [roleId, setRoleId] = useState('fullstack');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];
    setError(null);
    try {
      const text = await extractTextFromFile(file);
      if (!text.trim()) {
        setError('Could not read any text from that file. Try pasting the text instead.');
        return;
      }
      setResume(text);
      setFileName(file.name);
    } catch {
      setError('Sorry, that file could not be parsed. Paste your resume text instead.');
    }
  }, []);

  const runAnalysis = async () => {
    if (resume.trim().length < 40) {
      setError('Add a bit more resume text (at least a few lines) to get a meaningful score.');
      return;
    }
    setError(null);
    setLoading(true);
    // Small delay to let the "AI is thinking" moment land.
    await new Promise((r) => setTimeout(r, 850));
    const r = analyzeResume({ resume, jobDescription: jd, roleId });
    onAnalyze(r);
    setLoading(false);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const clearAll = () => {
    setResume('');
    setJd('');
    setFileName(null);
    setError(null);
  };

  return (
    <section id="screener" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <div className="mb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
          <Target className="h-4 w-4 text-magic-cyan" /> The Screener
        </span>
        <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
          Score your resume in <span className="text-gradient">seconds</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          Paste or upload your resume, pick a target role or drop in a job description, and let
          Lumina's AI screen it just like a recruiter's ATS would.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Input column */}
        <div className="lg:col-span-3">
          <div className="glass-strong card-glow rounded-3xl p-6 sm:p-7">
            {/* Dropzone / textarea */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              className={`relative rounded-2xl border-2 border-dashed p-1 transition ${
                dragging ? 'border-magic-cyan bg-magic-cyan/5' : 'border-white/10'
              }`}
            >
              <textarea
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  setFileName(null);
                }}
                placeholder="Paste your resume text here — or drop a PDF / TXT file anywhere in this box."
                className="h-64 w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm leading-relaxed text-white/90 outline-none placeholder:text-white/35"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <FileText className="h-4 w-4" />
                  {fileName ? (
                    <span className="text-magic-cyan">{fileName}</span>
                  ) : (
                    <span>{resume.trim() ? `${resume.trim().split(/\s+/).length} words` : 'PDF, TXT or paste'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setResume(SAMPLE_RESUME)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
                  >
                    Try sample
                  </button>
                  {(resume || jd) && (
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear
                    </button>
                  )}
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.txt,.md,text/plain,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              </div>
            </div>

            {/* Role chips */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Target role
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRoleId(r.id)}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                      roleId === r.id
                        ? 'bg-gradient-to-r from-magic-pink to-magic-violet text-white shadow-lg shadow-magic-violet/30'
                        : 'glass text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-1">{r.emoji}</span>
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Job description */}
            <div className="mt-6">
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                <Braces className="h-3.5 w-3.5" /> Job description
                <span className="font-normal normal-case text-white/35">— optional, boosts accuracy</span>
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job posting to match against its exact keywords…"
                className="h-24 w-full resize-none rounded-xl glass px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/35"
              />
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                <AlertTriangle className="h-4 w-4" /> {error}
              </div>
            )}

            <button
              onClick={runAnalysis}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-magic-pink via-magic-violet to-magic-indigo px-6 py-4 font-semibold text-white shadow-lg shadow-magic-violet/30 transition hover:shadow-magic-pink/40 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Screening your resume…
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" /> Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Score column */}
        <div className="lg:col-span-2" id="results">
          <div className="glass-strong card-glow flex h-full flex-col items-center justify-center rounded-3xl p-7 text-center">
            {!result ? (
              <div className="flex flex-col items-center py-10">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-magic-pink/20 to-magic-cyan/20 animate-float">
                  <Sparkles className="h-10 w-10 text-magic-gold" />
                </div>
                <p className="mt-6 max-w-xs text-white/55">
                  Your resume score and a full breakdown will appear here after you run the AI screen.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={result.overall}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex w-full flex-col items-center"
                >
                  <ScoreRing value={result.overall} />
                  <div
                    className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${sevBorder[result.tone]}`}
                  >
                    {sevIcon[result.tone]}
                    {result.verdict}
                  </div>
                  <p className="mt-2 text-xs text-white/45">Screened for {result.role}</p>

                  <div className="mt-6 w-full space-y-3 text-left">
                    {result.subScores.map((s) => (
                      <div key={s.key}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-white/70">{s.label}</span>
                          <span className="font-semibold text-white/90">{s.score}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.score}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${barColor(s.score)}`}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-white/40">{s.summary}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Detailed results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Insights */}
          <div className="glass-strong rounded-3xl p-6 lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
              <Wand2 className="h-5 w-5 text-magic-pink" /> AI recommendations
            </h3>
            <div className="space-y-3">
              {result.insights.map((i) => (
                <div key={i.id} className={`flex gap-3 rounded-2xl border p-4 ${sevBorder[i.severity]}`}>
                  <div className="mt-0.5 shrink-0">{sevIcon[i.severity]}</div>
                  <div>
                    <div className="font-semibold text-white/90">{i.label}</div>
                    <div className="mt-1 text-sm text-white/60">{i.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords + stats */}
          <div className="space-y-6">
            <div className="glass-strong rounded-3xl p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Keyword match</h3>
              <div className="mb-3">
                <div className="mb-1.5 text-xs uppercase tracking-wider text-emerald-300/80">Matched</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.matched.length ? (
                    result.matched.slice(0, 18).map((k) => (
                      <span key={k} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/40">None yet</span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-xs uppercase tracking-wider text-rose-300/80">Missing</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing.length ? (
                    result.missing.slice(0, 16).map((k) => (
                      <span key={k} className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-xs text-rose-200">
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-300/80">Great coverage 🎉</span>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-3xl p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">At a glance</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="Words" value={result.stats.words} />
                <Stat label="Quantified wins" value={result.stats.quantified} />
                <Stat label="Action verbs" value={result.stats.actionVerbs} />
                <Stat label="Bullet points" value={result.stats.bullets} />
                <Stat label="Reading ease" value={result.stats.readingEase} />
                <Stat label="Skills found" value={result.detectedSkills.length} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Flag ok={result.stats.hasEmail} label="Email" />
                <Flag ok={result.stats.hasPhone} label="Phone" />
                <Flag ok={result.stats.hasLinks} label="Links" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="font-display text-2xl font-bold text-gradient">{value}</div>
      <div className="text-[11px] text-white/50">{label}</div>
    </div>
  );
}

function Flag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
        ok ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/5 text-white/40'
      }`}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}
