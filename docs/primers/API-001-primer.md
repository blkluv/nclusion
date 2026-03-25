# API-001 Primer: Initialize TypeScript backend monorepo or service layout

**For:** New session
**Project:** Nclusion — Solana-Based Sports Betting Platform Using HTGN Stablecoins for the Haitian Market
**Date:** Mar 24, 2026
**Previous work:** Phase 0 complete (10/11). Tech stack locked in `techstack.md`. See `docs/DEVLOG.md`.

---

## What Is This Ticket?

Set up the Turborepo + pnpm workspaces monorepo that holds all TypeScript code: API gateway, backend services, shared packages. This is the foundation for all backend implementation.

### Why It Matters

- Blocks API-002 through API-007 (all service skeletons)
- Blocks INF-001, INF-002, INF-003 (env config, shared types, CI)
- Blocks all Phase 2 backend work
- Establishes the developer workflow: install → build → test → lint

---

## What Was Already Done

- `techstack.md` locks: Turborepo, pnpm, Hono, Node 20, Drizzle, Zod, Vitest, Biome
- `production.md` defines: combined Hono server deployment on Railway
- `systemsdesign.md` defines: 7 services (gateway, betting, balance, match-odds, relay, settlement, history)

---

## Deliverables Checklist

### A. Monorepo Structure

- [ ] `pnpm-workspace.yaml` with workspace definitions
- [ ] `turbo.json` with build/test/lint/typecheck pipelines
- [ ] `package.json` (root) with shared scripts
- [ ] `biome.json` (root) for TypeScript linting/formatting
- [ ] `tsconfig.base.json` for shared TypeScript config
- [ ] `.gitignore` updated for node_modules, .turbo, dist, .env

### B. Gateway App

- [ ] `apps/gateway/package.json`
- [ ] `apps/gateway/tsconfig.json`
- [ ] `apps/gateway/src/index.ts` — minimal Hono app with health check

### C. Service Skeletons (empty but buildable)

- [ ] `services/betting/` — package.json, tsconfig, src/index.ts
- [ ] `services/balance/` — package.json, tsconfig, src/index.ts
- [ ] `services/match-odds/` — package.json, tsconfig, src/index.ts
- [ ] `services/relay/` — package.json, tsconfig, src/index.ts
- [ ] `services/settlement/` — package.json, tsconfig, src/index.ts
- [ ] `services/history/` — package.json, tsconfig, src/index.ts

### D. Shared Packages (empty but importable)

- [ ] `packages/shared-types/` — package.json, tsconfig, src/index.ts
- [ ] `packages/db/` — package.json, tsconfig, src/index.ts
- [ ] `packages/solana-client/` — package.json, tsconfig, src/index.ts

### E. Verification

- [ ] `pnpm install` succeeds
- [ ] `turbo build` succeeds across all packages
- [ ] `turbo test` runs Vitest (even if no tests yet)
- [ ] `turbo lint` runs Biome
- [ ] `turbo typecheck` passes

---

## Architectural Decisions

| Decision | Reference | Summary |
|----------|-----------|---------|
| Hono framework | R1-Q2, techstack.md | Ultralight, TS-first, built-in RPC client |
| Combined deployment | production.md | All services compose into single process |
| Zod validation | techstack.md | Shared schemas in packages/shared-types |
| Drizzle ORM | techstack.md | TS-native, no codegen, SQL-close |

---

## Files to Create

| File | Why |
|------|-----|
| `pnpm-workspace.yaml` | Workspace definitions |
| `turbo.json` | Pipeline config |
| `biome.json` | Lint/format config |
| `tsconfig.base.json` | Shared TS config |
| `apps/gateway/` | API gateway |
| `services/*/` | 6 service skeletons |
| `packages/*/` | 3 shared packages |

## Files to Modify

| File | Action |
|------|--------|
| `.gitignore` | Add node_modules, .turbo, dist, .env |
| `docs/DEVLOG.md` | Add ticket entry |

---

## Definition of Done

- [ ] Monorepo structure matches techstack.md layout
- [ ] `pnpm install` succeeds
- [ ] `turbo build` succeeds
- [ ] `turbo test` runs
- [ ] `turbo lint` passes
- [ ] `turbo typecheck` passes
- [ ] Gateway health check responds
- [ ] DEVLOG updated
- [ ] Feature branch pushed
