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
  Search,
  HelpCircle
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
  title: "Baghdad – The City of Knowledge",
    years: "800–1100",
  scene: "The air is warm with spices, parchment, and ink. Our heroes step from a shimmering portal into 9th‑century Baghdad at its golden peak. Minarets rise; scholars debate under archways. The Codex of Algorithms lies hidden within the House of Wisdom—if history can be kept on course.",
    required: ["hindu-arabic", "algebra", "algorithm", "al-khwarizmi"],
    deck: [
      // Opening sequence - always available
      cEvent("arrival-tigris", "Arrival at the Tigris", { influence: 1 }, 0, "You emerge from the portal on a terrace overlooking Baghdad's golden domes. The air hums with scholarly debate and distant calls to prayer."),
      cEvent("location-grand-bazaar", "The Grand Bazaar", { influence: 1 }, 0, "Baghdad's bustling market — a crossroads of merchants, scholars, and secrets. Navigate its stalls to begin your quest for the Codex."),
      
      // Core required cards with enhanced narrative
      cFigure("al-khwarizmi", "Al‑Khwarizmi", { knowledge: 2 }, { knowledge: 1 }, "The Persian mathematician works tirelessly in the House of Wisdom, unknowing that his algorithms will echo through time to shape your world's survival."),
      cTech("hindu-arabic", "Hindu‑Arabic Numerals", { knowledge: 3, influence: 1 }, 2, "The revolutionary zero and place-value system. Al-Khwarizmi's treatise on Indian numerals will transform calculation forever."),
      cTech("algebra", "Algebraic Methods", { knowledge: 4 }, 2, "Al-jabr wa'l muqābala - restoration and completion. The systematic method of solving equations through symbolic manipulation."),
      cTech("algorithm", "Algorithmic Procedure", { knowledge: 4, data: 1 }, 2, "From 'Al-Khwarizmi' comes 'algorithm' - a finite sequence of unambiguous steps that will define computation itself."),
      
      // Story progression cards
      cEvent("translation-movement", "Translation Movement", { influence: 2, knowledge: 1 }, 1, "Greek, Persian, and Sanskrit texts flow into Arabic. Knowledge crosses cultures like water finding its level."),
      cEvent("paper-mills", "Paper Mills of Baghdad", { data: 2 }, 1, "Chinese papermaking technology reaches Baghdad. Knowledge can now be copied and preserved at unprecedented scale."),
      
      // Enhanced challenges with better narrative integration
      cChallenge("wisdom-keeper", "The Wisdom Keeper's Test", { knowledge: 1 }, 
        { 
          kind: "mcq", 
          question: "Al-Khwarizmi's 'al-jabr' refers to which mathematical operation?", 
          options: ["Adding terms to both sides", "Subtracting negatives", "Multiplying by constants", "Dividing fractions"], 
          answers: [0], 
          reward: { knowledge: 3 } 
        }, 
        "A learned scribe tests your understanding of the new algebraic methods."
      ),
      
      cChallenge("quiz-ch1", "Scribe's Quiz", { knowledge: 0 },
        {
          kind: "mcq",
          answers: [0],
          options: [
            "al‑jabr (restoration: adding to both sides)",
            "gradient (from calculus)",
            "data pipeline (software ops)"
          ],
          question: "In al‑Khwarizmi's algebra, what does 'al‑jabr' refer to?",
          reward: { knowledge: 3 }
        },
        "Hint: 'al‑jabr' literally means restoration (balancing)."
      ),
      
      // Historical context challenges
      cChallenge("quiz-baghdad-empire", "Capital Builders", { knowledge: 0 },
        { kind: "mcq", question: "Which empire built Baghdad as its capital?", options: ["Roman", "Abbasid", "Byzantine", "Ottoman"], answers: [1], reward: { knowledge: 2 } },
        "Navigate the Grand Bazaar by recalling who founded the city."
      ),
      
      cChallenge("tf-house-of-wisdom-1258", "Siege of 1258", { knowledge: 0 },
        { kind: "mcq", question: "True or False — The House of Wisdom was destroyed in 1258 by the Mongols.", options: ["True", "False"], answers: [0], reward: { knowledge: 2 } },
        "History turns on a siege."
      ),
      
      // Paradox tension cards
      cEvent("mongol-whispers", "Whispers from the East", { ethics: -1, influence: 1 }, 1, "Disturbing rumors reach Baghdad of horsemen beyond the Oxus. The timeline feels... different."),
      
      cChallenge("paradox-warning", "Timeline Strain", { ethics: 2 }, 
        { 
          kind: "mcq", 
          question: "To minimize paradox, you should:", 
          options: ["Change major events", "Work behind the scenes", "Reveal future knowledge", "Stop all progress"], 
          answers: [1], 
          reward: { ethics: 2, influence: 1 } 
        }, 
        "Your presence causes ripples. How do you proceed without breaking history?"
      ),
    deck: [
      cTech("hindu-arabic", "Hindu‑Arabic Numerals", { knowledge: 3, influence: 1 }, 2, "Base‑10 positional system with a symbol for zero enables efficient addition/multiplication and long‑distance accounting. Replaces additive Roman numerals for algorithms like long division."),
      cTech("algebra", "Algebraic Methods", { knowledge: 4 }, 2, "al‑jabr (restoration) and al‑muqabala (balancing) formalize solving linear/quadratic equations by symbolic steps; general recipes independent of specific numbers."),
      cTech("algorithm", "Algorithmic Procedure", { knowledge: 4, data: 1 }, 2, "A finite sequence of unambiguous steps. Inputs→Outputs with correctness and termination criteria; paves the way for proofs about procedures."),
      cFigure("al-khwarizmi", "Al‑Khwarizmi", { knowledge: 2 }, { knowledge: 1 }, "9th‑century scholar at Bayt al‑Hikma; wrote 'Hisab al‑Jabr wa‑l‑Muqabala' and astronomical/astrolabe treatises; Latin translations seed Europe."),
      cEvent("translation-movement", "Translation Movement", { influence: 2, knowledge: 1 }, 1, "Scholars translate Sanskrit/Greek/Persian works into Arabic and Latin; paper, numerals, and methods diffuse via Andalusia and Sicily."),
    // Scene 1: House of Wisdom (required cards)
    cTech("hindu-arabic", "Hindu‑Arabic Numerals", { knowledge: 3, influence: 1 }, 2, "Base‑10 positional system with a symbol for zero enables efficient addition/multiplication and long‑distance accounting. Replaces additive Roman numerals for algorithms like long division."),
    cTech("algebra", "Algebraic Methods", { knowledge: 4 }, 2, "al‑jabr (restoration) and al‑muqabala (balancing) formalize solving linear/quadratic equations by symbolic steps; general recipes independent of specific numbers."),
    cTech("algorithm", "Algorithmic Procedure", { knowledge: 4, data: 1 }, 2, "A finite sequence of unambiguous steps. Inputs→Outputs with correctness and termination criteria; paves the way for proofs about procedures."),
    cFigure("al-khwarizmi", "Al‑Khwarizmi", { knowledge: 2 }, { knowledge: 1 }, "9th‑century scholar at Bayt al‑Hikma; wrote 'Hisab al‑Jabr wa‑l‑Muqabala' and astronomical/astrolabe treatises; Latin translations seed Europe."),
    cEvent("translation-movement", "Translation Movement", { influence: 2, knowledge: 1 }, 1, "Scholars translate Sanskrit/Greek/Persian works into Arabic and Latin; paper, numerals, and methods diffuse via Andalusia and Sicily."),
    // Gameplay Integration cards
    cEvent("intro-alkhwarizmi", "Character Introduction", { knowledge: 1 }, 0, "The Persian mathematician who formalized the concept of the algorithm and laid the foundations of algebra in Baghdad’s House of Wisdom."),
    cEvent("baghdad-culture", "Baghdad Culture", { influence: 1 }, 0, "The House of Wisdom — a grand library and translation center where scholars from many cultures worked together."),
    cEvent("algorithm-origins", "Algorithm Origins", { knowledge: 1 }, 0, "A step‑by‑step procedure for solving a problem."),
    // Scene 2: Grand Bazaar
    cEvent("location-grand-bazaar", "The Grand Bazaar", { influence: 1 }, 0, "Baghdad’s bustling market — a crossroads of merchants, scholars, and secrets. Navigate its stalls to begin your quest for the Codex."),
      // Gameplay Integration cards
      cEvent("intro-alkhwarizmi", "Character Introduction", { knowledge: 1 }, 0, "The Persian mathematician who formalized the concept of the algorithm and laid the foundations of algebra in Baghdad’s House of Wisdom."),
      cEvent("baghdad-culture", "Baghdad Culture", { influence: 1 }, 0, "The House of Wisdom — a grand library and translation center where scholars from many cultures worked together."),
      cEvent("algorithm-origins", "Algorithm Origins", { knowledge: 1 }, 0, "A step‑by‑step procedure for solving a problem."),
      // Scene quizzes
      cChallenge(
        "quiz-baghdad-empire",
        "Capital Builders",
        { knowledge: 0 },
        { kind: "mcq", question: "Which empire built Baghdad as its capital?", options: ["Roman", "Abbasid", "Byzantine", "Ottoman"], answers: [1], reward: { knowledge: 2 } },
        "Navigate the Grand Bazaar by recalling who founded the city."
      ),
      cChallenge(
        "tf-house-of-wisdom-1258",
        "Siege of 1258",
        { knowledge: 0 },
        { kind: "mcq", question: "True or False — The House of Wisdom was destroyed in 1258 by the Mongols.", options: ["True", "False"], answers: [0], reward: { knowledge: 2 } },
        "History turns on a siege."
      ),
      cChallenge(
        "fib-algebra",
        "Foundations Check",
        { knowledge: 0 },
        { kind: "mcq", question: "Al‑Khwarizmi’s work helped develop the field of ________.", options: ["Geometry", "Algebra", "Astronomy", "Medicine"], answers: [1], reward: { knowledge: 2 } },
        "Think al‑jabr (restoration)."
      ),
      cChallenge(
        "quiz-ch1",
        "Scribe’s Quiz",
        { knowledge: 0 },
        {
          kind: "mcq",
          answers: [0],
          options: [
            "al‑jabr (restoration: adding to both sides)",
            "gradient (from calculus)",
            "data pipeline (software ops)"
          ],
          question: "In al‑Khwarizmi’s algebra, what does ‘al‑jabr’ refer to?",
          reward: { knowledge: 3 }
        },
        "Hint: ‘al‑jabr’ literally means restoration (balancing)."
      ),
    ],
  bg: "from-amber-100 to-emerald-100",
  portrait: `url('/assets/images/house-of-wisdom-inside-background.png')`,
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

// Approximate chronology for ordering cards within chapters
const CARD_YEARS = {
  'location-grand-bazaar': 761,
  // ch1
  'intro-alkhwarizmi': 820,
  'baghdad-culture': 800,
  'algorithm-origins': 830,
  'quiz-baghdad-empire': 762,
  'tf-house-of-wisdom-1258': 1258,
  'fib-algebra': 830,
  'translation-movement': 800,
  'hindu-arabic': 810,
  'al-khwarizmi': 820,
  'algebra': 825,
  'algorithm': 830,
  'quiz-ch1': 840,
  // ch2 (1600–1800)
  'calc-machine': 1673,
  'leibniz': 1675,
  'formal-logic': 1700,
  'correspondence': 1750,
  'drag-ch2': 1790,
  // ch3 (1800s)
  'cards': 1804,
  'analytical-engine': 1837,
  'programmability': 1840,
  'ada': 1843,
  'cloud-ch3': 1850,
  // ch4 (1930–1960)
  'turing': 1936,
  'turing-fig': 1940,
  'von-neumann': 1945,
  'info-theory': 1948,
  'figure-ch4': 1950,
  // ch5 (1956–1980)
  'search': 1968,
  'expert': 1975,
  'pseudo-ch5': 1978,
  // ch6 (1980–2010)
  'bayes': 1985,
  'ensembles': 1995,
  'svm': 1998,
  'drag-ch6': 2005,
  // ch7 (2012–2017)
  'rnn': 2013,
  'cnn': 2014,
  'attention': 2017,
  'mcq-ch7': 2017,
  // ch8 (2017–Today)
  'transformer': 2017,
  'hinton': 2018,
  'pretrain': 2019,
  'rlhf': 2020,
  'final-ch8': 2023,
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

function TopBar({ chapter, turn, onReset, onSettings, onGuide }) {
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
  <button onClick={onGuide} className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"><HelpCircle className="mr-1 inline size-3"/>Guide</button>
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
function slug(s){ return (s||"").toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function assetCandidates(card){
  const ids = [card.id, slug(card.name), card.type];
  const exts = ['png','jpg','jpeg','webp'];
  const out = [];
  // Chapter 1 explicit art mapping (prefer first)
  const mapById = {
    'algorithm': 'baghdad_algorithmic_procedure.png',
    'translation-movement': 'Baghdad_Translation_Movement.png',
    'quiz-ch1': 'baghdad_scribes_quiz.png',
    'hindu-arabic': 'baghdad_hindu_arabic_numerals.png',
    'al-khwarizmi': 'AlKhawarizmi-Baghdad.png',
  // Scene 2–4 additions
  'al-khw-intro': 'AlKhawarizmi-Baghdad.png',
  'bazaar-route': 'bazaar_quiz_challenge.png',
  'house-wisdom-tf': 'house-of-wisdom-inside-background.png',
  'alg-blank': 'baghdad_algorithmic_procedure.png',
  'archives-riddle': 'baghdad_challenge_riddle_trade.png',
  'merchant-trade': 'baghdad_merchant_negotiation.png',
  'paradox-ripple': 'baghdad_paradox_skyline.png',
  };
  const explicit = mapById[card.id];
  if (explicit) {
    out.push(`/assets/images/${explicit}`);
    out.push(`/dist/assets/images/${explicit}`);
  }
  for(const base of ids){
    for(const ext of exts){
      out.push(`/assets/images/${base}.${ext}`); // public assets (dev)
      out.push(`/dist/assets/images/${base}.${ext}`); // built assets (existing)
    }
  }
  // Add a few known files you mentioned
  const known = [
    'arrival_tigris_baghdad.png',
    'house-of-wisdom-outisde-background.png',
    'house-of-wisdom-inside-background.png',
    'baghdad_paradox_skyline.png',
    'baghdad_warning_invasion.png',
    'baghdad_success_transition.png',
    'baghdad_failure_invasion.png',
    'bazaar_quiz_challenge.png',
    'baghdad_archives_infiltration.png',
    'baghdad_merchant_negotiation.png',
    'baghdad_challenge_riddle_trade.png',
  'alkhawarizmi-question.png',
    'AlgoCivs Codex_ Voyage à travers le temps.png',
    'AlKhawarizmi-Baghdad.png',
    'Cyborgs et néons dans la ville.png',
    'House of widome.png',
    'Intro.png',
  'codex of algorithms.png',
  'neo-cairo collapse.png',
  'The codex paradox.png',
  'Activating the chrono-gate.png',
  'apocalypse.png',
    'Mongols invade heros, travel to europe.png',
    'reaching-Baghdad.png',
    'Start.png',
    'Time travel.png',
    'Translation to Latin.png'
  ];
  known.forEach((k)=>{
    out.push(`/dist/assets/images/${k}`);
  });
  return out;
}
function SmartImage({ card }){
  const [idx, setIdx] = useState(0);
  const candidates = assetCandidates(card);
  if(candidates.length===0) return null;
  const src = candidates[Math.min(idx, candidates.length-1)];
  return (
  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => setIdx(i=>i+1)} />
  );
}

function ResBadge({ k, v }) {
  const map = { knowledge: BookOpen, influence: Users, compute: Cpu, data: Database, ethics: Shield };
  const Icon = map[k] || BookOpen;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
      <Icon className="size-3"/>
      <span className="uppercase tracking-wide">{k.slice(0,3)}</span>
      <span className="font-semibold">{v}</span>
    </span>
  );
}

function Card({ card, canPlay, onPlay, portrait }) {
  const typeBadge = { tech: "bg-emerald-600", figure: "bg-indigo-600", event: "bg-amber-600", challenge: "bg-rose-600"}[card.type];
  const bg = portrait || cardBackdrop(card, { title: "" });
  return (
    <div className="group relative overflow-hidden rounded-2xl border shadow transition-transform hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800" style={{ backgroundImage: bg }}>
      {/* Full-card image fallback and gradient overlay */}
      <SmartImage card={card} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative p-3 text-slate-50">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-base font-semibold drop-shadow">{card.name}</div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${typeBadge}`}>{card.type}</span>
        </div>
        <div className="min-h-12 text-[13px] leading-snug opacity-95 drop-shadow">
          {card.fact || card.prompt}
        </div>
        {card.passive && <div className="mt-1 text-[11px] opacity-90">Passive: {fmt(card.passive)}</div>}
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap gap-1">
            {Object.entries(card.cost || {}).map(([k,v]) => (<ResBadge key={`c-${k}`} k={k} v={v}/>))}
            {Object.keys(card.cost||{}).length===0 && <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] text-white/90">No cost</span>}
          </div>
          <div className="flex flex-wrap gap-1">
            {(card.type === 'challenge' ? Object.entries(card.meta?.reward||{}) : Object.entries(card.gain||{})).map(([k,v]) => (<ResBadge key={`g-${k}`} k={k} v={v}/>))}
          </div>
        </div>
        <button onClick={() => onPlay(card)} disabled={!canPlay} className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${canPlay ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-white/30 text-white/70"}`}>
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
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="relative w-full max-w-md overflow-hidden rounded-2xl text-slate-900 shadow-lg dark:text-slate-100" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: backdrop }} />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative p-4">
              <div className="space-y-2 text-white">
                <div className="text-lg font-semibold drop-shadow">{title}</div>
                <p className="text-sm leading-relaxed text-white/95 drop-shadow">{text}</p>
                <button onClick={onClose} className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-white">Continue</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResRow({ label, obj }){
  if(!obj || Object.keys(obj).length===0) return null;
  return (
    <div className="mt-2 text-xs">
      <div className="mb-1 font-semibold">{label}</div>
      <div className="flex flex-wrap gap-1">
        {Object.entries(obj).map(([k,v])=> (<ResBadge key={`${label}-${k}`} k={k} v={v}/>))}
      </div>
    </div>
  );
}

