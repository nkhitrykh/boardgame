const APP_VERSION = 8;
const CAMPAIGN_SAVE_KEY = "felix-producto-campaign-v8-8";
const PLAYTEST_SAVE_KEY = "felix-producto-playtest-v8-8";

const RESOURCE_ICONS = {
  Coal: "coal.png",
  Minerals: "minerals.png",
  Copper: "copper.png",
  Steel: "steel.png",
  Wires: "wires.png",
  Circuits: "circuits.png",
  Iron: "iron.png",
  Screw: "screws.png",
  Screws: "screws.png",
  Uranium: "uranium.png",
  "Refined Uranium": "refined-uranium.png",
  Beam: "beam.png",
  Frame: "frame.png",
  Processor: "processor.png",
  Core: "core.png",
};

// Future content: add responsive board setup diagrams after exact Tile placements
// are supplied, and show only physical Recipe card numbers after their IDs are final.
// Recipe formulas intentionally remain hidden from the Digital Portal.
const LEVELS = [
  {
    id: "L0",
    label: "Level 0",
    credits: 20,
    objectives: [
      { resource: "Iron", amount: 1 },
      { resource: "Copper", amount: 1 },
    ],
    inputs: [
      { resource: "Minerals", amount: 2 },
      { resource: "Coal", amount: 2 },
    ],
    optionalOutputs: [],
  },
  {
    id: "L1",
    label: "Level 1",
    credits: 16,
    objectives: [
      { resource: "Copper", amount: 2 },
      { resource: "Steel", amount: 1 },
    ],
    inputs: [
      { resource: "Minerals", amount: 4 },
      { resource: "Minerals", amount: 2 },
      { resource: "Coal", amount: 2 },
    ],
    optionalOutputs: [
      { resource: "Iron", amount: 1, reward: 5 },
    ],
  },
  {
    id: "L2",
    label: "Level 2",
    credits: 20,
    objectives: [
      { resource: "Circuits", amount: 4 },
      { resource: "Steel", amount: 2 },
    ],
    inputs: [
      { resource: "Iron", amount: 2 },
      { resource: "Coal", amount: 2 },
      { resource: "Minerals", amount: 4 },
      { resource: "Copper", amount: 2 },
    ],
    optionalOutputs: [
      { resource: "Steel", amount: 1, reward: 5 },
    ],
  },
  {
    id: "L3",
    label: "Level 3",
    credits: 20,
    objectives: [
      { resource: "Screws", amount: 3 },
      { resource: "Refined Uranium", amount: 2 },
    ],
    inputs: [
      { resource: "Uranium", amount: 3 },
      { resource: "Coal", amount: 2 },
      { resource: "Minerals", amount: 4 },
      { resource: "Minerals", amount: 1 },
    ],
    optionalOutputs: [
      { resource: "Screw", amount: 1, reward: 5 },
      { resource: "Uranium", amount: 1, reward: 5 },
    ],
  },
  {
    id: "L4",
    label: "Level 4",
    credits: 60,
    objectives: [
      { resource: "Payload", amount: 1 },
      { resource: "Shell", amount: 1 },
    ],
    inputs: [
      { resource: "Refined Uranium", amount: 3 },
      { resource: "Steel", amount: 5 },
      { resource: "Circuits", amount: 6 },
      { resource: "Iron", amount: 5 },
    ],
    optionalOutputs: [],
  },
];

