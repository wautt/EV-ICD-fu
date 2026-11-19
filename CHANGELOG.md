# EV-ICD F/U form: changelog and decisions

Owner: Autthapol K. Language of chat: Thai. Keep replies short.

## Versions (Artifact links, all private to the owner)
- V01: https://claude.ai/artifact/9va7CoLy1DhS1CexxuLC7X  (first full version, dropdowns, larger layout)
- V02 (FINAL, keep as base): https://claude.ai/artifact/M11ez4nJyJsMYcMWGW1Wn3
- V02.1 (V02 + bats flying across the screen, on/off switch): https://claude.ai/artifact/4D9iTE6tnAzQjZvMsSmZxk
- V02.2 (V02 + calm Halloween header: dark purple, orange line, static moon + small pumpkin; no animation; rest unchanged): https://claude.ai/artifact/C4KxwquuykYrJdmq7M8Lq5
- V03 (Halloween header only, rest is blue): https://claude.ai/artifact/PmSLsPZihRqZd15RhaAS1S
- V04 (Christmas, light tone): https://claude.ai/artifact/J5vKVqvWKeXv5M2CLvg5oF
- V05 (tap-the-report input; built on V02, normal blue header): https://claude.ai/artifact/UFQp2BZ6XkQihuWr65J46Y
- Original working link used for early edits: https://claude.ai/artifact/Cs5dfH1M62VhywG3kxEMh1
- GitHub Pages (PWA): wautt/EV-ICD-fu -> https://wautt.github.io/EV-ICD-fu/

## What the form is
Follow-up form for an EV-ICD (Medtronic). User fills fields, then exports a PNG / PDF that looks like a Medtronic F/U sheet, or copies a text summary.
Fixed: Model = DVEA3E4 (read-only). Mode defaults to OVO.
No patient name / HN fields on purpose (PDPA).

## Form layout (V02)
Sections: Device, Sensing R wave, Impedance, Threshold, Wavelet, Setting, Detection zone, Note, Export preview.
- Tap buttons instead of dropdowns: zone mode (On/Off, FVT also via VF / via VT), RX type (J / Burst / Ramp), units (yrs / month).
- Wavelet vector(EGM2) stays a dropdown (8 options, default Coil2 to Can): Ring1 to Ring2, Ring1 to Coil1, Ring1 to Coil2, Coil2 to Can, Coil1 to Can, Ring1 to Can, Ring2 to Can, Coil2 to Coil1.
- Quick buttons: "40J x 6" per zone, "Fill RX2-6 same as RX1". (The "Use same No PWOs at" button was removed in V05.)
- Min, Wavelet and each zone have a checkbox; their fields stay hidden until ticked. Clear un-ticks and hides them again.
- Text: body 13px, field labels 11px, input text 16px (16px stops iPhone auto-zoom). System font (San Francisco on iPhone).

