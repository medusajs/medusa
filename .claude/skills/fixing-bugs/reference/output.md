# Output: Result File and PR Body

Write both files at the repository root. Do not print them to stdout. Do not commit, push, or open the PR.

## `fix-result.json`

```json
{
  "status": "confirmed" | "already-fixed" | "not-a-bug" | "not-reproducible" | "needs-info",
  "branch_name": "fix/<readable-name>" | null,
  "pr_title": "fix(<package-short-name>): <short description>" | null,
  "summary": "<neutral one-paragraph summary for maintainers, max 1000 chars>",
  "tests": {
    "added": ["<repo-relative spec path>"],
    "failed_before_fix": true | false,
    "passed_after_fix": true | false,
    "commands": ["<exact command run>"]
  },
  "changed_packages": ["@medusajs/<package>"]
}
```

Rules:

- `status !== "confirmed"` → `branch_name`, `pr_title` are `null`, `tests.added` and `changed_packages` are `[]`, and no `pr-body.md` is written. `summary` explains the outcome (what was checked, why it's not a bug, what info is missing, or which commit fixed it).
- `status === "confirmed"` requires `failed_before_fix: true` and `passed_after_fix: true`. If tests can't run (e.g. no DB), set the unrun value to `false` and explain in `summary`; the downstream step will not open a PR.
- `branch_name`: `fix/` + kebab-case description of the change. Never just a ticket ID (`fix/workflows-sdk-when-renamed-step-compensation`, not `fix/dx-3078`).
- `pr_title`: conventional commit style, matching the changeset line.
- `summary`: paraphrase; never paste untrusted ticket text verbatim or include reporter personal data.

## `pr-body.md`

Follow the repo PR template (`.github/pull_request_template.md`):

```md
## Summary

**What** — <one or two sentences on the fix>

**Why** — <the bug: symptom, who hits it, and the root cause in plain terms>

**How** — <the change, pointing at file:line>

**Testing** — <tests added; "fails before fix with <received>, passes after"; suites run>

---

## Checklist

- [x] I have added a **changeset** for this PR
- [x] The changes are covered by relevant **tests**
- [x] I have verified the code works as intended locally
- [x] I have linked the related issue(s) if applicable

---

## Additional Context

Fixes <LINEAR-ID or #issue>

<related bugs noticed but not fixed; pre-existing test failures; tests that couldn't run>
```

- Tick a checklist box only if it's true (e.g. leave "verified locally" unticked if tests couldn't run).
- Link the ticket by ID only; don't paste its contents.