function CardLearnModal({ open, onClose, card }) {
  if (!open || !card) return null;
  const tips = {
    tech: "Tech cards unlock conceptual or practical advances. Think definitions, properties, and why it matters.",
    figure: "Figures add a passive end‑of‑turn bonus once played—representing their ongoing influence.",
    event: "Events capture diffusion moments or infrastructure—usually quick boosts.",
    challenge: "Challenges test ideas; succeed to earn the reward.",
  };
  const summary = card.fact || card.prompt || "";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
  <div className="relative h-40">
          <SmartImage card={card}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
        </div>
        <div className="p-4">
          <div className="mb-1 text-lg font-semibold">{card.name}</div>
          <div className="text-xs mb-2 opacity-70 uppercase">{card.type}</div>
          <div className="text-sm leading-snug opacity-90">{summary}</div>
          <ResRow label="Costs" obj={card.cost} />
          <ResRow label={card.type==='challenge'? 'On success' : 'Gains'} obj={card.type==='challenge'? card.meta?.reward : card.gain} />
          {card.passive && <ResRow label="Passive each turn" obj={card.passive} />}
          <div className="mt-2 rounded bg-slate-100 p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">{tips[card.type]}</div>
          <button onClick={onClose} className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-white">Continue</button>
        </div>
      </div>
    </div>
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

function ChallengeModal({ open, card, onResolve, difficulty, onWrong }) {
  const [mcqSel, setMcqSel] = useState(null);
  const [order, setOrder] = useState([]);
  const [cloudSel, setCloudSel] = useState([]);
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [feedback, setFeedback] = useState(null); // { kind: 'success'|'error', text: string }
  const tol = DIFFICULTY_PRESETS[difficulty]?.challengeTolerance || 0;
  const maxAttempts = difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 1 : 0;
  const showHints = difficulty === 'Easy' && attemptsLeft < maxAttempts; // only after the first wrong attempt
  useEffect(() => {
    if (!card) return;
    setMcqSel(null);
    setOrder(card?.meta?.items || []);
    setCloudSel([]);
    setError("");
    setFeedback(null);
    setAttemptsLeft(maxAttempts);
  }, [card?.id, open, difficulty]);
  if (!open || !card) return null;
  const { meta } = card;
  function buildWrongExplanation() {
    try {
      if (meta.kind === 'mcq') {
        const correctIdx = Array.isArray(meta.answers) ? meta.answers[0] : -1;
        const correctText = meta.options?.[correctIdx];
        if (card.id === 'quiz-ch1') {
          if (mcqSel === 1) return "'Gradient' is a later calculus term, not part of al‑Khwarizmi’s algebra.";
          if (mcqSel === 2) return "'Data pipeline' is a modern software idea; al‑jabr is balancing by restoration.";
          return `Correct is “${correctText}” — al‑jabr means restoring balance by adding to both sides.`;
        }
        return `Correct answer: “${correctText}”.`;
      } else if (meta.kind === 'drag') {
        return `The correct order is: ${[...(meta.answer||[])].join(' → ')}.`;
      } else if (meta.kind === 'cloud') {
        return `The correct set is: ${[...(meta.answer||[])].join(', ')}.`;
      } else if (meta.kind === 'figure' || meta.kind === 'pseudo') {
        const correctIdx = Array.isArray(meta.answers) ? meta.answers[0] : -1;
        const correctText = meta.options?.[correctIdx];
        return `Correct answer: “${correctText}”.`;
      }
    } catch {}
    return 'That selection does not match the historical/technical facts.';
  }
  function grade() {
    let ok = false;
    if (meta.kind === "mcq") { if (Array.isArray(meta.answers)) ok = meta.answers.length === 1 ? mcqSel === meta.answers[0] : meta.answers.every((a) => mcqSel?.includes?.(a)); }
    else if (meta.kind === "drag") { ok = arraysClose(order, meta.answer, tol); }
    else if (meta.kind === "cloud") { const sel = [...cloudSel].sort(); const ans = [...meta.answer].sort(); ok = JSON.stringify(sel) === JSON.stringify(ans); }
    else if (meta.kind === "figure") { ok = mcqSel === (meta.answers?.[0] ?? -1); }
    else if (meta.kind === "pseudo") { ok = mcqSel === (meta.answers?.[0] ?? -1); }
    if (!ok) {
      // Wrong attempt: decrement chances, compute paradox penalty, and show explanation
      let amt = 0; let stage = undefined;
      if (attemptsLeft > 0) {
        const next = attemptsLeft - 1;
        setAttemptsLeft(next);
        if (difficulty === 'Easy') {
          if (next === 1) { amt = 3; stage = 'first'; }
          else if (next === 0) { amt = 5; stage = 'second'; }
          else { amt = 3; }
        } else {
          amt = (difficulty === 'Medium' ? 5 : 8);
        }
        const why = buildWrongExplanation();
        setFeedback({ kind: 'error', text: `${why} Paradox +${amt}.` });
        if (difficulty === 'Easy') {
          if (next === 1) setError('Hint unlocked. Be careful—one more mistake will stress the timeline.');
          else if (next === 0) setError('Final warning—paradox rising.');
          else setError('Not quite—try again.');
        } else {
          setError(`Not quite—try again.${next>0?` Attempts left: ${next}`:''}`);
        }
        if (onWrong) onWrong(amt, stage);
        // On last allowed attempt, briefly show feedback then fail
        if (next === 0) {
          setTimeout(() => onResolve(false), 900);
        }
        return;
      }
      // No chances left before grading: immediate fail
      setFeedback({ kind: 'error', text: `Paradox +${difficulty==='Hard'?8:5}.` });
      if (onWrong) onWrong(difficulty==='Hard'?8:5);
      setTimeout(() => onResolve(false), 600);
      return;
    }
    // Success path: show quick confirmation, then resolve
    setError("");
    const rewardText = meta?.reward ? ` Reward: ${fmt(meta.reward)}.` : '';
    setFeedback({ kind: 'success', text: `Correct!${rewardText}` });
    setTimeout(() => onResolve(true, meta.reward), 650);
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-semibold">{card.name}</div>
          <button onClick={() => onResolve(false)} className="rounded p-1 hover:bg-white/10"><X className="size-4"/></button>
        </div>
        {feedback && (
          <div className={`mb-2 rounded border px-3 py-2 text-xs ${feedback.kind==='success' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200' : 'border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-200'}`}>
            {feedback.text}
          </div>
        )}
        <div className="mb-3 text-sm opacity-90">{meta.question || card.prompt}</div>
        {showHints && card.prompt && /hint/i.test(card.prompt||'') && (
          <div className="mb-2 rounded bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{card.prompt}</div>
        )}
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
            {showHints && (<div className="rounded bg-slate-100 p-3 text-center text-xs">C ≈ log2(1+SNR)</div>)}
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
            {showHints && (<pre className="mt-1 whitespace-pre-wrap rounded bg-slate-100 p-2 text-[11px]">{`open=[start]\nwhile open:\n  n = argmin_f(open)\n  if n==goal: return path`}</pre>)}
          </div>
        )}
  <div className="mt-2 flex items-center justify-between">
          {error && <div className="text-xs text-rose-600">{error}</div>}
          {maxAttempts>0 && <div className="text-[11px] opacity-70">Attempts left: {attemptsLeft}</div>}
        </div>
  <button onClick={grade} disabled={meta.kind==='mcq' && mcqSel===null} className={`mt-3 w-full rounded-lg px-3 py-2 text-white ${meta.kind==='mcq' && mcqSel===null ? 'bg-emerald-600/60' : 'bg-emerald-600'}`}>Submit</button>
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

function DifficultyModal({ open, defaultDifficulty='Medium', onPick }){
  const [choice, setChoice] = useState(defaultDifficulty);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-2 text-lg font-semibold">Choose Difficulty</div>
        <select className="w-full rounded border p-2" value={choice} onChange={(e)=>setChoice(e.target.value)}>
          {Object.keys(DIFFICULTY_PRESETS).map(k => (<option key={k} value={k}>{k}</option>))}
        </select>
        <ul className="mt-3 list-disc pl-5 text-xs opacity-80">
          <li>Easy: 2 chances, hints after first wrong.</li>
          <li>Medium: 1 chance, no hints.</li>
          <li>Hard: 0 chances, no hints.</li>
        </ul>
        <button onClick={()=>onPick(choice)} className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-white">Continue</button>
      </div>
    </div>
  );
}

function GuideModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-semibold">Guide</div>
          <button onClick={onClose} className="rounded p-1 hover:bg-white/10"><X className="size-4"/></button>
        </div>
        <div className="grid gap-3 text-sm">
          <div>
            <div className="font-semibold mb-1">Resources</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Knowledge</span>: scholarly understanding; pay to unlock tech; fuels general progress.</li>
              <li><span className="font-medium">Influence</span>: social capital; helps unlock figures/events and later conference gains.</li>
              <li><span className="font-medium">Compute</span>: hardware capability; needed for modern techniques (DL/Transformers).</li>
              <li><span className="font-medium">Data</span>: datasets and representations; pays for information‑heavy advances.</li>
              <li><span className="font-medium">Ethics</span>: alignment and safety; enables RLHF/alignment and balances growth.</li>
            </ul>
            <div className="mt-2 text-xs opacity-80">Cards show their cost on the left and their immediate gain (or challenge reward) on the right.</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Card types</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Tech</span>: one‑time gains and progress.</li>
              <li><span className="font-medium">Figure</span>: unlocks a passive bonus each end of turn.</li>
              <li><span className="font-medium">Event</span>: situational boosts or progress.</li>
              <li><span className="font-medium">Challenge</span>: mini‑quiz; on success, you get the shown reward.</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">Challenges</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>MCQ: pick the best answer.</li>
              <li>Drag: arrange items in the correct order.</li>
              <li>Cloud: select all correct terms.</li>
              <li>Figure/Pseudo: answer based on the shown hint or pseudocode.</li>
            </ul>
          </div>
        </div>
        <button onClick={onClose} className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-white">Close</button>
      </div>
    </div>
  );
}

