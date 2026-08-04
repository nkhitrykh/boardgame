const SAVE_KEY = "felix-producto.campaign.v4";
const LEGACY_SAVE_KEY = "felix-producto.campaign.v3";

const LEVELS = {
  L0: {
    label: "Level 0",
    difficulty: "Tutorial",
    roundLimit: null,
    credits: 4,
    objective: [["Iron", 1], ["Copper", 1]],
    inputs: [["Minerals", 2], ["Coal", 2]],
    bonusOutputs: [],
    specialRules: [],
    next: ["L1"]
  },
  L1: {
    label: "Level 1",
    difficulty: "",
    roundLimit: 10,
    credits: 3,
    objective: [["Copper", 2], ["Steel", 1]],
    inputs: [["Minerals", 2], ["Minerals", 4], ["Coal", 2]],
    bonusOutputs: [["1 Iron", "1 Credit / Recipe Phase"]],
    specialRules: [],
    next: ["L2A", "L2B"]
  },
  L2A: {
    label: "Level 2A",
    difficulty: "",
    roundLimit: 10,
    credits: 4,
    objective: [["Screws", 3], ["Refined Uranium", 2]],
    inputs: [["Uranium", 3], ["Coal", 2], ["Minerals", 3], ["Minerals", 2]],
    bonusOutputs: [["1 Screw", "1 Credit / Recipe Phase"], ["1 Uranium", "1 Credit / Recipe Phase"]],
    specialRules: [
      "Uranium may NOT be on a conveyor adjacent (within 1 Game Board Tile) of a conveyor containing Copper, Iron or Steel. This does NOT include Refined Uranium. This does NOT prohibit diagonal adjacency."
    ],
    next: []
  },
  L2B: {
    label: "Level 2B",
    difficulty: "",
    roundLimit: 8,
    credits: 3,
    objective: [["Screws", 3], ["Refined Uranium", 2]],
    inputs: [["Uranium", 3], ["Coal", 2], ["Minerals", 3], ["Minerals", 2]],
    bonusOutputs: [["1 Screw", "1 Credit / Recipe Phase"], ["1 Uranium", "1 Credit / Recipe Phase"]],
    specialRules: [
      "Uranium may NOT be on a conveyor adjacent (within 1 Game Board Tile) of a conveyor containing Copper, Iron or Steel. This does NOT include Refined Uranium. This does NOT prohibit diagonal adjacency."
    ],
    next: []
  }
};

const RESOURCES = [
  "Minerals",
  "Coal",
  "Copper",
  "Iron",
  "Steel",
  "Uranium",
  "Refined Uranium",
  "Screws"
];

const CREDIT_SPEND_ACTIONS = [
  ["Purchase Marker", 2],
  ["Discard 2 Revealed Markers", 2],
  ["Place Reserved Marker", 2],
  ["Move Placed Marker", 1],
  ["Swap 2 Recipe Markers", 2],
  ["Alter Existing Conveyors", 1],
  ["Place Curved or Split Conveyor", 1]
];

const CREDIT_INCOME_ACTIONS = [
  ["Satisfied Output Marker", 1],
  ["Satisfied Objective Output", 1]
];

const app = document.querySelector("#app");
let campaign = loadCampaign();
let currentView = "home";
let rulebookReturnView = "home";

function newCampaign() {
  return {
    version: 4,
    screen: "onboarding",
    levelId: "L0",
    round: 1,
    credits: 0,
    creditHistory: [],
    route: []
  };
}

