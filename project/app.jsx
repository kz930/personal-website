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

      <div className={"scroll-cue" + (revealed ? " in" : "")}>scroll to dive in</div>
    </section>);

}

/* ---------- ISOMETRIC ROOM (compact SVG) ---------- */
function IsoRoom() {
  return (
    <svg viewBox="0 0 400 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d4ad" />
          <stop offset="1" stopColor="#d8b487" />
        </linearGradient>
        <linearGradient id="wallL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe9d2" />
          <stop offset="1" stopColor="#ecceae" />
        </linearGradient>
        <linearGradient id="wallR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5dab8" />
          <stop offset="1" stopColor="#dab48c" />
        </linearGradient>
        <linearGradient id="bedTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0a888" />
          <stop offset="1" stopColor="#d68868" />
        </linearGradient>
      </defs>

      {/* base shadow */}
      <ellipse cx="200" cy="332" rx="160" ry="14" fill="rgba(107,74,82,0.16)" />

      {/* ====== ROOM SHELL (back-walls + floor) ====== */}
      {/* floor diamond */}
      <polygon points="200,320 360,240 200,160 40,240" fill="url(#floor)" />
      {/* floor planks (thin lines) */}
      <line x1="120" y1="280" x2="280" y2="200" stroke="rgba(107,74,82,0.10)" />
      <line x1="160" y1="300" x2="320" y2="220" stroke="rgba(107,74,82,0.10)" />
      <line x1="200" y1="320" x2="360" y2="240" stroke="rgba(107,74,82,0.10)" />

      {/* LEFT BACK WALL */}
      <polygon points="40,240 200,160 200,40 40,120" fill="url(#wallL)" />
      {/* RIGHT BACK WALL */}
      <polygon points="200,160 360,240 360,120 200,40" fill="url(#wallR)" />
      {/* wall edge highlight */}
      <line x1="200" y1="40" x2="200" y2="160" stroke="rgba(107,74,82,0.18)" strokeWidth="0.8" />

      {/* ====== LEFT WALL: window with curtains ====== */}
      {/* window frame */}
      <polygon points="60,200 140,160 140,90 60,130" fill="#fff6e8" />
      <polygon points="60,200 140,160 140,158 60,198" fill="#a87850" />
      <polygon points="60,128 140,88 140,90 60,130" fill="#a87850" />
      {/* sky inside window */}
      <polygon points="63,196 137,159 137,93 63,131" fill="#dde8e8" />
      <line x1="100" y1="113" x2="100" y2="178" stroke="#a87850" strokeWidth="0.8" />
      <line x1="63,131" x2="137" y2="159" stroke="#a87850" strokeWidth="0.6" />
      {/* sun */}
      <circle cx="115" cy="120" r="8" fill="#f5e0a8" />
      {/* hill */}
      <path d="M 63 173 Q 90 158 137 167 L 137 196 L 63 196 Z" fill="#c8d4a8" />
      {/* curtains (left + right) */}
      <polygon points="48,210 70,200 70,90 48,100" fill="#fbd6b8" />
      <polygon points="130,168 152,158 152,48 130,58" fill="#fbd6b8" />
      <line x1="58" y1="200" x2="58" y2="98" stroke="#e09878" strokeWidth="1" />
      <line x1="64" y1="195" x2="64" y2="93" stroke="#e09878" strokeWidth="1" />
      <line x1="138" y1="164" x2="138" y2="56" stroke="#e09878" strokeWidth="1" />
      <line x1="144" y1="160" x2="144" y2="50" stroke="#e09878" strokeWidth="1" />

      {/* ====== RIGHT WALL: shelf with books ====== */}
      <polygon points="220,140 320,90 320,84 220,134" fill="#a87850" />
      {/* books on shelf */}
      <polygon points="232,128 240,124 240,108 232,112" fill="#b1979e" />
      <polygon points="241,124 250,119 250,102 241,107" fill="#e09878" />
      <polygon points="251,119 260,114 260,96 251,101" fill="#fcd6c1" />
      <polygon points="261,113 270,109 270,90 261,94" fill="#6b4a52" />
      <polygon points="271,108 282,103 282,84 271,89" fill="#dce0e9" />
      <polygon points="283,102 294,97 294,80 283,84" fill="#c8a878" />
      {/* shelf 2 — small plant */}
      <polygon points="220,108 320,58 320,52 220,102" fill="#a87850" />
      <polygon points="240,98 252,92 252,82 240,88" fill="#c87858" />
      <path d="M 246 86 Q 240 70 250 72 Q 256 60 264 72 Q 270 68 268 82" fill="#8aa67a" />
      <ellipse cx="252" cy="84" rx="8" ry="2" fill="#a87850" />

      {/* framed picture above shelf */}
      <polygon points="270,80 295,67 295,52 270,65" fill="#fff6e8" />
      <polygon points="273,77 292,68 292,55 273,64" fill="#ecceae" />
      <circle cx="283" cy="68" r="3.5" fill="#e09878" />

      {/* ====== BED on right side of floor ====== */}
      {/* mattress base */}
      <polygon points="200,290 320,230 360,247 240,310" fill="#fbf3e8" />
      <polygon points="240,310 360,247 360,233 240,295" fill="#e8d8c0" />
      <polygon points="200,290 240,310 240,295 200,275" fill="#d8c4a8" />
      {/* duvet (peach) */}
      <polygon points="220,283 320,232 350,244 250,298" fill="url(#bedTop)" />
      <polygon points="250,298 350,244 350,232 250,283" fill="#b8704a" />
      {/* pillow */}
      <polygon points="298,242 340,222 348,225 306,247" fill="#f7ecdf" />
      <polygon points="306,247 348,225 348,231 306,253" fill="#e0d4c4" />
      <polygon points="298,242 306,247 306,253 298,247" fill="#c8b89a" />
      {/* headboard */}
      <polygon points="320,230 360,210 360,170 320,190" fill="#a87850" />
      <polygon points="360,210 360,170 364,172 364,212" fill="#7a5238" />

      {/* ====== DESK on left side of floor ====== */}
      {/* desk top */}
      <polygon points="60,290 160,238 200,255 100,308" fill="#e8c4a0" />
      <polygon points="60,290 100,308 100,316 60,298" fill="#b08458" />
      <polygon points="100,308 200,255 200,263 100,316" fill="#c89a72" />
      {/* desk legs */}
      <line x1="68" y1="295" x2="68" y2="320" stroke="#8a6448" strokeWidth="2" />
      <line x1="190" y1="260" x2="190" y2="285" stroke="#8a6448" strokeWidth="2" />

      {/* laptop on desk */}
      <polygon points="100,275 150,250 168,257 118,283" fill="#3d2e25" />
      <polygon points="105,272 145,253 162,260 122,279" fill="#5d4a3a" />
      <polygon points="118,283 168,257 168,261 118,287" fill="#1f1812" />
      {/* screen glow */}
      <polygon points="108,272 144,254 158,260 122,278" fill="#dce8d8" opacity="0.7" />

      {/* matcha cup */}
      <ellipse cx="155" cy="265" rx="8" ry="3" fill="#6b4a52" />
      <ellipse cx="155" cy="263.5" rx="6.5" ry="2.2" fill="#a8b890" />
      {/* steam */}
      <g>
        <circle cx="155" cy="258" r="1.8" fill="rgba(255,255,255,0.7)">
          <animate attributeName="cy" from="262" to="240" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="256" r="1.6" fill="rgba(255,255,255,0.7)">
          <animate attributeName="cy" from="262" to="237" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* desk lamp */}
      <line x1="80" y1="288" x2="80" y2="265" stroke="#6b4a52" strokeWidth="1.5" />
      <path d="M 80 265 L 80 250 Q 80 244 86 244" fill="none" stroke="#6b4a52" strokeWidth="1.5" />
      <polygon points="76,247 96,247 100,238 80,238" fill="#fcd6c1" />
      <ellipse cx="88" cy="247" rx="10" ry="2" fill="#fff1cc" opacity="0.6" />

      {/* ====== RUG (between desk and bed) ====== */}
      <polygon points="160,306 240,266 280,280 200,322" fill="#ecb8a6" opacity="0.85" />
      <polygon points="170,302 230,272 270,283 210,316" fill="none" stroke="#c87858" strokeWidth="0.8" strokeDasharray="3 2" />

      {/* ====== floor cushion ====== */}
      <polygon points="180,316 210,300 226,306 196,323" fill="#e09878" />
      <polygon points="180,316 196,323 196,328 180,322" fill="#b8704a" />
    </svg>
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
        <a href="#projects">projects</a>
        <a href="#extras">extras</a>
        <a href="#experience">experience</a>
        <a href="#publications">writing</a>
        <a href="#skills">skills</a>
        <a href="#contact">say hi</a>
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
          <p className="about-facts">
            UC Irvine <span aria-hidden="true">·</span> B.S. Computer Science <span aria-hidden="true">·</span> B.A. Psychological Science <span aria-hidden="true">·</span> ICS Honors <span aria-hidden="true">·</span> GPA 3.95
          </p>
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
            <span>fig. 01</span>
            <span>my desk · 2026</span>
          </div>
          <div className="room"><IsoRoom /></div>
          <div className="room-caption">a small room, mostly mine.</div>
        </div>
      </div>
    </section>);

}

