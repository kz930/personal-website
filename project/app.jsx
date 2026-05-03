/* ============================================================
   Kary's World — full app
   Terminal landing → animated welcome → portfolio sections
   ============================================================ */

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "day",
  "wordGap": 0.35,
  "accentColor": "#c4714a"
} /*EDITMODE-END*/;

/* ---------- TERMINAL LANDING (full screen) ---------- */
function Landing({ onEnter, exiting }) {
  const script = [
  { type: "cmd", prompt: "kary@world", path: "~", text: "whoami" },
  { type: "out", text: "kary zheng — software engineer" },
  { type: "blank" },
  { type: "cmd", prompt: "kary@world", path: "~", text: "echo \"hello world\"" },
  { type: "out", text: "hello world", accent: true },
  { type: "blank" },
  { type: "cmd", prompt: "kary@world", path: "~", text: "open ./world" }];


  const [lineIdx, setLineIdx] = useState(0); // current line being typed
  const [charIdx, setCharIdx] = useState(0); // chars typed in current line
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    if (lineIdx >= script.length) {setDoneTyping(true);return;}
    const line = script[lineIdx];
    const target = line.text || "";

    // for non-typed lines (blank, output), pause briefly then advance
    if (line.type === "blank" || line.type === "out") {
      const t = setTimeout(() => {setLineIdx(lineIdx + 1);setCharIdx(0);}, line.type === "out" ? 380 : 200);
      return () => clearTimeout(t);
    }

    if (charIdx < target.length) {
      const delay = 38 + Math.random() * 50;
      const t = setTimeout(() => setCharIdx(charIdx + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {setLineIdx(lineIdx + 1);setCharIdx(0);}, 420);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  const renderLine = (line, idx, isCurrent) => {
    if (line.type === "blank") return <div className="term-line" key={idx}>&nbsp;</div>;
    if (line.type === "out") {
      return (
        <div className="term-line" key={idx}>
          <span className={line.accent ? "accent" : "out"}>{line.text}</span>
        </div>);

    }
    const shownText = isCurrent ? line.text.slice(0, charIdx) : line.text;
    return (
      <div className="term-line" key={idx}>
        <span className="prompt">{line.prompt}</span>
        <span>:</span>
        <span className="path">{line.path}</span>
        <span>$ </span>
        <span className="cmd">{shownText}</span>
        {isCurrent && <span className="cursor"></span>}
      </div>);

  };

  return (
    <div className={"landing" + (exiting ? " exit" : "")}>
      <div className="landing-terminal">
        <div className="term-bar">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="title">kary — zsh — 80×24</span>
        </div>
        <div className="term-body">
          {script.slice(0, lineIdx + 1).map((l, i) => renderLine(l, i, i === lineIdx && !doneTyping))}
          {doneTyping &&
          <div className="term-line">
              <span className="prompt">kary@world</span>
              <span>:</span>
              <span className="path">~</span>
              <span>$ </span>
              <span className="cursor"></span>
            </div>
          }
        </div>
      </div>

      <div className={"landing-cta" + (doneTyping ? " show" : "")}>
        <span className="hint">press the door</span>
        <button className="btn" onClick={onEnter}>
          Enter Kary's World <span style={{ opacity: 0.7 }}>↗</span>
        </button>
      </div>
    </div>);

}

/* ---------- WELCOME (animated splash) ---------- */
function Welcome() {
  const marquee = [
  "software engineer", "uc irvine", "cs + psych",
  "ai / ml research", "full-stack builder", "matcha enthusiast",
  "k-pop on every walk", "matcha tastings"];

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="welcome" id="welcome">
      <div className="welcome-eyebrow">
        <span className="dot"></span>
        <span className="eyebrow">2026 · irvine notebook</span>
      </div>
      <h1 className={revealed ? "in" : ""}>
        <span className="word">Welcome</span>
        <span className="word">to</span>
        <span className="word"><em>Kary's</em></span>
        <span className="word accent">World!</span>
      </h1>
      <p className={"sub" + (revealed ? " in" : "")}>
        A slowly-grown corner of the internet for my software, my research,
        and the things I'm thinking about. Pull up a cushion.
      </p>

      <div className={"welcome-marquee" + (revealed ? " in" : "")}>
        <div className="marquee-track">
          {[...marquee, ...marquee].map((w, i) =>
          <span key={i}>
              {w} <span className="star">✦</span>
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        className={"scroll-cue" + (revealed ? " in" : "")}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
        scroll to dive in
      </button>
    </section>);

}

/* ---------- ISOMETRIC ROOM ---------- */
function IsoRoom() {
  return (
    <img src="public/assets/bedroom.png?v=2" alt="isometric illustration of a small bedroom with desk, bed, plants, and a window" loading="lazy" />
  );
}


/* ---------- TOP NAV ---------- */
function TopNav({ onLamp, mode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"topnav" + (scrolled ? " scrolled" : "")}>
      <a href="#welcome" className="logo">Kary Zheng</a>
      <nav className="nav-links">
        <a href="#about">about</a>
        <a href="#experience">experience</a>
        <a href="#projects">projects</a>
        <a href="#publications">writing</a>
        <a href="#skills">skills</a>
        <a href="#extras">extras</a>
        <a href="#contact">contact</a>
      </nav>
    </header>);

}

/* ---------- LAMP CORD (day/night) ---------- */
function LampCord({ mode, onPull }) {
  const [pulling, setPulling] = useState(false);
  const handle = () => {
    setPulling(true);
    onPull();
    setTimeout(() => setPulling(false), 500);
  };
  return (
    <div className="lamp-toggle" title={mode === "day" ? "turn off the light" : "turn on the light"}>
      <div className={"lamp-cord" + (pulling ? " pulled" : "")} onClick={handle}></div>
      <div className="lamp-knob" onClick={handle}></div>
    </div>);

}

/* ---------- ABOUT ---------- */
function About() {
  return (
    <section className="about container" id="about">
      <div className="about-grid">
        <div>
          <h2>About<br /><em>Kary.</em></h2>
          <div className="about-facts">
            {["UC Irvine", "B.S. Computer Science", "B.A. Psychological Science", "ICS Honors", "GPA 3.95"].map((f) => (
              <span key={f} className="about-tag">{f}</span>
            ))}
          </div>
        </div>
        <div className="about-body">
          <p>
            I'm a UC Irvine student pursuing a B.S. in Computer Science and a
            B.A. in Psychological Science, in the ICS Honors Program.
          </p>
          <p>
            My work is shaped by both sides of my background: computer
            science teaches me how to build reliable systems, while
            psychology helps me understand how people think, learn, and make
            decisions. I'm especially interested in technology that connects
            strong engineering with human needs.
          </p>
          <p>
            I enjoy building full-stack applications, AI-powered tools,
            backend systems, and research simulations — with interests in
            learning technology, healthcare technology, human-centered
            product design, reinforcement learning, and intelligent systems.
          </p>
          <p>
            Across my projects I care about making complex ideas feel clear,
            useful, and approachable — software that's not only functional,
            but thoughtful.
          </p>
        </div>
        <div className="room-card">
          <div className="label">
            <span>cozy room</span>
          </div>
          <div className="room"><IsoRoom /></div>
          <div className="room-caption">a small room, mostly mine.</div>
        </div>
      </div>
    </section>);

}

/* ---------- PROJECTS ---------- */
const PROJECTS = [
  {
    num: "01",
    title: "Scalable Search Engine",
    year: "Jan 2026 — Mar 2026",
    category: "SYSTEMS / INFORMATION RETRIEVAL",
    summary: "Disk-based search engine over 50K+ web pages with crawling, inverted indexing, TF-IDF ranking, and sub-300ms query response.",
    tags: ["Python", "Information Retrieval", "Data Structures"],
    highlights: [
      "Built a search engine that indexed 50K+ web pages, achieving sub-300ms query latency with optimized retrieval.",
      "Engineered a crawler with domain filtering, trap avoidance, and politeness controls to improve crawl quality.",
      "Designed a disk-based inverted index with partial indexing and k-way merging, reducing memory usage at scale.",
      "Developed TF-IDF ranking with HTML tag weighting and term proximity, improving relevance for ranked results."
    ],
    href: null,
    visual: "search"
  },
  {
    num: "02",
    title: "Fabflix",
    year: "Jan 2026 — Mar 2026",
    category: "FULL-STACK / CLOUD",
    summary: "Full-stack movie platform with search, authentication, checkout, and shopping cart — backed by Java Servlets, MySQL, and Dockerized services on Kubernetes/AWS.",
    tags: ["Java", "MySQL", "REST APIs", "Docker", "Kubernetes", "AWS"],
    highlights: [
      "Built a full-stack movie platform with search, authentication, checkout, and shopping cart features.",
      "Developed RESTful APIs using Java Servlets, Tomcat, and MySQL to support modular backend services.",
      "Implemented secure login, session handling, and role-based employee access for customer and admin workflows.",
      "Optimized MySQL queries and full-text search, reducing query response time by ~40%.",
      "Deployed Dockerized microservices on Kubernetes and AWS, enabling load-balanced backend performance."
    ],
    href: null,
    visual: "fabflix"
  },
  {
    num: "03",
    title: "LifeLink",
    year: "Apr 2026",
    category: "AI / HEALTHCARE / HARDWARE",
    summary: "AI-powered CPR emergency response platform combining voice guidance, SOS coordination, and Arduino-based compression feedback over Web Serial.",
    tags: ["React", "TypeScript", "Web Serial"],
    highlights: [
      "Built an AI CPR voice agent with ElevenLabs, delivering real-time CPR instructions through a React/TypeScript frontend.",
      "Integrated Arduino sensor feedback via Web Serial, enabling live compression feedback in an end-to-end demo.",
      "Connected SOS activation, AED routing, volunteer alerts, and patient handoff into a coordinated emergency workflow."
    ],
    href: "https://www.lifelinkfor.us/",
    visual: "lifelink"
  },
  {
    num: "04",
    title: "PhoenixConnect",
    year: "Jan 2025",
    category: "CIVIC TECH / DISASTER RESPONSE",
    summary: "Disaster-response web app for wildfire data, shelter mapping, and community reports to support emergency updates.",
    tags: ["Flask", "MongoDB", "REST APIs"],
    highlights: [
      "Built a disaster response app using NASA and Google Maps APIs to map real-time wildfire data and shelters.",
      "Developed Flask and MongoDB backend services for user reports, improving access to emergency updates."
    ],
    href: null,
    visual: "phoenix"
  }
];

const EXTRAS = [
  { num: "a", title: "Edugen", desc: "AI-powered lesson generation platform — turns objectives into structured slides and narrated instructional videos. Built for a startup competition.", year: "2025", tags: ["Python", "Full-Stack", "LLMs", "RAG", "SaaS Design"], href: null,
    bullets: [
      "Designed an AI-powered system that converts lesson objectives into structured slides and narrated instructional videos.",
      "Built a retrieval-augmented generation (RAG) pipeline to fetch and rank curriculum-aligned educational content.",
      "Developed content structuring pipeline (hook → concept → examples → assessment → recap) for consistent instructional output.",
      "Implemented automated multimedia generation with editable outputs and citation support.",
      "Conducted market research on K–12 education and homeschooling trends to validate product demand.",
      "Proposed SaaS business model with freemium and institutional licensing strategy."
    ]
  },
  { num: "b", title: "Lingualize", desc: "LLM writing assistant that refines language while tracking changes in emotional tone.", year: "2024 — 25", tags: ["Python", "Streamlit", "LLMs", "Emotion Analysis"], href: null,
    bullets: [
      "Built an LLM-powered application to refine language while tracking changes in emotional tone.",
      "Designed pipeline integrating APIs for emotion analysis and text generation.",
      "Developed Streamlit interface for real-time user interaction.",
      "Evaluated how LLM outputs affect emotional tone using automated analysis."
    ]
  }
];

function ProjectVisual({ kind }) {
  switch (kind) {
    case "search":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-search" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fcd6c1" />
              <stop offset="1" stopColor="#dce0e9" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-search)" />
          <rect x="20" y="34" width="120" height="22" rx="11" fill="#fff8ee" stroke="#a87850" strokeWidth="0.8" />
          <line x1="30" y1="46" x2="100" y2="46" stroke="#a89090" strokeWidth="0.8" />
          <circle cx="138" cy="45" r="6" fill="none" stroke="#6b4a52" strokeWidth="1.6" />
          <line x1="142" y1="49" x2="148" y2="55" stroke="#6b4a52" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="20" y="74" width="160" height="6" rx="3" fill="#fff8ee" opacity="0.85" />
          <rect x="20" y="86" width="120" height="4" rx="2" fill="#fff8ee" opacity="0.7" />
          <rect x="20" y="100" width="160" height="6" rx="3" fill="#fff8ee" opacity="0.85" />
          <rect x="20" y="112" width="100" height="4" rx="2" fill="#fff8ee" opacity="0.7" />
          <rect x="20" y="126" width="140" height="6" rx="3" fill="#fff8ee" opacity="0.85" />
          <circle cx="14" cy="77" r="2" fill="#e09878" />
          <circle cx="14" cy="103" r="2" fill="#e09878" />
          <circle cx="14" cy="129" r="2" fill="#e09878" />
        </svg>);

    case "fabflix":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-fab" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#dce0e9" />
              <stop offset="1" stopColor="#b1979e" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-fab)" />
          <rect x="18" y="22" width="40" height="60" rx="3" fill="#fff8ee" />
          <rect x="64" y="22" width="40" height="60" rx="3" fill="#fff8ee" opacity="0.85" />
          <rect x="110" y="22" width="40" height="60" rx="3" fill="#fff8ee" opacity="0.7" />
          <rect x="156" y="22" width="32" height="60" rx="3" fill="#fff8ee" opacity="0.55" />
          <g fill="#6b4a52" opacity="0.4">
            <rect x="22" y="28" width="3" height="3" />
            <rect x="22" y="36" width="3" height="3" />
            <rect x="22" y="44" width="3" height="3" />
            <rect x="22" y="52" width="3" height="3" />
            <rect x="22" y="60" width="3" height="3" />
            <rect x="22" y="68" width="3" height="3" />
          </g>
          <rect x="22" y="98" width="120" height="14" rx="7" fill="#fff8ee" />
          <rect x="148" y="98" width="36" height="14" rx="7" fill="#e09878" />
          <rect x="22" y="122" width="80" height="5" rx="2.5" fill="#fff8ee" opacity="0.7" />
          <rect x="22" y="132" width="120" height="5" rx="2.5" fill="#fff8ee" opacity="0.5" />
        </svg>);

    case "lifelink":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-life" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fcd6c1" />
              <stop offset="1" stopColor="#ecb8a6" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-life)" />
          <path d="M100 38 Q92 28 84 32 Q74 38 84 50 L100 64 L116 50 Q126 38 116 32 Q108 28 100 38 Z" fill="#c34248" />
          <polyline
            points="20,90 50,90 60,70 70,108 80,60 90,90 130,90 140,78 150,90 180,90"
            fill="none" stroke="#c34248" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <g stroke="#fff8ee" strokeWidth="2" strokeLinecap="round">
            <line x1="42" y1="124" x2="42" y2="138" />
            <line x1="50" y1="118" x2="50" y2="144" />
            <line x1="58" y1="122" x2="58" y2="140" />
            <line x1="66" y1="116" x2="66" y2="146" />
            <line x1="74" y1="120" x2="74" y2="142" />
            <line x1="82" y1="124" x2="82" y2="138" />
          </g>
          <rect x="118" y="116" width="64" height="28" rx="14" fill="#fff8ee" />
          <text x="150" y="135" textAnchor="middle" fontSize="13" fontFamily="serif" fontStyle="italic" fill="#6b4a52">SOS</text>
        </svg>);

    case "carl":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-carl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ced6d3" />
              <stop offset="1" stopColor="#dce0e9" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-carl)" />
          <line x1="20" y1="140" x2="180" y2="140" stroke="#a89090" strokeWidth="0.6" />
          <line x1="20" y1="140" x2="20" y2="20" stroke="#a89090" strokeWidth="0.6" />
          <path d="M20 140 Q60 130 100 100 Q140 80 180 60" fill="none" stroke="#e09878" strokeWidth="1.8" />
          <g stroke="#6b4a52" strokeWidth="1" opacity="0.5">
            <line x1="40" y1="50" x2="100" y2="80" />
            <line x1="40" y1="110" x2="100" y2="80" />
            <line x1="100" y1="80" x2="160" y2="50" />
            <line x1="100" y1="80" x2="160" y2="110" />
          </g>
          <g fill="#6b4a52">
            <circle cx="40" cy="50" r="6" />
            <circle cx="40" cy="110" r="6" />
            <circle cx="160" cy="50" r="6" />
            <circle cx="160" cy="110" r="6" />
          </g>
          <circle cx="100" cy="80" r="11" fill="#fff8ee" stroke="#6b4a52" strokeWidth="1" />
          <circle cx="100" cy="80" r="4" fill="#e09878" />
        </svg>);

    case "phoenix":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-ph" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffead9" />
              <stop offset="1" stopColor="#ffd9c6" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-ph)" />
          <path d="M20 30 Q50 20 80 32 L110 28 L150 38 L180 30 L180 130 L150 128 L120 138 L80 132 L40 138 L20 130 Z" fill="#fff8ee" opacity="0.9" />
          <path d="M30 60 Q80 70 140 50" fill="none" stroke="#a89090" strokeWidth="0.8" strokeDasharray="3 2" />
          <path d="M40 100 Q90 90 160 110" fill="none" stroke="#a89090" strokeWidth="0.8" strokeDasharray="3 2" />
          <path d="M80 50 Q86 40 92 50 Q90 60 86 64 Q82 60 80 50 Z" fill="#c34248" />
          <circle cx="86" cy="58" r="2" fill="#f5e0a8" />
          <path d="M138 88 L148 88 L143 76 Z" fill="#6b4a52" />
          <rect x="138" y="86" width="10" height="6" fill="#6b4a52" />
          <circle cx="170" cy="142" r="10" fill="#fff8ee" stroke="#6b4a52" strokeWidth="0.8" />
          <line x1="170" y1="135" x2="170" y2="149" stroke="#c34248" strokeWidth="1.2" />
        </svg>);

    case "research":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-research" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ced6d3" />
              <stop offset="1" stopColor="#dce0e9" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-research)" />
          <line x1="20" y1="140" x2="180" y2="140" stroke="#a89090" strokeWidth="0.6" />
          <line x1="20" y1="140" x2="20" y2="20" stroke="#a89090" strokeWidth="0.6" />
          <path d="M20 140 Q60 130 100 100 Q140 80 180 60" fill="none" stroke="#e09878" strokeWidth="1.8" />
          <g stroke="#6b4a52" strokeWidth="1" opacity="0.5">
            <line x1="40" y1="50" x2="100" y2="80" />
            <line x1="40" y1="110" x2="100" y2="80" />
            <line x1="100" y1="80" x2="160" y2="50" />
            <line x1="100" y1="80" x2="160" y2="110" />
          </g>
          <g fill="#6b4a52">
            <circle cx="40" cy="50" r="6" />
            <circle cx="40" cy="110" r="6" />
            <circle cx="160" cy="50" r="6" />
            <circle cx="160" cy="110" r="6" />
          </g>
          <circle cx="100" cy="80" r="11" fill="#fff8ee" stroke="#6b4a52" strokeWidth="1" />
          <circle cx="100" cy="80" r="4" fill="#e09878" />
        </svg>);

    case "dashboard":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-dash" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffead9" />
              <stop offset="1" stopColor="#fcd6c1" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-dash)" />
          <rect x="18" y="22" width="120" height="116" rx="4" fill="#fff8ee" />
          <line x1="18" y1="38" x2="138" y2="38" stroke="#a89090" strokeWidth="0.5" />
          <line x1="18" y1="56" x2="138" y2="56" stroke="#a89090" strokeWidth="0.5" />
          <line x1="18" y1="74" x2="138" y2="74" stroke="#a89090" strokeWidth="0.5" />
          <line x1="18" y1="92" x2="138" y2="92" stroke="#a89090" strokeWidth="0.5" />
          <line x1="18" y1="110" x2="138" y2="110" stroke="#a89090" strokeWidth="0.5" />
          <line x1="58" y1="22" x2="58" y2="138" stroke="#a89090" strokeWidth="0.5" />
          <line x1="98" y1="22" x2="98" y2="138" stroke="#a89090" strokeWidth="0.5" />
          <rect x="58" y="56" width="40" height="18" fill="#e09878" opacity="0.4" />
          <path d="M148 80 L166 80 M163 76 L168 80 L163 84" stroke="#6b4a52" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="146" y="92" width="38" height="46" rx="3" fill="#fff8ee" />
          <rect x="150" y="124" width="6" height="10" fill="#e09878" />
          <rect x="158" y="118" width="6" height="16" fill="#e09878" />
          <rect x="166" y="110" width="6" height="24" fill="#e09878" />
          <rect x="174" y="104" width="6" height="30" fill="#e09878" />
        </svg>);

    case "teaching":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-teach" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ebe9e2" />
              <stop offset="1" stopColor="#dce0e9" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-teach)" />
          <rect x="18" y="22" width="164" height="88" rx="4" fill="#fff8ee" />
          <rect x="18" y="22" width="164" height="14" rx="4" fill="#dce0e9" />
          <rect x="18" y="32" width="164" height="4" fill="#dce0e9" />
          <circle cx="26" cy="29" r="2" fill="#e09878" />
          <circle cx="34" cy="29" r="2" fill="#f5e0a8" />
          <circle cx="42" cy="29" r="2" fill="#b8ce98" />
          <line x1="28" y1="48" x2="50" y2="48" stroke="#e09878" strokeWidth="1.5" />
          <line x1="56" y1="48" x2="100" y2="48" stroke="#6b4a52" strokeWidth="1.5" />
          <line x1="36" y1="60" x2="80" y2="60" stroke="#a89090" strokeWidth="1.5" />
          <line x1="36" y1="70" x2="120" y2="70" stroke="#a89090" strokeWidth="1.5" />
          <line x1="28" y1="82" x2="60" y2="82" stroke="#e09878" strokeWidth="1.5" />
          <line x1="66" y1="82" x2="140" y2="82" stroke="#6b4a52" strokeWidth="1.5" />
          <line x1="36" y1="94" x2="100" y2="94" stroke="#a89090" strokeWidth="1.5" />
          <g fill="#6b4a52">
            <circle cx="40" cy="130" r="5" />
            <circle cx="60" cy="130" r="5" />
            <circle cx="80" cy="130" r="5" />
            <circle cx="100" cy="130" r="5" />
            <circle cx="120" cy="130" r="5" />
            <circle cx="140" cy="130" r="5" />
            <circle cx="160" cy="130" r="5" />
          </g>
        </svg>);

    case "publication":
      return (
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="vg-pub" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ced6d3" />
              <stop offset="1" stopColor="#ebe9e2" />
            </linearGradient>
          </defs>
          <rect width="200" height="160" rx="8" fill="url(#vg-pub)" />
          <rect x="40" y="20" width="120" height="120" rx="3" fill="#fff8ee" />
          <rect x="50" y="32" width="80" height="6" rx="1.5" fill="#6b4a52" />
          <rect x="50" y="44" width="60" height="3" rx="1" fill="#a89090" />
          <rect x="50" y="56" width="100" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="62" width="100" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="68" width="80" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="82" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="88" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="94" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="100" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="106" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="50" y="112" width="32" height="2" rx="1" fill="#a89090" />
          <rect x="106" y="82" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="106" y="88" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="106" y="94" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="106" y="100" width="44" height="2" rx="1" fill="#a89090" />
          <rect x="106" y="106" width="32" height="2" rx="1" fill="#a89090" />
          <circle cx="148" cy="128" r="9" fill="#e09878" />
          <text x="148" y="131" textAnchor="middle" fontSize="9" fontFamily="serif" fontStyle="italic" fill="#fff8ee">Sci</text>
        </svg>);

    default:
      return null;
  }
}

