# 📸 Photobooth Web App - Product Alignment

**1. Business Value & Core Concept**
A nostalgic, interactive web-based photobooth that allows users to capture moments and dynamically generate beautifully designed, downloadable photo strips. The core value lies in providing a delightful, frictionless souvenir experience directly in the browser.

**2. Target Audience**
*   **Couples & Friends:** Seeking fun memories and posing inspiration.
*   **Event Attendees:** Looking for a digital keepsake from parties or gatherings.
*   **Casual Users:** Wanting a creative, nostalgic photo strip without downloading a dedicated native app.

**3. Primary User Journey (The "Happy Path")**
*   **Step 1: Onboarding & Template Selection** 
    The user arrives at the app, grants camera permissions, and selects their desired photo strip layout (e.g., 3-photo or 4-photo strip) and design theme.
*   **Step 2: The Capture Session (Loop)** 
    Based on the selected strip template, a structured session begins to capture the required number of photos. For each shot:
    1.  A **10-second countdown timer** initiates before the photo is taken. *(Future Feature: Dynamic stick figures appear during this timer to suggest poses).*
    2.  The camera captures the photo.
    3.  The user is shown the captured shot alongside an indicator of how many photos are left to take.
    4.  The user can choose to **"Continue"** to the next shot or **"Retake"** the current one.
    5.  This process loops until all required photos for the strip are captured.
*   **Step 3: Post-Capture Customization** 
    The user applies creative filters and adds a custom text caption to the bottom of their strip.
*   **Step 4: Finalize & Download** 
    The app composites the photos, design, and text into a single high-resolution photo strip image for the user to download and share.
