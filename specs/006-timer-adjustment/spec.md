# Feature Specification: Timer Adjustment Controls

**Feature Branch**: `006-timer-adjustment`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description: "Create up down arrows that sit on the left and right of the timer which can be used to adjust the timer once the time is in the paused state. The arrows on the left of the timer adjust the minutes and the arrows on the right adjust the seconds."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Adjust Timer Minutes (Priority: P1)

User can click up/down arrow buttons on the left side of the timer display to increment/decrement the minutes by 1 minute at a time when the timer is in paused state.

**Why this priority**: This is the core feature - adjusting minutes is a fundamental use case for changing game time before starting play. Essential for MVP.

**Independent Test**: Can be fully tested by placing timer in paused state and clicking left arrow buttons to verify minutes change by ±1, confirming value is independent of seconds adjustment.

**Acceptance Scenarios**:

1. **Given** timer is paused at 10:00, **When** user clicks the up arrow on the left of timer, **Then** timer displays 11:00
2. **Given** timer is paused at 10:00, **When** user clicks the down arrow on the left of timer, **Then** timer displays 09:00
3. **Given** timer is paused at 01:30, **When** user clicks the down arrow on the left twice, **Then** timer displays 00:30 (seconds unchanged)
4. **Given** timer is paused at 59:45, **When** user clicks the up arrow on the left, **Then** timer displays 60:45 or wraps (clarification needed on max)

---

### User Story 2 - Adjust Timer Seconds (Priority: P1)

User can click up/down arrow buttons on the right side of the timer display to increment/decrement the seconds by 1 second at a time when the timer is in paused state.

**Why this priority**: Equal to minutes adjustment - seconds adjustment is equally critical for precise game time initialization before play starts.

**Independent Test**: Can be fully tested by placing timer in paused state and clicking right arrow buttons to verify seconds change by ±1, independent of minutes.

**Acceptance Scenarios**:

1. **Given** timer is paused at 10:00, **When** user clicks the up arrow on the right of timer, **Then** timer displays 10:01
2. **Given** timer is paused at 10:00, **When** user clicks the down arrow on the right of timer, **Then** timer displays 09:59
3. **Given** timer is paused at 10:30, **When** user clicks the down arrow on the right twice, **Then** timer displays 10:28 (minutes unchanged)
4. **Given** timer is paused at 10:59, **When** user clicks the up arrow on the right, **Then** timer displays 10:00 or increments minutes (clarification needed on wrap behavior)

---

### User Story 3 - Arrows Only Available When Paused (Priority: P1)

The adjustment arrows are only enabled and interactive when the timer is in paused state. When timer is running or expired, arrows are disabled/hidden.

**Why this priority**: Critical safety feature - prevents accidental timer adjustments during active gameplay. Users should only adjust during setup/pause.

**Independent Test**: Can be tested by toggling timer play/pause and verifying arrow buttons enabled/disabled state changes accordingly.

**Acceptance Scenarios**:

1. **Given** timer is running at 05:00, **When** user views the timer display, **Then** arrow buttons are disabled/visually grayed out
2. **Given** timer is paused at 05:00, **When** user views the timer display, **Then** arrow buttons are enabled/interactive
3. **Given** timer is paused at 05:00 and user clicks Play, **When** timer starts running, **Then** arrow buttons become disabled
4. **Given** timer is expired at 00:00, **When** user views the timer display, **Then** arrow buttons are disabled

---

### User Story 4 - Visual Arrangement and Accessibility (Priority: P2)

Arrow buttons are positioned on the left (minutes) and right (seconds) sides of the timer display with clear visual distinction. Buttons are accessible via keyboard and meet touch target size requirements.

**Why this priority**: Important for usability - proper positioning makes feature intuitive. Accessibility ensures all users can interact with controls.

**Independent Test**: Can be tested in multiple viewports and input modalities (mouse, touch, keyboard) to verify buttons are positioned correctly and functional.

**Acceptance Scenarios**:

1. **Given** user views timer on desktop, **When** inspecting layout, **Then** left arrows are left-aligned, right arrows are right-aligned with timer centered between them
2. **Given** user views timer on mobile (320px), **When** inspecting layout, **Then** arrows are visible, not overlapping with timer display
3. **Given** user has focus on an arrow button, **When** pressing Enter or Space, **Then** button activation/click is triggered
4. **Given** user on touchscreen device, **When** touching arrow button, **Then** tap target is ≥44px and button responds

---

### Edge Cases

