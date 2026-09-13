import { motion } from 'framer-motion';
import { Upload, ScanLine, Bot, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Drop your resume',
    text: 'Paste text or upload a PDF. Everything is parsed instantly, right in your browser.',
    color: 'from-magic-pink to-magic-violet',
  },
  {
    icon: ScanLine,
    title: 'AI screens it',
    text: 'We score keywords, impact, structure, clarity and completeness against your target role.',
    color: 'from-magic-violet to-magic-indigo',
  },
  {
    icon: Bot,
    title: 'Nova coaches you',
    text: 'Your AI co-pilot explains every gap and hands you the exact wording to fix it.',
    color: 'from-magic-indigo to-magic-cyan',
  },
  {
    icon: Rocket,
    title: 'Ship & apply',
    text: 'Polish with a recruiter-approved template and download a clean, ATS-ready resume.',
    color: 'from-magic-cyan to-magic-gold',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          From draft to <span className="text-gradient">dream job</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Four steps, zero guesswork. Lumina turns the black box of resume screening into a
          clear, guided path.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative glass rounded-3xl p-6"
          >
            <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
              Step {i + 1}
            </div>
            <h3 className="font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/55">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
