# FOMO UI/UX Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the FOMO Daily Checklist into an exquisite, tactile skeuomorphic experience. 
**Architecture:** The tasks are divided into three highly independent sub-systems: Dark Mode & Fold Physics, Pencil Sketch Loading Skeleton, and 3D Press & Ink Bleeding Effects. 
**Tech Stack:** React 18, Vite, Tailwind CSS v4, SVG Filters, CSS Custom Properties.

## Global Constraints
- Do not introduce external styling libraries; stick to custom CSS/Tailwind.
- Maintain maximum backward compatibility; preserve original localstorage keys (`fomo:done`, `fomo:streak`).
- Ensure no layout shift (CLS < 0.05) when loading feeds asynchronously.
- The UI must look polished and tactile on mobile viewports (minimum 375px wide).

---

### Task 1: Dark Mode & Fold Physics

**Files:**
- Modify: `D:/MyProjects/FOMO/src/index.css`
- Modify: `D:/MyProjects/FOMO/src/App.tsx`

**Interfaces:**
- Consumes: None (Starting base state)
- Produces: Dark theme variable triggers (`.dark-mode`), Dark/Light manual switch API.

- [ ] **Step 1: Define Dark Mode colors in variables**
  Add dark mode colors inside `src/index.css` scoped under `.dark` class (which will be added to the `html` element).
  
  ```css
  :root.dark {
    --paper:        #2c251e;        /* 深褐老牛皮纸 */
    --paper-light:  #352d24;
    --paper-shade:  #201b16;
    --ink:          #e5dacf;        /* 亮米金淡墨 */
    --ink-soft:     #cbbb9f;        /* 柔和金褐 */
    --ink-muted:    #8e7e68;        /* 弱化墨 */
    --rule:         #6b5a45;        /* 深金色横线 */
    --rule-soft:    rgba(140, 110, 80, 0.22);
    --margin-red:   #ab3d30;        /* 哑红装订线 */
    --margin-red-s: #8a2b20;
    --stamp-red:    #cd5c5c;        /* 朱砂红章 */
    --done-green:   #6b8e5c;        /* 青苔绿 */
    --sepia:        #c2a278;
    --desk:         #15100c;        /* 暗桌面 */
  }
  ```

- [ ] **Step 2: Add Dark Mode State to App.tsx**
  Implement state in `src/App.tsx` and hook it up to system preferences and LocalStorage.
  
  ```typescript
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fomo:dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('fomo:dark-mode', String(darkMode));
  }, [darkMode]);
  ```

- [ ] **Step 3: Implement Page-Fold Toggle DOM in App.tsx**
  Add fold element in the header or `.sheet` container:
  
  ```typescript
  {/* Inside App.tsx, inside the <article className="sheet"> */}
  <div 
    className="paper-fold" 
    onClick={() => setDarkMode(!darkMode)}
    title={darkMode ? "切换至白昼模式" : "切换至黑夜模式"}
    aria-label="昼夜切换折角"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setDarkMode(!darkMode); }}
  >
    <span className="fold-text">{darkMode ? "昼" : "夜"}</span>
  </div>
  ```

- [ ] **Step 4: Design folding physics in CSS**
  Add styles in `src/index.css` for `.paper-fold`. Ensure realistic folding triangles using linear-gradients and box-shadows.
  
  ```css
  .paper-fold {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    cursor: pointer;
    z-index: 10;
    transition: transform 0.3s ease;
    background: linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 55%, transparent 55%);
  }
  .paper-fold::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent transparent var(--paper-shade) transparent;
    box-shadow: -2px 2px 4px rgba(0,0,0,0.15);
    transition: border-color 0.3s, border-width 0.2s;
  }
  .paper-fold:hover::before {
    border-width: 0 48px 48px 0;
  }
  .fold-text {
    position: absolute;
    top: 6px;
    right: 12px;
    font-family: 'Ma Shan Zheng', serif;
    font-size: 14px;
    color: var(--ink-muted);
    transform: rotate(45deg);
    pointer-events: none;
    user-select: none;
  }
  ```

- [ ] **Step 5: Run typecheck and verify build**
  Run: `npm run typecheck && npm run build`
  Expected: Command finishes successfully with zero errors.

- [ ] **Step 6: Commit changes**
  ```bash
  git add src/index.css src/App.tsx
  git commit -m "feat(ui): implement skeuomorphic dark mode with paper fold toggle"
  ```

---

### Task 2: Pencil Sketch Loading Skeleton & CLS Mitigation

**Files:**
- Modify: `D:/MyProjects/FOMO/src/components/SourceCard.tsx`
- Modify: `D:/MyProjects/FOMO/src/index.css`

**Interfaces:**
- Consumes: `loading` prop in `SourceCard`
- Produces: CSS animation for `.sketch-skeleton` and HTML skeleton markup.

