---
name: commit
description: Commit the current changes with descriptive messages in Romanian without diacritics. Groups changes by feature and creates a separate commit per feature. Use when the user wants to commit, save progress, or finalize changes.
---

# Commit changes

Stage and commit the working-tree changes. When the changes span multiple features,
split them into **one commit per feature** rather than a single mixed commit.

## Steps
1. Inspect what changed — run in parallel:
   - `git status`
   - `git diff` (unstaged) and `git diff --staged`
   - `git log --oneline -8` (to match the existing message style)
2. **Group the changes by feature/concern.** A group is a coherent unit, e.g.
   "biblioteca: filtru status in URL", "componente: PasswordInput", "backend:
   UploadOrchestrator". Files touched for one feature go in one commit.
3. For each group, in order:
   - Stage only that group's files: `git add <paths>` (never blanket `git add -A`
     when there are multiple groups).
   - Commit with a clear message (see format below).
4. After all commits, run `git status` to confirm a clean tree and `git log
   --oneline -n <count>` to show what was created. Report the commits back to the user.

## Message format
- **Romanian without diacritics.** Concise, imperative, describes the change.
- Subject line short (~50-72 chars). Add a body only if the why isn't obvious.
- Examples: `Adauga filtru status in URL pentru Biblioteca`,
  `Extrage PasswordInput peste Input`, `Centralizeaza rutele API in API_ROUTES`.
- End every commit message with the trailer:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```

## Rules
- Commit/push only what the user asked. **Do not push** unless explicitly requested.
- If on the default branch (`main`) and the user wants a feature branch, branch first
  — otherwise commit on the current branch.
- Respect `.gitignore`; never force-add ignored paths (e.g. `Finco/*`, `.DS_Store`).
- Do not commit secrets, build output, or `node_modules`.
- If nothing is staged and nothing changed, say so instead of creating an empty commit.
