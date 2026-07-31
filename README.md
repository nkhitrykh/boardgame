# Factory Companion

A responsive static companion for a single-player, level-based factory puzzle board game. The physical board handles factory construction and production; this site handles onboarding, level setup, round tracking, narrative branches, and device-local progress.

## Current experience

- Home screen with New Game and Continue
- Placeholder onboarding-video screen
- Three-level campaign with the requested branching map
- Input materials, allowed recipes, output goals, and round limits for every level
- Easy, medium, and hard routes
- Next Round, Objective Complete, retry, quit confirmation, and campaign completion states
- Prototype rules available from both the home and play screens
- Local save using `localStorage`
- Responsive phone and desktop layouts

## Branch map

```text
L1 Tutorial
├── L2A Easy
│   ├── L3A Easy
│   └── L3B Medium
└── L2B Hard
    ├── L3B Medium
    └── L3C Hard
```

Level 1 uses the playtest objective and recipes from the concept document. Later levels are prototype balancing content and should be adjusted after physical playtesting.

## Run locally

Open `index.html` directly in a modern browser, or use a local static server such as the Live Server extension in Visual Studio Code.

## Saving and privacy

Campaign progress is stored only in the current browser under `factory-companion.campaign.v2`. The site has no accounts, analytics, external scripts, database, or network API. Clearing browser site data removes the save.

## Publishing

The site uses relative paths and is compatible with a GitHub Pages project URL such as:

```text
https://USERNAME.github.io/boardgame/
```

Publish from the `main` branch and `/(root)` folder.