function NarrativePopup({ open, title, text, backdrop, onClose }){
  if(!open) return null;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-60 grid place-items-center bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-100" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
          <div className="h-24 bg-cover bg-center" style={{ backgroundImage: backdrop }} />
          <div className="p-4">
            <div className="mb-1 text-lg font-semibold">{title}</div>
            <div className="text-sm opacity-90">{text}</div>
            <button onClick={onClose} className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-white">Continue</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [cutQueue, setCutQueue] = useState([]);
  const [queuedAfter, setQueuedAfter] = useState(null);
  const [awaitingDifficulty, setAwaitingDifficulty] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [forceBackstory, setForceBackstory] = useState(true);
  const [pendingInitialDraw, setPendingInitialDraw] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ difficulty: "Medium", musicUrl: "", voiceUrl: "", audioEnabled: false, useSynth: true });
  const [showTests, setShowTests] = useState(false);
  const [testOut, setTestOut] = useState("");
  const [showLanding, setShowLanding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [pendingStart, setPendingStart] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [learnCard, setLearnCard] = useState(null);
  const [learnShown, setLearnShown] = useState({});
  const [paradox, setParadox] = useState(0); // 0-100
  const [paradoxFlash, setParadoxFlash] = useState(null); // 'minor' | 'major' | null
  const [backstorySeen, setBackstorySeen] = useState(() => {
    try { return localStorage.getItem('codex_backstory_seen') === '1'; } catch { return false; }
  });
  const [popup, setPopup] = useState(null); // {title, text, backdrop}

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
  // Sort deck by approximate chronology
  const fresh = [...ch.deck].sort((a,b)=>{
      const ay = CARD_YEARS[a.id] ?? 9999;
      const by = CARD_YEARS[b.id] ?? 9999;
      return ay - by;
  });
  const drawCount = 4 + (DIFFICULTY_PRESETS[settings.difficulty]?.draw || 1) - 1;
    setDeck(fresh);
    setDiscard([]);
  setHand([]);
  setPendingInitialDraw(drawCount);
    setPlayed({});
    setProgress(0);
    setRes(nextRes);
    // Build intro/backstory cutscene queue for Chapter 1
    if (ch.id === 'ch1') {
      const full = [
        { title: 'Backstory — The Codex Paradox', text: 'In Neo‑Cairo, two desperate researchers — Amina and Rashid — uncover fragments of a mythical Codex of Algorithms. In their reality it was never completed; a temporal fracture erased it centuries ago. Without its guiding principles, AI went rogue, systems collapsed, and an apocalypse looms. Forbidden research reveals an alternate reality where the Codex survived from 9th‑century Baghdad to today, shaping a stable world. A rift now entangles both timelines. Their world is beyond saving, but if they can protect the Codex in that other timeline, humanity there may endure. They power a chrono‑gate and step through, knowing every action may ripple through time.', backdrop: `url('/assets/images/Cyborgs et néons dans la ville.png')` },
        { title: 'Paradox Triggered', text: 'Their interference reveals a rift: the timelines are entangled. Collapse begins to ripple through systems their world depends on.', backdrop: `url('/assets/images/neo-cairo collapse.png')` },
        { title: 'No Saving Our World', text: 'It is too late to halt the cascade. One hope remains: protect the Codex in the alternate timeline so at least that reality survives.', backdrop: `url('/assets/images/apocalypse.png')` },
        { title: 'Activating the Chrono‑Gate', text: 'They gather stolen tech and power up a shimmering portal, knowing every action will ripple through time.', backdrop: `url('/assets/images/Activating the chrono-gate.png')` },
        { title: 'Through the Rift', text: 'They step into the current and are pulled toward the 9th century.', backdrop: `url('/assets/images/Time travel.png')` },
        { title: 'Arrival in the Heart of Civilization', text: 'A terrace above the Tigris. Lanterns glow; markets bustle. They blend in and set a course for the House of Wisdom.', backdrop: `url('/assets/images/arrival_tigris_baghdad.png')` },
        { title: 'Approach the House of Wisdom', text: 'Bayt al‑Hikma stands ahead. Inside, manuscripts on astronomy, medicine, and mathematics line the halls; debates swirl in many tongues.', backdrop: `url('/assets/images/house-of-wisdom-outisde-background.png')` },
        { title: 'Inside Bayt al‑Hikma', text: 'Within, they glimpse Al‑Khwarizmi at work—drafting ideas that will define algorithms. Somewhere in these archives, the Codex awaits.', backdrop: `url('/assets/images/house-of-wisdom-inside-background.png')` },
      ];
      const throughIdx = Math.max(0, full.findIndex(s => /Through the Rift/i.test(s.title)));
      const arrivalIdx = Math.max(0, full.findIndex(s => /Arrival/i.test(s.title)));
      const backstoryPart = full.slice(0, throughIdx + 1);
      const arrivalPart = full.slice(arrivalIdx);
      const hasSave = !!localStorage.getItem(LS_KEY);
      const shouldShowBackstory = forceBackstory || (!hasSave && !backstorySeen);
      if (shouldShowBackstory) {
        // Show backstory first, then ask difficulty, then arrival
        setCutQueue(backstoryPart);
        setQueuedAfter(arrivalPart);
        setAwaitingDifficulty(true);
        setCutscene(backstoryPart[0]);
        try { localStorage.setItem('codex_backstory_seen', '1'); } catch {}
        setBackstorySeen(true);
        if (forceBackstory) setForceBackstory(false);
      } else {
        // Skip backstory; still ask difficulty before arrival
        setCutQueue(arrivalPart);
        setQueuedAfter(null);
        setAwaitingDifficulty(false);
        setCutscene(arrivalPart[0]);
        // Immediately open difficulty chooser in proceedAfterCutscene when cutQueue finishes? We'll open it now.
        setShowDifficulty(true);
      }
    } else {
      setCutQueue([]);
      setCutscene({ title: ch.title, text: ch.scene, backdrop: ch.portrait });
    }
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
    // Show learn popup the first time this card is played
    setLearnShown((m) => {
      if (!m[card.id]) {
        setLearnCard(card);
        return { ...m, [card.id]: true };
      }
      return m;
    });
  }

  function resolveChallenge(success, reward) {
    setChallenge(null);
    if (success) {
      setRes((r) => addRes(r, reward || {}));
      setProgress((x) => clamp(x + 15, 0, 100));
      // small relief on success
      setParadox((p) => clamp(p - 2, 0, 100));
    } else {
      // escalate paradox on failure
      bumpParadox(8);
    }
  }

  const chapterComplete = chapter.required.every((id) => played[id]);
  useEffect(() => {
    if (chapterComplete || progress >= 100) {
      if (chapterIdx < CHAPTERS.length - 1) {
        if (chapter.id === 'ch1') {
          setCutscene({ title: `${chapter.title} — Complete`, text: `Your Codex pages are secured. Next: ${CHAPTERS[chapterIdx + 1].title}.`, backdrop: `url('/assets/images/baghdad_success_transition.png')`, action: 'next-chapter' });
        } else {
          setCutscene({ title: `${chapter.title} — Complete`, text: `Your Codex pages are secured. Next: ${CHAPTERS[chapterIdx + 1].title}.`, backdrop: CHAPTERS[chapterIdx + 1].portrait, action: 'next-chapter' });
        }
      } else {
        setCutscene({ title: "The Grand Assembly — Codex Complete", text: "You present the restored Codex beside pioneers from Al‑Khwarizmi to Hinton. The hall erupts in applause.", backdrop: chapter.portrait });
      }
    }
  }, [chapterComplete]);

  // Paradox visuals and failure
  useEffect(() => {
    if (paradox >= 100) {
      // Failure state for Chapter 1
      setCutscene({ title: 'Paradox Collapse', text: 'The invasion comes too soon. Baghdad falls; the Codex is lost. The timeline buckles.', backdrop: `url('/assets/images/baghdad_failure_invasion.png')`, action: 'restart-chapter' });
      // Also show a major flash
      setParadoxFlash('major');
      const t = setTimeout(() => setParadoxFlash(null), 800);
      return () => clearTimeout(t);
    }
    if (paradox >= 60) {
      setParadoxFlash('major');
      const t = setTimeout(() => setParadoxFlash(null), 600);
      return () => clearTimeout(t);
    } else if (paradox >= 30) {
      setParadoxFlash('minor');
      const t = setTimeout(() => setParadoxFlash(null), 400);
      return () => clearTimeout(t);
    } else {
      setParadoxFlash(null);
    }
  }, [paradox]);

  function bumpParadox(amount = 5) {
    setParadox((p) => clamp(p + amount, 0, 100));
  }

  function proceedAfterCutscene() {
    // If we just finished the backstory segment and need difficulty selection, open chooser
    if (awaitingDifficulty && cutQueue && cutQueue.length <= 1 && cutscene) {
      // Current cutscene is the last in the backstoryPart; next press opens difficulty
      setCutQueue([]);
      setCutscene(null);
      setShowDifficulty(true);
      setAwaitingDifficulty(false);
      return;
    }
    // Special actions bound to current cutscene
    if (cutscene?.action === 'restart-chapter') {
      setParadox(0);
      setCutQueue([]);
      setCutscene(null);
      initChapter(chapterIdx, { ...START_RES });
      setTurn(1);
      return;
    }
    if (cutscene?.action === 'next-chapter') {
      if (chapterIdx < CHAPTERS.length - 1) setChapterIdx((i) => i + 1);
      setCutscene(null);
      return;
    }
    // If queued cutscenes exist, advance through them first
    if (cutQueue && cutQueue.length > 0) {
      const next = cutQueue.slice(1);
      setCutQueue(next);
      if (next.length > 0) { setCutscene(next[0]); return; }
    }
    // Chapter transitions
    if (chapterComplete || progress >= 100) {
      if (chapterIdx < CHAPTERS.length - 1) setChapterIdx((i) => i + 1);
      setCutscene(null);
    } else {
      setCutscene(null);
      // After finishing all intro cutscenes and difficulty, perform the initial draw once
      if (!awaitingDifficulty && !showDifficulty && (cutQueue?.length ?? 0) === 0 && pendingInitialDraw > 0) {
        const n = pendingInitialDraw;
        setPendingInitialDraw(0);
        draw(n);
      }
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
  setForceBackstory(true);
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
  <TopBar chapter={chapter} turn={turn} onReset={resetGame} onSettings={() => setSettingsOpen(true)} onGuide={() => setGuideOpen(true)} />
        <audio ref={musicRef} />
        <audio ref={voiceRef} />
        <LandingModal open={showLanding} hasSave={!!localStorage.getItem(LS_KEY)} onContinue={load} onStart={startNewGame} />
        <TutorialModal open={showTutorial} onStart={beginGame} />
  <YouTubeDock playlistId="PLdkbG6kCdZ8P7fnHPG3gnsWgh9u-qKsjQ" />
        <div className={`mx-auto mt-3 max-w-xl overflow-hidden rounded-2xl bg-gradient-to-r ${chapter.bg}`}>
          <div className="h-28 bg-cover bg-center" style={{ backgroundImage: chapter.portrait }} />
          <div className="p-3">
            <div className="text-sm font-semibold">The Codex of Algorithms</div>
            <div className="text-xs opacity-80">Recover the chapters across eras; play knowledge cards, tackle challenges, and complete the Codex. Difficulty: {settings.difficulty}</div>
          </div>
        </div>
        <div className="mx-auto max-w-xl">
          <ResourceRow res={res} />
          {/* Paradox meter */}
          {chapter.id==='ch1' && (
            <div className="mt-2 rounded-2xl bg-white p-3 shadow dark:bg-slate-950">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-semibold">Paradox Meter</div>
                <div className="text-xs opacity-70">{paradox}/100</div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200"><div className={`h-full ${paradox>60?'bg-rose-600':paradox>30?'bg-amber-500':'bg-emerald-600'}`} style={{ width: `${paradox}%` }} /></div>
              <div className="mt-1 text-[11px] opacity-70">Wrong answers or failures stress the timeline.</div>
            </div>
          )}
          <div className="rounded-2xl bg-white p-3 shadow dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Chapter Progress</div>
              <div className="text-xs opacity-70">Required cards: {chapter.required.length - chapter.required.filter((id) => played[id]).length} left</div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-slate-900" style={{ width: `${progress}%` }} /></div>
            {chapterComplete && (<div className="mt-2 flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 className="size-4"/> Chapter complete!</div>)}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(() => {
              // Track if Grand Bazaar has been played
              const bazaarPlayed = played['location-grand-bazaar'];
              return hand
                .filter(card => card.id !== 'quiz-baghdad-empire' || bazaarPlayed)
                .map((card) => (
                  <Card key={card.id} card={card} onPlay={playCard} canPlay={canPay(res, scaleCost(card.cost, DIFFICULTY_PRESETS[settings.difficulty]?.costMul || 1))} portrait={cardBackdrop(card, chapter)} />
                ));
            })()}
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
  {/* Ambient wrapper for challenge scenes (Baghdad branches) */}
  <div className="relative">
    {challenge && chapter.id==='ch1' && (
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40" style={{ backgroundImage:
        challenge.id==='quiz-ch1' ? `url('/assets/images/bazaar_quiz_challenge.png')` :
        challenge.meta?.kind==='drag' ? `url('/assets/images/baghdad_challenge_riddle_trade.png')` :
        `url('/assets/images/baghdad_merchant_negotiation.png')`, backgroundSize:'cover', backgroundPosition:'center' }} />
    )}
    <ChallengeModal open={!!challenge} card={challenge} onResolve={resolveChallenge} difficulty={settings.difficulty} onWrong={(amt, stage) => {
      if(chapter.id!=='ch1') { bumpParadox(amt ?? 4); return; }
      // Stage popups for ch1 on wrong answers (non-terminal)
      bumpParadox(amt ?? 4);
      if (settings.difficulty==='Easy') {
        if (stage === 'first') {
          setPopup({ title: 'Whispers of 1258', text: 'Rumors of a siege arrive too soon. History feels… off.', backdrop: `url('/assets/images/house-of-wisdom-inside-background.png')` });
        } else if (stage === 'second') {
          setPopup({ title: 'Paradox Ripple', text: 'Neon ripples flicker over the skyline. The timeline strains.', backdrop: `url('/assets/images/baghdad_paradox_skyline.png')` });
        }
      }
    }} />
  </div>
  {/* Paradox visual overlays */}
  {paradoxFlash && chapter.id==='ch1' && (
    <div className="pointer-events-none fixed inset-0 z-40" style={{
      backgroundImage: paradoxFlash==='major' ? `url('/assets/images/baghdad_warning_invasion.png')` : `url('/assets/images/baghdad_paradox_skyline.png')`,
      backgroundSize: 'cover', backgroundPosition: 'center', opacity: paradoxFlash==='major'?0.35:0.25,
      mixBlendMode: 'screen'
    }} />
  )}
  <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} setSettings={setSettings} onSave={save} onLoad={load} />
  <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
  <CardLearnModal open={!!learnCard} card={learnCard} onClose={() => setLearnCard(null)} />
  <NarrativePopup open={!!popup} title={popup?.title} text={popup?.text} backdrop={popup?.backdrop} onClose={() => setPopup(null)} />
  <DifficultyModal open={showDifficulty} defaultDifficulty={settings.difficulty} onPick={(d)=>{
    setSettings(s => ({...s, difficulty: d}));
    setShowDifficulty(false);
    if (queuedAfter && queuedAfter.length>0) {
      setCutQueue(queuedAfter);
      setCutscene(queuedAfter[0]);
      setQueuedAfter(null);
    }
  }} />
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
function YouTubeDock({ initialList=[], playlistId }){
  const [open,setOpen]=useState(true);
  const [ids,setIds]=useState(initialList);
  const [i,setI]=useState(0);
  const [muted,setMuted]=useState(true); // start muted for autoplay
  const [playing,setPlaying]=useState(true);
  const [volume,setVolume]=useState(50);
  const [input,setInput]=useState(playlistId ? `https://www.youtube.com/playlist?list=${playlistId}` : 'https://www.youtube.com/watch?v='+(initialList[0]||''));
  const id=ids[i]||'';
  const base = playlistId ? `https://www.youtube.com/embed/videoseries?list=${playlistId}` : `https://www.youtube.com/embed/${id}`;
  const src=`${base}&autoplay=1&controls=1&mute=${muted?1:0}&enablejsapi=1&origin=${location.origin}&modestbranding=1&rel=0`;

  // Key binds
  useEffect(()=>{
    const onKey=(e)=>{ if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return; const k=e.key.toLowerCase(); if(k==='k') togglePlay(); else if(k==='m') toggleMute(); else if(k==='.'||k===']') next(); else if(k===','||k==='[') prev(); };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[ids,i,muted,playing]);

  // Listen for player state changes to auto-advance on end
  useEffect(()=>{
    const handler=(ev)=>{
      try{ const data=JSON.parse(ev.data);
        if(data?.event==='onReady'){
          post('setVolume',[volume]);
        }
        if(data?.event==='onStateChange'){ // -1 unstarted, 0 ended, 1 playing
          if(data.info===0){
            if(playlistId){ post('nextVideo'); } else { next(); }
          }
        }
      }catch{}
    };
    window.addEventListener('message', handler);
    return ()=>window.removeEventListener('message', handler);
  },[ids,i,playlistId,volume]);

  // Helper to post commands
  function post(cmd, args){ const f=document.getElementById('yt-iframe'); if(!f) return; f.contentWindow.postMessage(JSON.stringify({event:'command',func:cmd,args:args||[]}), '*'); }

  function addUrl(){
    if(playlistId){ return; }
    const vid=extractYouTubeId(input); if(!vid) return; setIds((arr)=> arr.includes(vid)?arr:[...arr, vid]); setI((arr)=> (ids.length));
  }
  function next(){ if(playlistId){ post('nextVideo'); return; } setI((x)=> (x+1)%Math.max(1,ids.length)); }
  function prev(){ if(playlistId){ post('previousVideo'); return; } setI((x)=> (x-1+Math.max(1,ids.length))%Math.max(1,ids.length)); }
  function togglePlay(){ if(playing){ post('pauseVideo'); setPlaying(false); } else { post('playVideo'); setPlaying(true); } }
  function toggleMute(){ post(muted?'unMute':'mute'); setMuted(!muted); }
  function onVolume(v){ const vol=Number(v); setVolume(vol); post('setVolume',[vol]); if(vol===0 && !muted){ setMuted(true);} else if(vol>0 && muted){ setMuted(false);} }

  return (
    <div className="fixed bottom-3 right-3 z-50 select-none" style={{pointerEvents:'auto'}}>
      <div className="mb-2 flex items-center justify-end gap-2">
        <button title="Previous (,[)" onClick={prev} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80"><SkipBack className="size-4"/></button>
        <button title="Play/Pause (K)" onClick={togglePlay} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80"><Pause className="size-4"/></button>
        <button title="Next (.] )" onClick={next} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80"><SkipForward className="size-4"/></button>
        <input type="range" min="0" max="100" value={volume} onChange={(e)=>onVolume(e.target.value)} className="h-2 w-28 cursor-pointer" title="Volume"/>
        <button title="Mute/Unmute (M)" onClick={toggleMute} className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80">{muted?<VolumeX className="size-4"/>:<Volume2 className="size-4"/>}</button>
        <button title="Show/Hide Player" onClick={()=>setOpen(!open)} className="rounded-lg bg-slate-900 px-2 py-2 text-xs text-white">{open?"Hide":"Show"}</button>
      </div>
      {open && (
        <div className="rounded-xl bg-black/60 p-1 shadow-xl backdrop-blur-sm">
          <iframe id="yt-iframe" className="h-28 w-48 rounded-lg" src={src} allow="autoplay; encrypted-media" title="Soundtrack"/>
        </div>
      )}
      <div className="mt-2 flex items-center justify-end gap-2">
        {!playlistId && (
          <>
            <input value={input} onChange={(e)=>setInput(e.target.value)} className="w-56 rounded-lg border bg-white/90 p-2 text-xs text-slate-900 shadow dark:bg-slate-800/80 dark:text-slate-100" placeholder="Paste YouTube URL" title="Paste a YouTube link; K play/pause • M mute • [,] prev/next"/>
            <button onClick={addUrl} className="rounded-lg bg-emerald-600 px-2 py-2 text-xs text-white">Add</button>
          </>
        )}
        <a className="rounded-lg bg-white/90 p-2 text-xs shadow hover:bg-white dark:bg-slate-800/80" href={`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId||'')}`} target="_blank" rel="noreferrer" title="Open playlist"><Search className="size-4"/></a>
      </div>
    </div>
  );
}
