# Output: Result File and PR Body

Write both files at the repository root. Do not print them to stdout. Do not commit, push, or open the PR.

## `update-result.json`

```json
{
  "status": "proposed" | "failed" | "no-change",
  "pr_title": "chore(deps): <short description>" | null,
  "summary": "<neutral summary for maintainers, max 1000 chars>",
  "risk": "low" | "medium" | "high",
  "packages": [
    {
      "name": "<package>",
      "from": "<locked version before>",
      "to": "<planned target>",
      "outcome": "updated" | "dropped" | "blocked",
      "reason": "<why it was dropped or blocked, max 300 chars; empty when updated>"
    }
  ],
  "verify": {
    "build": true | false,
    "unit": true | false,
    "integration": true | false | null,
    "commands": ["<exact command run>"]
  },
  "sources": [
    {
      "package": "<package>",
      "title": "<short link text, e.g. Migration guide from v7>",
      "url": "<https URL of a release note, changelog, or migration guide you read>"
    }
  ]
}
```

Rules:

- One `packages` entry per package in the group, including dropped and blocked ones.
- `status: "proposed"`: at least one package is `updated`, and `verify.build` and `verify.unit` are `true` for what's left. `integration` is `null` only when no affected workspace has integration tests.
- `status: "failed"`: nothing could be shipped. `pr_title` is `null` and no `pr-body.md` is written; the working tree must have no changes left.
- `status: "no-change"`: the targets were already in place (for example on a revision with nothing to address).
- `pr_title`: `chore(deps): ` + a short description, single line, under 80 characters: `chore(deps): update minor dependencies`, `chore(deps): update stripe to v23`.
- `risk`: `low` for lockfile-only changes with no code changes; `medium` when code changed; `high` for majors of shipped runtime dependencies (`dependencies` of a published package) or when tests needed changes.
- `summary` and `reason` are posted to Linear as plain text: paraphrase, no links or mentions. The PR body carries the detail.
- `sources`: up to 4 per updated package, the pages a reviewer should read to check the update: migration guides, release notes, and changelog entries for the bumped range. Prefer a page for the exact version (a release tag, a changelog anchor) over a generic one. Only URLs on the package's own GitHub repository, its npm page, or its homepage's domain (from `npm view <package> repository.url homepage`) are kept; the workflow drops anything else. The workflow adds each package's GitHub releases and npm version links itself, so don't list those.

## `pr-body.md`

```md
## Summary

**What**: <packages and versions, one line, or "N packages (table below)">

**Why**: Weekly dependency update.

**How**: <lockfile refresh / range bump; codemods run; code changes and why each was needed>

**Testing**: <commands run and results; pre-existing failures>

| Package | From | To | Change | Notes |
| --- | --- | --- | --- | --- |
| <name> | <from> | <to> | lockfile / range | <breaking changes that affected us, or "none found"> |

### Breaking changes and call sites

<majors only: each breaking change that affects the repo, with the file:line changed>

### Dropped

<packages dropped or blocked and why; omit when none>

---

## Checklist

- [x] I have added a **changeset** for this PR
- [x] The changes are covered by relevant **tests**
- [x] I have verified the code works as intended locally
- [ ] I have linked the related issue(s) if applicable
```

- Tick a checklist box only if it's true.
- Don't put links in `pr-body.md`: links to hosts other than `github.com/medusajs/*`, `docs.medusajs.com`, and `medusajs.com` are removed (their text is kept). The workflow appends a **Release notes** table built from `sources`, so refer to "the release notes below" instead.
- There's no length limit beyond 30 KB: give each breaking change and code change the detail a reviewer needs.
- Don't write closing keywords, issue links, or @mentions.
- Don't paste release notes; summarize what affects the repo.
