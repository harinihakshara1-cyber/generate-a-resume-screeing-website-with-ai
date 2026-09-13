import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, ShieldCheck, X, Download, Eye, Sparkles } from 'lucide-react';
import { TEMPLATES, type ResumeTemplate } from '../lib/templates';
import { SAMPLE_DATA, buildResumeHtml } from '../lib/resumeBuilder';

// A tiny stylised thumbnail of each template.
function Thumb({ t }: { t: ResumeTemplate }) {
  const { headerStyle, sidebar, accentBar } = t.preview;
  const Line = ({ w }: { w: string }) => (
    <div className="h-1 rounded-full bg-white/20" style={{ width: w }} />
  );
  const body = (
    <div className="flex-1 space-y-1.5">
      <Line w="70%" />
      <Line w="90%" />
      <Line w="85%" />
      <Line w="60%" />
      <div className="pt-1" />
      <Line w="80%" />
      <Line w="92%" />
    </div>
  );

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-night-900 p-3">
      <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-10`} />
      {accentBar && <div className={`absolute inset-x-0 top-0 h-6 bg-gradient-to-r ${t.accent}`} />}
      <div className={`relative flex h-full flex-col ${accentBar ? 'pt-5' : ''}`}>
        {headerStyle === 'centered' ? (
          <div className="mb-2 flex flex-col items-center gap-1">
            <div className={`h-2 w-24 rounded bg-gradient-to-r ${t.accent}`} />
            <div className="h-1 w-16 rounded-full bg-white/25" />
          </div>
        ) : (
          <div className="mb-2 flex items-center justify-between">
            <div className={`h-2.5 w-20 rounded bg-gradient-to-r ${t.accent}`} />
            <div className="space-y-1">
              <div className="ml-auto h-1 w-10 rounded-full bg-white/20" />
              <div className="ml-auto h-1 w-8 rounded-full bg-white/20" />
            </div>
          </div>
        )}
        {sidebar ? (
          <div className="flex flex-1 gap-2">
            <div className={`w-1/3 rounded-md bg-gradient-to-b ${t.accent} opacity-40`} />
            {body}
          </div>
        ) : (
          body
        )}
      </div>
    </div>
  );
}

export default function Templates() {
  const [filter, setFilter] = useState<'all' | 'ats'>('all');
  const [active, setActive] = useState<ResumeTemplate | null>(null);

  const list = TEMPLATES.filter((t) => (filter === 'ats' ? t.atsSafe : true));

  const download = (t: ResumeTemplate) => {
    const html = buildResumeHtml(t.id, SAMPLE_DATA);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${SAMPLE_DATA.name.replace(/\s+/g, '_')}_${t.name}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="templates" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <LayoutTemplate className="h-4 w-4 text-magic-gold" /> Templates
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
            Start from a <span className="text-gradient">winning</span> design
          </h2>
          <p className="mt-3 max-w-xl text-white/60">
            Six recruiter-approved layouts, each engineered to parse cleanly through the ATS.
            Preview one, then download a ready-to-edit HTML resume.
          </p>
        </div>
        <div className="flex gap-2 rounded-full glass p-1">
          {(['all', 'ats'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All templates' : 'ATS-safe only'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="group glass-strong overflow-hidden rounded-3xl p-5 transition hover:card-glow"
          >
            <div className="relative">
              <Thumb t={t} />
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-night-950/70 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                <button
                  onClick={() => setActive(t)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-night-900"
                >
                  <Eye className="h-4 w-4" /> Preview
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                <p className="text-sm text-white/50">{t.vibe}</p>
              </div>
              {t.atsSafe && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" /> ATS
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/55">{t.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setActive(t)}
                className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm font-semibold transition hover:bg-white/20"
              >
                Preview
              </button>
              <button
                onClick={() => download(t)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-magic-pink to-magic-violet px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Use
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-night-950/80 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl glass-strong"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${active.accent}`}>
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-display text-lg font-semibold">{active.name}</div>
                    <div className="text-xs text-white/50">{active.bestFor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => download(active)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-magic-pink to-magic-violet px-4 py-2 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" /> Download HTML
                  </button>
                  <button
                    onClick={() => setActive(null)}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto bg-night-950/50 p-4 sm:p-8">
                <iframe
                  title={`${active.name} preview`}
                  srcDoc={buildResumeHtml(active.id, SAMPLE_DATA)}
                  className="h-[70vh] w-full rounded-xl border border-white/10 bg-white"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
