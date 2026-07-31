const SAVE_KEY = "factory-companion.campaign.v2";

const RECIPES = {
  R01: "1 iron + 1 mineral → 1 steel",
  R02: "1 iron → 2 coal",
  R03: "1 coal + 2 minerals → 2 iron",
  R04: "2 minerals + 2 coal → 2 copper",
  R05: "1 coal + 4 minerals → 1 steel",
  R06: "1 iron + 1 mineral → 2 copper",
  R07: "1 copper + 1 iron → 1 steel"
};

const LEVELS = {
  L1: {
    number: 1,
    pathLabel: "Tutorial",
    difficulty: "tutorial",
    title: "Commissioning Run",
    briefing: "The loading dock is waiting on its first shipment. Bring the dormant line online and prove the factory can hold a stable copper-to-steel ratio.",
    rounds: 10,
    inputs: [
      ["Minerals", "4"],
      ["Minerals", "2"],
      ["Coal", "2"],
      ["Empty", "—"]
    ],
    recipes: ["R01", "R02", "R03", "R04", "R05", "R06", "R07"],
    objectives: [
      ["Copper", "2"],
      ["Steel", "1"],
      ["Empty", "—"],
      ["Empty", "—"]
    ],
    ratio: "2 copper : 1 steel",
    next: [
      {
        target: "L2A",
        title: "Stabilize the western line",
        difficulty: "Easy route",
        description: "A predictable supply train offers extra minerals and a wider recipe set. Choose reliability over speed."
      },
      {
        target: "L2B",
        title: "Answer the emergency call",
        difficulty: "Hard route",
        description: "A failing outpost needs material now. Accept scarcer inputs and a tighter production window."
      }
    ]
  },
  L2A: {
    number: 2,
    pathLabel: "Western line",
    difficulty: "easy",
    title: "Reserve Current",
    briefing: "The western feeder line is intact, but its generators are running below capacity. Build an efficient loop before reserves fall further.",
    rounds: 9,
    inputs: [
      ["Minerals", "4"],
      ["Minerals", "4"],
      ["Coal", "3"],
      ["Iron", "1"]
    ],
    recipes: ["R01", "R03", "R04", "R05", "R06"],
    objectives: [
      ["Copper", "4"],
      ["Steel", "2"],
      ["Empty", "—"],
      ["Empty", "—"]
    ],
    ratio: "2 copper : 1 steel",
    next: [
      {
        target: "L3A",
        title: "Protect the reserves",
        difficulty: "Easy route",
        description: "Keep the repaired grid isolated and finish with stable power, generous stock, and time to plan."
      },
      {
        target: "L3B",
        title: "Power the relay",
        difficulty: "Medium route",
        description: "Divert energy to a silent relay station. The route is less forgiving, but nearby crews may hear you."
      }
    ]
  },
  L2B: {
    number: 2,
    pathLabel: "Emergency line",
    difficulty: "hard",
    title: "Redline Dispatch",
    briefing: "The outpost cannot wait. Its damaged intake provides fewer raw materials, and every round lost brings the line closer to collapse.",
    rounds: 8,
    inputs: [
      ["Minerals", "4"],
      ["Coal", "2"],
      ["Iron", "1"],
      ["Empty", "—"]
    ],
    recipes: ["R02", "R03", "R04", "R06", "R07"],
    objectives: [
      ["Copper", "3"],
      ["Steel", "2"],
      ["Empty", "—"],
      ["Empty", "—"]
    ],
    ratio: "3 copper : 2 steel",
    next: [
      {
        target: "L3B",
        title: "Stabilize the convoy",
        difficulty: "Medium route",
        description: "Use the recovered shipment to reinforce the relay route and take the measured path forward."
      },
      {
        target: "L3C",
        title: "Push beyond the grid",
        difficulty: "Hard route",
        description: "Chase a powerful signal into an unstable sector with the least material and the shortest clock."
      }
    ]
  },
  L3A: {
    number: 3,
    pathLabel: "Reserve ending",
    difficulty: "easy",
    title: "Safe Harbor",
    briefing: "The final loading dock is within reach. Use the protected reserves to establish a steady line and secure the region.",
    rounds: 9,
    inputs: [
      ["Minerals", "6"],
      ["Coal", "4"],
      ["Iron", "2"],
      ["Empty", "—"]
    ],
    recipes: ["R01", "R03", "R04", "R05", "R06"],
    objectives: [
      ["Copper", "4"],
      ["Steel", "2"],
      ["Empty", "—"],
      ["Empty", "—"]
    ],
    ratio: "2 copper : 1 steel",
    next: []
  },
  L3B: {
    number: 3,
    pathLabel: "Relay ending",
    difficulty: "medium",
    title: "Signal Relay",
    briefing: "The relay is awake, but drawing heavily from the grid. Balance its power demand against a larger final shipment.",
    rounds: 8,
    inputs: [
      ["Minerals", "6"],
      ["Coal", "3"],
      ["Iron", "1"],
      ["Copper", "1"]
    ],
    recipes: ["R01", "R02", "R03", "R04", "R05", "R06"],
    objectives: [
      ["Copper", "6"],
      ["Steel", "4"],
      ["Empty", "—"],
      ["Empty", "—"]
    ],
    ratio: "3 copper : 2 steel",
    next: []
  },
  L3C: {
    number: 3,
    pathLabel: "Frontier ending",
    difficulty: "hard",
    title: "Black Grid",
    briefing: "Past the mapped lines, the grid is barely alive. Make the final shipment before the remaining generators fail.",
    rounds: 7,
    inputs: [
      ["Minerals", "5"],
      ["Coal", "2"],
      ["Iron", "1"],
      ["Empty", "—"]
    ],
    recipes: ["R02", "R03", "R04", "R06", "R07"],
    objectives: [
      ["Copper", "6"],
      ["Steel", "4"],
      ["Empty", "—"],
      ["Empty", "—"]
    ],
    ratio: "3 copper : 2 steel",
    next: []
  }
};

