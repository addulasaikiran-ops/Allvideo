# Claude Code Instructions

Read `AGENTS.md` first. It is the canonical project constitution; these instructions supplement it and must not contradict it.

## Working agreement
- Follow the approved audit → plan → approval → implementation workflow.
- Keep changes on `step-XX-name` branches and work in small, reviewable commits.
- Ask before adding any dependency, even when the dependency is part of the intended stack.
- After each implementation step, run lint, tests, and production build when the scripts and environment exist. Report commands and truthful results; clearly identify checks that could not run.
- Never claim to have inspected, tested, deployed, or created something without evidence.
- Do not add real personal data, photos, secrets, or unlicensed assets unless the owner supplies/approves them.
- Preserve the framework-independent engine in `src/engine/`; keep React UI in `src/ui/` and connect it to engine state through a store.
- Follow all accessibility, mobile-first, emotional-safety, performance, personalization, and Vercel rules in `AGENTS.md`.
- When an asset is missing, document a clearly named placeholder and a license-safe acquisition source in `docs/ASSET_TODO.md`.