function ProjectCard({ p, featured }) {
  return (
    <article className={"project-card" + (featured ? " featured" : "")}>
      <div className="project-card-text">
        <div className="project-card-meta">
          <span className="project-card-num">{p.num}</span>
          <span className="project-card-cat">{p.category}</span>
          <span className="project-card-year">{p.year}</span>
        </div>
        <h3>{p.title}</h3>
        <p className="project-card-summary">{p.summary}</p>
        <ul className="project-card-bullets">
          {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
        <div className="project-card-tags">
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        {p.href &&
          <a className="project-card-link" href={p.href} target="_blank" rel="noreferrer">
            visit project ↗
          </a>
        }
      </div>
      <div className="project-card-visual">
        <ProjectVisual kind={p.visual} />
      </div>
    </article>);

}

function Projects() {
  return (
    <section className="container" id="projects">
      <div className="section-head">
        <h2>Projects.</h2>
        <span className="meta">engineering · research · product builds</span>
      </div>
      <div className="project-list">
        {PROJECTS.map((p, i) => <ProjectCard key={p.num} p={p} featured={i < 2} />)}
      </div>
    </section>);

}

/* ---------- EXTRAS (fun projects) ---------- */
const FUN_COLORS = [
  { from: "#d6e6ef", to: "#a8c8dc", ink: "#2c4a63" },  // light blue
  { from: "#dee9c5", to: "#bcd098", ink: "#3d4a1f" },  // matcha
  { from: "#dce0e9", to: "#bec5d4", ink: "#39425a" },  // lilac
  { from: "#fde4b8", to: "#f5c87a", ink: "#6b4910" }   // honey
];

function ExtraCard({ p, index }) {
  const c = FUN_COLORS[index % FUN_COLORS.length];
  const style = { "--fun-from": c.from, "--fun-to": c.to, "--fun-ink": c.ink };
  const [open, setOpen] = useState(false);
  const hasBullets = Array.isArray(p.bullets) && p.bullets.length > 0;

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const inner =
    <>
      <div className="fun-card-head">
        <span className="fun-num">{p.num}</span>
        <span className="fun-year">{p.year}</span>
      </div>
      <h3>{p.title}</h3>
      <p>{p.desc}</p>
      <div className="fun-tags">
        {p.tags.map((t) => <span key={t}>{t}</span>)}
      </div>
      {hasBullets &&
        <button
          type="button"
          className="extra-toggle"
          onClick={toggle}
          aria-expanded={open}>
          {open ? "hide details ↑" : "details ↓"}
        </button>
      }
      {hasBullets && open &&
        <div className="extra-detail">
          <ul>
            {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      }
    </>;

  return p.href ?
  <a className="fun-card" href={p.href} target="_blank" rel="noreferrer" style={style}>{inner}</a> :

  <div className="fun-card" style={style}>{inner}</div>;

}

function Extras() {
  return (
    <section className="container extras-section" id="extras">
      <div className="section-head">
        <h2><em>Fun projects.</em></h2>
        <span className="meta">built for fun + curiosity</span>
      </div>
      <p className="extras-intro">
        Smaller experiments and weekend builds — things I made because the idea wouldn't leave me alone.
        These don't make the official cut, but they're some of my favorites.
      </p>
      <div className="extras-grid">
        {EXTRAS.map((p, i) => <ExtraCard key={p.num} p={p} index={i} />)}
      </div>
    </section>);

}

/* ---------- EXPERIENCE ---------- */
const EXPERIENCE = [
  {
    num: "01",
    role: "Research Assistant",
    where: "Cognitive Anteater Robotics Lab · UC Irvine",
    when: "Sep 2024 — Present",
    category: "RESEARCH / REINFORCEMENT LEARNING",
    summary: "Reinforcement learning simulations modeling episodic-like memory in cuttlefish behavior. Co-authored Scientific Reports paper.",
    tags: ["Python", "Machine Learning"],
    highlights: [
      "Designed Q-learning simulations across 4 experimental conditions, achieving stable convergence under 130-second delays.",
      "Improved decision accuracy by ~20–30% through reward tuning, punishment modeling, and cross-environment evaluation.",
      "Co-authored a peer-reviewed Scientific Reports publication on episodic-like memory in simulated cuttlefish behavior."
    ],
    href: "https://www.nature.com/articles/s41598-025-31950-x",
    visual: "research"
  },
  {
    num: "02",
    role: "Intern",
    where: "Mucci Assessment · Remote",
    when: "Sep 2024 — Sep 2025",
    category: "AUTOMATION / WEB",
    summary: "Automated reporting dashboards via Google Sheets API — cut weekly manual work by ~80%. Built reusable web modules for client data access.",
    tags: ["REST APIs", "HTML/CSS"],
    highlights: [
      "Automated dashboard updates via Google Sheets API, cutting manual reporting work by ~80% and saving ~5–10 hours/week.",
      "Built reusable web modules for client projects, improving data access speed and reducing manual reporting steps."
    ],
    visual: "dashboard"
  },
  {
    num: "03",
    role: "Learning Assistant",
    where: "UC Irvine",
    when: "Apr 2025 — Jun 2025",
    category: "TEACHING / CS EDUCATION",
    summary: "Led weekly Python labs for 30+ first-year CS students. Guided debugging, program design, and core CS concepts in hands-on sessions.",
    tags: ["Python"],
    highlights: [
      "Led weekly Python labs for 30+ students, improving assignment completion and reducing common debugging errors.",
      "Guided students through Python debugging, program design, and core CS concepts during hands-on lab sessions."
    ],
    visual: "teaching"
  }
];

function ExperienceCard({ e, featured }) {
  return (
    <article className={"project-card" + (featured ? " featured" : "")}>
      <div className="project-card-text">
        <div className="project-card-meta">
          <span className="project-card-num">{e.num}</span>
          <span className="project-card-cat">{e.category}</span>
          <span className="project-card-year">{e.when}</span>
        </div>
        <h3>{e.role}</h3>
        <div className="exp-where">{e.where}</div>
        <p className="project-card-summary">{e.summary}</p>
        <ul className="project-card-bullets">
          {e.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
        <div className="project-card-tags">
          {e.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        {e.href &&
          <a className="project-card-link" href={e.href} target="_blank" rel="noreferrer">
            read paper ↗
          </a>
        }
      </div>
      <div className="project-card-visual">
        <ProjectVisual kind={e.visual} />
      </div>
    </article>);

}

function Experience() {
  return (
    <section className="container" id="experience">
      <div className="section-head">
        <h2>Experience.</h2>
        <span className="meta">research · work · teaching</span>
      </div>
      <div className="project-list">
        {EXPERIENCE.map((e, i) => <ExperienceCard key={e.num} e={e} featured={i === 0} />)}
      </div>
    </section>);

}

/* ---------- PUBLICATIONS ---------- */
const PUBLICATIONS = [
  {
    num: "01",
    title: "Episodic-like memory in a simulation of cuttlefish behavior",
    venue: "Scientific Reports · 2025",
    year: "2025",
    category: "PEER-REVIEWED / NATURE",
    authors: "Kandimalla, S., Wong, Q. Y., Zheng, K. et al.",
    summary: "Computational model of episodic-like memory in cuttlefish foraging behavior, validating biological plausibility through Q-learning simulations.",
    tags: ["Python", "Q-learning", "NumPy", "Cognitive Modeling"],
    highlights: [
      "Reinforcement-learning simulations across four delay/reward conditions, with stable convergence up to 130s delays.",
      "Co-authored figures, statistical analyses, and the simulation framework in Python.",
      "Published in Scientific Reports (Nature Portfolio), 2025."
    ],
    href: "https://www.nature.com/articles/s41598-025-31950-x",
    visual: "publication"
  }
];

function PublicationCard({ p, featured }) {
  return (
    <article className={"project-card" + (featured ? " featured" : "")}>
      <div className="project-card-text">
        <div className="project-card-meta">
          <span className="project-card-num">{p.num}</span>
          <span className="project-card-cat">{p.category}</span>
          <span className="project-card-year">{p.year}</span>
        </div>
        <h3>{p.title}</h3>
        <div className="pub-authors">{p.authors}</div>
        <div className="pub-venue">{p.venue}</div>
        <p className="project-card-summary">{p.summary}</p>
        <ul className="project-card-bullets">
          {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
        <div className="project-card-tags">
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        {p.href &&
          <a className="project-card-link" href={p.href} target="_blank" rel="noreferrer">
            read on Nature ↗
          </a>
        }
      </div>
      <div className="project-card-visual">
        <ProjectVisual kind={p.visual} />
      </div>
    </article>);

}

function Publications() {
  return (
    <section className="container" id="publications">
      <div className="section-head">
        <h2><em>Publications.</em></h2>
      </div>
      <div className="project-list">
        {PUBLICATIONS.map((p, i) => <PublicationCard key={p.num} p={p} featured={i === 0} />)}
      </div>
    </section>);

}

/* ---------- SKILLS ---------- */
const SKILLS = [
  { group: "Languages", items: [
    { name: "Python" }, { name: "Java" }, { name: "C++" }
  ]},
  { group: "Frameworks & Tools", items: [
    { name: "React" }, { name: "TypeScript" }, { name: "Flask" },
    { name: "MongoDB" }, { name: "MySQL" }, { name: "Docker" },
    { name: "Kubernetes" }, { name: "AWS" }, { name: "HTML" }, { name: "CSS" }
  ]},
  { group: "Topics", items: [
    { name: "Data Structures" }, { name: "REST APIs" },
    { name: "Information Retrieval" }, { name: "Machine Learning" },
    { name: "Reinforcement Learning" }, { name: "Data Mining" },
    { name: "Web Serial" }
  ]}
];

function Skills() {
  return (
    <section className="container" id="skills">
      <div className="section-head">
        <h2>Skills.</h2>
        <span className="meta"></span>
      </div>
      <div className="skills-grid">
        {SKILLS.map((g) =>
        <div className="skill-group" key={g.group}>
            <h4>{g.group}</h4>
            <ul>
              {g.items.map((i) =>
            <li key={i.name}>
                  <span>{i.name}</span>
                </li>
            )}
            </ul>
          </div>
        )}
      </div>
    </section>);

}

/* ---------- THINGS I LIKE ---------- */
const LIKES = [
  { kind: "Drinking",  title: "matcha breaks",     by: "my afternoon ritual",   img: "public/assets/matcha.png" },
  { kind: "Listening", title: "k-pop playlists",   by: "on every walk",         img: "public/assets/kpop.png" },
  { kind: "Playing",   title: "ping pong",         by: "loudly, badly",         img: "public/assets/pingpong.png" },
  { kind: "Playing",   title: "badminton",         by: "weekend regulars",      img: "public/assets/badminton.png" },
  { kind: "Reading",   title: "books",             by: "stacks by the bed",     img: "public/assets/books.png?v=2" },
  { kind: "Building",  title: "coding",             by: "keyboard hum",          img: "public/assets/laptop.png?v=2" },
  { kind: "Studying",  title: "cuttlefish",        by: "my research muse",      img: "public/assets/cuttlefish.png?v=2" },
  { kind: "Doing",     title: "research",          by: "questions on questions", img: "public/assets/research.png" }
];

function Likes() {
  return (
    <section className="likes" id="likes">
      <div className="container">
        <div className="section-head">
          <h2>Things I <em>like.</em></h2>
          <span className="meta">a small archive</span>
        </div>
        <div className="likes-grid">
          {LIKES.map((l, i) =>
          <div className="like-card" key={i}>
              <div className="like-photo">
                <img src={l.img} alt={l.title} loading="lazy" />
              </div>
              <span className="kind">{l.kind}</span>
              <span className="title">{l.title}</span>
              <span className="by">{l.by}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- CONTACT ---------- */
function Contact() {
  return (
    <section className="contact container" id="contact">
      <p className="eyebrow">last stop</p>
      <h2><em>Say hello.</em></h2>
      <p>
        Open to software engineering internships, full-stack projects,
        AI/ML research, product-focused engineering, and human-centered
        technology work. Drop me a line — I read everything.
      </p>
      <div className="contact-links">
        <a className="contact-link" href="mailto:zhengj29@uci.edu">
          <span className="dot"></span> zhengj29@uci.edu
        </a>
        <a className="contact-link" href="https://github.com/kz930" target="_blank" rel="noreferrer">
          <span className="dot" style={{ background: "#6b4a52" }}></span> github / kz930
        </a>
        <a className="contact-link" href="https://www.linkedin.com/in/kary-zheng-30451b244/" target="_blank" rel="noreferrer">
          <span className="dot" style={{ background: "#b1979e" }}></span> linkedin / kary-zheng
        </a>
        <a className="contact-link" href="resume.pdf" download>
          <span className="dot" style={{ background: "#e09878" }}></span> download résumé
        </a>
      </div>
    </section>);

}

/* ---------- VINYL PLAYER ---------- */
function Vinyl() {
  const [open, setOpen] = useState(false);
  const track = { t: "Ditto", a: "NewJeans" };

  return (
    <div className="vinyl-stack">
      <div
        className={"vinyl" + (open ? " playing" : "")}
        onClick={() => setOpen((o) => !o)}
        title={open ? "hide player" : "show player"}>
        <div className="disk"></div>
        <div className="vinyl-info">
          <span className="now">{open ? "now showing" : "lo-fi"}</span>
          <span>{open ? `${track.t} — ${track.a}` : "click to play"}</span>
        </div>
      </div>
      {open &&
        <div className="vinyl-embed">
          <iframe
            src="https://archive.org/embed/newjeans-ditto-24bit-192khz"
            width="500"
            height="30"
            frameBorder="0"
            allowFullScreen
            title="Ditto — NewJeans"
          />
        </div>
      }
    </div>);

}

/* ---------- TWEAKS (just lamp-cord, no panel) ---------- */
/* The lamp cord IS the only tweak. Persisted via window.parent postMessage. */

/* ---------- APP ---------- */
function App() {
  const [stage, setStage] = useState("landing"); // landing | exiting | world
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty("--word-gap", `${t.wordGap}em`);
  }, [t.wordGap]);

  useEffect(() => {
    document.documentElement.style.setProperty("--terracotta", t.accentColor);
  }, [t.accentColor]);

  const handleEnter = () => {
    setStage("exiting");
    setTimeout(() => setStage("world"), 700);
  };

  return (
    <>
      {stage !== "world" &&
      <Landing onEnter={handleEnter} exiting={stage === "exiting"} />
      }

      {stage === "world" &&
      <>
          <TopNav />
          <Welcome />
          <About />
          <Experience />
          <Projects />
          <Publications />
          <Skills />
          <Extras />
          <Likes />
          <Contact />
          <footer className="footer">
            <span>© Kary Zheng · MMXXVI</span>
            <span>made slowly, by hand</span>
          </footer>
          <Vinyl />

          <TweaksPanel title="Tweaks">
            <TweakSection label="Welcome headline" />
            <TweakSlider
              label="Word spacing"
              value={t.wordGap}
              min={0.2} max={1.4} step={0.05} unit="em"
              onChange={(v) => setTweak("wordGap", v)}
            />
            <TweakSection label="Theme" />
            <TweakColor
              label="Accent"
              value={t.accentColor}
              onChange={(v) => setTweak("accentColor", v)}
            />
          </TweaksPanel>
        </>
      }
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);