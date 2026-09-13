import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { assistantReply, STARTER_PROMPTS, type ChatMessage } from '../lib/assistant';
import { uid } from '../lib/uid';
import type { AnalysisResult } from '../lib/analyzer';

export default function Assistant({ analysis }: { analysis: AnalysisResult | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm Nova ✨ — your resume co-pilot. Run a scan in the Screener and I'll give tailored advice, or ask me anything about keywords, metrics, wording, or beating the ATS.",
      chips: STARTER_PROMPTS.slice(0, 3),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = assistantReply(trimmed, analysis);
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 650);
  };

  return (
    <section id="assistant" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <Bot className="h-4 w-4 text-magic-pink" /> Meet Nova
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
            Your personal <span className="text-gradient">AI resume coach</span>
          </h2>
          <p className="mt-4 max-w-lg text-white/60">
            Nova reads your latest scan and answers in plain language — what to add, what to cut, and
            exactly how to phrase it. No fluff, just the edits that move your score.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Beat the ATS', d: 'Surface the exact keywords recruiters filter on.' },
              { t: 'Quantify impact', d: 'Turn duties into metric-driven achievements.' },
              { t: 'Sharpen wording', d: 'Rewrite weak bullets with power verbs.' },
              { t: 'Tailor to a job', d: 'Match your resume to any posting instantly.' },
            ].map((f) => (
              <div key={f.t} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-magic-gold" /> {f.t}
                </div>
                <p className="mt-1 text-sm text-white/55">{f.d}</p>
              </div>
            ))}
          </div>

          {analysis && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-magic-cyan/30 bg-magic-cyan/10 px-4 py-2 text-sm text-magic-cyan">
              <Sparkles className="h-4 w-4" /> Nova is using your latest scan · score {analysis.overall}/100
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="glass-strong card-glow flex h-[560px] flex-col overflow-hidden rounded-3xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-magic-pink to-magic-violet">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-night-900 bg-emerald-400" />
            </div>
            <div>
              <div className="font-semibold">Nova</div>
              <div className="text-xs text-emerald-300/80">online · resume co-pilot</div>
            </div>
          </div>

          <div ref={scrollRef} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onChip={send} />
            ))}
            {typing && (
              <div className="flex items-center gap-2 text-white/50">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-magic-pink to-magic-violet">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex gap-1 rounded-2xl bg-white/5 px-4 py-3">
                  <Dot delay={0} />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask Nova about your resume…"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-white/35"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-magic-pink to-magic-violet transition hover:opacity-90 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MessageBubble({ message, onChip }: { message: ChatMessage; onChip: (t: string) => void }) {
  const isUser = message.role === 'user';
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        <div
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
            isUser ? 'bg-white/10' : 'bg-gradient-to-br from-magic-pink to-magic-violet'
          }`}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div className={`max-w-[82%] ${isUser ? 'items-end text-right' : ''}`}>
          <div
            className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? 'bg-gradient-to-br from-magic-indigo to-magic-violet text-white'
                : 'bg-white/5 text-white/85'
            }`}
          >
            {renderContent(message.content)}
          </div>
          {message.chips && message.chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {message.chips.map((c) => (
                <button
                  key={c}
                  onClick={() => onChip(c)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Bold **text** support.
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} className="font-semibold text-white">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-white/60"
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}