- [ ] **Step 1: Refactor Loading Markup in SourceCard.tsx**
  Replace simple text "加载中..." with pencil-drawn sketch line paths inside the feed preview box.
  
  ```typescript
  {/* Inside SourceCard.tsx, under the loading condition */}
  {loading && hasFeed && (
    <div className="row-preview skeleton-container">
      <svg className="sketch-skeleton" viewBox="0 0 400 68" preserveAspectRatio="none">
        {/* Row 1: Line 1 */}
        <path d="M 5,12 Q 100,10 200,13 T 390,11" className="skeleton-pencil" />
        {/* Row 2: Line 2 */}
        <path d="M 5,34 Q 120,36 240,33 T 370,35" className="skeleton-pencil" />
        {/* Row 3: Line 3 */}
        <path d="M 5,56 Q 80,54 180,57 T 330,55" className="skeleton-pencil" />
      </svg>
    </div>
  )}
  ```

- [ ] **Step 2: Setup fixed height to avoid Layout Shift (CLS)**
  Fix the preview height range in `src/index.css`. Keep a minimum preview block height of `68px` for loading feeds so that when feeds mount, the elements do not jump.
  
  ```css
  .row-preview {
    min-height: 68px; /* Fixed height for 3 lines to contain skeleton/content stably */
    transition: min-height 0.3s ease;
  }
  .skeleton-container {
    position: relative;
    overflow: hidden;
  }
  .sketch-skeleton {
    width: 100%;
    height: 68px;
    display: block;
  }
  ```

- [ ] **Step 3: Animate Sketch lines with Hand-drawn Shimmer in CSS**
  Use stroke animation with dashed strokes or pulse opacity to simulate sketchy drawings coming alive.
  
  ```css
  .skeleton-pencil {
    fill: none;
    stroke: var(--ink-soft);
    stroke-width: 1.2;
    stroke-linecap: round;
    opacity: 0.35;
    stroke-dasharray: 400;
    stroke-dashoffset: 0;
    animation: pencilDraw 2s ease-in-out infinite alternate;
  }
  
  @keyframes pencilDraw {
    0% {
      stroke-dashoffset: 30;
      opacity: 0.2;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 0.55;
    }
  }
  ```

- [ ] **Step 4: Run typecheck and verify build**
  Run: `npm run typecheck && npm run build`
  Expected: Success.

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/components/SourceCard.tsx src/index.css
  git commit -m "feat(ui): add sketchy pencil loading skeletons and stabilize height"
  ```

---

### Task 3: 3D Card Press & Ink Bleeding Effects

**Files:**
- Modify: `D:/MyProjects/FOMO/src/index.css`
- Modify: `D:/MyProjects/FOMO/src/App.tsx`
- Modify: `D:/MyProjects/FOMO/src/components/SourceCard.tsx`

**Interfaces:**
- Consumes: `.row.done` toggles.
- Produces: 3D transforms, SVG Ink bleeding filter overlay, updated checklist styles.

- [ ] **Step 1: Inject SVG Ink Bleeding Filter into HTML**
  Define a turbulence-based ink bleeding filter globally. Inject the `<svg>` containing the filter definition in `src/App.tsx` (hidden at the top/bottom).
  
  ```typescript
  {/* Inside App.tsx root return */}
  <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
    <defs>
      <filter id="ink-bleed-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
  ```

- [ ] **Step 2: Add 3D Press Effects in CSS**
  Make the `.row` feel like a bouncy surface by defining perspective and transform-style.
  
  ```css
  .row {
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.2s;
  }
  .row:active {
    transform: scale(0.992) translateZ(-4px) rotateX(0.8deg);
    background: rgba(180, 140, 80, 0.12);
  }
  ```

- [ ] **Step 3: Wire up Ink Bleeding filter to Checked elements**
  Apply the filter to the tick path (`.tick`) and the crossed-out text (`.row.done .row-name`) to create slightly fuzzy, bleeding edges.
  
  ```css
  .row.done .check .tick {
    filter: url(#ink-bleed-filter);
    animation: bleedExpansion 0.4s ease-out forwards;
  }
  .row.done .row-name {
    filter: url(#ink-bleed-filter);
  }
  
  @keyframes bleedExpansion {
    0% {
      stroke-dashoffset: 60;
      filter: url(#ink-bleed-filter) contrast(1.5) brightness(0.9);
    }
    100% {
      stroke-dashoffset: 0;
      filter: url(#ink-bleed-filter) contrast(1.1) brightness(1);
    }
  }
  ```

- [ ] **Step 4: Run typecheck and verify build**
  Run: `npm run typecheck && npm run build`
  Expected: Success.

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/App.tsx src/index.css src/components/SourceCard.tsx
  git commit -m "feat(ui): implement 3D card press physics and SVG ink bleeding effects"
  ```
