# 🧑‍💻 Code Auditor Report: Layout Selection

## 1. Summary of Changes
*   **HTML/CSS:** Added custom toggle UI for Layout (1 vs 2 cols) and Shots (3,4 vs 6,8) into the `controls-idle` state in `index.html`. Styled them as clean toggle switches in `styles/main.css`.
*   **State & Events:** Hooked up listeners in `scripts/app.js` that track `appState.columns` and automatically adjust `appState.totalShots` depending on the selected layout.
*   **Dynamic Canvas Logic:** Refactored `scripts/canvas.js` to calculate dimensions dynamically using math (modulo and floor divisions) to accurately place photos in the new grid layout, regardless of the column count.

## 2. Test Verifications Needed
*   **UI Toggles:** Check if the toggle buttons appear correctly before clicking "START SESSION".
*   **State Masking:** Verify that selecting "2 Columns" hides the "3 & 4" shot options and reveals "6 & 8", successfully locking the loop logic to a minimum of 6 shots.
*   **Canvas Export:** Complete a 2-column session and verify that the final export generates a wide canvas with photos cleanly placed side-by-side.
