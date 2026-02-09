import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  History,
  Play,
  RotateCcw,
  Clock,
  Users,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  X,
  Music,
  VolumeX,
  Save,
  Download,
  Upload,
  Settings as SettingsIcon,
  Bug as BugIcon,
  SkipForward,
  SkipBack,
  Pause,
  Volume2,
  Search
} from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: String(error?.message || error) };
  }
  componentDidCatch(err, info) {
    console.error("Codex of Algorithms crashed:", err, info);
  }
  render() {
    if (this.state.hasError) {
      const isMetamask = /metamask/i.test(this.state.message || "");
      return (
        <div className="m-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900">
          <div className="font-semibold">We hit a snag.</div>
          <div className="text-sm mt-1">
            {isMetamask ? (
              <>A browser extension (MetaMask) raised an error, but this game doesn’t use Web3. You can ignore it or disable the extension for this tab.</>
            ) : (
              <>{this.state.message}</>
            )}
          </div>
          <button className="mt-2 rounded-lg bg-slate-900 px-3 py-1 text-white" onClick={() => location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const RES_NAMES = ["knowledge", "influence", "compute", "data", "ethics"];
const START_RES = { knowledge: 8, influence: 4, compute: 0, data: 3, ethics: 0 };
const VERSION = "codex_v1.4";
const LS_KEY = "algocodex_save";

function cTech(id, name, gain, cost, fact) { return { id, type: "tech", name, art: "tech", gain, cost, fact }; }
function cFigure(id, name, gain, passive, fact) { return { id, type: "figure", name, art: "figure", gain, passive, cost: 3, fact }; }
function cEvent(id, name, gain, cost, fact) { return { id, type: "event", name, art: "event", gain, cost, fact }; }
function cChallenge(id, name, cost, meta, prompt) { return { id, type: "challenge", name, art: "challenge", cost, meta, prompt }; }

const CHAPTERS = [
  {
    id: "ch1",
    title: "The House of Wisdom",
    years: "800–1100",
    scene: "Baghdad shimmers under a noon sun. In the scriptorium, Al‑Khwarizmi opens a leather‑bound manuscript: the Codex begins here.",
    required: ["hindu-arabic", "algebra", "algorithm"],
    deck: [
      cTech("hindu-arabic", "Hindu‑Arabic Numerals", { knowledge: 3, influence: 1 }, 2, "Base‑10 positional system with a symbol for zero enables efficient addition/multiplication and long‑distance accounting. Replaces additive Roman numerals for algorithms like long division."),
      cTech("algebra", "Algebraic Methods", { knowledge: 4 }, 2, "al‑jabr (restoration) and al‑muqabala (balancing) formalize solving linear/quadratic equations by symbolic steps; general recipes independent of specific numbers."),
      cTech("algorithm", "Algorithmic Procedure", { knowledge: 4, data: 1 }, 2, "A finite sequence of unambiguous steps. Inputs→Outputs with correctness and termination criteria; paves the way for proofs about procedures."),
      cFigure("al-khwarizmi", "Al‑Khwarizmi", { knowledge: 2 }, { knowledge: 1 }, "9th‑century scholar at Bayt al‑Hikma; wrote 'Hisab al‑Jabr wa‑l‑Muqabala' and astronomical/astrolabe treatises; Latin translations seed Europe."),
      cEvent("translation-movement", "Translation Movement", { influence: 2, knowledge: 1 }, 1, "Scholars translate Sanskrit/Greek/Persian works into Arabic and Latin; paper, numerals, and methods diffuse via Andalusia and Sicily."),
      cChallenge(
        "quiz-ch1",
        "Scribe’s Quiz",
        { knowledge: 0 },
        { kind: "mcq", answers: [0], options: ["al‑jabr", "gradient", "pipeline"], question: "Which term names an operation central to classical algebra?", reward: { knowledge: 3 } },
        "Match terms: 'al‑jabr' relates to…"
      ),
    ],
    bg: "from-amber-100 to-emerald-100",
    portrait: portraitPlaceholder("Al‑Khwarizmi", "Baghdad"),
  },
  {
    id: "ch2",
    title: "Algorithmic Enlightenment",
    years: "1600–1800",
    scene: "A quill scratches in a candle‑lit study. Leibniz dreams of a calculus of thought; Boole sketches an algebra of logic.",
    required: ["calc-machine", "formal-logic"],
    deck: [
      cTech("calc-machine", "Calculating Machines", { compute: 1, knowledge: 2 }, 2, "From Pascaline to Leibniz stepped‑drum: mechanical place‑value, carry propagation, and repeated operations; early hardware abstraction of arithmetic."),
      cTech("formal-logic", "Formal Logic", { knowledge: 3, data: 1 }, 2, "Boolean algebra encodes TRUE/FALSE with operators ∧, ∨, ¬; basis for switching circuits and digital computation."),
      cFigure("leibniz", "G. W. Leibniz", { influence: 2 }, { knowledge: 1 }, "Imagines characteristica universalis and calculus ratiocinator; promotes binary notation and mechanized reasoning."),
      cEvent("correspondence", "Republic of Letters", { influence: 2 }, 1, "Scientific networks exchange preprints, devices, and proofs; accelerates priority and standardization."),
      cChallenge(
        "drag-ch2",
        "Arrange the Claims",
        { influence: 0 },
        { kind: "drag", items: ["Leibniz", "Boole", "Shannon"], answer: ["Leibniz", "Boole", "Shannon"], reward: { influence: 2 } },
        "Put these milestones in order."
      ),
    ],
    bg: "from-yellow-100 to-emerald-100",
    portrait: portraitPlaceholder("Leibniz & Boole", "Study"),
  },
  {
    id: "ch3",
    title: "Engines & Theory",
    years: "1800s",
    scene: "Pistons hiss; Jacquard looms clatter. Ada’s notes whisper of programs unfettered by mere calculation.",
    required: ["programmability", "cards"],
    deck: [
      cTech("programmability", "Programmability", { knowledge: 3, data: 1 }, 3, "Separates data, control, and memory; loops/branches enable Turing‑complete patterns; foreshadows stored‑program designs."),
      cTech("cards", "Punched Cards", { data: 2 }, 1, "Externalized programs as sequences of holes; reconfigurable logic for looms and tabulators; inspires early I/O formats."),
      cFigure("ada", "Ada Lovelace", { influence: 1 }, { knowledge: 1 }, "Annotates Bernoulli numbers procedure; theorizes machines manipulating symbols beyond numbers—music and art."),
      cEvent("analytical-engine", "Analytical Engine", { compute: 1, knowledge: 1 }, 1, "Mill, store, and control; conditional jumps and micro‑ops anticipate CPU components."),
      cChallenge(
        "cloud-ch3",
        "Word Cloud Selection",
        { knowledge: 0 },
        { kind: "cloud", tokens: ["loop", "memory", "kernel", "control", "entropy"], answer: ["loop", "memory", "control"], reward: { data: 2 } },
        "Select terms linked to programmability."
      ),
    ],
    bg: "from-emerald-100 to-cyan-100",
    portrait: portraitPlaceholder("Ada & Babbage", "Engines"),
  },
  {
    id: "ch4",
    title: "Foundations of CS",
    years: "1930–1960",
    scene: "Creaking Bombe rotors; chalk dust around Turing’s proofs; Shannon flips a coin—information becomes quantity.",
    required: ["turing", "von-neumann", "info-theory"],
    deck: [
      cTech("turing", "Turing Machines", { knowledge: 4 }, 3, "Abstract automaton with tape, head, and state table defines computability; halting problem proves undecidability."),
      cTech("von-neumann", "Stored‑Program Architecture", { compute: 2, data: 1 }, 3, "Instructions and data share memory; fetch‑decode‑execute pipeline; random access enables generality."),
      cTech("info-theory", "Information Theory", { data: 2, knowledge: 2 }, 2, "Bits quantify surprise H=−∑p log2 p; channel capacity and coding separate error correction from semantics."),
      cFigure("turing-fig", "Alan Turing", { influence: 1 }, { knowledge: 1 }, "Codebreaking at Bletchley; morphogenesis; universal computation; Turing test frames intelligence debates."),
      cChallenge(
        "figure-ch4",
        "Interactive Figure",
        { knowledge: 0 },
        { kind: "figure", question: "As SNR increases, capacity should…", options: ["decrease", "stay same", "increase"], answers: [2], reward: { knowledge: 2 } },
        "Use Shannon’s C≈log2(1+SNR)."
      ),
    ],
    bg: "from-cyan-100 to-indigo-100",
    portrait: portraitPlaceholder("Turing & Shannon", "Chalkboard"),
  },
  {
    id: "ch5",
    title: "Symbolic AI",
    years: "1956–1980",
    scene: "Chess boards and search trees. Heuristics bloom, winters loom.",
    required: ["search", "expert"],
    deck: [
      cTech("search", "Search & Heuristics", { knowledge: 3 }, 2, "State spaces and evaluation functions; A* optimal given admissible heuristic; alpha‑beta pruning reduces game tree branching."),
      cTech("expert", "Expert Systems", { knowledge: 2, influence: 1 }, 2, "IF‑THEN rules + inference engines (forward/backward chaining); brittle beyond closed worlds; sparks winter when maintenance explodes."),
      cChallenge(
        "pseudo-ch5",
        "Pseudocode Exercise",
        { knowledge: 0 },
        { kind: "pseudo", question: "After popping node n with lowest f, next step is…", options: ["expand n", "return start", "clear open"], answers: [0], reward: { knowledge: 2 } },
        "Trace A* on a tiny grid."
      ),
    ],
    bg: "from-indigo-100 to-fuchsia-100",
    portrait: portraitPlaceholder("Symbolic AI", "Chess"),
  },
  {
    id: "ch6",
    title: "Statistical Learning",
    years: "1980–2010",
    scene: "Margins and priors; graphs that reason under uncertainty.",
    required: ["svm", "bayes"],
    deck: [
      cTech("svm", "Support Vector Machines", { knowledge: 3 }, 3, "Maximize margin between classes; kernels map to feature spaces φ(x); convex optimization with generalization bounds."),
      cTech("bayes", "Bayesian Networks", { knowledge: 2, data: 2 }, 3, "Directed acyclic graphs encode conditional independence; exact/approximate inference (VE, BP, MCMC)."),
      cTech("ensembles", "Ensembles", { knowledge: 2 }, 2, "Bagging reduces variance, boosting reduces bias; random forests average decorrelated trees; feature importance emerges."),
      cChallenge(
        "drag-ch6",
        "Kernel Match",
        { knowledge: 0 },
        { kind: "drag", items: ["Linear", "RBF", "Poly"], answer: ["Linear", "Poly", "RBF"], reward: { data: 2 } },
        "Reorder simplest→most flexible."
      ),
    ],
    bg: "from-fuchsia-100 to-rose-100",
    portrait: portraitPlaceholder("Statistical Learning", "Graphs"),
  },
  {
    id: "ch7",
    title: "Deep Learning",
    years: "2012–2017",
    scene: "GPUs hum; features become filters; sequences remember and forget.",
    required: ["cnn", "rnn", "attention"],
    deck: [
      cTech("cnn", "Convolutional Nets", { compute: 1, data: 1 }, 3, "Parameter sharing and locality learn translation‑equivariant features; pooling builds invariance; drives ImageNet breakthroughs."),
      cTech("rnn", "Recurrent Nets", { knowledge: 2 }, 3, "Shared weights through time; vanishing gradients mitigated by LSTM/GRU gating; sequence labeling and language modeling."),
      cTech("attention", "Attention", { knowledge: 2, data: 1 }, 3, "Soft alignment weighs tokens by relevance; improves long‑range dependencies and interpretability."),
      cChallenge("mcq-ch7", "Quick Check", { knowledge: 0 }, { kind: "mcq", question: "Which is best for parallelization?", options: ["RNN", "Transformer"], answers: [1], reward: { knowledge: 2 } }, "CNN vs RNN vs Attention."),
    ],
    bg: "from-rose-100 to-purple-100",
    portrait: portraitPlaceholder("Deep Learning", "GPU"),
  },
  {
    id: "ch8",
    title: "Transformers & The Grand Assembly",
    years: "2017–Today",
    scene: "A packed conference hall. You complete the Codex and present it alongside the pioneers. Alignment guides the future.",
    required: ["transformer", "pretrain", "rlhf"],
    deck: [
      cTech("transformer", "Transformer", { compute: 2, data: 1 }, 5, "Self‑attention with Q,K,V; positional encodings; O(n^2) context but full parallelism; scales with data/compute for emergent abilities."),
      cTech("pretrain", "Pre‑train & Fine‑tune", { knowledge: 2, data: 2 }, 4, "Self‑supervised objectives (MLM/next‑token) learn general representations; adapters/LoRA and instruction tuning specialize."),
      cTech("rlhf", "RLHF & Alignment", { ethics: 2, influence: 1 }, 3, "Preference data → reward model; policy optimization steers behavior towards helpful, harmless, honest outputs."),
      cFigure("hinton", "Geoffrey Hinton", { influence: 1 }, { knowledge: 1 }, "Backprop and deep nets advocacy; ImageNet revolution; Turing/Nobel‑level honors discussions; mentorship shapes the field."),
      cChallenge("final-ch8", "Conference Q&A", { knowledge: 0 }, { kind: "cloud", tokens: ["pretrain", "fine‑tune", "alchemy", "rlhf", "attention"], answer: ["pretrain", "fine‑tune", "rlhf", "attention"], reward: { influence: 2 } }, "Select claims supported by evidence."),
    ],
    bg: "from-purple-100 to-slate-100",
    portrait: portraitPlaceholder("Transformers Era", "Conference"),
  },
];

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const fmt = (r) => RES_NAMES.map((k) => `${k.slice(0, 3)}:${r[k] || 0}`).join(" · ");
function canPay(res, cost) { if (!cost) return true; return Object.entries(cost).every(([k, v]) => (res[k] || 0) >= v); }
function pay(res, cost) { const next = { ...res }; for (const [k, v] of Object.entries(cost || {})) next[k] = Math.max(0, (next[k] || 0) - v); return next; }
function addRes(res, gain) { const next = { ...res }; for (const [k, v] of Object.entries(gain || {})) next[k] = (next[k] || 0) + v; return next; }
function shuffle(a) { const arr = [...a]; for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function portraitPlaceholder(subject, place, tone = "slate") {
  const colors = {
    slate: ["#0f172a", "#334155"],
    amber: ["#78350f", "#f59e0b"],
    emerald: ["#064e3b", "#10b981"],
    indigo: ["#1e1b4b", "#6366f1"],
    rose: ["#4c0519", "#fb7185"],
    purple: ["#2e1065", "#a78bfa"],
  };
  const [c1, c2] = colors[tone] || colors.slate;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${c1}'/>
          <stop offset='100%' stop-color='${c2}'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <g fill='rgba(255,255,255,0.08)'>
        <circle cx='200' cy='120' r='80'/>
        <rect x='700' y='300' width='260' height='140'/>
      </g>
      <text x='40' y='80' fill='#fff' font-family='serif' font-size='36'>${subject}</text>
      <text x='40' y='130' fill='#e2e8f0' font-family='serif' font-size='18'>${place}</text>
    </svg>`
  );
  return `url("data:image/svg+xml,${svg}")`;
}

const DIFFICULTY_PRESETS = {
  Easy: { costMul: 0.8, draw: 2, challengeTolerance: 0 },
  Medium: { costMul: 1.0, draw: 1, challengeTolerance: 0 },
  Hard: { costMul: 1.2, draw: 1, challengeTolerance: 0 },
};

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs shadow dark:bg-slate-800/90">
      <Icon className="size-3.5" aria-hidden />
      <span className="font-semibold">{label}</span>
      <span className="ml-1 opacity-80">{value}</span>
    </div>
  );
}

function TopBar({ chapter, turn, onReset, onSettings }) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 text-white">
      <div className="flex items-center gap-2">
        <History className="size-5"/>
        <div>
          <div className="text-xs opacity-80">Chapter</div>
          <div className="text-sm font-semibold">{chapter.title} <span className="opacity-75">({chapter.years})</span></div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatPill icon={Clock} label="Turn" value={turn} />
        <button onClick={onSettings} className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"><SettingsIcon className="mr-1 inline size-3"/>Settings</button>
        <button onClick={onReset} className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"><RotateCcw className="mr-1 inline size-3"/>Reset</button>
      </div>
    </div>
  );
}

function ResourceRow({ res }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2">
      <StatPill icon={BookOpen} label="Knowledge" value={res.knowledge} />
      <StatPill icon={Users} label="Influence" value={res.influence} />
      <StatPill icon={Cpu} label="Compute" value={res.compute} />
      <StatPill icon={Database} label="Data" value={res.data} />
      <StatPill icon={Shield} label="Ethics" value={res.ethics} />
    </div>
  );
}

function cardBackdrop(card, chapter) {
  const tone = card.type === "tech" ? "emerald" : card.type === "figure" ? "indigo" : card.type === "event" ? "amber" : "rose";
  return portraitPlaceholder(card.name, chapter.title, tone);
}

function Card({ card, canPlay, onPlay, portrait }) {
  const typeBadge = { tech: "bg-emerald-600", figure: "bg-indigo-600", event: "bg-amber-600", challenge: "bg-rose-600" }[card.type];
  const bg = portrait || cardBackdrop(card, { title: "" });
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow dark:border-slate-800 dark:bg-slate-950">
      <div className="h-28 bg-cover bg-center" style={{ backgroundImage: bg }} />
      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-base font-semibold">{card.name}</div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${typeBadge}`}>{card.type}</span>
        </div>
        <div className="min-h-12 text-[13px] leading-snug opacity-90">{card.fact || card.prompt}</div>
        {card.passive && <div className="mt-1 text-[11px]">Passive: {fmt(card.passive)}</div>}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <div>Cost: {fmt(card.cost || {})}</div>
          {card.gain && <div>Gain: {fmt(card.gain)}</div>}
        </div>
        <button onClick={() => onPlay(card)} disabled={!canPlay} className={`mt-2 w-full rounded-lg px-3 py-2 text-sm font-medium ${canPlay ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`}>
          {card.type === "challenge" ? "Attempt" : "Play"}
        </button>
      </div>
    </div>
  );
}

function Cutscene({ open, onClose, text, title, backdrop }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-100" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
            <div className="h-32 bg-cover bg-center" style={{ backgroundImage: backdrop }} />
            <div className="p-4">
              <div className="mb-2 text-lg font-semibold">{title}</div>
              <p className="text-sm opacity-90">{text}</p>
              <button onClick={onClose} className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-white">Continue</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TutorialModal({ open, onStart }) {
  const [i, setI] = useState(0);
  const slides = [
    { t: "Welcome", s: "Recover the Codex by playing cards and completing challenges." },
    { t: "Resources", s: "Knowledge, Influence, Compute, Data, Ethics. Costs must be paid to play cards." },
    { t: "Cards", s: "Tech, Figure, Event add gains or passives. Challenge cards open quizzes, drags, clouds, figures, pseudocode." },
    { t: "Progress", s: "Play required cards to complete a chapter. Difficulty changes costs and draw rate." },
  ];
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-2 text-lg font-semibold">{slides[i].t}</div>
        <div className="text-sm opacity-90">{slides[i].s}</div>
        <div className="mt-4 flex items-center justify-between">
          <button disabled={i===0} onClick={() => setI(i-1)} className="rounded bg-slate-200 px-3 py-2 text-sm disabled:opacity-50">Back</button>
          {i < slides.length - 1 ? (
            <button onClick={() => setI(i+1)} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Next</button>
          ) : (
            <button onClick={onStart} className="rounded bg-emerald-600 px-3 py-2 text-sm text-white">Start Game</button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChallengeModal({ open, card, onResolve, difficulty }) {
  const [mcqSel, setMcqSel] = useState(null);
  const [order, setOrder] = useState([]);
  const [cloudSel, setCloudSel] = useState([]);
  const tol = DIFFICULTY_PRESETS[difficulty]?.challengeTolerance || 0;
  useEffect(() => { if (!card) return; setMcqSel(null); setOrder(card?.meta?.items || []); setCloudSel([]); }, [card?.id, open]);
  if (!open || !card) return null;
  const { meta } = card;
  function grade() {
    let ok = false;
    if (meta.kind === "mcq") { if (Array.isArray(meta.answers)) ok = meta.answers.length === 1 ? mcqSel === meta.answers[0] : meta.answers.every((a) => mcqSel?.includes?.(a)); }
    else if (meta.kind === "drag") { ok = arraysClose(order, meta.answer, tol); }
    else if (meta.kind === "cloud") { const sel = [...cloudSel].sort(); const ans = [...meta.answer].sort(); ok = JSON.stringify(sel) === JSON.stringify(ans); }
    else if (meta.kind === "figure") { ok = mcqSel === (meta.answers?.[0] ?? -1); }
    else if (meta.kind === "pseudo") { ok = mcqSel === (meta.answers?.[0] ?? -1); }
    onResolve(ok, ok ? meta.reward : null);
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-semibold">{card.name}</div>
          <button onClick={() => onResolve(false)} className="rounded p-1 hover:bg-white/10"><X className="size-4"/></button>
        </div>
        <div className="mb-3 text-sm opacity-90">{meta.question || card.prompt}</div>
        {meta.kind === "mcq" && (
          <div className="grid gap-2">
            {meta.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-2 rounded border p-2 ${mcqSel === i ? "border-slate-900" : "border-slate-300"}`}>
                <input type="radio" name="mcq" checked={mcqSel === i} onChange={() => setMcqSel(i)} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}
        {meta.kind === "drag" && (
          <div className="grid gap-2">
            {order.map((item, idx) => (
              <div key={item} className="flex items-center justify-between rounded border p-2">
                <span className="text-sm">{item}</span>
                <div className="flex gap-1">
                  <button className="rounded bg-slate-200 px-2 py-1 text-xs" onClick={() => move(order, setOrder, idx, -1)}>↑</button>
                  <button className="rounded bg-slate-200 px-2 py-1 text-xs" onClick={() => move(order, setOrder, idx, +1)}>↓</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {meta.kind === "cloud" && (
          <div className="flex flex-wrap gap-2">
            {meta.tokens.map((t) => {
              const sel = cloudSel.includes(t);
              return (
                <button key={t} className={`rounded-full px-2 py-1 text-[12px] ${sel ? "bg-slate-900 text-white" : "bg-slate-200"}`} onClick={() => setCloudSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}>
                  {t}
                </button>
              );
            })}
          </div>
        )}
        {meta.kind === "figure" && (
          <div className="grid gap-2">
            {meta.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-2 rounded border p-2 ${mcqSel === i ? "border-slate-900" : "border-slate-300"}`}>
                <input type="radio" name="fig" checked={mcqSel === i} onChange={() => setMcqSel(i)} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
            <div className="rounded bg-slate-100 p-3 text-center text-xs">C ≈ log2(1+SNR)</div>
          </div>
        )}
        {meta.kind === "pseudo" && (
          <div className="grid gap-2">
            {meta.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-2 rounded border p-2 ${mcqSel === i ? "border-slate-900" : "border-slate-300"}`}>
                <input type="radio" name="ps" checked={mcqSel === i} onChange={() => setMcqSel(i)} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
            <pre className="mt-1 whitespace-pre-wrap rounded bg-slate-100 p-2 text-[11px]">{`open=[start]\nwhile open:\n  n = argmin_f(open)\n  if n==goal: return path`}</pre>
          </div>
        )}
        <button onClick={grade} className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-white">Submit</button>
      </div>
    </div>
  );
}

function SettingsModal({ open, onClose, settings, setSettings, onSave, onLoad }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-semibold">Settings</div>
          <button onClick={onClose} className="rounded p-1 hover:bg-white/10"><X className="size-4"/></button>
        </div>
        <div className="grid gap-3">
          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <select className="mt-1 w-full rounded border p-2" value={draft.difficulty} onChange={(e) => setDraft({ ...draft, difficulty: e.target.value })}>
              {Object.keys(DIFFICULTY_PRESETS).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium flex items-center gap-2"><Music className="size-4"/> Background music URL</label>
            <input className="w-full rounded border p-2" placeholder="https://…/music.mp3" value={draft.musicUrl || ""} onChange={(e) => setDraft({ ...draft, musicUrl: e.target.value })} />
            <label className="text-sm font-medium flex items-center gap-2"><VolumeX className="size-4"/> Voiceover URL</label>
            <input className="w-full rounded border p-2" placeholder="https://…/voiceover.mp3" value={draft.voiceUrl || ""} onChange={(e) => setDraft({ ...draft, voiceUrl: e.target.value })} />
            <label className="mt-2 inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!draft.audioEnabled} onChange={(e) => setDraft({ ...draft, audioEnabled: e.target.checked })}/> Enable audio</label>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => { setSettings(draft); onClose(); }} className="rounded-lg bg-slate-900 px-3 py-2 text-white">Apply</button>
          <button onClick={onClose} className="rounded-lg bg-slate-200 px-3 py-2">Cancel</button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <button onClick={onSave} className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-white"><Save className="size-4"/>Save</button>
          <button onClick={onLoad} className="flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-white"><Upload className="size-4"/>Load</button>
          <a download={`algocodex-${Date.now()}.json`} href={makeDownloadHref(localStorage.getItem(LS_KEY))} className="flex items-center justify-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-white"><Download className="size-4"/>Export</a>
        </div>
      </div>
    </div>
  );
}

function DevTestPanel({ run, results }) {
  return (
    <div className="mx-auto my-3 max-w-xl rounded-2xl border bg-white p-3 text-slate-900 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><BugIcon className="size-4"/> Dev / Test Panel</div>
      <button onClick={run} className="rounded bg-slate-900 px-3 py-2 text-xs text-white">Run tests</button>
      <pre className="mt-2 whitespace-pre-wrap text-[11px]">{results}</pre>
    </div>
  );
}

export default function CodexAlgo() {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [turn, setTurn] = useState(1);
  const [res, setRes] = useState({ ...START_RES });
  const [hand, setHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [played, setPlayed] = useState({});
  const [progress, setProgress] = useState(0);
  const [cutscene, setCutscene] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ difficulty: "Medium", musicUrl: "", voiceUrl: "", audioEnabled: false, useSynth: true });
  const [showTests, setShowTests] = useState(false);
  const [testOut, setTestOut] = useState("");
  const [showLanding, setShowLanding] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [pendingStart, setPendingStart] = useState(null);

  const chapter = CHAPTERS[chapterIdx];

  const musicRef = useRef(null);
  const voiceRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (!settings.audioEnabled) return stopAllAudio();
    if (settings.musicUrl) {
      if (musicRef.current) {
        musicRef.current.src = settings.musicUrl;
        musicRef.current.loop = true;
        musicRef.current.volume = 0.3;
        musicRef.current.play().catch(() => {});
      }
    } else if (settings.useSynth) {
      if (!synthRef.current) synthRef.current = new SynthwaveEngine();
      synthRef.current.start();
    }
    if (voiceRef.current && settings.voiceUrl) {
      voiceRef.current.src = settings.voiceUrl;
      voiceRef.current.volume = 0.7;
    }
  }, [settings.audioEnabled, settings.musicUrl, settings.voiceUrl, settings.useSynth]);

  function stopAllAudio() {
    try { musicRef.current && musicRef.current.pause(); } catch {}
    try { if (synthRef.current) synthRef.current.stop(); } catch {}
  }

  useEffect(() => { initChapter(chapterIdx, chapterIdx === 0 ? { ...START_RES } : addRes(res, { knowledge: 1 })); }, [chapterIdx]);

  function initChapter(idx, nextRes) {
    const ch = CHAPTERS[idx];
    const fresh = shuffle([...ch.deck]);
    const drawCount = 4 + (DIFFICULTY_PRESETS[settings.difficulty]?.draw || 1) - 1;
    setDeck(fresh);
    setDiscard([]);
    setHand(fresh.slice(0, drawCount));
    setPlayed({});
    setProgress(0);
    setRes(nextRes);
    setCutscene({ title: ch.title, text: ch.scene, backdrop: ch.portrait });
  }

  function save() {
    const payload = { v: VERSION, chapterIdx, turn, res, hand, deck, discard, played, progress, settings };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }
  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s?.v?.startsWith("codex_")) {
        setChapterIdx(s.chapterIdx || 0);
        setTurn(s.turn || 1);
        setRes(s.res || START_RES);
        setHand(s.hand || []);
        setDeck(s.deck || []);
        setDiscard(s.discard || []);
        setPlayed(s.played || {});
        setProgress(s.progress || 0);
        setSettings(s.settings || settings);
        setShowLanding(false);
      }
    } catch (e) {
      console.warn("Load failed", e);
    }
  }

  function draw(n = 1) {
    let d = [...deck];
    let h = [...hand];
    let disc = [...discard];
    for (let i = 0; i < n; i++) {
      if (d.length === 0) { d = shuffle(disc); disc = []; }
      if (d.length > 0) h.push(d.shift());
    }
    setDeck(d); setHand(h); setDiscard(disc);
  }

  function endTurn() {
    const passive = Object.entries(played)
      .filter(([id]) => chapter.deck.find((c) => c.id === id && c.type === "figure"))
      .map(([id]) => chapter.deck.find((c) => c.id === id)?.passive || {})
      .reduce((acc, p) => addRes(acc, p), {});
    setRes((r) => addRes(r, passive));
    setTurn((t) => t + 1);
    draw(1);
  }

  function playCard(card) {
    const costMul = DIFFICULTY_PRESETS[settings.difficulty]?.costMul || 1;
    const scaledCost = scaleCost(card.cost, costMul);
    if (card.type === "challenge") {
      if (!canPay(res, scaledCost)) return;
      setRes((r) => pay(r, scaledCost));
      setChallenge(card);
      return;
    }
    if (!canPay(res, scaledCost)) return;
    setRes((r) => addRes(pay(r, scaledCost), card.gain || {}));
    setPlayed((p) => ({ ...p, [card.id]: true }));
    const isRequired = chapter.required.includes(card.id);
    const delta = isRequired ? 20 : 10;
    setProgress((x) => clamp(x + delta, 0, 100));
    setHand((h) => h.filter((c) => c.id !== card.id));
    setDiscard((d) => [card, ...d]);
    draw(1);
  }

  function resolveChallenge(success, reward) {
    setChallenge(null);
    if (success) {
      setRes((r) => addRes(r, reward || {}));
      setProgress((x) => clamp(x + 15, 0, 100));
    }
  }

  const chapterComplete = chapter.required.every((id) => played[id]);
  useEffect(() => {
    if (chapterComplete || progress >= 100) {
      if (chapterIdx < CHAPTERS.length - 1) {
        setCutscene({ title: `${chapter.title} — Complete`, text: `Your Codex pages are secured. Next: ${CHAPTERS[chapterIdx + 1].title}.`, backdrop: CHAPTERS[chapterIdx + 1].portrait });
      } else {
        setCutscene({ title: "The Grand Assembly — Codex Complete", text: "You present the restored Codex beside pioneers from Al‑Khwarizmi to Hinton. The hall erupts in applause.", backdrop: chapter.portrait });
      }
    }
  }, [chapterComplete]);

  function proceedAfterCutscene() {
    if (chapterComplete || progress >= 100) {
      if (chapterIdx < CHAPTERS.length - 1) setChapterIdx((i) => i + 1);
      setCutscene(null);
    } else {
      setCutscene(null);
    }
  }

  function beginGame() {
    const opts = pendingStart || { difficulty: "Medium", audio: true };
    const nextSettings = { ...settings, difficulty: opts.difficulty, audioEnabled: opts.audio, useSynth: true };
    setSettings(nextSettings);
    setShowLanding(false);
    setShowTutorial(false);
    initChapter(0, { ...START_RES });
    setTurn(1);
  }

  function startNewGame(opts) {
    setPendingStart(opts);
    setShowTutorial(true);
  }

  function resetGame() {
    setChapterIdx(0); setTurn(1); setRes({ ...START_RES });
    setDeck([]); setHand([]); setDiscard([]); setPlayed({}); setProgress(0);
    setCutscene(null); setChallenge(null);
    localStorage.removeItem(LS_KEY);
    setShowLanding(true);
    stopAllAudio();
  }

  function runTests() {
    const logs = [];
    const a = arraysClose(["a","b"],["a","b"],0);
    const b = arraysClose(["a","b"],["b","a"],0);
    logs.push(`arraysClose exact: ${a}, wrong order: ${b}`);
    const c = JSON.stringify(scaleCost({knowledge:10, data:5}, 1.2));
    logs.push(`scaleCost 1.2: ${c}`);
    const can = canPay({knowledge:5},{knowledge:5});
    logs.push(`canPay exact: ${can}`);
    const cannot = canPay({knowledge:4},{knowledge:5});
    logs.push(`canPay insufficient: ${cannot}`);
    const after = pay({knowledge:5},{knowledge:3});
    logs.push(`pay: knowledge=${after.knowledge}`);
    const added = addRes({knowledge:1},{knowledge:2, data:1});
    logs.push(`addRes: knowledge=${added.knowledge}, data=${added.data}`);
    const id1 = extractYouTubeId('https://www.youtube.com/watch?v=j_pOkYjjvX8');
    const id2 = extractYouTubeId('https://youtu.be/j_pOkYjjvX8');
    const id3 = extractYouTubeId('https://www.youtube.com/embed/j_pOkYjjvX8');
    const id4 = extractYouTubeId('not a url');
    logs.push(`yt ids: ${id1}, ${id2}, ${id3}, invalid:${id4}`);
    const dl = makeDownloadHref('{"ok":true}');
    logs.push(`download href ok: ${String(dl).startsWith('data:application/json')}`);
    const shuf = shuffle([1,2,3,4]);
    logs.push(`shuffle size: ${shuf.length}`);
    const scaledZero = scaleCost({}, 2.5);
    logs.push(`scaleCost empty: ${JSON.stringify(scaledZero)}`);
    const payOver = pay({knowledge:1},{knowledge:5});
    logs.push(`pay clamp non-negative: ${payOver.knowledge}`);
    setTestOut(logs.join("\n"));
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
        <TopBar chapter={chapter} turn={turn} onReset={resetGame} onSettings={() => setSettingsOpen(true)} />
        <audio ref={musicRef} />
        <audio ref={voiceRef} />
        <LandingModal open={showLanding} hasSave={!!localStorage.getItem(LS_KEY)} onContinue={load} onStart={startNewGame} />
        <TutorialModal open={showTutorial} onStart={beginGame} />
        <YouTubeDock initialList={["j_pOkYjjvX8"]} />
        <div className={`mx-auto mt-3 max-w-xl overflow-hidden rounded-2xl bg-gradient-to-r ${chapter.bg}`}>
          <div className="h-28 bg-cover bg-center" style={{ backgroundImage: chapter.portrait }} />
          <div className="p-3">
            <div className="text-sm font-semibold">The Codex of Algorithms</div>
            <div className="text-xs opacity-80">Recover the chapters across eras; play knowledge cards, tackle challenges, and complete the Codex. Difficulty: {settings.difficulty}</div>
          </div>
        </div>
        <div className="mx-auto max-w-xl">
          <ResourceRow res={res} />
          <div className="rounded-2xl bg-white p-3 shadow dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Chapter Progress</div>
              <div className="text-xs opacity-70">Required cards: {chapter.required.length - chapter.required.filter((id) => played[id]).length} left</div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-slate-900" style={{ width: `${progress}%` }} /></div>
            {chapterComplete && (<div className="mt-2 flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 className="size-4"/> Chapter complete!</div>)}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {hand.map((card) => (
              <Card key={card.id} card={card} onPlay={playCard} canPlay={canPay(res, scaleCost(card.cost, DIFFICULTY_PRESETS[settings.difficulty]?.costMul || 1))} portrait={cardBackdrop(card, chapter)} />
            ))}
          </div>
          <div className="mx-auto my-4 flex max-w-xl items-center justify-between gap-2">
            <button onClick={() => draw(1)} className="rounded-xl bg-white/80 px-3 py-2 text-sm shadow hover:bg-white dark:bg-slate-800/80">Draw</button>
            <div className="flex gap-2">
              <button onClick={save} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow"><Save className="mr-1 inline size-4"/>Save</button>
              <button onClick={load} className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow"><Upload className="mr-1 inline size-4"/>Load</button>
            </div>
            <button onClick={endTurn} className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow"><Play className="size-4" /> End Turn</button>
          </div>
          <div className="mb-6 text-center">
            <button onClick={() => setShowTests((s) => !s)} className="text-xs underline">{showTests ? "Hide" : "Show"} tests</button>
            {showTests && <DevTestPanel run={runTests} results={testOut} />}
          </div>
        </div>
        <Cutscene open={!!cutscene} onClose={proceedAfterCutscene} title={cutscene?.title} text={cutscene?.text} backdrop={cutscene?.backdrop} />
        <ChallengeModal open={!!challenge} card={challenge} onResolve={resolveChallenge} difficulty={settings.difficulty} />
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} setSettings={setSettings} onSave={save} onLoad={load} />
        <footer className="mx-auto mb-6 max-w-xl px-3 text-center text-[11px] opacity-70">Single‑file build for Notion/Super. Local save in browser. Synthwave soundtrack when audio is enabled.</footer>
        <style>{`@media (prefers-color-scheme: dark) { :root { color-scheme: dark; } }`}</style>
      </div>
    </ErrorBoundary>
  );
}

function move(arr, setArr, idx, dir) { const out = [...arr]; const j = idx + dir; if (j < 0 || j >= out.length) return; [out[idx], out[j]] = [out[j], out[idx]]; setArr(out); }
function arraysClose(a, b, tol = 0) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function scaleCost(cost, mul) { const out = {}; for (const [k, v] of Object.entries(cost || {})) out[k] = Math.ceil(v * mul); return out; }
function makeDownloadHref(text) { return `data:application/json;charset=utf-8,${encodeURIComponent(text || "{}\n")}`; }

class SynthwaveEngine { constructor() { this.ctx = null; this.timer = null; this.master = null; this.filter = null; this.step = 0; } start() { if (this.ctx) return; const ctx = new (window.AudioContext || window.webkitAudioContext)(); this.ctx = ctx; const master = ctx.createGain(); master.gain.value = 0.15; master.connect(ctx.destination); this.master = master; const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 1200; filter.Q.value = 0.7; filter.connect(master); this.filter = filter; const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain(); lfo.frequency.value = 0.1; lfoGain.gain.value = 400; lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start(); this.timer = setInterval(() => this.tick(), 400); } stop() { if (this.timer) clearInterval(this.timer); this.timer = null; if (this.ctx) { try { this.ctx.close(); } catch {} } this.ctx = null; this.master = null; this.filter = null; this.step = 0; } note(freq, dur = 0.35) { if (!this.ctx) return; const t = this.ctx.currentTime; const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(freq, t); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(this.filter); o.start(t); o.stop(t + dur + 0.05); } bass(freq, dur = 0.6) { if (!this.ctx) return; const t = this.ctx.currentTime; const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = "square"; o.frequency.setValueAtTime(freq / 2, t); const f = this.ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 400; o.connect(f); f.connect(g); g.connect(this.filter); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur + 0.05); } tick() { const scale = [110, 130.81, 146.83, 174.61, 220, 261.63, 293.66]; const root = scale[0]; const chord = [[0,3,5],[0,2,5],[0,3,6],[0,2,4]][this.step % 4].map(i => scale[i]); chord.forEach((f, i) => this.note(f * (i?1:0.5), 0.3 + i*0.05)); this.bass(root, 0.5); this.step++; } }

function LandingModal({ open, hasSave, onContinue, onStart }) { const [difficulty, setDifficulty] = useState("Medium"); const [audio, setAudio] = useState(true); if (!open) return null; return (<div className="fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-slate-900/90 to-purple-900/90 p-4"><div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/95 text-slate-900 shadow-xl backdrop-blur dark:bg-slate-900/95 dark:text-slate-100"><div className="h-28 bg-gradient-to-r from-fuchsia-600 to-indigo-700" /><div className="p-4"><div className="text-lg font-semibold">Codex of Algorithms</div><p className="mt-1 text-sm opacity-80">A single‑player, story‑driven card game. Recover the Codex from Al‑Khwarizmi to Transformers.</p><div className="mt-4 grid gap-3"><div><label className="text-sm font-medium">Difficulty</label><select className="mt-1 w-full rounded border p-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>{Object.keys(DIFFICULTY_PRESETS).map((k) => (<option key={k} value={k}>{k}</option>))}</select></div><label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={audio} onChange={(e) => setAudio(e.target.checked)} /> Enable synthwave soundtrack</label></div><div className="mt-4 grid grid-cols-2 gap-2">{hasSave && <button onClick={onContinue} className="rounded-lg bg-indigo-600 px-3 py-2 text-white">Continue</button>}<button onClick={() => onStart({ difficulty, audio })} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">Start</button></div></div></div></div>); }
function extractYouTubeId(u){ try{ const url=new URL(u); if(url.hostname.includes('youtu.be')) return url.pathname.slice(1); if(url.searchParams.get('v')) return url.searchParams.get('v'); const m=u.match(/embed\/([a-zA-Z0-9_-]{5,})/); return m?m[1]:null; }catch{return null;} }
function YouTubeDock({ initialList=[] }){ const [open,setOpen]=useState(true); const [ids,setIds]=useState(initialList); const [i,setI]=useState(0); const [muted,setMuted]=useState(true); const [playing,setPlaying]=useState(false); const [input,setInput]=useState('https://www.youtube.com/watch?v='+ (initialList[0]||'j_pOkYjjvX8')); const id=ids[i]||'j_pOkYjjvX8'; const src=`https://www.youtube.com/embed/${id}?autoplay=1&controls=1&mute=${muted?1:0}&enablejsapi=1&origin=${location.origin}`; useEffect(()=>{ const onKey=(e)=>{ if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return; const k=e.key.toLowerCase(); if(k==='k') togglePlay(); else if(k==='m') toggleMute(); else if(k==='.'||k===']') next(); else if(k===','||k==='[') prev(); }; window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey); },[ids,i,muted,playing]); function addUrl(){ const vid=extractYouTubeId(input); if(!vid) return; setIds((arr)=> arr.includes(vid)?arr:[...arr, vid]); setI((arr)=> (ids.length)); } function next(){ setI((x)=> (x+1)%Math.max(1,ids.length)); } function prev(){ setI((x)=> (x-1+Math.max(1,ids.length))%Math.max(1,ids.length)); } function post(cmd){ const f=document.getElementById('yt-iframe'); if(!f) return; f.contentWindow.postMessage(JSON.stringify({event:'command',func:cmd}), '*'); } function togglePlay(){ if(playing){ post('pauseVideo'); setPlaying(false); } else { post('playVideo'); setPlaying(true); } } function toggleMute(){ post(muted?'unMute':'mute'); setMuted(!muted); } return (<div className="fixed bottom-3 right-3 z-50 select-none" style={{pointerEvents:'auto'}}> <div className="mb-2 flex items-center justify-end gap-2"> <button title="Previous (,[)" onClick={prev} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80"><SkipBack className="size-4"/></button> <button title="Play/Pause (K)" onClick={togglePlay} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80"><Pause className="size-4"/></button> <button title="Next (.] )" onClick={next} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80"><SkipForward className="size-4"/></button> <button title="Mute/Unmute (M)" onClick={toggleMute} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80">{muted?<VolumeX className="size-4"/>:<Volume2 className="size-4"/>}</button> <button title="Show/Hide Player" onClick={()=>setOpen(!open)} className="rounded-lg bg-slate-900 px-2 py-2 text-xs text-white">{open?"Hide":"Show"}</button> </div> {open && (<div className="rounded-xl bg-black/60 p-1 shadow-xl backdrop-blur-sm"> <iframe id="yt-iframe" className="h-28 w-48 rounded-lg" src={src} allow="autoplay; encrypted-media" title="Soundtrack"/> </div>)} <div className="mt-2 flex items-center justify-end gap-2"> <input value={input} onChange={(e)=>setInput(e.target.value)} className="w-56 rounded-lg border bg-white/90 p-2 text-xs text-slate-900 shadow dark:bg-slate-800/80 dark:text-slate-100" placeholder="Paste YouTube URL" title="Paste a YouTube link; K play/pause • M mute • [,] prev/next"/> <button onClick={addUrl} className="rounded-lg bg-emerald-600 px-2 py-2 text-xs text-white">Add</button> <a className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80" href={`https://www.youtube.com/results?search_query=${encodeURIComponent('synthwave cyberpunk')}`} target="_blank" rel="noreferrer" title="Open YouTube search"><Search className="size-4"/></a> </div> </div> ); }