function loadCampaign() {
  try {
    const savedValue = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
    const value = JSON.parse(savedValue);
    if (!value || ![3, 4].includes(value.version) || !LEVELS[value.levelId]) return null;
    if (!Number.isInteger(value.round) || value.round < 1) return null;
    const normalized = {
      ...value,
      version: 4,
      credits: Number.isInteger(value.credits) && value.credits >= 0
        ? value.credits
        : LEVELS[value.levelId].credits,
      creditHistory: Array.isArray(value.creditHistory)
        ? value.creditHistory.filter((entry) => (
          entry && typeof entry.label === "string" && Number.isInteger(entry.amount)
        )).slice(-20)
        : []
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return null;
  }
}

function saveCampaign() {
  if (campaign) localStorage.setItem(SAVE_KEY, JSON.stringify(campaign));
}

function focusPage() {
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
}

function roundText(level) {
  return level.roundLimit
    ? `Round ${campaign.round} of ${level.roundLimit}`
    : `Round ${campaign.round} of Unlimited`;
}

function resetLevelCredits(levelId) {
  const income = LEVELS[levelId].credits;
  campaign.credits = income;
  campaign.creditHistory = [{ label: "Round 1 income", amount: income }];
}

function recordCreditTransaction(label, amount) {
  if (!Number.isInteger(amount) || !label) return false;
  if (amount < 0 && campaign.credits < Math.abs(amount)) return false;
  campaign.credits += amount;
  campaign.creditHistory.push({ label, amount });
  campaign.creditHistory = campaign.creditHistory.slice(-20);
  saveCampaign();
  return true;
}

function creditHistoryMarkup() {
  if (!campaign.creditHistory.length) {
    return `<li class="credit-history-empty">No Credit activity yet.</li>`;
  }

  return campaign.creditHistory.slice().reverse().slice(0, 8).map((entry) => `
    <li>
      <span>${entry.label}</span>
      <strong class="${entry.amount > 0 ? "credit-positive" : "credit-negative"}">${entry.amount > 0 ? "+" : ""}${entry.amount}</strong>
    </li>
  `).join("");
}

function creditActionMarkup([label, amount], type) {
  const signedAmount = type === "spend" ? -amount : amount;
  const disabled = signedAmount < 0 && campaign.credits < amount ? "disabled" : "";
  const costAttribute = signedAmount < 0 ? `data-credit-cost="${amount}"` : "";
  return `
    <button class="credit-action" type="button" data-action="credit-change" data-label="${label}" data-amount="${signedAmount}" ${costAttribute} ${disabled}>
      <span>${label}</span>
      <strong>${signedAmount > 0 ? "+" : ""}${signedAmount}</strong>
    </button>
  `;
}

function creditTrackerMarkup(level) {
  return `
    <section class="credit-tracker" aria-labelledby="credit-tracker-title">
      <header class="credit-tracker-header">
        <div>
          <h2 id="credit-tracker-title">Credit Tracker</h2>
          <p>+${level.credits} Credits automatically at the start of each Round</p>
        </div>
        <div class="credit-balance-panel" aria-live="polite">
          <strong data-credit-balance>${campaign.credits}</strong>
          <span>Credits</span>
        </div>
      </header>

      <div class="credit-option-columns">
        <section class="credit-option-section">
          <h3>Receive Credits</h3>
          <div class="credit-action-list credit-income-actions">
            ${CREDIT_INCOME_ACTIONS.map((action) => creditActionMarkup(action, "income")).join("")}
          </div>
        </section>

        <section class="credit-option-section">
          <h3>Spend Credits</h3>
          <div class="credit-action-list credit-spend-actions">
            ${CREDIT_SPEND_ACTIONS.map((action) => creditActionMarkup(action, "spend")).join("")}
          </div>
        </section>
      </div>

      <footer class="credit-tracker-footer">
        <div class="credit-corrections" aria-label="Manual Credit correction">
          <button class="button compact-button" type="button" data-action="credit-change" data-label="Manual Credit Added" data-amount="1">Add 1</button>
          <button class="button compact-button" type="button" data-action="credit-change" data-label="Manual Credit Removed" data-amount="-1" data-credit-cost="1" ${campaign.credits ? "" : "disabled"}>Remove 1</button>
        </div>
        <details class="credit-history-section">
          <summary>Recent Activity</summary>
          <div class="credit-history-body">
            <div class="credit-section-heading">
              <button class="text-button neutral-text-button" type="button" data-action="undo-credit" ${campaign.creditHistory.length ? "" : "disabled"}>Undo Last</button>
            </div>
            <ul class="plain-list credit-history" data-credit-history>${creditHistoryMarkup()}</ul>
          </div>
        </details>
      </footer>
    </section>
  `;
}

function updateCreditDisplays() {
  document.querySelectorAll("[data-credit-balance]").forEach((element) => {
    element.textContent = campaign.credits;
  });
  document.querySelectorAll("[data-credit-cost]").forEach((button) => {
    button.disabled = campaign.credits < Number(button.dataset.creditCost);
  });
  const history = document.querySelector("[data-credit-history]");
  if (history) history.innerHTML = creditHistoryMarkup();
  const undoButton = document.querySelector('[data-action="undo-credit"]');
  if (undoButton) undoButton.disabled = campaign.creditHistory.length === 0;
}

function saveDescription() {
  if (!campaign) return "No saved game on this device.";
  if (campaign.screen === "onboarding") return "Saved at onboarding.";
  if (campaign.screen === "complete") return "Completed game saved.";
  return `Saved at ${LEVELS[campaign.levelId].label}, Round ${campaign.round}.`;
}

function quickRulesDialogMarkup() {
  return `
    <dialog class="rules-dialog" id="quick-rules-dialog" aria-labelledby="quick-rules-title">
      <div class="dialog-shell">
        <header class="dialog-header">
          <h2 id="quick-rules-title">Quick Rules</h2>
          <button class="text-button neutral-text-button" type="button" data-action="close-quick-rules">Close</button>
        </header>

        <div class="dialog-body">
          <section class="quick-section">
            <h3>Round Sequence</h3>
            <div class="phase-grid">
              <article class="phase-card">
                <h4>1. Recipe Phase</h4>
                <ul>
                  <li>Receive the Credits listed for the Level.</li>
                  <li>Receive additional Credits from satisfied Output Markers and 1 additional Credit from each satisfied Level Objective Output. Neither requires the Factory to be “Switched on”.</li>
                  <li>Reveal Markers from the Marker Deck until 2 are face-up.</li>
                  <li>Purchase a Marker for 2 Credits, or Reserve one Marker for free.</li>
                  <li>You may only Reserve one Marker at a time. It is not affected by revealing new Markers, and you may discard it at any time during the Recipe Phase.</li>
                  <li>Spend 2 Credits to discard the 2 revealed Markers and reveal the next 2. If the Marker Deck is empty, shuffle the Marker Discard pile to replenish it.</li>
                </ul>
              </article>
              <article class="phase-card">
                <h4>2. Build Phase</h4>
                <ul>
                  <li>You MUST Place a Purchased Recipe or Output Marker. This does NOT cost Credits.</li>
                  <li>You MAY Pay 2 Credits to place a Reserved Marker.</li>
                  <li>Pay 1 Credit to move an already Placed Marker.</li>
                  <li>Pay 2 Credits to Swap 2 Recipe Markers.</li>
                  <li>Freely Rotate Recipe and Output Markers.</li>
                  <li>Recipes do NOT have to be adjacent, but WILL need conveyor connections to function.</li>
                </ul>
              </article>
              <article class="phase-card">
                <h4>3. Conveyor Phase</h4>
                <ul>
                  <li>Place Conveyors to connect required Recipe Inputs and Outputs.</li>
                  <li>Pay 1 Credit for the Round to alter EXISTING Conveyors freely.</li>
                  <li>Any number of Straight Conveyors are free when they form one uninterrupted straight line.</li>
                  <li>Curved and Split Conveyors cost 1 Credit each.</li>
                  <li>Conveyors may cross as a bridge but may never share the same lane.</li>
                  <li>DOUBLE the required Input Resources to DOUBLE a Recipe's Outputs. Triple and quadruple requirements only produce double Outputs.</li>
                </ul>
              </article>
              <article class="phase-card">
                <h4>4. Clean Up</h4>
                <ul>
                  <li>Return spent Credits to the supply.</li>
                  <li>Advance the Round Counter.</li>
                  <li>If the Round Counter reaches zero, you lose the current Level.</li>
                  <li>If the Round Counter is Above 0 and all Objective Outputs are satisfied, "Switch on" the Factory and win the Level.</li>
                  <li>If the Round Counter is above zero, return to the Recipe Phase.</li>
                </ul>
              </article>
            </div>
          </section>

          <section class="quick-section">
            <h3>Credit Reference</h3>
            <div class="cost-grid">
              <span>Purchase a Marker</span><strong>2 Credits</strong>
              <span>Discard the 2 revealed Markers and reveal the next 2</span><strong>2 Credits</strong>
              <span>Place a Reserved Marker</span><strong>2 Credits</strong>
              <span>Move a Placed Marker</span><strong>1 Credit</strong>
              <span>Swap 2 Recipe Markers</span><strong>2 Credits</strong>
              <span>Alter existing Conveyors for the Round</span><strong>1 Credit</strong>
              <span>Place a Curved or Split Conveyor</span><strong>1 Credit each</strong>
              <span>Place uninterrupted Straight Conveyors</span><strong>Free</strong>
              <span>Rotate Recipe or Output Markers</span><strong>Free</strong>
            </div>
          </section>

          <section class="quick-section quick-notes">
            <h3>Level Check</h3>
            <ul>
              <li>All recipes activate simultaneously and Receive their Inputs and Produce their Outputs.</li>
              <li>All Resources are simultaneously transported along the Conveyor network.</li>
              <li>Satisfying Placed Output Markers is OPTIONAL for Completing the Level.</li>
              <li>Producing more than the required Objective Outputs will still satisfy the Level.</li>
            </ul>
          </section>
        </div>

        <footer class="dialog-footer">
          <button class="button" type="button" data-action="open-rulebook">Open Full Rule Book</button>
        </footer>
      </div>
    </dialog>
  `;
}

function rulesAccessMarkup() {
  return `
    <div class="rules-access" aria-label="Rules">
      <button class="button" type="button" data-action="open-quick-rules">Quick Rules</button>
      <button class="button" type="button" data-action="open-rulebook">Full Rule Book</button>
    </div>
  `;
}

function objectiveMarkup(level) {
  return level.objective.map(([resource, amount], index) => `
    <li>
      <span class="port">Output ${index + 1}</span>
      <span>${resource}</span>
      <strong>×${amount}</strong>
    </li>
  `).join("");
}

function inputMarkup(level) {
  const slots = Array.from({ length: 4 }, (_, index) => level.inputs[index] || null);
  return slots.map((input, index) => `
    <li class="${input ? "" : "empty-row"}">
      <span class="port">Input ${index + 1}</span>
      <span>${input ? input[0] : "Empty"}</span>
      <strong>${input ? `×${input[1]}` : ""}</strong>
    </li>
  `).join("");
}

function bonusOutputMarkup(level) {
  if (!level.bonusOutputs.length) {
    return `<li class="none-row"><span>None</span></li>`;
  }

  return level.bonusOutputs.map(([requirement, reward]) => `
    <li>
      <span>${requirement}</span>
      <span aria-hidden="true">→</span>
      <strong>${reward}</strong>
    </li>
  `).join("");
}

function levelIndexMarkup() {
  return Object.values(LEVELS).map((level) => `
    <details class="level-index-entry">
      <summary>${level.label.toUpperCase()}</summary>
      <div class="level-index-body">
        <ul class="level-index-meta">
          <li>${level.roundLimit ? `${level.roundLimit} Rounds Maximum` : "No Round Maximum"}</li>
          <li>${level.credits} Credits/Round</li>
        </ul>
        <h4>OBJECTIVES</h4>
        <ul>${level.objective.map(([resource, amount]) => `<li>${amount} ${resource}</li>`).join("")}</ul>
        <h4>INPUTS</h4>
        <ul>${level.inputs.map(([name, amount]) => `<li>${amount} ${name}</li>`).join("")}</ul>
        <h4>OUTPUTS (Not OBJECTIVES)</h4>
        <ul>${level.bonusOutputs.length ? level.bonusOutputs.map(([requirement, reward]) => `<li>${requirement} = ${reward}</li>`).join("") : "<li>NONE</li>"}</ul>
      </div>
    </details>
  `).join("");
}

function renderHome() {
  currentView = "home";
  app.innerHTML = `
    <div class="card home-card">
      <p class="label">Board Game Digital Companion</p>
      <h1>Felix Producto</h1>
      <p class="game-facts">1 Player · 30–45 Minutes · Ages 13+</p>
      <div class="actions">
        <button class="button button-primary" type="button" data-action="new-game">New Game</button>
        <button class="button" type="button" data-action="continue" ${campaign ? "" : "disabled"}>Continue</button>
      </div>
      ${rulesAccessMarkup()}
      <p class="save-note">${saveDescription()}</p>
    </div>
    ${quickRulesDialogMarkup()}
  `;
  focusPage();
}

function renderOnboarding() {
  currentView = "onboarding";
  app.innerHTML = `
    <div class="card onboarding-card">
      <div class="video-frame" role="img" aria-label="Onboarding video"></div>
      <div class="actions onboarding-actions">
        <button class="button button-primary" type="button" data-action="start-level">Skip</button>
      </div>
      <div class="quit-row">
        <button class="text-button" type="button" data-action="quit">Quit</button>
      </div>
    </div>
  `;
  focusPage();
}

function renderLevel() {
  currentView = "level";
  const level = LEVELS[campaign.levelId];
  app.innerHTML = `
    <div class="card level-card">
      <header class="level-header">
        <div>
          ${level.difficulty ? `<p class="label">${level.difficulty}</p>` : ""}
          <h1>${level.label}</h1>
        </div>
        <button class="button compact-button" type="button" data-action="open-quick-rules">Quick Rules</button>
      </header>

      <section class="level-summary" aria-label="Level summary">
        <div class="summary-block objective-summary">
          <h2>Objective Outputs</h2>
          <ul class="plain-list objective-list">${objectiveMarkup(level)}</ul>
          </div>
          <div class="summary-block">
            <h2>Round</h2>
            <strong role="status" aria-live="polite">${roundText(level)}</strong>
          </div>
          <div class="summary-block credit-summary-block">
            <h2>Credits</h2>
            <div class="credit-summary-content">
              <strong data-credit-balance>${campaign.credits}</strong>
              <span>+${level.credits} / Round</span>
            </div>
        </div>
      </section>

      ${level.specialRules.length ? `
        <aside class="special-rule" aria-labelledby="special-rule-title">
          <h2 id="special-rule-title">NOTE: Uranium</h2>
          ${level.specialRules.map((rule) => `<p>${rule}</p>`).join("")}
        </aside>
      ` : ""}

        <div class="level-controls">
          <button class="button button-primary" type="button" data-action="next-round">Next Round</button>
          <button class="button button-success" type="button" data-action="objective-complete">Objective Complete</button>
        </div>

      <p class="marker-deck-reminder">Reveal Markers from the Marker Deck until 2 are face-up.</p>

      <div class="level-columns">
        <section class="level-column">
          <h2>Input Markers</h2>
          <ul class="plain-list">${inputMarkup(level)}</ul>
        </section>

        <section class="level-column">
          <h2>Output Markers <span>(Optional)</span></h2>
          <ul class="plain-list output-marker-list">${bonusOutputMarkup(level)}</ul>
        </section>
      </div>

      ${creditTrackerMarkup(level)}

      <div class="quit-row">
        <button class="text-button" type="button" data-action="quit">Quit</button>
      </div>
    </div>
    ${quickRulesDialogMarkup()}
  `;
  focusPage();
}

function branchChoiceText(targetLevel) {
  if (campaign.levelId === "L0") return "Continue to the next level.";
  if (targetLevel === "L2A") return "Level 1 felt challenging.";
  if (targetLevel === "L2B") return "Level 1 felt manageable.";
  return "Continue.";
}

function renderBranch() {
  currentView = "branch";
  const level = LEVELS[campaign.levelId];
  app.innerHTML = `
    <div class="card result-card">
      <h1>Make a decision</h1>
      <div class="choice-list ${level.next.length === 1 ? "single-choice" : ""}">
        ${level.next.map((targetLevel, index) => `
          <article class="choice">
            <h2>Choice ${index + 1}</h2>
            <p>${branchChoiceText(targetLevel)}</p>
            <button class="button button-primary" type="button" data-action="choose-route" data-target="${targetLevel}">Choose</button>
          </article>
        `).join("")}
      </div>
      <div class="quit-row">
        <button class="text-button" type="button" data-action="quit">Quit</button>
      </div>
    </div>
  `;
  focusPage();
}

function renderFailed() {
  currentView = "failed";
  app.innerHTML = `
    <div class="card result-card">
      <p class="label">No Rounds Remaining</p>
      <h1>Level Failed</h1>
      <p>Retry the level or return to the home page.</p>
      <div class="actions">
        <button class="button button-primary" type="button" data-action="retry-level">Retry Level</button>
        <button class="button" type="button" data-action="home">Back to Home</button>
      </div>
      ${rulesAccessMarkup()}
    </div>
    ${quickRulesDialogMarkup()}
  `;
  focusPage();
}

function renderComplete() {
  currentView = "complete";
  const level = LEVELS[campaign.levelId];
  app.innerHTML = `
    <div class="card result-card">
      <p class="label">Game Complete</p>
      <h1>You Win!</h1>
      <p>You completed ${level.label} and won Felix Producto.</p>
      <div class="actions">
        <button class="button button-primary" type="button" data-action="new-game">New Game</button>
        <button class="button" type="button" data-action="home">Back to Home</button>
      </div>
      ${rulesAccessMarkup()}
    </div>
    ${quickRulesDialogMarkup()}
  `;
  focusPage();
}

function renderRulebook() {
  currentView = "rulebook";
  app.innerHTML = `
    <article class="card rulebook-page">
      <header class="rulebook-header">
        <div>
          <h1>Felix Producto</h1>
          <p class="rulebook-kicker">Rule Book</p>
          <p class="rulebook-byline"><em>A Game by:</em><br>Nicholai Khitrykh, Noah Leibert, Marcus Polson and Owen Sample</p>
        </div>
        <button class="button" type="button" data-action="close-rulebook">Back</button>
      </header>

      <div class="rulebook-facts" aria-label="Game facts">
        <strong>1 Player</strong>
        <strong>30-45 Minutes</strong>
        <strong>13 +</strong>
      </div>

      <nav class="rulebook-nav" aria-label="Rule Book sections">
        <a href="#components">Components</a>
        <a href="#overview">Overview</a>
        <a href="#setup">Setup</a>
        <a href="#winning">Winning</a>
        <a href="#rounds">Playing a Round</a>
        <a href="#indexes">Indexes</a>
      </nav>

      <section class="rulebook-section" id="components">
        <h2>Components:</h2>
        <h3>Game Board:</h3>
        <p>A 6x6 grid containing the Round Counter, 4 Input Tiles and 4 Output Tiles.</p>
        <h3>Markers:</h3>
        <p>3 Decks consisting of</p>
        <div class="marker-type-grid" aria-label="Marker decks">
          <strong>Input Markers</strong>
          <strong>Recipe Markers</strong>
          <strong>Output Markers</strong>
        </div>
        <ul>
          <li>Input Markers provide their listed Resources and are placed on Input Tiles.</li>
          <li>Recipe Markers use Provided Resources to Create new Resources.</li>
          <li>Output Markers consume their Input Resources and provide additional Credits each Recipe Phase while they remain satisfied.
            <ul>
              <li>Output Markers do NOT need to be placed on Output Tiles. Output Tiles are for a Level's Objective Outputs.</li>
              <li>A satisfied Output Marker will provide additional Credits even if the factory is not “Switched on”</li>
            </ul>
          </li>
          <li>Provide a Level's Objective Outputs to an Output Tile to complete a level.</li>
        </ul>
        <h3>Conveyors:</h3>
        <p>30x straight, 30x split, 30x curved Conveyor Tokens connect Input, Recipe and Output Markers to each other and to Objective Output Tiles.</p>
        <h3>Credit Tokens:</h3>
        <p>26 Credit Tokens representing 1 Credit each.</p>
        <p class="site-note portal-note">The Digital Portal can track the current Credit total during each Level.</p>
        <h3>Digital Portal:</h3>
        <p><a href="https://nkhitrykh.github.io/felix-producto/">https://nkhitrykh.github.io/felix-producto/</a></p>
        <p class="site-note portal-note">The Digital Portal is required to play Felix Producto.</p>
      </section>

      <section class="rulebook-section" id="overview">
        <h2>Game Overview:</h2>
        <p>Each level, your objective is to produce the required resources within the time constraint. The game is played in rounds, and each round consists of 4 phases: the Recipe Phase, the Build Phase, the Conveyor Phase, and the Clean Up Phase.</p>
        <p>Each level has a set Round limit in which you must arrange Recipes and Conveyors to develop the production line. Once the line is complete, you will “Switch on” the Factory and complete the level! (Yes, that means Recipes will only start to produce after "Switch on”, so just follow the Input/Output numbers as you build the Factory)</p>
        <p>Between each level, the Digital Portal provides narrative decisions and setup directions for the next level.</p>
      </section>

      <section class="rulebook-section" id="setup">
        <h2>Game Setup:</h2>
        <ol>
          <li>Place the Game Board in the center of the table, aligning each side to make a 6x6 grid with the marked INPUT Tiles in the top-left Corner, and the OUTPUT Tiles on the bottom-center.</li>
          <li>Place the designated Input Markers for the level on their designated Input Tiles of the Game Board (see Digital Portal or Level Index). Set unused Input Markers aside, you will not need these for the current level.</li>
          <li>Take the assigned Recipe Markers out of the Recipe Deck (see Digital Portal or Level Index). Set unused Recipe Markers aside, you will not need these for the current level.</li>
          <li>Take the assigned Output Markers out of the Output Deck (see Digital Portal or Level Index). Set unused Output Markers aside, you will not need these for the current level.</li>
          <li>Shuffle the assigned Recipe and Output Markers together and place them face down on the table, this is the Marker Deck.</li>
        </ol>
      </section>

      <section class="rulebook-section" id="winning">
        <h2>Winning the Level:</h2>
        <p>During the Clean-Up Phase, if every Objective Output is Produced and connected to a Game Board Output Tile via Conveyors, you will “Switch On” the Factory, and the Level is immediately Won! (see the Digital Portal after the completion of each Level)</p>
        <p class="rulebook-note-line"><strong>NOTE:</strong> All recipes activate simultaneously and will Receive their Inputs and Produce their Outputs.</p>
        <p class="rulebook-note-line"><strong>NOTE:</strong> All Resources are simultaneously transported along the Conveyor network.</p>
        <h3>Losing the Level:</h3>
        <p>If at any point the Round Counter reaches 0, you will lose the current Level. WORRY NOT! You can always retry a level, just follow the directions on the Digital Portal.</p>
        <h3>Winning the Game:</h3>
        <p>Once all Levels have been completed and all Digital Portal decisions have been made, you have won the Game!</p>
      </section>

      <section class="rulebook-section" id="rounds">
        <h2>Playing the Game:</h2>
        <p>The Game is played in Rounds. Each round consists of 4 Phases: the Recipe Phase, Build Phase, Conveyor Phase and Clean-up Phase.</p>
        <div class="full-phase-grid">
          <article class="full-phase">
            <h3>1. Recipe Phase</h3>
            <ol>
              <li>Receive Credits according to the Level settings (see Index or Digital Portal).
                <ol>
                  <li>Receive additional Credits according to satisfied Output Markers (Output Markers placed on the Game Board that are connected to required Resource Inputs).</li>
                  <li>Receive 1 additional Credit according to satisfied Level Objective Outputs (Resource delivered to Game Board Objective Output Tile)</li>
                  <li>Neither of these requires the Factory to be “Switched on” to grant the additional Credits.</li>
                </ol>
              </li>
              <li>Reveal Markers from the Marker Deck until 2 are face-up. (Skip this step if 2 Markers are already revealed, see Recipe Phase D for further options)</li>
              <li>You may Purchase or Reserve a Marker from the 2 revealed Recipe Markers.
                <ol>
                  <li>If you Purchase a Marker, pay 2 Credits immediately. You will NOT need to pay Credits to Place this Marker on the Game Board in the Build Phase.</li>
                  <li>You may only Reserve one Marker at a time. This Marker will not be affected by revealing new Markers (see below).
                    <ol><li>You may choose to discard this Marker at any time during the Recipe Phase.</li></ol>
                  </li>
                  <li>Reserving a Marker does NOT cost any Credits, but you will need to pay Credits to Place the Marker on the Game Board in the Build Phase.</li>
                </ol>
              </li>
              <li>You may spend 2 Credits to take the 2 revealed Markers and Discard them, Revealing the next top 2 Markers from the face-down Marker Deck.
                <ol><li>If at any time the Marker Deck is empty, Shuffle the Marker Discard pile and place it face down on the table to replenish the Deck.</li></ol>
              </li>
            </ol>
          </article>
          <article class="full-phase">
            <h3>2. Build Phase</h3>
            <ol>
              <li>You MUST Place a Purchased Recipe or Output Marker on ANY empty Game Board Tile in ANY orientation.
                <ol><li>This does NOT cost Credits as the Marker has already been Purchased.</li></ol>
              </li>
              <li>You MAY Pay 2 Credits to place a Reserved Marker on ANY empty Game Board Tile in ANY orientation.</li>
              <li>Recipes do NOT have to be adjacent to each other, but WILL need conveyor connections to function.</li>
              <li>You may Pay 1 Credit to move an already Placed Marker.</li>
              <li>You may Pay 2 Credits to Swap the positions of 2 Recipe Markers.
                <ol><li>You may freely Rotate the Orientation of a Recipe or Output Marker at any time during the Build Phase.</li></ol>
              </li>
            </ol>
          </article>
          <article class="full-phase">
            <h3>3. Conveyor Phase</h3>
            <ol>
              <li>Place Conveyors to connect the required Recipe Inputs and Recipe Outputs to other Recipe or Output Markers.</li>
              <li>Conveyors exist along the edges of Game Board Tiles and remain on the Board until you decide to alter their path or remove them.</li>
              <li>Rotating, Moving, Replacing or Removing Conveyors costs 1 Credit for the Round (1 Credit allows you to alter EXISTING Conveyors freely for the entire Round)</li>
              <li>Any number of Straight Conveyors may be Placed for free, provided they form one uninterrupted straight line.</li>
              <li>Placing a Curved or Split Conveyor costs 1 Credit per Conveyor placed.</li>
              <li>Conveyors may cross each other as a bridge but may never share the same lane (edge of a Game Board Tile).</li>
              <li>Be mindful of any Resource Restrictions or Interactions (see Resource Notes under INDEXES).</li>
              <li>Using conveyors to connect DOUBLE the required Input Resources for a Recipe will DOUBLE the Outputs of the Recipe. This does not apply to triple or quadruple Input Recipe Requirements, which will only produce double outputs.
                <ol><li>Ie. 2 Iron = 2 Coal: Providing 4 Iron will Produce 4 Coal. Providing 6 Iron continues to Produce 4 Coal.</li></ol>
              </li>
            </ol>
          </article>
          <article class="full-phase">
            <h3>4. Clean Up</h3>
            <ol>
              <li>Return all spent Credits to the supply (if not done so already)</li>
              <li>Advance the Round Counter on the Game Board one space.
                <ol><li>If the Round Counter ever reaches zero, you lose the current level.</li></ol>
              </li>
              <li>If the Round Counter is Above 0 and all Objective Outputs have been satisfied, you will “Switch on” the Factory and win the Level!
                <ol>
                  <li>Satisfying any Placed Output Markers is OPTIONAL for Completing the Level</li>
                  <li>Producing more than the required Objective Outputs will still satisfy the Level (ie. 3 Steel will complete the objective of 2 Steel)</li>
                </ol>
              </li>
              <li>If the Round Counter is above zero, return to the Recipe Phase.</li>
            </ol>
          </article>
        </div>
      </section>

      <section class="rulebook-section" id="indexes">
        <h2>Indexes:</h2>
        <p class="spoiler-note"><strong>First-time players:</strong> Play through the game before opening the Indexes. They contain Resource Notes and future Level information.</p>
        <details class="index-entry resource-index-entry">
          <summary>Resource Index:</summary>
          <div class="index-entry-body">
            <ol class="resource-index">${RESOURCES.map((resource) => `<li>${resource}</li>`).join("")}</ol>
            <aside class="site-note resource-note">
              <p><strong>NOTE:</strong> Uranium may NOT be on a conveyor adjacent (within 1 Game Board Tile) of a conveyor containing Copper, Iron or Steel. This does NOT include Refined Uranium. This does NOT prohibit diagonal adjacency.</p>
            </aside>
          </div>
        </details>
        <h3>Level Index:</h3>
        <div class="level-index">${levelIndexMarkup()}</div>
      </section>
    </article>
    ${quickRulesDialogMarkup()}
  `;
  focusPage();
}

function renderSavedScreen() {
  if (!campaign) return renderHome();
  if (campaign.screen === "onboarding") return renderOnboarding();
  if (campaign.screen === "level") return renderLevel();
  if (campaign.screen === "branch") return renderBranch();
  if (campaign.screen === "failed") return renderFailed();
  if (campaign.screen === "complete") return renderComplete();
  renderHome();
}

function renderView(view) {
  if (view === "home") return renderHome();
  if (view === "onboarding") return renderOnboarding();
  if (view === "level") return renderLevel();
  if (view === "branch") return renderBranch();
  if (view === "failed") return renderFailed();
  if (view === "complete") return renderComplete();
  renderHome();
}

function startNewGame() {
  campaign = newCampaign();
  saveCampaign();
  renderOnboarding();
}

function advanceToLevel(levelId) {
  if (!LEVELS[levelId]) return;
  campaign.levelId = levelId;
  campaign.round = 1;
  resetLevelCredits(levelId);
  campaign.route.push(levelId);
  campaign.screen = "level";
  saveCampaign();
  renderLevel();
}

document.addEventListener("click", (event) => {
  if (event.target.matches?.(".rules-dialog")) {
    event.target.close();
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "open-quick-rules") {
    document.querySelector("#quick-rules-dialog")?.showModal();
  }

  if (action === "close-quick-rules") {
    document.querySelector("#quick-rules-dialog")?.close();
  }

  if (action === "credit-change") {
    const amount = Number(button.dataset.amount);
    if (recordCreditTransaction(button.dataset.label, amount)) updateCreditDisplays();
  }

  if (action === "undo-credit" && campaign.creditHistory.length) {
    const transaction = campaign.creditHistory.pop();
    campaign.credits -= transaction.amount;
    saveCampaign();
    updateCreditDisplays();
  }

  if (action === "open-rulebook") {
    if (currentView !== "rulebook") rulebookReturnView = currentView;
    document.querySelector("#quick-rules-dialog")?.close();
    renderRulebook();
  }

  if (action === "close-rulebook") {
    renderView(rulebookReturnView);
  }

  if (action === "new-game") {
    if (!campaign || window.confirm("Start a new game and replace the current save?")) startNewGame();
  }

  if (action === "continue" && campaign) renderSavedScreen();

  if (action === "home") renderHome();

  if (action === "start-level") {
    campaign.screen = "level";
    campaign.levelId = "L0";
    campaign.round = 1;
    resetLevelCredits("L0");
    saveCampaign();
    renderLevel();
  }

  if (action === "next-round") {
    const level = LEVELS[campaign.levelId];
    if (level.roundLimit && campaign.round >= level.roundLimit) {
      campaign.screen = "failed";
      saveCampaign();
      renderFailed();
    } else {
      campaign.round += 1;
      recordCreditTransaction(`Round ${campaign.round} income`, level.credits);
      renderLevel();
    }
  }

  if (action === "objective-complete") {
    const level = LEVELS[campaign.levelId];
    if (level.next.length > 0) {
      campaign.screen = "branch";
      saveCampaign();
      renderBranch();
    } else {
      campaign.screen = "complete";
      saveCampaign();
      renderComplete();
    }
  }

  if (action === "choose-route") {
    advanceToLevel(button.dataset.target);
  }

  if (action === "retry-level") {
    campaign.round = 1;
    campaign.screen = "level";
    resetLevelCredits(campaign.levelId);
    saveCampaign();
    renderLevel();
  }

  if (action === "quit" && window.confirm("Quit to the home page? Your current level and round are saved.")) {
    renderHome();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === SAVE_KEY) {
    campaign = loadCampaign();
    renderHome();
  }
});

renderHome();