const RULES = [
  {
    title: "Set the floor",
    text: "Use the level's starting factory, resources, machines, conveyors, and yellow generator zone."
  },
  {
    title: "Collect energy",
    text: "At the start of each round, collect energy from every active generator at its current power level."
  },
  {
    title: "Build the line",
    text: "Place or move machines and conveyors, assign recipes, or spend energy to change the factory."
  },
  {
    title: "Run production",
    text: "Each powered machine resolves its recipe once. Connected conveyors carry outputs toward the next machine."
  },
  {
    title: "Ship the goal",
    text: "Only materials delivered to the loading docks count. Complete the required ratio before the round limit."
  }
];

const app = document.querySelector("#app");
const rulesDialog = document.querySelector("#rules-dialog");
const rulesDialogContent = document.querySelector("#rules-dialog-content");
const confirmDialog = document.querySelector("#confirm-dialog");
const confirmTitle = document.querySelector("#confirm-title");
const confirmMessage = document.querySelector("#confirm-message");
const confirmButton = document.querySelector("#confirm-button");

let pendingConfirmation = null;
let campaign = loadCampaign();
let currentView = "home";

function defaultCampaign() {
  return {
    version: 2,
    screen: "onboarding",
    levelId: "L1",
    round: 1,
    route: [],
    updatedAt: Date.now()
  };
}

function isValidCampaign(value) {
  if (!value || value.version !== 2) return false;
  if (!LEVELS[value.levelId]) return false;
  if (!Number.isInteger(value.round) || value.round < 1) return false;
  return ["onboarding", "level", "branch", "failed", "complete"].includes(value.screen);
}

function loadCampaign() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return isValidCampaign(saved) ? saved : null;
  } catch {
    return null;
  }
}

function saveCampaign() {
  if (!campaign) return;
  campaign.updatedAt = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(campaign));
}

function removeCampaign() {
  localStorage.removeItem(SAVE_KEY);
  campaign = null;
}

