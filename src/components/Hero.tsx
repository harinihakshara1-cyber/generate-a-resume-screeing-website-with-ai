import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ScanLine, Bot, LayoutTemplate } from 'lucide-react';
import Unicorn from './Unicorn';

const stats = [
  { value: '75%', label: 'of resumes are filtered by ATS before a human reads them' },
  { value: '6s', label: 'average time a recruiter spends per resume' },
  { value: '3×', label: 'more interviews with a keyword-matched resume' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-28">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 grid-mask opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-6 lg:grid-cols-2 lg:gap-4">
        {/* Copy */}
        <div className="z-10 py-10 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/80"
          >
            <Sparkles className="h-4 w-4 text-magic-gold" />
            AI screening · beautifully cinematic
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Screen your resume
            <br />
            like a <span className="text-gradient animate-shimmer">unicorn</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-white/65"
          >
            Lumina scores your resume against any job in seconds, tells you exactly what
            to fix with an AI co-pilot, and hands you recruiter-approved templates — all
            wrapped in a little bit of magic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#screener"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magic-pink via-magic-violet to-magic-indigo px-7 py-3.5 font-semibold text-white shadow-lg shadow-magic-violet/30 transition hover:shadow-magic-pink/40"
            >
              Screen my resume
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#templates"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold text-white/85 transition hover:bg-white/10"
            >
              <LayoutTemplate className="h-4 w-4" />
              Browse templates
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-6 text-sm text-white/60"
          >
            <span className="inline-flex items-center gap-2"><ScanLine className="h-4 w-4 text-magic-cyan" /> ATS scoring</span>
            <span className="inline-flex items-center gap-2"><Bot className="h-4 w-4 text-magic-pink" /> AI assistant</span>
            <span className="inline-flex items-center gap-2"><LayoutTemplate className="h-4 w-4 text-magic-gold" /> 6 templates</span>
          </motion.div>
        </div>

        {/* 3D unicorn */}
        <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[640px]">
          <div className="absolute inset-0">
            <Unicorn />
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full glass px-4 py-1.5 text-xs text-white/60">
            drag-free · always cinematic
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-4 px-6 sm:grid-cols-3"
      >
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="font-display text-3xl font-bold text-gradient">{s.value}</div>
            <div className="mt-1 text-sm text-white/60">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