- What happens when user tries to increment minutes past 59 or a logical maximum?
- What happens when user tries to decrement below 00:00?
- What happens if user rapidly clicks arrows multiple times in succession?
- What happens if timer is paused at 00:00 and user clicks down arrow on minutes?
- What happens if user adjusts seconds from 59 to 00 - does it wrap or is there a boundary?
- [NEEDS CLARIFICATION: What is the maximum timer duration supported?]
- [NEEDS CLARIFICATION: Should there be a boundary at 00:00 (cannot go negative)?]
- [NEEDS CLARIFICATION: Should minutes wrap at 60 minutes or allow unlimited minutes?]

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide up/down arrow buttons on the left side of timer display to adjust minutes
- **FR-002**: System MUST provide up/down arrow buttons on the right side of timer display to adjust seconds
- **FR-003**: Each click on left up arrow MUST increment minutes by 1 unit (while paused)
- **FR-004**: Each click on left down arrow MUST decrement minutes by 1 unit (while paused)
- **FR-005**: Each click on right up arrow MUST increment seconds by 1 unit (while paused)
- **FR-006**: Each click on right down arrow MUST decrement seconds by 1 unit (while paused)
- **FR-007**: System MUST disable arrow buttons when timer is in running state
- **FR-008**: System MUST disable arrow buttons when timer is in expired state (00:00)
- **FR-009**: System MUST enable arrow buttons when timer is in paused state
- **FR-010**: Arrow buttons MUST be keyboard accessible (Tab navigation, Enter/Space activation)
- **FR-011**: Arrow buttons MUST meet 44px minimum touch target size on mobile devices
- **FR-012**: System MUST immediately display updated time on button click (MM:SS format maintained)
- **FR-013**: Adjustments MUST work independently - changing minutes does not affect seconds and vice versa
- **FR-014**: System MUST prevent timer from going into negative time (cannot go below 00:00)

### Key Entities

- **Adjustment Button**: Interactive control with up/down direction indicator, associated with minutes or seconds unit
- **Timer State**: Current display value (MM:SS), determines if adjustments are allowed (paused=allowed, running/expired=disabled)
- **Increment/Decrement Action**: User interaction triggering ±1 unit change in selected time component

## Success Criteria *(mandatory)*

Success criteria are measurable, technology-agnostic outcomes that verify feature completion:

1. **Timer adjustment buttons display and respond to clicks** - User can click left/right arrows and see time change by ±1 in target unit (minutes/seconds) when paused
2. **Buttons disabled when timer running or expired** - Arrow buttons are visually disabled and non-interactive when timer is not in paused state
3. **Buttons enabled only when paused** - Arrow buttons are visually enabled and fully interactive when timer is in paused state
4. **Keyboard navigation works** - User can Tab to arrow buttons and press Enter/Space to activate (same effect as click)
5. **Touch targets meet accessibility requirement** - All arrow buttons are ≥44px high and ≥44px wide on mobile devices
6. **Time never goes negative** - Clicking down arrow does not result in negative time displayed (stops at 00:00)
7. **Time stays within valid range** - Adjusted time remains in MM:SS format with no overflow/underflow errors
8. **Independent adjustment of minutes and seconds** - Adjusting minutes does not change seconds, and vice versa
9. **Integration with existing timer** - Adjustment works seamlessly with existing play/pause toggle and countdown display
10. **Responsive layout maintained** - Arrow buttons are visible and functional on mobile (320px+), tablet (768px+), and desktop (1920px+) viewports

## Assumptions

- Timer adjustment arrows are only enabled when timer is not counting down (paused state)
- Maximum timer duration is not explicitly limited, but [NEEDS CLARIFICATION] on practical maximum (59:59, 99:59, or unlimited?)
- Timer cannot display negative values (stops at 00:00)
- Rapid successive clicks on arrows are handled (no debounce specified, so each click increments/decrements by 1)
- Adjustments persist until timer starts counting or is reset
- No sound/haptic feedback specified for button clicks (Feature 004 limitation applies)
- Integration with Feature 004 (Scorekeeping Timer) is required - arrows are added to existing `ScoreboardTimerContainer`

## Out of Scope

- Sound or haptic notifications on adjustment (defer to future enhancement)
- Preset duration buttons (user must use arrows to reach desired time)
- Custom duration limits beyond 00:00/max (use API constraints if implemented)
- Undo/redo for adjustments (simple increment/decrement only)
- Drag-to-adjust interface (arrows only as specified)

## Known Limitations (v1)

- No animation on time change (instant update)
- No audio feedback (visual only)
- No haptic feedback on touch (Feature 004 limitation)
- Single-increment only (no hold-to-repeat or acceleration)
