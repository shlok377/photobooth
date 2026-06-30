# 🏗️ Photobooth Web App - Initial Architecture

**1. Technology Stack**
*   **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+).
*   **Animations:** GSAP (GreenSock Animation Platform) via CDN for fluid, high-performance UI and character animations.
*   **Core APIs:** `navigator.mediaDevices.getUserMedia` (webcam), HTML5 `<canvas>` (image compositing & downloading).

**2. Proposed Improvements**
1.  **Audio Cues (Shutter Sound):** Add a subtle, nostalgic "camera shutter" sound effect right as the timer hits zero to give the user physical-feeling feedback.
2.  **Flash Effect:** Use a quick, full-screen white flash animation (via CSS/GSAP) synced with the shutter sound to mimic a real photobooth flash.
3.  **Local Storage Drafts:** Save the individual captured photos temporarily in the browser's `localStorage` or `sessionStorage` in case the user accidentally refreshes the page during the loop.

**3. Proposed Directory Structure**
```text
/
├── index.html            # Main entry point and UI structure
├── styles/
│   └── main.css          # Core styles, layouts, and responsive rules
├── scripts/
│   ├── app.js            # Main initialization and state management
│   ├── camera.js         # Handles MediaDevices API and video stream
│   ├── session.js        # Handles the timer, capture loop, and retakes
│   ├── canvas.js         # Handles stitching photos and text for download
│   └── animations.js     # GSAP logic for transitions and stick figures
└── assets/
    ├── images/           # Stick figure SVGs, template backgrounds
    └── sounds/           # Shutter sound effect
```

**4. User Requirements (Wishlist)**
*   Webcam access and live video feed.
*   Selection of photo strip templates (e.g., 3-shot, 4-shot).
*   10-second countdown timer per shot.
*   Ability to review and retake individual shots within the loop.
*   Future: Stick figure pose animations between/during shots.
*   Post-capture filter application and custom text input.
*   Final compositing and high-res image download.

**5. Setup & Error-Prevention Steps**
*   **HTTPS Requirement:** The browser's camera API (`getUserMedia`) *requires* the site to be served over HTTPS (or `localhost` for development). We must ensure the dev server supports this.
*   **Permission Handling:** We need graceful error states if the user denies camera access or if they don't have a webcam connected.
*   **Mobile Responsiveness:** The camera feed aspect ratio must be carefully handled so it doesn't stretch or distort on mobile devices vs desktop screens.