function rulesMarkup() {
  return `
    <div class="section-head">
      <div>
        <p class="kicker">Table reference</p>
        <h2>Round structure</h2>
      </div>
      <p>Prototype summary based on the current concept document. Replace this section when the final class rules are approved.</p>
    </div>
    <div class="rule-grid">
      ${RULES.map((rule, index) => `
        <article class="rule-step">
          <span class="rule-number">0${index + 1}</span>
          <h3>${rule.title}</h3>
          <p>${rule.text}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function factoryGridMarkup() {
  const machines = new Set([8, 9, 15, 16, 22, 28]);
  return Array.from({ length: 36 }, (_, index) => {
    const classes = ["factory-cell"];
    if (index % 6 === 0) classes.push("generator");
    if (machines.has(index)) classes.push("machine");
    return `<span class="${classes.join(" ")}" aria-hidden="true"></span>`;
  }).join("");
}

function continueLabel() {
  if (!campaign) return "No saved run on this device";
  if (campaign.screen === "onboarding") return "Briefing ready to continue";
  if (campaign.screen === "complete") return "Completed run saved";
  const level = LEVELS[campaign.levelId];
  return `Saved at Level ${level.number}, Round ${campaign.round}`;
}

function renderHome() {
  currentView = "home";
  app.innerHTML = `
    <div class="screen">
      <section class="hero" aria-labelledby="home-title">
        <div class="hero-copy">
          <p class="kicker">Factory network // awaiting operator</p>
          <h1 id="home-title">Build the line.<br>Choose what follows.</h1>
          <p>Run a physical 6×6 factory, meet each material ratio before time runs out, and let your decisions determine the next level.</p>
          <div class="hero-actions">
            <button class="button button-primary" type="button" data-action="new-game"><span aria-hidden="true">▶</span> New game</button>
            <button class="button" type="button" data-action="continue" ${campaign ? "" : "disabled"}>Continue</button>
          </div>
          <p class="continue-note">${continueLabel()}</p>
        </div>

        <div class="factory-visual" aria-label="Diagram of a six by six factory floor with a generator column and six machines">
          <div class="factory-caption">
            <span>Factory floor // 6×6</span>
            <span><i class="live-dot" aria-hidden="true"></i>Grid ready</span>
          </div>
          <div class="factory-grid">${factoryGridMarkup()}</div>
          <div class="factory-legend">
            <span><i class="legend-swatch"></i>Generator zone</span>
            <span><i class="legend-swatch machine"></i>Machine</span>
          </div>
        </div>
      </section>

      <section class="rules-section" aria-label="Prototype rules">
        ${rulesMarkup()}
      </section>
    </div>
  `;
  focusApp();
}

function renderOnboarding() {
  currentView = "onboarding";
  app.innerHTML = `
    <div class="screen">
      <div class="screen-heading">
        <p class="kicker">Operator onboarding // 00</p>
        <h1>Before the first shift</h1>
        <p>This space is reserved for the onboarding video. It will introduce the board, machine cards, recipes, generators, and round sequence.</p>
      </div>

      <section class="onboarding-layout" aria-label="Onboarding briefing">
        <div class="video-placeholder" role="img" aria-label="Placeholder for onboarding video">
          <div class="video-placeholder-inner">
            <div class="play-symbol" aria-hidden="true">▶</div>
            <h2>Training feed placeholder</h2>
            <p>Onboarding video will be added here.</p>
          </div>
        </div>
        <aside class="briefing-card">
          <p class="kicker">Briefing contents</p>
          <h2>What you’ll learn</h2>
          <ol>
            <li>Read the four input and output ports.</li>
            <li>Build inside the 6×6 factory grid.</li>
            <li>Assign recipes and power machines.</li>
            <li>Complete the objective before time expires.</li>
          </ol>
          <button class="button button-primary" type="button" data-action="start-level">Skip briefing &amp; begin</button>
          <button class="button button-ghost" type="button" data-action="home">Return home</button>
        </aside>
      </section>
    </div>
  `;
  focusApp();
}

function materialMarkup(items, type) {
  const className = type === "objective" ? "objective" : "material";
  return items.map(([name, quantity], index) => `
    <li class="${className}-item">
      <span><span class="port">${type === "objective" ? "OUT" : "IN"}-${index + 1}</span><br>${name}</span>
      <strong class="quantity">${quantity}</strong>
    </li>
  `).join("");
}

function recipeMarkup(recipeIds) {
  return recipeIds.map((id) => `
    <li class="recipe-item">
      <span class="recipe-id">${id}</span>
      <p>${RECIPES[id]}</p>
    </li>
  `).join("");
}

function roundTrackMarkup(round, total) {
  return Array.from({ length: total }, (_, index) => `
    <span class="round-mark ${index < round ? "used" : ""}" aria-hidden="true"></span>
  `).join("");
}

function renderLevel() {
  const level = LEVELS[campaign.levelId];
  currentView = "level";
  app.innerHTML = `
    <div class="screen">
      <div class="level-topline">
        <p class="kicker">Level ${level.number} of 3 // ${level.pathLabel}</p>
        <span class="difficulty ${level.difficulty}">${level.difficulty}</span>
      </div>

      <section class="level-card" aria-labelledby="level-title">
        <header class="level-brief">
          <h1 id="level-title">${level.title}</h1>
          <p>${level.briefing}</p>
        </header>

        <div class="level-columns">
          <section class="level-column" aria-labelledby="inputs-title">
            <p class="kicker">01 // Supply</p>
            <h2 id="inputs-title">Input materials</h2>
            <ul class="material-list">${materialMarkup(level.inputs, "input")}</ul>
          </section>

          <section class="level-column level-column-recipes" aria-labelledby="recipes-title">
            <p class="kicker">02 // Machine cards</p>
            <h2 id="recipes-title">Level recipes <span class="count-badge">${level.recipes.length} of 7</span></h2>
            <ul class="recipe-list">${recipeMarkup(level.recipes)}</ul>
          </section>

          <section class="level-column" aria-labelledby="objective-title">
            <p class="kicker">03 // Loading docks</p>
            <h2 id="objective-title">Output objective</h2>
            <ul class="objective-list">${materialMarkup(level.objectives, "objective")}</ul>
            <div class="ratio-callout">
              <span>Required ratio</span>
              <strong>${level.ratio}</strong>
            </div>
          </section>
        </div>

        <div class="level-controls">
          <div class="round-readout" aria-label="Round ${campaign.round} of ${level.rounds}">
            <strong>${String(campaign.round).padStart(2, "0")}</strong>
            <span>/ ${String(level.rounds).padStart(2, "0")} rounds</span>
          </div>
          <div class="round-track" style="--rounds: ${level.rounds}" aria-hidden="true">
            ${roundTrackMarkup(campaign.round, level.rounds)}
          </div>
          <div class="control-buttons">
            <button class="button" type="button" data-action="next-round">Next round <span aria-hidden="true">→</span></button>
            <button class="button button-primary" type="button" data-action="objective-complete">Objective complete</button>
          </div>
        </div>
        <div class="quit-row">
          <button class="text-button" type="button" data-action="quit">Quit to home</button>
        </div>
      </section>

      <section class="rules-section" aria-label="Prototype rules">
        ${rulesMarkup()}
      </section>
    </div>
  `;
  focusApp();
}

function renderBranch() {
  const level = LEVELS[campaign.levelId];
  currentView = "branch";
  app.innerHTML = `
    <div class="screen">
      <div class="branch-intro">
        <p class="kicker">Transmission received // decision required</p>
        <h1>Production holds. The route does not.</h1>
        <p>Your shipment cleared ${level.title}, but two requests arrive before the next shift. Choose one; the decision sets the next level and its difficulty.</p>
      </div>

      <section class="choice-grid" aria-label="Choose the next route">
        ${level.next.map((choice, index) => `
          <article class="choice-card">
            <span class="choice-index">0${index + 1}</span>
            <p class="kicker">${choice.difficulty}</p>
            <h2>${choice.title}</h2>
            <p>${choice.description}</p>
            <button class="button ${index === 0 ? "button-primary" : ""}" type="button" data-action="choose-route" data-target="${choice.target}">Choose route</button>
          </article>
        `).join("")}
      </section>
    </div>
  `;
  focusApp();
}

function renderFailed() {
  const level = LEVELS[campaign.levelId];
  currentView = "failed";
  app.innerHTML = `
    <div class="screen result-wrap">
      <section class="result-card" aria-labelledby="failed-title">
        <div class="result-icon" aria-hidden="true">!</div>
        <p class="kicker">Round limit reached</p>
        <h1 id="failed-title">Shipment missed.</h1>
        <p>${level.title} exceeded its ${level.rounds}-round limit. Reset the level and try a different factory layout.</p>
        <div class="result-actions">
          <button class="button button-primary" type="button" data-action="retry-level">Retry level</button>
          <button class="button button-ghost" type="button" data-action="home">Return home</button>
        </div>
      </section>
    </div>
  `;
  focusApp();
}

function renderComplete() {
  const level = LEVELS[campaign.levelId];
  currentView = "complete";
  app.innerHTML = `
    <div class="screen result-wrap">
      <section class="result-card" aria-labelledby="complete-title">
        <div class="result-icon" aria-hidden="true">✓</div>
        <p class="kicker">Campaign route complete</p>
        <h1 id="complete-title">The final dock is supplied.</h1>
        <p>You completed the ${level.pathLabel.toLowerCase()} through ${level.title}. Start again to explore another branch and factory constraint.</p>
        <div class="result-actions">
          <button class="button button-primary" type="button" data-action="new-game">Start another run</button>
          <button class="button button-ghost" type="button" data-action="home">Return home</button>
        </div>
      </section>
    </div>
  `;
  focusApp();
}

function renderCampaign() {
  if (!campaign) {
    renderHome();
    return;
  }

  if (campaign.screen === "onboarding") renderOnboarding();
  if (campaign.screen === "level") renderLevel();
  if (campaign.screen === "branch") renderBranch();
  if (campaign.screen === "failed") renderFailed();
  if (campaign.screen === "complete") renderComplete();
}

function focusApp() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.focus({ preventScroll: true });
}

