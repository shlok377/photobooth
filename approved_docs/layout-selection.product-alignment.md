# 📸 Feature: Photo Strip Layout & Size Selection

## 1. Business Value & Core Concept
Allow users to customize the physical shape and duration of their photobooth session by selecting between a classic vertical strip (1 column) or a wider grid strip (2 columns). This adds replay value and caters to different group sizes (e.g., 2 columns fit group photos better).

## 2. Target Audience
Users who want variety in their digital keepsakes and groups who want longer, more expansive capture sessions (up to 8 photos).

## 3. Primary User Journey (The New Flow)
*   **Step 1: The Setup Screen** 
    Before clicking "Start Session", the user sees a new configuration area. 
    They choose their **Layout Style**:
    *   **1-Column Classic Strip:** Offers options for **3 or 4 photos**.
    *   **2-Column Grid Strip:** Offers options for **6 or 8 photos**.
*   **Step 2: The Capture Session** 
    The app updates the total required shots based on the user's choice. The capture loop runs exactly as it does now, but scales up to 8 shots if requested.
*   **Step 3: Final Output & Download** 
    When finished, the app intelligently draws the photos onto the final high-res canvas. If 1-Column was chosen, they stack vertically. If 2-Column was chosen, they tile side-by-side (2 across) down the page, with the custom text centered at the bottom of the grid.
