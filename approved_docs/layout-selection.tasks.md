# 📐 System Architecture: Layout Selection

## 1. State Management Updates (`app.js`)
We will augment our existing `appState` to explicitly track columns:
```javascript
const appState = {
  columns: 1,             // Tracks if we are in 1-column or 2-column mode
  totalShots: 3,          // This will now dynamically update to 3, 4, 6, or 8
  currentShotIndex: 0,
  capturedPhotos: [],
  customText: "",
  status: "idle"
};
```

## 2. UI Logic Hooks (`app.js`)
*   Create event listeners for the new layout radio buttons. 
*   **Safety Rule:** When `columns` is switched to `2`, automatically update `totalShots` to `6` (the minimum for that layout) so the state never ends up in an invalid combination (like a 2-column layout with only 3 photos).

## 3. Dynamic Canvas Math (`canvas.js`)
The `generateStrip()` function will completely abandon hardcoded heights and widths.
*   **Width Calculation:** `(photoWidth * columns) + (spacing * (columns - 1)) + (padding * 2)`
*   **Rows Calculation:** `Math.ceil(photos.length / columns)`
*   **Height Calculation:** `(photoHeight * rows) + (spacing * (rows - 1)) + (padding * 2) + bottomTextSpace`
*   **X/Y Offset Loop:**
    ```javascript
    const colIndex = i % appState.columns;
    const rowIndex = Math.floor(i / appState.columns);
    const xOffset = padding + (colIndex * photoWidth) + (colIndex * spacing);
    const yOffset = padding + (rowIndex * photoHeight) + (rowIndex * spacing);
    ```

---
## 4. Implementation Tasks Checklist

**Phase 1: Interface & Styling**
*   [ ] **Task 1: UI Toggle Implementation** (Agent: B.1 Coder)
    *   Goal: Add HTML radio button groups for Layout (1 Col / 2 Col) and Shots (3, 4, 6, 8) in `index.html`. Style as toggles in `main.css`.
    *   Authorized Files: `index.html`, `styles/main.css`

**Phase 2: Logic & Canvas**
*   [ ] **Task 2: State & Event Integration** (Agent: B.1 Coder)
    *   Goal: Update `app.js` to track `appState.columns`. Hide/show correct shot counts based on layout selection.
    *   Authorized Files: `scripts/app.js`, `index.html`
*   [ ] **Task 3: Canvas Dynamic Grid** (Agent: B.1 Coder)
    *   Goal: Rewrite `canvas.js` drawing logic to calculate dynamic overall dimensions and X/Y offsets.
    *   Authorized Files: `scripts/canvas.js`
