### FILE: project_tree.txt


/Users/vv2024/Documents/Repos - vv2024/MIDI/WebApps/midi-tonnetz
├── # Prompts
|  ├── # 1.md
|  ├── # 10.md
|  ├── # 11.md
|  ├── # 12.md
|  ├── # 13.md
|  ├── # 14.md
|  ├── # 15.md
|  ├── # 2.md
|  ├── # 3.md
|  ├── # 4.md
|  ├── # 5.md
|  ├── # 6.md
|  ├── # 7.md
|  ├── # 8.md
|  └── # 9.md
├── App.tsx
├── PROJECT_CONTEXT_BUNDLE.md
├── PROJECT_STATE.md
├── README.md
├── components
|  ├── Modal.tsx
|  ├── TitleBar.tsx
|  ├── TonnetzGrid.tsx
|  ├── TonnetzGridContainer.tsx
|  └── navigation
|     ├── ContextMenus.tsx
|     ├── NavContainer.tsx
|     ├── NavControllerOriginal.tsx
|     └── types.ts
├── constants.ts
├── index.html
├── index.tsx
├── llms.txt
├── metadata.json
├── migrated_prompt_history
|  └── prompt_2026-01-18T21:42:22.854Z.json
├── package-lock.json
├── package.json
├── project_tree.txt
├── tsconfig.json
├── types.ts
└── vite.config.ts

directory: 210 file: 1950

ignored: directory (17)


[2K[1G

### FILE: PROJECT_STATE.md

# Project State

## 1. Architecture

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

## 2. Tech Stack

- **React 19.2.3** & **React DOM 19.2.3** (UI library)
- **TypeScript 5.8.2** (Static typing)
- **Vite 6.2.0** (Build tool and dev server)
- **Tailwind CSS** (via CDN in `index.html`)
- **Lucide React 1.17.0** (Icon library)
- **Google Fonts (Inter)** & **Material Symbols Outlined** (Typography and iconography)
- **Web MIDI API** (Browser API for MIDI devices)
- **HTML5 Canvas 2D API** (High-performance rendering of the Tonnetz mesh)

## 3. Current System Capabilities

### Audio Engine
- **MIDI Panic Controller**: The app does not generate local audio. Instead, it forwards an `All Notes Off` CC message (CC 123) to all 16 channels on all connected MIDI outputs when the Panic button is clicked. It also clears all active/held notes in the local React state.

### Tracking Engine
- **Web MIDI Receiver**: Integrates with the browser's `navigator.requestMIDIAccess` to automatically discover MIDI inputs.
- **Port Selection**: Provides a dropdown to bind to a specific MIDI input device.
- **Channel Filtering**: Allows toggling active monitoring for channels 1 through 16.
- **Bypass Mode**: Disables incoming MIDI message processing dynamically.
- **Message Parsing**: Intercepts Note On/Off bytes (handling velocity 0 as Note Off) to maintain state.

### Visualizer Modes
- **Euler-Riemann Tonnetz Grid**: Renders a dynamic, infinite hexagonal grid on an HTML5 canvas where:
  - Horizontal movement (X-axis) maps to a custom semitone interval (default is perfect fifth).
  - Diagonal movement (Y-axis) maps to a custom semitone interval (default is major third).
- **Interactive Triad Mappings**: Dropdown selector changes grid layout mapping between various triad intervals (Major, Minor, diminished, etc.).
- **Interactive Mesh Controls**: Supports zoom (using mouse wheel with ⌘ / Ctrl) and drag-to-pan. Nodes can be clicked directly to toggle active pitch classes.
- **Triad Rendering**: Identifies active triads (three active notes forming a triangle) and fills the triangle area with a transparent blue highlight.

### UI State Logic & Navigation Overlay
- **Header Toolbar**: Clean, modern control dashboard containing MIDI input selection, bypass toggle, panic button, channel filter popover, and visual status indicators.
- **Floating Navigation Controller Overlay**: A floating control deck containing:
  - **D-Pad Directional Keys**: Up, down, left, right, and optionally diagonals (up-left, up-right, down-left, down-right) mapped to custom steps and MIDI triggers.
  - **Action Keys**: Play and Home buttons customizable to trigger specific actions.
  - **MIDI Learn Mode**: An interactive wizard allowing users to map physical MIDI keys directly to control interface buttons.
  - **Custom Context Menus**: Right-click trigger on controller buttons to configure step size, channel, and MIDI notes, with automatic safe-boundary layout adjustments.
- **Responsive Workspace**: Flexible centering grid layout that scales canvas drawing buffers to match the device pixel ratio (High DPI / Retina support) and anchors overlays.

### Current Work-in-Progress
- **None**: Current implementation of navigation overlays, MIDI learning, and core visualization features are complete and stable.

## 4. Recent Evolution

Recent updates introduced automated GitHub Pages build & deployment workflows (using Node 24 actions) to host the application. Additionally, a floating D-Pad and action button Navigation Controller was integrated with context menus, layout safety boundaries, and custom MIDI Learn mapping.


### FILE: README.md

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




