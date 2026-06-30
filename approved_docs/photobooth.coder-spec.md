# 👨‍💻 Photobooth Master Coder Spec

## 1. Architecture & State Management
*   **State:** Use a centralized `appState` object in `app.js` (template, totalShots, currentShotIndex, capturedPhotos, customText, status).
*   **Modules:**
    *   `camera.js`: Handle `getUserMedia()` and `takeSnapshot()`.
    *   `session.js`: Timer and "Continue/Retake" logic.
    *   `canvas.js`: Stitch photos on hidden canvas, trigger PNG download.
    *   `animations.js`: GSAP for shutter flash, sound, and countdown.

## 2. Design Tokens & UI Config
*   **Colors:** `--bg-dark: #1A1A18`, `--bg-strip: #FDFBF7`, `--accent: #FFB800`, `--text-dark: #0A0A0A`, `--text-light: #FDFBF7`.
*   **Fonts:** `Playfair Display` (serif) for headings, `Space Mono` (mono) for UI.
*   **Layout:** CSS Grid (`.app-container` split into camera section and controls).
*   **Components:** Brutalist `.btn-primary` (deep `#000` shadow, compresses on active). `.photo-strip` with soft paper shadow.
*   **Loaders:** `.skeleton-camera` with pulse animation.

## 3. Copy & Safety Rules
*   **Privacy Disclaimer:** "Your privacy is guaranteed. All photos are processed entirely on your device and are never uploaded or stored on any external servers."
*   **Error States:** Clear messages for Camera Denied and No Camera Detected.
*   **UI Text:** "Analog Photobooth", "Capture your moments, retro style.", "START SESSION", "RETAKE", "KEEP", "DOWNLOAD STRIP".
*   **Safety Net:** Clear `localStorage` drafts immediately upon successful download of the final strip to prevent data hoarding.
