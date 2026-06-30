# 📐 Photobooth System Architecture & Tasks

## 1. Centralized State Management
Instead of scattering variables everywhere, `app.js` will hold a single "source of truth" state object.
```javascript
const appState = {
  template: '3-shot',       // Current selected layout
  totalShots: 3,            // Target number of photos
  currentShotIndex: 0,      // Which photo we are currently taking
  capturedPhotos: [],       // Array storing the image data (base64)
  customText: "",           // User's text for the final strip
  status: "idle"            // 'idle', 'counting_down', 'reviewing', 'done'
};
```

## 2. Decoupled Modules (The Interfaces)
We will split the logic so adding new features is easy. Each script handles *only* its specific job:

*   **`camera.js` (Hardware Layer):** 
    *   `initCamera(videoElement)`: Requests permissions and pipes the stream to the UI.
    *   `takeSnapshot()`: Grabs the current video frame and returns image data.
*   **`session.js` (Logic Layer):** 
    *   `startSession(totalShots)`: Initiates the flow.
    *   `startTimer(seconds, onTick, onComplete)`: Manages the 10-second countdown.
    *   `handleRetake()` / `handleContinue()`: Updates the `appState` arrays.
*   **`canvas.js` (Render Layer):** 
    *   `generateStrip(photos, template, text)`: Draws the images onto a hidden HTML5 canvas based on exact coordinates for the chosen template.
    *   `triggerDownload()`: Converts the canvas to a PNG and forces the browser download.
*   **`animations.js` (Presentation Layer - GSAP):** 
    *   `flashEffect()`: Triggers the white CSS flash.
    *   `playShutterSound()`: Plays the audio file.
    *   `animateStickFigure(poseId)`: Ready for the future feature!

## 3. Data Flow (The "Continue/Retake" Loop)
1. User clicks "Start". `session.js` calls `animations.js` to start the 10s countdown.
2. At 0s, `animations.js` plays the shutter/flash. `camera.js` takes a snapshot.
3. The UI pauses the video feed and displays the snapshot.
4. If User clicks **"Retake"**: Snapshot is discarded, UI resumes the video feed, timer restarts.
5. If User clicks **"Continue"**: Snapshot is pushed to `appState.capturedPhotos`. If `capturedPhotos.length` equals `totalShots`, `canvas.js` takes over for rendering. Otherwise, the loop repeats for the next shot.

---
## 4. Implementation Tasks Checklist

**Phase 1: Design & Foundation**
*   [ ] **Task 1: Art Direction** (Agent: A.0 Creative Director)
    *   Goal: Output `creative-spec.md` defining the nostalgic theme, colors, typography, and animation style.
    *   Authorized Files: `creative-spec.md`
*   [ ] **Task 2: Layout & Styling** (Agent: A.1 UI Designer)
    *   Goal: Create UI tokens and build initial HTML structure and CSS variables.
    *   Authorized Files: `ui-config.md`, `index.html`, `styles/main.css`

**Phase 2: Core Hardware & State**
*   [ ] **Task 3: State Initialization** (Agent: B.1 Coder)
    *   Goal: Setup `app.js` with `appState` and DOM event listeners.
    *   Authorized Files: `scripts/app.js`, `index.html`
*   [ ] **Task 4: Webcam Integration** (Agent: B.1 Coder)
    *   Goal: Implement `camera.js` to handle `getUserMedia` and `takeSnapshot`.
    *   Authorized Files: `scripts/camera.js`, `index.html`

**Phase 3: The Capture Loop & Polish**
*   [ ] **Task 5: Session & Loop Logic** (Agent: B.1 Coder)
    *   Goal: Implement `session.js` for 10s countdown and "Continue/Retake" logic.
    *   Authorized Files: `scripts/session.js`, `scripts/app.js`, `index.html`
*   [ ] **Task 6: Animations & Sound** (Agent: B.1 Coder)
    *   Goal: Implement `animations.js` for GSAP flash, shutter sound, and countdown text.
    *   Authorized Files: `scripts/animations.js`, `index.html`, `styles/main.css`

**Phase 4: Compositing & Export**
*   [ ] **Task 7: Canvas Stitching** (Agent: B.1 Coder)
    *   Goal: Implement `canvas.js` to draw photos and text onto the final photo strip.
    *   Authorized Files: `scripts/canvas.js`, `scripts/app.js`
*   [ ] **Task 8: Download & Safety Net** (Agent: B.1 Coder)
    *   Goal: Enable PNG download and `localStorage` saving for drafts.
    *   Authorized Files: `scripts/canvas.js`, `scripts/app.js`
