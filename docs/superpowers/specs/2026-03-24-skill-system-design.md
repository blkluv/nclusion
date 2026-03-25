# Nclusion Skill System Design

**Date:** 2026-03-24
**Status:** Approved

## Summary

A two-layer skill system for the Nclusion sports betting platform: workflow skills enforce development discipline (TDD, git, tickets, CI), domain skills enforce architectural constraints (Solana safety, mobile performance, backend boundaries). Orchestrated by a root CLAUDE.md that maps triggers to skills.

## Skills

### Workflow Skills

| Skill | File | Trigger |
|---|---|---|
| `nclusion-tdd` | `~/.claude/skills/nclusion-tdd/skill.md` | Every implementation task |
| `nclusion-git-workflow` | `~/.claude/skills/nclusion-git-workflow/skill.md` | Any git operation |
| `nclusion-ticket-workflow` | `~/.claude/skills/nclusion-ticket-workflow/skill.md` | Ticket start / ticket end |
| `nclusion-ci-preflight` | `~/.claude/skills/nclusion-ci-preflight/skill.md` | Before push or PR |
| `nclusion-branch-finish` | `~/.claude/skills/nclusion-branch-finish/skill.md` | Ticket complete, ready to merge |

### Domain Skills

| Skill | File | Trigger |
|---|---|---|
| `nclusion-constraints` | `~/.claude/skills/nclusion-constraints/skill.md` | Any implementation file |
| `nclusion-solana` | `~/.claude/skills/nclusion-solana/skill.md` | `programs/`, `packages/solana-client/` |
| `nclusion-mobile` | `~/.claude/skills/nclusion-mobile/skill.md` | `apps/mobile/` |
| `nclusion-backend` | `~/.claude/skills/nclusion-backend/skill.md` | `apps/gateway/`, `services/` |

### Orchestration

| File | Location | Purpose |
|---|---|---|
| `CLAUDE.md` | Project root | Non-negotiable constraints inline, skill trigger map, tech stack, workflow rules |

## Design Decisions

1. **Selective enforcement** — hard-enforce non-negotiable constraints (on-chain/off-chain boundary, managed wallets, relay, idempotency, tech stack, localization), leave implementation details flexible
2. **Full ticket ceremony** — primer on start, DEVLOG on completion, conventional commits, for every ticket
3. **Language-aware TDD** — Vitest for TS, bankrun for Rust, no mocks on trust-critical paths
4. **Local pre-flight** — lint, typecheck, test, build on affected packages before push; CI as safety net
5. **Trunk-based git** — short-lived feature branches, one ticket per branch, fast-forward or squash merge
6. **Hybrid Solana handling** — unified workflow skills, dedicated domain skill for Anchor-specific safety
7. **Constraints in CLAUDE.md** — non-negotiables inline so they're in context every session without skill lookup

## File Inventory

```
CLAUDE.md                                          (project root)
~/.claude/skills/nclusion-constraints/skill.md
~/.claude/skills/nclusion-tdd/skill.md
~/.claude/skills/nclusion-git-workflow/skill.md
~/.claude/skills/nclusion-ticket-workflow/skill.md
~/.claude/skills/nclusion-ci-preflight/skill.md
~/.claude/skills/nclusion-branch-finish/skill.md
~/.claude/skills/nclusion-solana/skill.md
~/.claude/skills/nclusion-mobile/skill.md
~/.claude/skills/nclusion-backend/skill.md
```