const NARRATIVES = {
  L0: {
    paragraphs: [
      "Acceptable work. Your next job will feature a new material, Steel. This will be high-grade Steel fit for bridge building, fork welding, and defense projects. Don’t screw up and get it done cheaply.",
      "You’ll notice this Level has an Optional Output. Satisfying it will grant you extra Credits to use for the job. Follow the instructions following this message to complete the next job.",
    ],
  },
  L1: {
    paragraphs: [
      "Good job, employee. Your EVS has hit a high enough point that we will allow you to continue working for the company. We’ll need a little more Steel for your next project, and I’m just getting a message here that you’ll also be making some circuitry.",
    ],
  },
  L2: {
    paragraphs: [
      "I think the company’s starting to notice your hard work. No factory planner has ever produced Circuits so effectively before. Keep this up and you might even be paid in a year or two.",
      "I’ve worked here for 63 years. I even started out planning factories like you. I’ve never seen such talent before. Even I’ve never been paid.",
      "Next, you’ll be working with a rather dangerous material for a secret project planned by the higher-ups. Don’t ask questions, just refine that Uranium. Remember: produce it effectively, efficiently, and hopefully safely.",
    ],
  },
  L3: {
    paragraphs: [
      "This next job should be a little familiar. You’ll be using the materials you’ve previously produced. Keep your head down and work efficiently. I’ll be in contact with you before the factory is switched on.",
    ],
  },
};

const FINAL_NARRATIVE = {
  paragraphs: [
    "I suppose at this point you’ve realized what you have created. I’ll give you this one for free: yes, it’s a bomb. Why do we need a bomb? I’ll also answer that. The higher-ups have been developing a new medical procedure. By injecting a person’s lymph nodes with a Uranium-based serum, their bodies will adapt and become all but immune to radiation.",
    "This marvel of technology simply doesn’t have a market yet. That is where you come in. This bomb isn’t for sale to some defense contractor or military black site. It’s to create demand: demand for anti-radiation protection. A demand for something only the company has the supply to meet. A demand for something we, and only we, set the price for.",
    "I need you to switch on the factory. I have a family to feed. I need a paycheck from the company. So what if a few cities get nuked? My child is starving, man! Switch on that factory and we’ll get paid! Have you ever seen a dollar bill before? Back before the great incorporation, this thing called the “government” would just make them. You could find them just lying on the street. People would just go to stores and buy whatever they wanted. They didn’t need to beg their companies to eat. Payment was required!",
    "Are you just going to sit there, watching your money go down the drain? Think about it: if the company gets rich, the wealth will find its way to us! What will the CEO do with the money this will make him? He won’t be able to spend it all. It’ll find its way to us! Turn it on, keep your head down, and we’ll both be PAID!",
  ],
};

const ENDINGS = {
  yes: {
    label: "Factory Switched On",
    text: "The wealth never trickled down. Once-great cities of a once-great civilization were reduced to rubble overnight. The company’s stock price shot up 3000 points in 24 hours. You were never paid, despite your flawless EVS. What’s worse, you can’t afford the treatment. Good luck with your new life in the wasteland!",
  },
  no: {
    label: "Factory Destroyed",
    text: "You never delivered the bombs. You switched on the factory long enough to produce one, and only one. Detonating it, you take the factory and yourself with it. The company simply replaced you. You saved millions of lives, and your body and name were erased from the company’s records and history. No one has been able to produce the bombs since your death.",
  },
};

const TYPEWRITER_DELAY = 36;
const TYPEWRITER_START_DELAY = 400;
const CREDITS_DURATION = 31000;
const CREDITS_SKIP_TITLE_DURATION = 3000;

const app = document.querySelector("#app");
const siteActions = document.querySelector("#site-actions");
const rulesDialog = document.querySelector("#quick-rules-dialog");

let campaignSave = loadSave(CAMPAIGN_SAVE_KEY, "campaign");
let activeSession = null;
let currentView = "home";
let typewriterStartTimer = null;
let typewriterTimer = null;
let creditsReturnTimer = null;
let activeNarrativeText = "";

function levelById(levelId) {
  return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
}

function maximumCredits(level) {
  return level.credits + level.optionalOutputs.reduce((total, output) => total + output.reward, 0);
}