## V05: tap-the-report input
- Name is "EV-ICD FU" (no slash) everywhere in V05: page title, header, report heading, Copy text first line, Home Screen name and manifest. V02 keeps "F/U".
- Clear (bottom bar) asks first in a custom dialog (#cfm, not window.confirm, which can be blocked in the Claude app iframe): "Clear everything?" with Cancel and a red Clear. Cancel, tapping outside or Esc keeps everything. Per-panel Clear in a sheet does not ask. Tests must click #cfmYes after #clear.
- Wavelet is on by default (wven checked in HTML, so it is on the report and in exports with Coil2 to Can and % Matching "-"); it can still be turned off in its sheet. Clear (all) and the sheet Clear reset checkboxes to their defaults (defaultChecked), so Wavelet comes back on. Saved drafts carry _v:2; an older draft gets wven=true once on load.
- Wavelet % Matching uses the normal keyboard (inputmode="text").
- Header on screens <=380px wide: title 17px, icon tile 38px, so "What's new" fits on one line on iPhone SE (375). On 320px screens the title wraps to two lines.
- One-screen layout: the page never scrolls (html/body overflow hidden, body is a height:100% flex column inside html (:root has no safe-area padding any more: the blue header runs up under the iOS status bar with its own env(safe-area-inset-top) padding, and the bottom bar adds env(safe-area-inset-bottom); the old :root padding left a pale blurred strip under the status bar and a gray strip at the bottom in the Home Screen app): header, report, button bar). fitCv() scales the report canvas display size to fit the space left (contain), on every redraw, on resize while no sheet is open, and via a ResizeObserver on the report box plus window load / fonts ready (without these the first fit could run before layout settled and clip the bottom on iPhone SE). Export is unaffected (canvas stays 1170 px wide). The hint line above the report was removed to save space.
- Home Screen app (@media display-mode: standalone) has a thicker header: top padding 34px + safe-area inset, bottom 18px. iOS keeps a blur under the status bar in the shortcut that the page cannot turn off, so the title is pushed below it. Safari and the Claude app are unchanged.
- Home Screen shortcut updates without re-adding: sw.js fetches pages with cache:"no-store" and pre-caches with cache:"reload"; index registers with updateViaCache:"none", calls update(), and reloads once (sessionStorage flag evicd_swr) on controllerchange when a new version takes over; the draft survives. Meta tags (status-bar style, icons) are still read only when the shortcut is added.
- GitHub index.html: service worker registration is wrapped in try/catch inside the load handler; reading navigator.serviceWorker throws in sandboxed frames (e.g. the file preview in Claude), which showed "Uncaught Error: Script error."
- Inside the Claude app (a head script adds html.inapp when in an iframe): no :root safe-area padding, header top padding 12px (iOS reports the notch inset inside the iframe too, which doubled the header height), bar bottom padding max(14px, 6px + inset).
- Header (V05): navy-to-blue gradient bar with rounded bottom corners, a soft circle highlight, a hand-drawn inline-SVG icon tile modelled on the owner's Medtronic EV-ICD product photo: D-shaped can with a clear header block on top right, lead leaving the bottom, running left with a suture sleeve, then straight up the left side into two sine waves (polyline) with two ring bands and a round tip; lead is silver gray (#c3cad8), from the tip down, like the real lead: light gray tip, dark gray coil (#8e98ad with a thin light highlight line), light gray, black band, light gray, dark gray coil, light gray, black band, then light gray lead to the can (one sine-wave polyline built from 65 points: coils on points 6-27 and 38-59, bands at points 0 and 32), ring bands black (#0b0b0b); "EV-ICD" written in bold on the can, title with a "V05" pill, credit line below. Other versions keep the flat blue bar.
- Main screen is the report canvas itself. Tapping a field opens a bottom sheet with only that item's original V02 controls (same IDs, same logic), moved in and put back on close (unitsFor() maps field -> controls). Sensing: any row opens all 3 vectors together, compact (Note checkbox in its own column; the note row expands only when ticked) so it fits without scrolling. Impedance: any row opens all 3 in one row. Detection: one sheet with tabs VF | FVT | VT | VTM at the top, one zone shown at a time (tapping a zone row opens its tab; the header or ghost opens the first ticked zone, else VF). A dot marks ticked zones. The sheet Clear clears only the open tab. Done / tap outside / Esc closes it.
- Light blue tint behind values and faint "+ Rhythm / Rate / min / V-pace / Wavelet / Threshold / Output / Detection zone / Note" items show only on screen (EDIT=true); export renders with EDIT=false so PNG/PDF match V02.
- Tapping a "current vector" box toggles it directly. "+ Wavelet" / "+ min" also tick their checkbox.
- iPhone keyboard: the sheet follows window.visualViewport (Safari / PWA). Inside the Claude app the keyboard does not resize the page, so after focus, if no keyboard is detected on a touch device, the sheet moves up (class kbtop: floating card, top 12vh, max-height 39vh, 8px side margins, so it ends above the keyboard toolbar at ~51% of the screen) and scrolls the field into view.
- Gotcha: setTab() must run after the moved #dzwrap is back in the document (getElementById misses detached nodes).
- Zone rate placeholders: VF e.g. >200, FVT e.g. 200-250, VT e.g. 167-200, VT Monitor e.g. 150-167.
- Current vector is ticked only on the report (removed from the Sensing sheet). Only one can be ticked; ticking one unticks the others.
- Each sheet has its own Clear: empties only that sheet's fields, unticks its checkboxes (zone/Wavelet/Min get removed), restores defaults (Mode OVO, date today, Wavelet vector Coil2 to Can, unit yrs).
- Smoothness: render draws straight onto the screen canvas and only resizes it when the report height changes (redrawNow); redraw() batches all input/change events into one draw per animation frame (~6x faster per draw, 1 draw instead of ~11 for rapid edits); html touch-action:manipulation; no entry animation for the raised sheet; no smooth page scroll on open (only an instant scroll when the tapped spot would sit under the sheet); on every touch device (Claude app, Safari and the Home Screen app) every sheet opens already lifted (kbtop); in the Home Screen app a bottom sheet used to be pushed off the top when the iPhone keyboard opened, so it is no longer used on phones. when the keyboard shrinks visualViewport by >80px (Safari / Home Screen), fitSheet() pins the panel to the visible area (top = visualViewport.offsetTop + 24px, max-height = visible height - 48px), because iOS slides the whole page up and carries fixed elements off the top; inside the Claude app the viewport does not shrink so the panel stays at 12vh, even ones opened with no field focused (Detection), and stays there until Done; a focused field lower in the sheet is scrolled into view inside the sheet, so it does not jump when the keyboard opens or closes.
- Artifact must declare capabilities {downloads: true} or Save PNG/PDF fails inside claude.ai.

## Detection panel (17 Nov 2026 update, in V05)
- Zone tick box is hidden inside the sheet. A zone switches on by itself when anything is typed or tapped in its tab (dot on the tab shows it); the sheet Clear turns that zone off and empties it.
- On/Off and Rate are on one line. Rate placeholders: VF >200, FVT 200-250, VT 167-200, VTM 150-167.
- Rx1-Rx6 are COLUMNS side by side (like the Medtronic programmer screen): row 1 = Type, row 2 = Value. Type is one button per Rx that cycles - -> Joules -> Burst -> Ramp (default shows "-"). Value placeholder "40" for Joules (energy), "3" for Burst/Ramp (sequence); a hint line under the grid explains it. Field IDs unchanged (dz<k>s<i> = type select, hidden; dz<k>v<i> = value). Buttons: "40J x 6" and "Same as RX1".
- Fits one screen without scrolling on iPhone 390x844 and on SE 375x667 (simulated). Compact sizes are in CSS under "compact detection v2" and "horizontal Rx grid"; inputs stay 16px to stop iOS zoom.
- Tests: t.py (PNG/PDF/Copy/Clear), t23.py (Detection panel; set evicd_news_seen to the current NEWS_ID first or the news box blocks taps).

## V05.01 (19 Nov 2026): lighter tip card
- Same as V05 but the tip card pages are re-rendered smaller: 140 dpi, JPEG quality 62 (1.37 MB instead of 2.44 MB; whole file ~2.0 MB instead of ~3.4 MB, ~1.3 MB gzipped). Title and badge say V05.01. It is a SEPARATE Artifact link; the V05 link is unchanged (full-resolution tip card). Small print (page 14 legal text) is harder to read when zoomed. Re-render with: pdftoppm -jpeg -jpegopt quality=62,optimize=y -r 140, then rebuild const TIP and const TIPSZ (page pixel sizes).
- Load time measured: V05 about 155 ms to first paint (vs about 100-130 ms before the tip card); the cost is mostly the first download.

## Tip card viewer (19 Nov 2026, in V05)
- Header has two stacked pills on the right: "What's new" and "Tip card" (.tb-btns). Tip card opens a pop-up (#tip, z-index 32) showing the Medtronic "Aurora EV-ICD System follow-up tip card" PDF (14 pages; pages 7, 8, 11, 12 are wide two-page spreads, so the page box uses each page's own aspect ratio from const TIPSZ; do not assume 396x684 for every page) as 14 JPEG pages (190 dpi, quality 70) embedded as data URIs in a second <script> (const TIP=[...]) at the end of index.html (~3.3 MB; page 14 legal text is tiny). Controls: Close, prev/next, page dropdown, zoom button 1x / 1.8x / 2.6x (scroll inside to pan), swipe left/right at 1x, Esc and arrow keys.
- Images were used instead of the PDF itself because iOS Safari / the Claude app cannot show PDFs reliably inside a pop-up. Search button in the tip card header: keyword (multi-word allowed, substring match) searches the PDF text ignoring spaces (so "droptime" finds "Drop Time"; min 2 letters) (pdftotext -bbox, 3745 words, embedded as const TIPTXT with word boxes in 1/1000 of page size); results list with snippets, tap to jump, matches highlighted on the page (current = orange), arrows step through all matches; text inside screenshots is not searchable. Zoom: two-finger pinch and double-tap only (the Zoom button was removed on request); swipe changes page only at 1x. Opening is smooth: the page box has a fixed aspect ratio (no height jump), the image fades in after decode(), page 1 is pre-decoded at idle, and the pop-up has a short fade/slide. No download button (the 6.5 MB PDF is not embedded). To replace the card: re-render pages with pdftoppm -jpeg -r 190 and rebuild const TIP; change N=14 in the viewer script if the page count changes.

## What's new box and saved draft (V05)
- "What's new" pill button (10.5px, renamed from "New") in the header opens a What's new box (English, orange "Major update" badge, title "V05: a new way to fill in the form", 4 cards with small looping CSS demos: tap-to-edit, Detection tabs, per-sheet Clear, saved draft; current-vector card and the "Also" line removed on request; NEWS_ID now V05-2026-11-19; box date "Updated 19 Nov 2026"; 5th card "EV-ICD tip card inside the app"; the Detection card now says "Detection zones on one screen" and describes the Rx grid). It opens by itself once per NEWS_ID (localStorage evicd_news_seen); an orange dot shows until seen. To announce a new update: change NEWS_ID and edit the cards.
- Draft autosave: every input/change saves all form values to localStorage evicd_v05_draft (300 ms debounce); on load they are restored and "Restored your last entries" shows. Clear (whole form) deletes the draft. Browser-only, per device; nothing leaves the device.
- Tests: set localStorage evicd_news_seen before load, or the box covers the page.

## Report rules (PNG / PDF and Copy text)
- Empty values show "-".
- Hidden when empty: Rate, V-pace episode, Threshold, Output, Charge time line.
- Sensitivity always shows.
- est.: "<" checkbox, unit yr/yrs or month/months (1 or less = singular, more than 1 = plural), or "Initializing". Empty shows "est. - yr".
- Min: own "<" and unit, shown only when ticked, lowercase "min" under est.
- Sensing R wave: 3 vectors, each with R wave (range allowed, e.g. 4.8-4.9), no PWOs at, current-vector box, optional note line.
- Impedance (left) and Wavelet (right, only when ticked): Wavelet vector(EGM2) + % Matching, blue labels, black values.
- Detection zone table: Detection | Rates | Therapies. Only ticked zones. Rate gets " bpm". Consecutive equal joule shocks merge ("40J x 6"); Burst and Ramp never merge ("Burst(3), Burst(3), 40J x 4"). VT Monitor has no RX.
- Copy text format: follows the user's example exactly (Impedance lines indented 21 spaces, "- VF On" rows in the Detection table, blank lines between blocks).

## Tried and rejected (do not redo)
- Locking the Detection sheet so it cannot scroll (owner wanted normal scrolling back; fitting is done by compact sizes instead).
- Rx as one row each with Type + value side by side (replaced by the horizontal Rx columns).
- "e.g. 15" placeholder for Burst/Ramp (now "3").
- Detection therapies as chips (+J / +Burst / +Ramp, tap a chip to remove).
- "Use same No PWOs at for all vectors" button (removed on request).
- Zone sheet with RX in two columns and J / B / R short labels (owner asked to go back to one RX per row with J / Burst / Ramp).
- Jump-to-section menu and a Detection zone preset button.
- Text smaller than 13px.
- Bats next to section titles (only the header may have decorations).

## Technical gotchas
- Claude Artifact uses window.claude.use("downloads") to save files. GitHub/PWA needs a fallback: share sheet on phones, else a download link.
- Never build the GitHub file by plain copy of the Artifact file. Patch in: manifest link + meta tags, the fallback save, service worker registration. Bump the cache name in sw.js each release (current: evicd-fu-v05-43). Repo files: index.html, sw.js, manifest.json, icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png (180). Icons are the header logo on the header gradient; maskable/apple versions have the logo smaller for the safe zone. Home-screen icons only work from GitHub Pages; a shortcut to the claude.ai artifact link uses Claude's icon.
- Do not reuse the class name .in for anything but form inputs (global .in sets width/height).
- Do not put style="display:..." on an element that uses the hidden attribute (it overrides hidden). Use a CSS class and [hidden]{display:none!important}.
- LINE's in-app browser cannot export files. Open in Safari/Chrome (e.g. add ?openExternalBrowser=1 to the link).
- iPhone date inputs need explicit width/appearance rules or they overflow their grid cell.

## Ideas not done yet
- Warnings for odd values (battery 29.9, % over 100).
- Drop the unit when est. is empty ("est. -").
- Copy text says "Wavelet:" while the report says "Wavelet vector(EGM2)".
- Test inside an iframe (frame.html wrapping index.html, has_touch) to reproduce the Claude app; plain page tests miss iframe-only behaviour.
- Test on a real iPhone (only tested in a headless browser so far).

## Working style the owner wants
Test in a real browser before saying done. Combine several requests per turn. Keep the old version before changing anything. Short Thai replies.