function startNewGame() {
  campaign = defaultCampaign();
  saveCampaign();
  renderOnboarding();
}

function requestConfirmation({ title, message, confirmLabel, onConfirm }) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  confirmButton.textContent = confirmLabel;
  pendingConfirmation = onConfirm;
  confirmDialog.showModal();
}

function showRules() {
  rulesDialogContent.innerHTML = rulesMarkup();
  rulesDialog.showModal();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "home") {
    if (currentView === "level" || currentView === "branch") {
      requestConfirmation({
        title: "Return home?",
        message: "Your current level and round are saved. Use Continue to return later.",
        confirmLabel: "Return home",
        onConfirm: renderHome
      });
    } else {
      renderHome();
    }
  }

  if (action === "show-rules") showRules();
  if (action === "close-rules") rulesDialog.close();
  if (action === "cancel-confirm") {
    pendingConfirmation = null;
    confirmDialog.close();
  }

  if (action === "new-game") {
    if (!campaign) {
      startNewGame();
      return;
    }
    requestConfirmation({
      title: "Start a new run?",
      message: "This will replace the campaign currently saved on this device.",
      confirmLabel: "Start new game",
      onConfirm: startNewGame
    });
  }

  if (action === "continue" && campaign) renderCampaign();

  if (action === "start-level") {
    campaign.screen = "level";
    campaign.levelId = "L1";
    campaign.round = 1;
    saveCampaign();
    renderLevel();
  }

  if (action === "next-round") {
    const level = LEVELS[campaign.levelId];
    if (campaign.round >= level.rounds) {
      campaign.screen = "failed";
      saveCampaign();
      renderFailed();
      return;
    }
    campaign.round += 1;
    saveCampaign();
    renderLevel();
  }

  if (action === "objective-complete") {
    const level = LEVELS[campaign.levelId];
    campaign.screen = level.next.length ? "branch" : "complete";
    saveCampaign();
    renderCampaign();
  }

  if (action === "choose-route") {
    const nextLevel = target.dataset.target;
    if (!LEVELS[nextLevel]) return;
    campaign.route.push(nextLevel);
    campaign.levelId = nextLevel;
    campaign.round = 1;
    campaign.screen = "level";
    saveCampaign();
    renderLevel();
  }

  if (action === "retry-level") {
    campaign.round = 1;
    campaign.screen = "level";
    saveCampaign();
    renderLevel();
  }

  if (action === "quit") {
    requestConfirmation({
      title: "Quit to home?",
      message: "Your current level and round are saved. Use Continue to return later.",
      confirmLabel: "Quit to home",
      onConfirm: renderHome
    });
  }
});

confirmButton.addEventListener("click", () => {
  const callback = pendingConfirmation;
  pendingConfirmation = null;
  confirmDialog.close();
  if (callback) callback();
});

[rulesDialog, confirmDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

confirmDialog.addEventListener("cancel", () => {
  pendingConfirmation = null;
});

window.addEventListener("storage", (event) => {
  if (event.key !== SAVE_KEY) return;
  campaign = loadCampaign();
  renderHome();
});

rulesDialogContent.innerHTML = rulesMarkup();
renderHome();
