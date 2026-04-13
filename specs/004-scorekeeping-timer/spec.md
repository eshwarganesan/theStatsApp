# Feature Specification: Scorekeeping Timer

**Feature Branch**: `004-scorekeeping-timer`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description: "Create a timer on the top middle of the scorekeeping component, with a toggle switch to stop and start it."

---

## User Scenarios & Testing

### User Story 1 - Display Game Timer (Priority: P1)

As a scorekeeper, I need to see a game timer displayed prominently at the top middle of the scorekeeping canvas so I can track game time during play.

**Why this priority**: Timer display is the core MVP feature; without it, the scorekeeping component is incomplete for basketball games. Visible time tracking is essential for game management.

**Independent Test**: Navigate to /scorekeeping and verify a timer is visible at the top-center position, displaying time in MM:SS format (e.g., "10:00" for 10 minutes).

**Acceptance Scenarios**:

1. **Given** user navigates to /scorekeeping page, **When** page loads, **Then** timer is displayed at the top-middle of the canvas in MM:SS format with default value shown (e.g., "0:00")
2. **Given** timer is displayed, **When** user views on mobile (320px), tablet (768px), and desktop (1920px), **Then** timer remains centered at top and is readable on all screen sizes
3. **Given** timer is displayed, **When** user accesses timer element with keyboard, **Then** timer controls are focusable and keyboard-navigable

---

### User Story 2 - Start/Stop Toggle Control (Priority: P1)

As a scorekeeper, I need a toggle switch to start and stop the timer so I can control game time during play and stoppages.

**Why this priority**: Without start/stop control, the timer is unusable. Toggle functionality is essential for pausing during timeouts, injuries, or administrative stoppages.

**Independent Test**: User can click/tap toggle switch to start timer, then click again to stop it. Timer state changes visually to indicate running vs. stopped state.

**Acceptance Scenarios**:

1. **Given** timer is stopped at "10:00", **When** user clicks/taps the toggle switch, **Then** timer begins counting down and toggle switch shows "Pause" or visual running state
2. **Given** timer is running and counting down, **When** user clicks/taps the toggle switch, **Then** timer stops at current time and toggle switch shows "Play" or visual stopped state
3. **Given** timer is toggled between start and stop multiple times, **When** each toggle occurs, **Then** timer correctly resumes from stopped time or pauses from running state
4. **Given** user is on mobile device, **When** user attempts to toggle timer, **Then** toggle switch is easily tappable (min. 44px hit target per WCAG) with clear visual feedback

---

### User Story 3 - Timer Display Format & Readability (Priority: P1)

As a scorekeeper, I need the timer to display clearly in MM:SS format so I can quickly read the current game time at a glance.

**Why this priority**: Timer readability is critical during live play; unclear or hard-to-read time display can cause confusion and errors.

**Independent Test**: Timer displays in MM:SS format (e.g., "48:00", "0:24"), is large enough to read from distance (15+ feet typical court viewing), and has sufficient contrast per WCAG 2.1 AA.

**Acceptance Scenarios**:

1. **Given** timer is at any time between 0:00 and 99:59, **When** user views timer, **Then** time is displayed in MM:SS format with leading zeros (e.g., "05:03" not "5:3")
2. **Given** timer is counting down or stopped, **When** user views timer on any device, **Then** text is large and legible, with font size >= 24px on desktop, >= 18px on mobile
3. **Given** timer is displayed with default light background, **When** contrast is measured, **Then** contrast ratio meets WCAG 2.1 AA minimum (4.5:1 for text)
4. **Given** timer font loads, **When** user views timer, **Then** no layout shift occurs (CLS contribution < 0.05 per Core Web Vitals)

---

### User Story 4 - Timer Completion Indicator (Optional, Priority: P3)

As a scorekeeper, I need visual feedback when the timer reaches 0:00 so I know the game period has ended.

**Why this priority**: Optional enhancement; provides user reassurance but not critical for MVP. Could be:
- Visual highlight/color change (e.g., background turns orange/red at 0:00)
- Audio alert (optional, accessibility-friendly)
- Text indicator (e.g., "TIME!" or "PERIOD ENDED")

**Independent Test**: When timer counts down to exactly 0:00, visual indicator appears and page does not crash or stall.

**Acceptance Scenarios**:

1. **Given** timer is counting down and reaches "0:00", **When** countdown completes, **Then** timer stops and visual indicator (color change or text) appears
2. **Given** timer reaches completion, **When** indicator is displayed, **Then** indicator is accessible (not color-only; includes text or icon)
3. **Given** timer is at 0:00, **When** user restarts timer with toggle, **Then** timer resumes counting and completion indicator disappears


---

## Edge Cases