/* ---------- PROJECTS ---------- */
const PROJECTS = [
  { num: "01", title: "Scalable Search Engine", desc: "Disk-based search engine over 50K+ web pages — crawler, inverted index, TF-IDF ranking, sub-300ms queries.", year: "2026", tags: ["Python", "IR", "TF-IDF"], href: null,
    bullets: [
      "Built a disk-based inverted index over 50,000+ ICS web pages, supporting partial indexing and on-disk merging to avoid memory blowups.",
      "Implemented TF-IDF ranking with cosine similarity and tiered scoring (title / heading / body), tuned to push relevant results to the top.",
      "Wrote a multi-threaded crawler with polite delays, robots.txt handling, and SimHash-based near-duplicate detection.",
      "Achieved sub-300ms average query latency on 50K+ docs running locally on a laptop, with a small Flask query UI."
    ]
  },
  { num: "02", title: "Fabflix", desc: "Full-stack movie search & checkout with REST APIs, MySQL, Dockerized microservices on Kubernetes/AWS.", year: "2026", tags: ["Java", "MySQL", "K8s"], href: null,
    bullets: [
      "Designed a relational schema with foreign-key constraints across movies, stars, genres, and customers; loaded via custom XML parsers.",
      "Built RESTful Java backend with prepared statements throughout — defended against SQL injection and XSS in security audit.",
      "Containerized backend + MySQL with Docker Compose; deployed read/write-split microservices to a Kubernetes cluster on AWS EC2.",
      "Integrated Stripe checkout and Google reCAPTCHA; load-tested with JMeter to validate scaling under 100+ concurrent shoppers."
    ]
  },
  { num: "03", title: "LifeLink", desc: "AI-powered CPR emergency response — voice agent + Arduino compression feedback over Web Serial.", year: "2026", tags: ["React", "ElevenLabs", "Arduino"], href: "https://www.lifelinkfor.us/",
    bullets: [
      "Won 1st place at HackUCI 2026 — built end-to-end in 36 hours with a 4-person team.",
      "Designed a voice agent (ElevenLabs) that calmly guides bystanders through CPR with real-time audio coaching at the right BPM.",
      "Connected an Arduino + force sensor to the browser via Web Serial API to measure compression depth/rate live.",
      "Built a React UI that visualizes compression quality and dispatches an emergency call template with location + status."
    ]
  },
  { num: "04", title: "CARL — Cognitive Anteater Robotics Lab", desc: "Reinforcement learning simulations of episodic-like memory in cuttlefish behavior. Co-authored Scientific Reports paper.", year: "2024–", tags: ["Python", "Q-Learning", "Research"], href: "https://www.nature.com/articles/s41598-025-31950-x",
    bullets: [
      "Co-authored a Scientific Reports paper modeling episodic-like memory in cuttlefish foraging behavior.",
      "Designed and ran Q-learning simulations across four delay/reward conditions; achieved stable convergence at delays up to 130s.",
      "Wrote the simulation framework in Python (NumPy + custom env), produced figures and statistical analyses for the paper.",
      "Presenting at UROP Symposium May 2026; ongoing extension work on memory consolidation under partial observability."
    ]
  },
  { num: "05", title: "PhoenixConnect", desc: "Disaster-response app — wildfire data, shelter mapping, and community reports for emergency updates.", year: "2025", tags: ["Flask", "MongoDB", "NASA API"], href: null,
    bullets: [
      "Built during NASA Space Apps Challenge — emergency-response app for wildfire-affected communities.",
      "Pulled live wildfire perimeters from NASA FIRMS API; rendered interactive maps with Leaflet + clustered shelter markers.",
      "Backend in Flask + MongoDB stores user-submitted incident reports, photos, and shelter availability with moderation queue.",
      "Designed an offline-friendly UI with cached map tiles for low-connectivity disaster zones."
    ]
  }
];

