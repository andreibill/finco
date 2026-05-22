# Skills

Reusable, invokable workflows for this repo. This set grows over time.

## Convention
One folder per skill, each containing a `SKILL.md` with YAML frontmatter:

```
.claude/skills/
  <skill-name>/
    SKILL.md
```

`SKILL.md` frontmatter must have:
- `name` — kebab-case, matches the folder name.
- `description` — one line stating what the skill does **and when to use it**
  (this is what Claude matches against the user's request, so be specific).

Keep the body focused: the steps to follow, rules to honor, and any examples.
Reference repo rules (`.claude/rules/*.md`) instead of duplicating them.

## Current skills
- `commit` — commit current changes with descriptive messages, split per feature.