- What happens when timer is at 0:00 and user clicks toggle? (Should resume counting from 0:00, or allow reset?)
- How does timer behave if page loses focus (browser tab switches)? (Should paused timer stay paused? Running timer continue?)
- What happens if browser session/page is refreshed? (Should timer reset to 0:00, or persist state if available?)
- How does timer behave on very slow networks? (Should display update smoothly, or might decrement in jumps?)
- What if user tries to toggle timer very rapidly (spam clicking)? (Should bouncing/debounce prevent false starts?)

---

## Requirements

### Functional Requirements

- **FR-001**: Timer component MUST display current time in MM:SS format (minutes:seconds with leading zeros)
- **FR-002**: Timer MUST be positioned at the top-center of the scorekeeping canvas
- **FR-003**: Timer MUST have a visible toggle switch/button to start and stop the countdown
- **FR-004**: Timer MUST support countdown from any starting time (configurable duration, e.g., 10:00 for quarter, or custom)
- **FR-005**: Timer MUST accurately count down at regular 1-second intervals when running
- **FR-006**: Timer toggle MUST provide clear visual state indication (e.g., "Play" icon vs. "Pause" icon)
- **FR-007**: Timer toggle MUST be keyboard accessible (Tab navigable, Enter/Space to activate)
- **FR-008**: Timer MUST remain responsive and not block UI during countdown
- **FR-009**: Timer MUST respect responsive design and remain readable/usable on viewports 320px-1920px
- **FR-010**: Timer text MUST have sufficient contrast per WCAG 2.1 AA (4.5:1 minimum for normal text)
- **FR-011**: Timer countdown MUST reset to initial time when page/component reloads (or persist if state management implemented)

### Key Entities

- **Timer State**: Running (counting down) vs. Stopped (paused)
  - Attributes: `isRunning: boolean`, `currentTime: number` (in seconds), `initialTime: number`, `label?: string`

- **Timer Display**: Visual representation of timer
  - Attributes: `time: MM:SS formatted string`, `isRunning: boolean`, `contrast ratio: >= 4.5:1`

- **Timer Controls**: Toggle switch/button UI
  - Attributes: `state: "play" | "pause"`, `aria-label: string`, `accessible: true (keyboard/touch)`

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Timer displays in MM:SS format and updates every 1 second with ±0.1s accuracy
- **SC-002**: Timer toggle switch is accessible via keyboard (Tab to focus, Enter/Space to activate)
- **SC-003**: Timer remains visible and readable on all devices (320px mobile, 768px tablet, 1920px desktop)
- **SC-004**: Toggle switch has minimum 44px touch target on mobile per WCAG accessibility guidelines
- **SC-005**: Timer text contrast ratio meets WCAG 2.1 AA standard (≥ 4.5:1)
- **SC-006**: Timer updates do not cause layout shift (CLS contribution < 0.05)
- **SC-007**: No console errors when toggling timer rapidly (debounce/bounce prevention works)
- **SC-008**: Page performance not degraded by timer (LCP < 2.5s, FID < 100ms maintained)
- **SC-009**: 100% of timer functionality works with screen readers (ARIA labels, role attributes correct)
- **SC-010**: Timer state persists during browser tab switch (stayed paused if paused, continued if running)

---

## Assumptions

- **Architecture**: Timer will be implemented as a reusable React component integrated into BlankScoreKeepingCanvas or as a sibling component on the scorekeeping page (decision deferred to planning phase)
- **Initial Time**: Timer starts at 0:00 by default; v1 does not include user-configurable timer duration (could be added in future)
- **No Backend**: Timer is client-side only in v1; no server-side time synchronization needed
- **State Management**: Timer state managed locally in component; not persisted to database or local storage in v1
- **Time Format**: Timer uses MM:SS format (assumes games < 100 minutes; no HH: prefix needed)
- **Accessibility**: WCAG 2.1 AA compliance mandatory per Constitution Principle V
- **No Audio**: v1 does not include audio alerts on timer completion (visual feedback only)
- **Responsive**: Timer adapts to all screen sizes without horizontal scroll (mobile-first Tailwind approach)
- **Browser Compatibility**: Works on modern browsers (Chrome, Firefox, Safari, Edge); no IE11 support
- **Styling**: Uses existing Tailwind theme tokens from theStatsApp design system (no new colors/fonts)

---

## Related Features

- **Feature 003** (Blank Scorekeeping Canvas): Timer will be integrated into or displayed alongside this component
- **Future Feature**: Score tracking (Feature 002) will coexist on same page as timer
- **Future Feature**: Timer configuration UI (allowing user to set custom duration)
- **Future Feature**: Audio alerts and visual animations on timer completion

---

**Version**: 1.0.0 | **Created**: 2026-04-13 | **Status**: Draft → Ready for Clarification
