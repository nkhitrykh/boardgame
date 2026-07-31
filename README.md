# Board Game Digital Companion

A responsive static website that supports a physical board game with branching narrative events, objective tracking, journal notes, and audio playback.

## Project structure

```text
boardgame/
├── index.html
├── style.css
├── script.js
├── story/
│   └── story.html
├── audio/
├── images/
├── objectives/
│   └── sample-objectives.json
└── assets/
```

## Run locally

Open `index.html` directly in a browser, or use a local web server such as the Live Server extension in Visual Studio Code.

## Twine integration

`story/story.html` is currently a small working prototype. When the Twine narrative is ready, export it as HTML and replace that file. Keep links and media paths relative so they work on GitHub Pages.

## Saving

Objectives and journal notes are saved only in the current browser using `localStorage`. The reset button removes that locally saved progress.

## Publishing later

This repository is ready for a future GitHub Pages deployment. After pushing it to GitHub, select the `main` branch and `/root` folder in the repository's Pages settings.
