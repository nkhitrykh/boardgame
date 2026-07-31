const STORAGE_KEYS = {
  objectives: "boardgame.objectives",
  journal: "boardgame.journal"
};

const objectiveForm = document.querySelector("#objective-form");
const objectiveInput = document.querySelector("#objective-input");
const objectiveList = document.querySelector("#objective-list");
const objectiveEmpty = document.querySelector("#objective-empty");
const objectiveCount = document.querySelector("#objective-count");
const journalNotes = document.querySelector("#journal-notes");
const saveStatus = document.querySelector("#save-status");
const resetButton = document.querySelector("#reset-progress");

let objectives = readObjectives();
let saveTimer;

function readObjectives() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.objectives)) ?? [];
  } catch {
    return [];
  }
}

function saveObjectives() {
  localStorage.setItem(STORAGE_KEYS.objectives, JSON.stringify(objectives));
}

function renderObjectives() {
  objectiveList.replaceChildren();

  objectives.forEach((objective) => {
    const item = document.createElement("li");
    item.className = `objective-item${objective.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = objective.completed;
    checkbox.setAttribute("aria-label", `Complete ${objective.text}`);
    checkbox.addEventListener("change", () => {
      objective.completed = checkbox.checked;
      saveObjectives();
      renderObjectives();
    });

    const text = document.createElement("span");
    text.textContent = objective.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${objective.text}`);
    remove.addEventListener("click", () => {
      objectives = objectives.filter((item) => item.id !== objective.id);
      saveObjectives();
      renderObjectives();
    });

    item.append(checkbox, text, remove);
    objectiveList.append(item);
  });

  const activeCount = objectives.filter((objective) => !objective.completed).length;
  objectiveCount.textContent = `${activeCount} active`;
  objectiveEmpty.hidden = objectives.length > 0;
}

objectiveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = objectiveInput.value.trim();

  if (!text) return;

  objectives.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });
  saveObjectives();
  renderObjectives();
  objectiveForm.reset();
  objectiveInput.focus();
});

journalNotes.value = localStorage.getItem(STORAGE_KEYS.journal) ?? "";
journalNotes.addEventListener("input", () => {
  saveStatus.textContent = "Saving…";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEYS.journal, journalNotes.value);
    saveStatus.textContent = "Saved on this device";
  }, 300);
});

resetButton.addEventListener("click", () => {
  const shouldReset = window.confirm("Clear all locally saved objectives and journal notes?");
  if (!shouldReset) return;

  localStorage.removeItem(STORAGE_KEYS.objectives);
  localStorage.removeItem(STORAGE_KEYS.journal);
  objectives = [];
  journalNotes.value = "";
  renderObjectives();
  saveStatus.textContent = "Progress cleared";
});

renderObjectives();
