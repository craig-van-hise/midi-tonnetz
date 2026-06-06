# VV | MIDI Tonnetz Explorer

An interactive web-based Tonnetz Explorer that visualizes MIDI input on a Euler-Riemann Tonnetz grid. The grid maps harmonic relationships geometrically, making it easy to visualize musical intervals, chords, and progressions in real-time.

## Features

- **Interactive Tonnetz Grid**: Visualizes note relationships where horizontal steps represent perfect fifths, diagonals up-right represent major thirds, and diagonals down-right represent minor thirds.
- **Web MIDI API Integration**: Connect any MIDI keyboard or controller directly to your browser.
- **Real-time Visualization**: Notes played on your MIDI controller light up on the grid instantly.
- **Multi-channel & Device Filtering**: Select specific MIDI input devices and filter by MIDI channels.
- **Panic Button**: Instantly clears all stuck notes and sends an All Notes Off CC message to all connected outputs.
- **Bypass Mode**: Temporarily pause MIDI visualization.

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- A modern browser with **Web MIDI API** support (Chrome, Edge, Opera)
- A connected MIDI controller (optional, can also be used with on-screen interaction or virtual MIDI drivers)

### Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Open the local server URL (usually `http://localhost:3000`) in a supported browser.

## Built With

- **React 19** & **TypeScript**
- **Vite 6**
- **Tailwind CSS** (via CDN)
- **Lucide React** (icons)
- **Web MIDI API**

## Project Structure

```
/Users/vv2024/Documents/Repos - vv2024/MIDI/WebApps/midi-tonnetz
├── App.tsx
├── PROJECT_CONTEXT_BUNDLE.md
├── PROJECT_STATE.md
├── README.md
├── components
│   ├── Modal.tsx
│   ├── TitleBar.tsx
│   ├── TonnetzGrid.tsx
│   ├── TonnetzGridContainer.tsx
│   └── navigation
│       ├── ContextMenus.tsx
│       ├── NavContainer.tsx
│       ├── NavControllerOriginal.tsx
│       └── types.ts
├── constants.ts
├── index.html
├── index.tsx
├── llms.txt
├── metadata.json
├── package-lock.json
├── package.json
├── project_tree.txt
├── tsconfig.json
├── types.ts
└── vite.config.ts
```