const EXTRAS = [
  { num: "a", title: "Edugen", desc: "AI lesson-generation platform — turns objectives into structured slides, narrated videos, and assessments.", year: "2025", tags: ["LLMs", "RAG", "EdTech"], href: null,
    bullets: [
      "Designed a teacher-facing tool: enter a learning objective + grade level → out comes a full lesson kit (slides, narrated video, quiz).",
      "Built a multi-stage LLM pipeline (outline → expand → narrate → assess) with RAG over uploaded textbooks for accuracy.",
      "Generated narrated videos via TTS + slide-image compositing; assessment generator includes auto-grading rubrics.",
      "Side build — explored what a teaching co-pilot could feel like if lesson prep took 5 minutes instead of 5 hours."
    ]
  },
  { num: "b", title: "Lingualize", desc: "LLM writing assistant that refines language while tracking changes in emotional tone.", year: "2025", tags: ["Streamlit", "LLM", "Emotion"], href: null,
    bullets: [
      "Streamlit app that rewrites text for clarity/concision while tracking the emotional tone shift in a side-by-side panel.",
      "Combined an LLM rewriter with an emotion-classification API (joy / anger / sadness / fear) to score each draft.",
      "Visualized tone deltas as horizontal bars so writers can see when an edit accidentally flattens or amplifies feeling.",
      "Built for my own writing — kept catching myself sanding the emotion out of essays without realizing it."
    ]
  }
];

