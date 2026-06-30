# 🏗️ Feature Architecture: Layout Selection

## 1. Technology Stack
*   No new technologies required. We will continue using Vanilla JS, DOM manipulation, and the HTML5 `<canvas>` API.

## 2. Proposed Improvements
1.  **Dynamic UI Toggles:** Use stylized CSS radio buttons for layout and photo amount selection.
2.  **Smart Canvas Math:** Refactor `canvas.js` to use dynamic grid algorithm (`row` and `col` based on index).
3.  **State-Driven UI:** UI updates dynamically to prevent invalid choices (e.g. 3 photos in a 2-column layout).

## 3. Proposed File Modifications
*   `index.html`: Add configuration UI block.
*   `scripts/app.js`: Expand `appState` with `columns` and add event listeners.
*   `scripts/canvas.js`: Rewrite rendering math for dynamic rows/cols.

## 4. User Requirements
*   Select 1 Column (3 or 4 shots) or 2 Column (6 or 8 shots).
*   App adjusts the capture loop correctly.
*   Final PNG correctly tiles photos and centers the caption at the bottom.

## 5. Setup & Error-Prevention Steps
*   **Math Check:** Precisely calculate X/Y offsets so photos don't overlap in 2-column mode.
