import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-magic-pink via-magic-violet to-magic-cyan text-lg">
                🦄
              </span>
              <span className="font-display text-lg font-bold">Lumina</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/55">
              AI resume screening with a little cinematic magic. Score, coach, and design your way
              past the ATS — all in your browser, nothing uploaded anywhere.
            </p>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-white/80">Product</div>
            <ul className="space-y-2 text-sm text-white/55">
              <li><a href="#screener" className="transition hover:text-white">Screener</a></li>
              <li><a href="#assistant" className="transition hover:text-white">AI Assistant</a></li>
              <li><a href="#templates" className="transition hover:text-white">Templates</a></li>
              <li><a href="#how" className="transition hover:text-white">How it works</a></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-white/80">Good to know</div>
            <ul className="space-y-2 text-sm text-white/55">
              <li>100% client-side</li>
              <li>No sign-up required</li>
              <li>Your data never leaves your device</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row">
          <span>© {new Date().getFullYear()} Lumina. A demo experience.</span>
          <span className="inline-flex items-center gap-1.5">
            Built with <Heart className="h-4 w-4 text-magic-pink" /> and a unicorn
          </span>
        </div>
      </div>
    </footer>
  );
}