function ProjectRow({ p }) {
  const [open, setOpen] = useState(false);
  const hasBullets = p.bullets && p.bullets.length > 0;
  return (
    <div className={"project-row" + (open ? " open" : "")}>
      <button
        type="button"
        className="project-row-head"
        onClick={() => hasBullets && setOpen((o) => !o)}
        aria-expanded={open}>

        <span className="num">{p.num}</span>
        <div className="project-main">
          <h3>{p.title}</h3>
          <span className="desc">{p.desc}</span>
          <div className="project-tags">
            {p.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
        <span className="year">{p.year}</span>
        <span className="arrow">{open ? "−" : "+"}</span>
      </button>
      {open && hasBullets &&
      <div className="project-detail">
          <ul>
            {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          {p.href &&
        <a className="project-detail-link" href={p.href} target="_blank" rel="noreferrer">
              visit project ↗
            </a>
        }
        </div>
      }
    </div>);

}

function Projects() {
  return (
    <section className="container" id="projects">
      <div className="section-head">
        <h2>Projects.</h2>
        <span className="meta">engineering · research · product builds — click to expand</span>
      </div>
      <div className="project-list">
        {PROJECTS.map((p) => <ProjectRow key={p.num} p={p} />)}
      </div>
    </section>);

}

/* ---------- EXTRAS (off-resume side projects) ---------- */
function ExtraCard({ p }) {
  const [open, setOpen] = useState(false);
  const hasBullets = p.bullets && p.bullets.length > 0;
  return (
    <div className={"extra-card" + (open ? " open" : "")}>
      <button
        type="button"
        className="extra-card-head-btn"
        onClick={() => hasBullets && setOpen((o) => !o)}
        aria-expanded={open}>

        <div className="extra-card-head">
          <span className="extra-marker">·</span>
          <span className="extra-year">{p.year}</span>
        </div>
        <h3>{p.title}</h3>
        <p className="extra-desc">{p.desc}</p>
        <div className="extra-tags">
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        <span className="extra-toggle">{open ? "− less" : "+ more"}</span>
      </button>
      {open && hasBullets &&
      <div className="extra-detail">
          <ul>
            {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      }
    </div>);

}

function Extras() {
  return (
    <section className="container extras-section" id="extras">
      <div className="section-head">
        <h2><em>Side quests.</em></h2>
        <span className="meta">extras · not on the résumé · built for fun + curiosity</span>
      </div>
      <p className="extras-intro">
        Smaller experiments and weekend builds — things I made because the idea wouldn't leave me alone.
        These don't make the official cut, but they're some of my favorites.
      </p>
      <div className="extras-grid">
        {EXTRAS.map((p) => <ExtraCard key={p.num} p={p} />)}
      </div>
    </section>);

}

/* ---------- EXPERIENCE ---------- */
const EXPERIENCE = [
  { when: "Sep 2024 — now", role: "Research Assistant", where: "Cognitive Anteater Robotics Lab · UC Irvine", desc: "Q-learning simulations across four conditions, stable convergence under 130s delays. Co-authored Scientific Reports paper on episodic-like memory in cuttlefish.",
    bullets: [
      "Designed and ran reinforcement-learning simulations modeling episodic-like memory in cuttlefish foraging behavior.",
      "Implemented Q-learning agents in Python (NumPy + custom env) across four delay/reward conditions with reproducible seeds.",
      "Achieved stable convergence at delays up to 130 seconds, validating the model's biological plausibility.",
      "Co-authored the resulting paper in Scientific Reports (2025); preparing follow-up work on memory consolidation."
    ]
  },
  { when: "Sep 2024 — Sep 2025", role: "Software / Assessment Intern", where: "Mucci Assessment · Remote", desc: "Automated dashboards via Google Sheets API — cut manual reporting ~80%. Built reusable web modules to speed up client data access.",
    bullets: [
      "Built automated reporting pipelines using the Google Sheets API + Apps Script — reduced weekly manual work by ~80%.",
      "Designed reusable web modules (HTML/CSS/JS) embedded in client dashboards for faster data lookup and filtering.",
      "Migrated legacy client onboarding spreadsheets into a structured, multi-tenant template with validation rules.",
      "Documented patterns + handoff guides so non-engineering staff could maintain and extend the tooling."
    ]
  },
  { when: "Apr 2025 — Jun 2025", role: "Learning Assistant — Intro to Python", where: "UC Irvine", desc: "Led weekly Python labs for 30+ students. Guided debugging, program design, and core CS concepts in hands-on sessions.",
    bullets: [
      "Led weekly hands-on Python labs for 30+ first-year CS students; covered control flow, functions, lists/dicts, OOP basics.",
      "Walked students through real debugging — reading tracebacks, isolating bugs, designing tests instead of guessing fixes.",
      "Held office hours focused on the conceptual jumps (recursion, references vs. values) rather than just answers.",
      "Wrote supplemental practice problems for students who finished early or wanted extra challenge."
    ]
  }
];

function ExperienceRow({ e }) {
  const [open, setOpen] = useState(false);
  const hasBullets = e.bullets && e.bullets.length > 0;
  return (
    <div className={"exp-row" + (open ? " open" : "")}>
      <button
        type="button"
        className="exp-row-head"
        onClick={() => hasBullets && setOpen((o) => !o)}
        aria-expanded={open}>

        <span className="when">{e.when}</span>
        <div className="what">
          <h3>{e.role}</h3>
          <span className="where">{e.where}</span>
        </div>
        <p className="desc">{e.desc}</p>
        <span className="exp-toggle">{open ? "−" : "+"}</span>
      </button>
      {open && hasBullets &&
      <div className="exp-detail">
          <ul>
            {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      }
    </div>);

}

function Experience() {
  return (
    <section className="container" id="experience">
      <div className="section-head">
        <h2>Experience.</h2>
        <span className="meta">a partial timeline — click to expand</span>
      </div>
      <div className="exp-list">
        {EXPERIENCE.map((e, i) => <ExperienceRow key={i} e={e} />)}
      </div>
    </section>);

}

/* ---------- PUBLICATIONS ---------- */
const PUBLICATIONS = [
  {
    num: "01",
    title: "Episodic-like memory in a simulation of cuttlefish behavior",
    venue: "Scientific Reports · 2025",
    authors: "Kandimalla, S., Wong, Q. Y., Zheng, K. et al.",
    href: "https://www.nature.com/articles/s41598-025-31950-x"
  }
];

function Publications() {
  return (
    <section className="container" id="publications">
      <div className="section-head">
        <h2>Writing &amp; <em>publications.</em></h2>
        <span className="meta">peer-reviewed · 2025</span>
      </div>
      <div className="pub-list">
        {PUBLICATIONS.map((p) =>
        <div className="pub-row" key={p.num}>
            <span className="num">{p.num}</span>
            <div>
              <div className="pub-title">{p.title}</div>
              <div className="pub-meta">{p.authors}</div>
              <div className="pub-meta" style={{ fontStyle: "italic" }}>{p.venue}</div>
            </div>
            <a className="pub-link" href={p.href} target="_blank" rel="noreferrer">read on Nature ↗</a>
          </div>
        )}
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
        <span className="meta">a working list, not a flex</span>
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
  { kind: "Reading",   title: "books",             by: "stacks by the bed",     img: "public/assets/books.png" },
  { kind: "Building",  title: "side projects",     by: "keyboard hum",          img: "public/assets/laptop.png" },
  { kind: "Studying",  title: "cuttlefish",        by: "my research muse",      img: "public/assets/cuttlefish.png" },
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
  const [playing, setPlaying] = useState(false);
  const tracks = [
  { t: "rainy windowsill", a: "m. atari" },
  { t: "early light", a: "slow tapes" },
  { t: "a quiet kitchen", a: "ko fujita" },
  { t: "library hours", a: "north branch" }];

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % tracks.length), 14000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [playing]);
  const cur = tracks[idx];
  return (
    <div className={"vinyl" + (playing ? " playing" : "")} onClick={() => setPlaying((p) => !p)} title={playing ? "pause" : "play"}>
      <div className="disk"></div>
      <div className="vinyl-info">
        <span className="now">{playing ? "now playing" : "lo-fi"}</span>
        <span>{playing ? `${cur.t} — ${cur.a}` : "click to play"}</span>
      </div>
    </div>);

}

/* ---------- TWEAKS (just lamp-cord, no panel) ---------- */
/* The lamp cord IS the only tweak. Persisted via window.parent postMessage. */

/* ---------- APP ---------- */
function App() {
  const [stage, setStage] = useState("landing"); // landing | exiting | world
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mode = t.mode;

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--word-gap", `${t.wordGap}em`);
  }, [t.wordGap]);

  useEffect(() => {
    document.documentElement.style.setProperty("--terracotta", t.accentColor);
  }, [t.accentColor]);

  const setMode = (m) => setTweak("mode", m);

  const handleEnter = () => {
    setStage("exiting");
    setTimeout(() => setStage("world"), 700);
  };

  const togglMode = () => setMode(mode === "day" ? "night" : "day");

  return (
    <>
      {stage !== "world" &&
      <Landing onEnter={handleEnter} exiting={stage === "exiting"} />
      }

      {stage === "world" &&
      <>
          <TopNav mode={mode} />
          <LampCord mode={mode} onPull={togglMode} />
          <Welcome />
          <About />
          <Projects />
          <Extras />
          <Experience />
          <Publications />
          <Skills />
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
            <TweakRadio
              label="Mode"
              value={t.mode}
              options={["day", "night"]}
              onChange={(v) => setTweak("mode", v)}
            />
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