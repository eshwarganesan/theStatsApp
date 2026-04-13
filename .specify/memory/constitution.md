<!-- Sync Impact Report
Version Change: 0.0.0 → 1.0.0 (MINOR: Initial Constitution)
Created Principles: I. Component-Driven Architecture, II. Type Safety, III. Test-Driven Development, IV. API Contract Enforcement, V. Performance & Accessibility, VI. Dependency Management
Created Sections: Development Standards, Quality & Review Gates, Governance
Templates Updated: ✅ plan-template (Constitution Check section exists), ✅ spec-template (User stories align with testing principle), ✅ tasks-template (Task organization aligns with TDD principle)
No manual follow-ups required.
-->

# theStatsApp Constitution

## Core Principles

### I. Component-Driven Architecture

Every feature is built as a reusable, independently testable React component with clear props and a single responsibility. Components MUST have PropTypes, accept typed inputs, and emit consistent outputs.

**Rationale**: Clear component boundaries enable parallel development, easier testing, and code reuse across the application. Basketball stats tracking requires UI components (scoreboard, box score, stat entries) that must be composable and maintainable.

### II. Type Safety (NON-NEGOTIABLE)

All TypeScript code MUST use strict mode. Every function signature requires explicit parameter and return types. No `any` types permitted except where third-party library types are unavailable (and must be documented with TODO).

**Rationale**: Type safety prevents runtime errors in a live scoring application where data correctness is critical. Users depend on accurate stats.

### III. Test-Driven Feature Development

Tests MUST be written and approved BEFORE implementation begins. Unit tests cover component logic, integration tests verify user workflows (entering scores, viewing stats). Minimum coverage: 80% for critical paths (scoring, stat tracking).

**Rationale**: Stats applications require accuracy. Pre-approved test cases ensure the app correctly tracks basketball metrics and prevent regressions in core features.

### IV. API Contract Enforcement

All backend APIs MUST have documented contracts (request/response schemas) verified by integration tests before frontend consumption. Contract changes MUST be backward compatible or include migration strategy.

**Rationale**: Enables frontend and backend teams to work in parallel without integration surprises. Critical for real-time stats updates and data consistency.

### V. Performance & Accessibility

- Frontend performance targets: Core Web Vitals - LCP < 2.5s, FID < 100ms, CLS < 0.1
- WCAG 2.1 AA compliance mandatory for all user-facing features
- Real-time data updates MUST not block UI rendering

**Rationale**: Basketball games are time-sensitive. Users need responsive, accessible interfaces to quickly log and view stats during live play.

### VI. Dependency Management & Versioning

App follows Semantic Versioning (MAJOR.MINOR.PATCH). Dependencies pinned to minor versions; security updates applied within 1 week. Breaking changes in dependencies require major version bump and migration guide.

**Rationale**: Ensures predictable releases and clear upgrade paths for users self-hosting or relying on the app for statistics.

## Development Standards

### Code Organization

- `src/components/` - React components (UI building blocks)
- `src/pages/` - Next.js page routes and layouts
- `src/services/` - API clients and business logic
- `src/types/` - TypeScript interfaces and types
- `src/lib/` - Utilities and helpers
- `src/styles/` - Global styles and Tailwind config

### Naming Conventions

- Components: PascalCase (e.g., `ScoreBoard.tsx`)
- Files/directories: kebab-case for styles, camelCase for files/functions
- Types: suffix with `Type` or `Interface` (e.g., `PlayerType`, `GameInterface`)
- Environment variables: UPPER_SNAKE_CASE

## Quality & Review Gates

**No code ships without**:

1. TypeScript passes strict type checking
2. ESLint passes (no warnings)
3. Tests pass locally and in CI/CD
4. One peer review approval for all changes
5. No merge conflicts with main branch

**Breaking Changes**: MUST include:

- Detailed migration guide
- Deprecation warning in prior release (if applicable)
- Updated user documentation
- Rationale document linked to PR

## Governance

The Constitution supersedes all other practices. Amendments MUST be:

1. **Proposed** with clear rationale (principle/policy affected, benefits, scope)
2. **Justified** by adding a Sync Impact Report documenting changes
3. **Version Bumped** appropriately:
   - MAJOR: Principle removed or fundamentally redefined
   - MINOR: New principle added or section materially expanded
   - PATCH: Clarifications, wording updates, typo fixes
4. **Compliance Verified** by ensuring dependent templates (plan, spec, tasks) align with updated guidance

All development follows this Constitution. Feature specifications (specs) MUST reference applicable principles. Implementation plans MUST verify Constitution compliance before work begins.

**Reference**: For runtime development guidance, see agent-specific documents (CLAUDE.md, AGENTS.md) and project README.

---

**Version**: 1.0.0 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12
