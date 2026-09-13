import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#screener', label: 'Screener' },
  { href: '#assistant', label: 'AI Assistant' },
  { href: '#templates', label: 'Templates' },
  { href: '#how', label: 'How it works' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full glass-strong px-5 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-magic-pink via-magic-violet to-magic-cyan text-lg shadow-lg shadow-magic-violet/40">
            🦄
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Lumina</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/70 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#screener"
            className="rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-night-900 transition hover:bg-white"
          >
            Start free
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg glass md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl glass-strong p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-white/80 transition hover:bg-white/10"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#screener"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-gradient-to-r from-magic-pink to-magic-violet px-4 py-3 text-center font-semibold"
            >
              Start free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
