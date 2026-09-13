import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Screener from './components/Screener';
import Assistant from './components/Assistant';
import Templates from './components/Templates';
import Footer from './components/Footer';
import type { AnalysisResult } from './lib/analyzer';

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <div id="top" className="relative min-h-screen overflow-hidden">
      {/* Ambient aurora backdrop */}
      <div className="pointer-events-none fixed inset-0 aurora" />
      <div className="pointer-events-none fixed inset-0 bg-night-950/40" />

      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <Screener onAnalyze={setAnalysis} result={analysis} />
          <Assistant analysis={analysis} />
          <Templates />
        </main>
        <Footer />
      </div>
    </div>
  );
}
