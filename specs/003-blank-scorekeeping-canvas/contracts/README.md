# API Contracts: Blank Scorekeeping Canvas

**Status**: NOT APPLICABLE (v1 is client-only)

## Summary

The Blank Scorekeeping Canvas v1 is a client-only feature with no backend API dependencies. The page is a static React component that renders an empty canvas for future scorekeeping features.

## Why No Contracts in v1

Per the Constitution Principle IV (API Contract Enforcement):
> "All backend APIs MUST have documented contracts (request/response schemas) verified by integration tests before frontend consumption."

**Blank Scorekeeping Canvas v1 does not consume any APIs**, so this principle does not apply to this feature.

## Confirmed Out of Scope for v1

- Backend API calls
- Database queries
- Authentication/authorization checks
- Real-time WebSocket connections
- File uploads
- External service integrations

## Future Phases (Will Require Contracts)

When the following scorekeeping features are implemented, API contracts MUST be defined:

### Feature: Timer Countdown with Backend Sync
- **Endpoint**: `GET /api/game/{gameId}/timer`
- **Response Schema**: `{ timeRemaining: number, isRunning: boolean, lastSyncTime: number }`

### Feature: Score Tracking
- **Endpoints**:
  - `GET /api/game/{gameId}/score` - Fetch current score
  - `POST /api/game/{gameId}/score` - Submit score update
- **Request Schema**: `{ team: string, points: number, timestamp: number }`
- **Response Schema**: `{ success: boolean, score: Score, error?: string }`

### Feature: Real-Time Updates
- **WebSocket**: `/ws/game/{gameId}`
- **Message Schema**: `{ type: 'score' | 'timer' | 'player', data: {...}, timestamp: number }`

### Feature: Game Session Management
- **Endpoints**:
  - `POST /api/games` - Create new game session
  - `GET /api/games/{gameId}` - Fetch game details
  - `PUT /api/games/{gameId}` - Update game
- **Schemas**: Game, Player, Team entities with CRUD operations

## Integration Timeline

1. **v1** (Current): Blank canvas, no APIs
2. **v2**: Add timer countdown (may use local state or backend sync)
3. **v3**: Add score tracking and real-time updates (requires API contracts)
4. **v4**: Add game session management (requires more complex contracts)

Each feature increment will define and document its API contracts in those features' contract directories.

## Process for Future Contracts

When adding a feature that requires backend APIs:

1. **Create** `specs/[feature-number]/contracts/` directory
2. **Define** OpenAPI/schema files for each endpoint:
   - `POST-api-game-id-score.md` for POST /api/game/{id}/score
   - `GET-api-game-id-timer.md` for GET /api/game/{id}/timer
3. **Write** integration tests that verify request/response schemas
4. **Verify** contracts before frontend implementation (per Principle IV)

---

**Version**: 1.0.0 | **Created**: 2026-04-13
