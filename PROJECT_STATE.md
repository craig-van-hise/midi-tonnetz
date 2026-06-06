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