function narrativeText(narrative) {
  return narrative.paragraphs.join("\n\n");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function createSession(mode, levelId = "L0") {
  return {
    version: APP_VERSION,
    mode,
    levelId,
    stage: "level",
    scores: {},
    result: null,
    ending: null,
  };
}

function normalizeSave(value, expectedMode) {
  if (!value || value.version !== APP_VERSION || value.mode !== expectedMode) return null;
  if (!LEVELS.some((level) => level.id === value.levelId)) return null;
  const stage = value.stage === "intro" ? "level" : value.stage;
  if (!["level", "evs", "result", "narrative", "final-narrative", "final-choice", "ending", "credits", "complete"].includes(stage)) return null;
  if (expectedMode === "campaign" && stage === "complete") return null;

  const scores = {};
  if (value.scores && typeof value.scores === "object") {
    LEVELS.forEach((level) => {
      const score = value.scores[level.id];
      if (Number.isInteger(score) && score >= 0 && score <= maximumCredits(level)) {
        scores[level.id] = score;
      }
    });
  }

  const currentLevel = levelById(value.levelId);
  const resultCredits = value.result?.credits;
  const result = Number.isInteger(resultCredits) && resultCredits >= 0 && resultCredits <= maximumCredits(currentLevel)
    ? { credits: resultCredits, message: resultForCredits(resultCredits) }
    : null;
  if (stage === "result" && !result) return null;

  return {
    version: APP_VERSION,
    mode: expectedMode,
    levelId: value.levelId,
    stage,
    scores,
    result,
    ending: value.ending === "yes" || value.ending === "no" ? value.ending : null,
  };
}

function loadSave(key, mode) {
  try {
    return normalizeSave(JSON.parse(localStorage.getItem(key)), mode);
  } catch {
    return null;
  }
}

function saveActiveSession() {
  if (!activeSession) return;
  const key = activeSession.mode === "campaign" ? CAMPAIGN_SAVE_KEY : PLAYTEST_SAVE_KEY;
  localStorage.setItem(key, JSON.stringify(activeSession));
  if (activeSession.mode === "campaign") campaignSave = activeSession;
}

function iconMarkup(resource) {
  const file = RESOURCE_ICONS[resource];
  if (!file) return "";
  return `<img class="resource-icon" src="assets/icons/${file}" alt="" aria-hidden="true">`;
}

function resourceMarkup(item, modifier = "") {
  return `
    <li class="resource-item ${modifier}">
      ${iconMarkup(item.resource)}
      <span class="resource-value"><strong>${item.amount}x</strong><span>${item.resource}</span></span>
    </li>
  `;
}

function objectiveListMarkup(level) {
  return level.objectives.map((item) => resourceMarkup(item, "objective-resource")).join("");
}

function inputListMarkup(level) {
  return level.inputs.map((item) => resourceMarkup(item)).join("");
}

function optionalOutputMarkup(level) {
  if (!level.optionalOutputs.length) return `<p class="empty-state">None</p>`;
  return `
    <ul class="resource-list optional-output-list">
      ${level.optionalOutputs.map((item) => `
        <li class="resource-item optional-output-item">
          ${iconMarkup(item.resource)}
          <span class="resource-value"><strong>${item.amount}x</strong><span>${item.resource}</span></span>
          <span class="reward-value">+${item.reward} Credits</span>
        </li>
      `).join("")}
    </ul>
    <p class="section-note">Each Optional Output pays once.</p>
  `;
}

function proportionalRecipeNoticeMarkup(level) {
  const levelIndex = LEVELS.findIndex((item) => item.id === level.id);
  if (levelIndex < 2) return "";

  return `
    <aside class="recipe-output-notice" aria-labelledby="recipe-output-rule-title">
      <div>
        <p class="eyebrow">Recipe Rule</p>
        <h2 id="recipe-output-rule-title">Proportional Outputs</h2>
      </div>
      <p><strong>2x inputs → 2x outputs.</strong> Providing a multiple of the required inputs for a Recipe will produce outputs proportionally.</p>
    </aside>
  `;
}

function scoreSummaryMarkup() {
  const recordedScores = LEVELS.map((level) => ({
    level,
    score: Number.isInteger(activeSession.scores[level.id]) ? activeSession.scores[level.id] : null,
  }));
  const total = recordedScores.reduce((sum, item) => sum + (item.score ?? 0), 0);

  return `
    <section class="campaign-score-summary" aria-labelledby="campaign-score-title">
      <div class="section-heading">
        <h2 id="campaign-score-title">Total EVS</h2>
      </div>
      <dl class="level-score-list">
        ${recordedScores.map(({ level, score }) => `
          <div class="level-score-item ${score === null ? "unrecorded-score" : ""}">
            <dt>${level.label}</dt>
            <dd>${score ?? "—"}</dd>
          </div>
        `).join("")}
        <div class="level-score-item total-score-item">
          <dt>Total</dt>
          <dd>${total}</dd>
        </div>
      </dl>
    </section>
  `;
}

function progressLabel(session) {
  const level = levelById(session.levelId);
  const stageLabels = {
    level: "In progress",
    evs: "Enter EVS",
    result: "EVS result",
    narrative: "Incoming message",
    "final-narrative": "Final message",
    "final-choice": "Final decision",
    ending: "Complete",
    credits: "Credits",
    complete: "Complete",
  };
  if (session.stage === "credits" || session.stage === "complete") return "Campaign complete";
  return `${level.label} · ${stageLabels[session.stage]}`;
}

function renderHome() {
  stopCreditsTimer();
  currentView = "home";
  siteActions.hidden = true;
  app.innerHTML = `
    <section class="home-screen" aria-labelledby="home-title">
      <div class="home-card">
        <p class="eyebrow">Digital Portal</p>
        <h1 id="home-title">Felix Producto</h1>

        <div class="home-actions">
          <button class="button ${campaignSave ? "button-primary" : "button-disabled"}" type="button" ${campaignSave ? 'data-action="continue-game"' : "disabled"}>
            <span>Continue</span>
            ${campaignSave ? `<small>${progressLabel(campaignSave)}</small>` : ""}
          </button>
          <button class="button ${campaignSave ? "button-secondary" : "button-primary"}" type="button" data-action="new-game">New Game</button>
          <button class="button button-quiet" type="button" data-action="open-playtesting">Level Select</button>
        </div>

        <a class="rulebook-link" href="assets/rules/felix-producto-rule-book-v3.0.pdf?v=3.0.1" target="_blank" rel="noopener">
          <span>Full Rule Book</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  `;
  focusView();
}

function renderPlaytesting() {
  currentView = "playtesting";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="page-card playtest-card" aria-labelledby="playtest-title">
      <header class="page-heading centered-heading">
        <p class="eyebrow">Direct Access</p>
        <h1 id="playtest-title">Level Select</h1>
        <p>Start at any level, play continues in order.</p>
      </header>

      <div class="level-picker">
        ${LEVELS.map((level) => `
          <button class="level-picker-button" type="button" data-action="start-playtest" data-level-id="${level.id}">
            <span>${level.label}</span>
            <span aria-hidden="true">›</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
  focusView();
}

function renderLevel() {
  const level = levelById(activeSession.levelId);
  const creditsText = level.credits === null ? "Pending" : level.credits;

  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = false;
  app.innerHTML = `
    <article class="level-page" aria-labelledby="level-title">
      <header class="level-heading">
        <div>
          <p class="eyebrow">${activeSession.mode === "playtest" ? "Level Select" : "Current Job"}</p>
          <h1 id="level-title">${level.label}</h1>
        </div>
      </header>

      <section class="objective-panel" aria-labelledby="objective-title">
        <div class="section-heading">
          <p class="eyebrow">Required</p>
          <h2 id="objective-title">Objective Outputs</h2>
        </div>
        <ul class="resource-list objective-list">${objectiveListMarkup(level)}</ul>
      </section>

      ${proportionalRecipeNoticeMarkup(level)}

      <div class="level-grid">
        <section class="setup-panel" aria-labelledby="inputs-title">
          <div class="section-heading">
            <p class="eyebrow">Level Setup</p>
            <h2 id="inputs-title">Inputs</h2>
          </div>
          <ul class="resource-list input-list">${inputListMarkup(level)}</ul>
        </section>

        <section class="setup-panel optional-panel" aria-labelledby="optional-title">
          <div class="section-heading">
            <p class="eyebrow">Additional Credits</p>
            <h2 id="optional-title">Optional Outputs</h2>
          </div>
          ${optionalOutputMarkup(level)}
        </section>

        <section class="credit-panel" aria-labelledby="credits-title">
          <img src="assets/icons/credit-token.png" alt="" aria-hidden="true">
          <div>
            <p class="eyebrow">Level Budget</p>
            <h2 id="credits-title">Starting Credits</h2>
            <strong>${creditsText}</strong>
          </div>
        </section>
      </div>

      <div class="level-footer-actions">
        <button class="button button-primary complete-button" type="button" data-action="level-complete">Level Complete</button>
      </div>
    </article>

    <div class="mobile-action-dock" aria-label="Level controls">
      <button class="button button-quiet" type="button" data-action="quick-rules">Quick Actions</button>
      <button class="button button-primary" type="button" data-action="level-complete">Level Complete</button>
    </div>
  `;
  focusView();
}

function renderEvsEntry() {
  const level = levelById(activeSession.levelId);
  const creditMaximum = maximumCredits(level);

  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = false;
  app.innerHTML = `
    <section class="page-card evs-card" aria-labelledby="evs-title">
      <header class="page-heading centered-heading">
        <p class="eyebrow">${level.label} Complete</p>
        <h1 id="evs-title">Employee Value Score</h1>
        <p>Enter your remaining Credits.</p>
      </header>

      <form class="evs-form" id="evs-form">
        <label for="leftover-credits">Credits Left</label>
        <div class="credit-input-wrap">
          <img src="assets/icons/credit-token.png" alt="" aria-hidden="true">
          <input id="leftover-credits" name="credits" type="number" min="0" max="${creditMaximum}" step="1" inputmode="numeric" required autofocus>
        </div>
        <p class="form-error" id="evs-error" role="alert" hidden>Enter a whole number from 0 to ${creditMaximum}.</p>
        <div class="form-actions">
          <button class="button button-quiet" type="button" data-action="back-to-level">Back</button>
          <button class="button button-primary" type="submit">Submit EVS</button>
        </div>
      </form>
    </section>
  `;
  window.scrollTo({ top: 0, behavior: "instant" });
  requestAnimationFrame(() => document.querySelector("#leftover-credits")?.focus({ preventScroll: true }));
}

function resultForCredits(credits) {
  if (credits >= 10) return "HOLY COW, uh, I mean, acceptable.";
  if (credits >= 5) return "Your work will be noted.";
  return "Do better next time.";
}

function renderResult() {
  const level = levelById(activeSession.levelId);
  const result = activeSession.result;
  const isLastLevel = LEVELS.findIndex((item) => item.id === level.id) === LEVELS.length - 1;

  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = false;
  app.innerHTML = `
    <section class="page-card result-card" aria-labelledby="result-title">
      <p class="eyebrow">${level.label} Evaluation</p>
      <div class="evs-score" aria-label="Employee Value Score ${result.credits}">
        <img src="assets/icons/credit-token.png" alt="" aria-hidden="true">
        <div class="evs-score-value">
          <span>EVS</span>
          <strong>${result.credits}</strong>
        </div>
      </div>
      <h1 id="result-title">${result.message}</h1>

      <div class="result-actions">
        <button class="button button-primary" type="button" data-action="${isLastLevel ? "open-final-narrative" : "open-narrative"}">${isLastLevel ? "Continue" : "Next Level"}</button>
      </div>
    </section>
  `;
  focusView();
}

function stopTypewriter() {
  if (typewriterStartTimer !== null) {
    window.clearTimeout(typewriterStartTimer);
    typewriterStartTimer = null;
  }
  if (typewriterTimer !== null) {
    window.clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
}

function finishNarrativeTyping() {
  stopTypewriter();
  const textTarget = document.querySelector("[data-dialogue-text]");
  const revealButton = document.querySelector('[data-action="reveal-dialogue"]');
  const nextButton = document.querySelector("[data-dialogue-next]");
  if (textTarget) {
    textTarget.textContent = activeNarrativeText;
    textTarget.dataset.complete = "true";
  }
  if (revealButton) revealButton.hidden = true;
  if (nextButton) nextButton.disabled = false;
}

function startNarrativeTyping(text) {
  stopTypewriter();
  activeNarrativeText = text;
  const textTarget = document.querySelector("[data-dialogue-text]");
  if (!textTarget) return;

  textTarget.textContent = "";
  textTarget.dataset.complete = "false";

  typewriterStartTimer = window.setTimeout(() => {
    typewriterStartTimer = null;
    let characterIndex = 0;
    typewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      textTarget.textContent = text.slice(0, characterIndex);
      if (characterIndex >= text.length) finishNarrativeTyping();
    }, TYPEWRITER_DELAY);
  }, TYPEWRITER_START_DELAY);
}

function renderNarrative() {
  const level = levelById(activeSession.levelId);
  const currentIndex = LEVELS.findIndex((item) => item.id === level.id);
  const nextLevel = LEVELS[currentIndex + 1];
  const narrative = NARRATIVES[level.id];

  if (!nextLevel || !narrative) return advanceLevel();
  activeNarrativeText = narrativeText(narrative);

  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="page-card narrative-card" aria-labelledby="narrative-title">
      <header class="page-heading centered-heading">
        <h1 id="narrative-title">Incoming Message</h1>
      </header>

      <div class="dialogue-panel">
        <p class="dialogue-speaker">Manager</p>
        <div class="dialogue-text" aria-label="${escapeHtml(activeNarrativeText)}"><span data-dialogue-text aria-hidden="true"></span></div>
      </div>

      <div class="narrative-actions">
        <button class="button button-quiet" type="button" data-action="reveal-dialogue">Skip</button>
        <button class="button button-primary" type="button" data-action="next-level" data-dialogue-next disabled>Start ${nextLevel.label}</button>
      </div>
    </section>
  `;
  focusView();
  requestAnimationFrame(() => startNarrativeTyping(activeNarrativeText));
}

function renderComplete() {
  return renderCompleteLegacy();
}

function renderFinalNarrative() {
  activeNarrativeText = narrativeText(FINAL_NARRATIVE);
  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="page-card narrative-card final-narrative-card" aria-labelledby="final-narrative-title">
      <header class="page-heading centered-heading">
        <h1 id="final-narrative-title">Incoming Message</h1>
      </header>
      <div class="dialogue-panel">
        <p class="dialogue-speaker">Manager</p>
        <div class="dialogue-text" aria-label="${escapeHtml(activeNarrativeText)}"><span data-dialogue-text aria-hidden="true"></span></div>
      </div>
      <div class="narrative-actions">
        <button class="button button-quiet" type="button" data-action="reveal-dialogue">Skip</button>
        <button class="button button-primary" type="button" data-action="open-final-choice" data-dialogue-next disabled>Continue</button>
      </div>
    </section>
  `;
  focusView();
  requestAnimationFrame(() => startNarrativeTyping(activeNarrativeText));
}

function renderFinalChoice() {
  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="page-card final-choice-card" aria-labelledby="final-choice-title">
      <header class="page-heading centered-heading">
        <p class="eyebrow">Final Decision</p>
        <h1 id="final-choice-title">Produce the Bomb?</h1>
      </header>
      <div class="final-choice-actions" role="group" aria-label="Produce the Bomb">
        <button class="button button-secondary choice-button" type="button" data-action="choose-ending" data-ending="yes">Yes</button>
        <button class="button button-quiet choice-button" type="button" data-action="choose-ending" data-ending="no">No</button>
      </div>
    </section>
  `;
  focusView();
}

function creditsMarkup() {
  return `
    <h1 class="credits-heading">Credits</h1>
    <p class="game-by">A game by<br><strong>Nicholai Khitrykh, Noah Leibert, Marcus Polson and Owen Sample</strong></p>
    <dl class="credits-list">
      <div><dt>Story Writing</dt><dd>Noah, Nicholai</dd></div>
      <div><dt>Art Design</dt><dd>Marcus</dd></div>
      <div><dt>Rule Design</dt><dd>Noah</dd></div>
      <div><dt>Game Concept</dt><dd>Owen</dd></div>
      <div><dt>Level Design</dt><dd>Marcus</dd></div>
      <div><dt>Physical Manufacturing</dt><dd>Owen</dd></div>
      <div><dt>Digital Portal</dt><dd>Nicholai</dd></div>
      <div><dt>Aura</dt><dd>Butch Nasser</dd></div>
    </dl>
    <p class="course-credit">CS 247G Design for Play: P2, Games in Space.<br>Team Joseporgatasia. Felix Producto.</p>
    <p class="thanks-message">Thank you for playing.</p>
    <blockquote class="ending-quote">
      <p>“For to go as a passenger you must needs have a purse, and a purse is but a rag unless you have something in it.”</p>
      <cite>— Herman Melville, <em>Moby-Dick</em></cite>
    </blockquote>
  `;
}

function renderEnding() {
  const ending = ENDINGS[activeSession.ending] || ENDINGS.no;
  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="page-card ending-card" aria-labelledby="ending-title">
      <header class="page-heading centered-heading">
        <p class="eyebrow">Final Outcome</p>
        <h1 id="ending-title">${escapeHtml(ending.label)}</h1>
      </header>
      <p class="ending-text">${escapeHtml(ending.text)}</p>
      ${scoreSummaryMarkup()}
      <div class="result-actions">
        <button class="button button-primary" type="button" data-action="open-credits">Continue</button>
      </div>
    </section>
  `;
  focusView();
}

function stopCreditsTimer() {
  if (creditsReturnTimer !== null) {
    window.clearTimeout(creditsReturnTimer);
    creditsReturnTimer = null;
  }
}

function completeCredits() {
  stopCreditsTimer();

  localStorage.removeItem(CAMPAIGN_SAVE_KEY);
  campaignSave = null;

  if (activeSession?.mode === "playtest" && activeSession.stage === "credits") {
    activeSession.stage = "complete";
    saveActiveSession();
  }

  activeSession = null;
  renderHome();
}

function renderCredits() {
  stopCreditsTimer();
  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="credits-screen" aria-label="Credits">
      <div class="credits-window">
        <div class="credits-track">
          ${creditsMarkup()}
        </div>
        <div class="credits-final-title" aria-hidden="true">Felix<br>Producto</div>
      </div>
      <button class="text-button credits-skip" type="button" data-action="skip-credits">Skip</button>
    </section>
  `;
  focusView();
  creditsReturnTimer = window.setTimeout(completeCredits, CREDITS_DURATION);
}

function finishCredits() {
  stopCreditsTimer();
  const creditsScreen = document.querySelector(".credits-screen");
  if (!creditsScreen) return;
  creditsScreen.classList.add("credits-finished");
  creditsScreen.querySelector(".credits-final-title")?.removeAttribute("aria-hidden");
  creditsScreen.querySelector(".credits-skip")?.setAttribute("hidden", "");
  creditsReturnTimer = window.setTimeout(completeCredits, CREDITS_SKIP_TITLE_DURATION);
}

function renderCompleteLegacy() {
  currentView = "session";
  siteActions.hidden = false;
  siteActions.querySelector('[data-action="quick-rules"]').hidden = true;
  app.innerHTML = `
    <section class="page-card result-card" aria-labelledby="complete-title">
      <p class="eyebrow">Campaign Complete</p>
      <h1 id="complete-title">Felix Producto</h1>
      <p>All Levels complete.</p>
    </section>
  `;
  focusView();
}

function renderSession() {
  if (!activeSession) return renderHome();
  if (activeSession.stage === "level") return renderLevel();
  if (activeSession.stage === "evs") return renderEvsEntry();
  if (activeSession.stage === "result") return renderResult();
  if (activeSession.stage === "narrative") return renderNarrative();
  if (activeSession.stage === "final-narrative") return renderFinalNarrative();
  if (activeSession.stage === "final-choice") return renderFinalChoice();
  if (activeSession.stage === "ending") return renderEnding();
  if (activeSession.stage === "credits") return renderCredits();
  return renderComplete();
}

function focusView(scroll = true) {
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
  requestAnimationFrame(() => app.focus({ preventScroll: true }));
}

function openQuickRules() {
  if (!rulesDialog.open) rulesDialog.showModal();
}

function closeQuickRules() {
  if (rulesDialog.open) rulesDialog.close();
}

function startCampaign() {
  if (campaignSave && !window.confirm("Start a new game and replace the current campaign save?")) return;
  activeSession = createSession("campaign");
  saveActiveSession();
  renderSession();
}

function startPlaytest(levelId) {
  activeSession = createSession("playtest", levelId);
  saveActiveSession();
  renderSession();
}

function restartLevel() {
  if (!activeSession) return;
  delete activeSession.scores[activeSession.levelId];
  activeSession.stage = "level";
  activeSession.result = null;
  saveActiveSession();
  renderSession();
}

function advanceLevel() {
  const currentIndex = LEVELS.findIndex((level) => level.id === activeSession.levelId);
  if (currentIndex >= LEVELS.length - 1) {
    activeSession.stage = "complete";
  } else {
    activeSession.levelId = LEVELS[currentIndex + 1].id;
    activeSession.stage = "level";
  }
  activeSession.result = null;
  saveActiveSession();
  renderSession();
}

function openNarrative() {
  activeSession.stage = "narrative";
  saveActiveSession();
  renderSession();
}

function openFinalNarrative() {
  activeSession.stage = "final-narrative";
  saveActiveSession();
  renderSession();
}

function openFinalChoice() {
  activeSession.stage = "final-choice";
  saveActiveSession();
  renderSession();
}

function chooseEnding(ending) {
  if (ending !== "yes" && ending !== "no") return;
  activeSession.ending = ending;
  activeSession.stage = "ending";
  saveActiveSession();
  renderSession();
}

function openCredits() {
  activeSession.stage = "credits";
  saveActiveSession();
  renderSession();
}

function handleAction(action, button) {
  if (action !== "reveal-dialogue") stopTypewriter();
  if (action !== "skip-credits") stopCreditsTimer();
  if (action === "home") return renderHome();
  if (action === "quick-rules") return openQuickRules();
  if (action === "close-rules") return closeQuickRules();
  if (action === "new-game") return startCampaign();
  if (action === "continue-game") {
    activeSession = campaignSave;
    return renderSession();
  }
  if (action === "open-playtesting") return renderPlaytesting();
  if (action === "start-playtest") return startPlaytest(button.dataset.levelId);
  if (action === "level-complete") {
    activeSession.stage = "evs";
    saveActiveSession();
    return renderSession();
  }
  if (action === "back-to-level") {
    activeSession.stage = "level";
    saveActiveSession();
    return renderSession();
  }
  if (action === "open-narrative") return openNarrative();
  if (action === "open-final-narrative") return openFinalNarrative();
  if (action === "open-final-choice") return openFinalChoice();
  if (action === "choose-ending") return chooseEnding(button.dataset.ending);
  if (action === "open-credits") return openCredits();
  if (action === "skip-credits") return finishCredits();
  if (action === "reveal-dialogue") return finishNarrativeTyping();
  if (action === "retry-level") return restartLevel();
  if (action === "next-level") return advanceLevel();
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  handleAction(actionButton.dataset.action, actionButton);
});

app.addEventListener("submit", (event) => {
  if (event.target.id !== "evs-form") return;
  event.preventDefault();

  const form = event.target;
  const input = form.elements.credits;
  const value = Number(input.value);
  const error = form.querySelector("#evs-error");
  const creditMaximum = maximumCredits(levelById(activeSession.levelId));

  if (!Number.isInteger(value) || value < 0 || value > creditMaximum) {
    error.hidden = false;
    input.focus();
    return;
  }

  error.hidden = true;
  activeSession.scores[activeSession.levelId] = value;
  activeSession.result = { credits: value, message: resultForCredits(value) };
  activeSession.stage = "result";
  saveActiveSession();
  renderSession();
});

rulesDialog.addEventListener("click", (event) => {
  if (event.target === rulesDialog) closeQuickRules();
});

renderHome();
