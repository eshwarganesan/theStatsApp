# API Contracts: Scorekeeping Timer

**Feature**: 004-scorekeeping-timer  
**Version**: 1.0  
**Status**: NO EXTERNAL CONTRACTS (Client-Side Only)

---

## Overview

The Scorekeeping Timer (Feature 004) is a **client-side React component** with **no backend API integration** in version 1.0. The timer operates entirely within the browser using React hooks and browser APIs.

**Why no contracts?** The timer's state (countdown time, running/paused) is transient and lives only in memory during the user's session. There is no persistent backend storage, no real-time synchronization, and no external systems to integrate with.

---

## Component Boundary

### What This Feature Exposes (Internal Contract)

The timer is a **React component**, not a service with external APIs. It provides the following **component interface**:

```typescript
// Public component props (defined in src/types/scorekeeping.types.ts)
interface ScoreboardTimerProps {
  initialTime?: number
  isRunning: boolean
  currentTime: number
  onTimeUpdate?: (time: number) => void
  className?: string
}
```

This component interface is used **internally only** — within the `/scorekeeping` page and its child components. No external systems consume this interface.

### What This Feature Consumes

The timer component depends on:
- React 19.x (built-in hooks: `useState`, `useEffect`, `useCallback`, `useRef`)
- Tailwind CSS 4.x (utility classes for styling and responsive design)
- TypeScript 5.x (type definitions)
- Browser APIs: `setInterval`, `Date.now()`, DOM events

All dependencies are **already present** in the project. No new packages required.

---

## Why No Backend API Needed (v1)

| Concern | Analysis | Conclusion |
|---------|----------|-----------|
| **State Persistence** | Timer state (countdown time) is session-scoped. On page reload, timer resets to 10:00. Users expect this behavior. | ❌ No persistence needed |
| **Real-Time Sync** | Single-user session (user and phone). No multi-device sync required. | ❌ No real-time API needed |
| **Multi-Device Sync** | Future enhancement (e.g., synchronized timer across referee devices). Not required in v1. | ⏭️ Future design point |
| **Analytics/Logging** | Not in v1 requirements. Timer events (start/stop) not logged. | ❌ No logging API needed |
| **Configuration** | Initial time fixed at 10:00 (basketball quarter standard). Not configurable in v1. | ❌ No config API needed |
| **External Integrations** | Timer is independent. No integrations with scoreboard, clock system, or other services. | ❌ No integration APIs needed |

---

## Future Extensibility (v2+)

### Potential API Contracts (If Needed Later)

If future versions require backend integration, consider these extensions:

```typescript
// Example (NOT implemented in v1):
// POST /api/timers - Create a timer session
// GET /api/timers/:id - Fetch timer state
// PATCH /api/timers/:id - Update timer (start/stop/reset)
// WebSocket /ws/timers/:id - Real-time sync for multi-device scenarios
```

**When to implement these**:
- Multi-user scorekeeping (synchronized timer across devices)
- Analytics (track timer events for game replay)
- Timer configuration (different lengths for different game types)

**Design principle**: Keep timer state client-side until business requirements demand backend integration.

---

## Component Architecture

### Current (v1): Client-Side State Management

```
ScoreboardTimerContainer (manages state locally)
├── useTimer hook (local state: currentTime, isRunning)
├── ScoreboardTimer (displays time)
└── TimerToggle (controls play/pause)

All state in React memory. No network requests.
```

### Future (v2+): With Backend (Hypothetical)

```
ScoreboardTimerContainer (manages state locally + syncs with backend)
├── useTimer hook (local state)
├── useTimerSync hook (fetches/updates from backend API)
├── ScoreboardTimer (displays time)
└── TimerToggle (controls play/pause)

State synced with backend. Enables multi-device scenarios.
```

---

## Testing Strategy

### v1 Testing (No API Mocking Needed)

```bash
# Unit tests: Isolated component behavior
npm test -- ScoreboardTimer.test.tsx
# Tests local state transitions, UI rendering

# E2E tests: Full user workflows
npm run test:e2e -- scorekeeping-page.spec.ts
# Tests timer countdown, keyboard nav, responsiveness
```

**No API mocking required** because there are no external API calls.

### Future Testing (If API Added)

If backend integration occurs in v2:
- Use `jest.mock()` to mock API calls
- Use `MSW` (Mock Service Worker) for E2E tests with simulated backend
- Test failure scenarios (network errors, timeout)

---

## Deployment Considerations

### v1: No Backend Dependency

The timer feature is **completely independent of backend availability**:
- Timer works offline (runs in browser)
- No API endpoints to deploy
- No database schema needed
- No backend configuration required

**Deployment**: Deploy only the frontend code (React component). No backend deployment needed for timer feature.

### Future: With Backend Dependency

If backend API added in v2:
- Backend API must be deployed before frontend
- API health checks needed in frontend
- Graceful fallback if API unavailable (e.g., local state only)
- Performance: API latency impacts timer responsiveness

---

## Conclusion

**Feature 004 (Scorekeeping Timer)** has **zero external API contracts** in v1. It is a self-contained React component with no backend dependencies.

The component is designed for **future extensibility** — if business requirements later demand backend integration (multi-device sync, analytics, configuration), the component architecture supports those extensions without major redesign.

---

**Version**: 1.0 | **Date**: 2026-04-13 | **Status**: ✅ No API Contracts Needed (v1)
