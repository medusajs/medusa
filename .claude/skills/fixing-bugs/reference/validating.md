# Validating a Bug Report

Decide whether the reported bug exists on the current branch before writing any test or fix.

## Steps

1. **Check open PRs.** Scan the open PR list (in CI: `/tmp/fix-bug/open-prs.md`; locally: `bash scripts/search_prs.sh <issue number or Linear ID>`) for a PR that references the same ticket or fixes the same root cause. If one does, read its diff (`bash scripts/get_pr_diff.sh <number>` locally) only as far as needed to confirm, and stop with `already-fixed`.
2. **Check the version gap.** Compare the reporter's version with the package's current `version` in its `package.json`. If they differ, check `git log --oneline -- <file>` on the suspected file for a fix since then.
3. **Locate the code path.** Grep for the symbols, error messages, or file names in the report. Read only the relevant line ranges.
4. **Trace the claim.** Follow the data from entry point to the reported symptom. Confirm the exact line(s) that cause it. Reporter claims about internals ("X calls Y with the wrong handler") must be verified in the code, not trusted.
5. **Check intended behavior.** If the behavior might be by design, check the docs (Medusa MCP `ask_medusa_question`, or `www/apps/` MDX) and TSDoc on the API. Documented behavior is `not-a-bug`.
6. **Repro if cheap.** When reading alone leaves doubt, write a throwaway test (see `writing-tests.md`), run it, then delete it. The permanent regression test is written in Step 3, not here.
7. **Widen the blast radius.** Ask what else the same root cause breaks: sibling code paths, the same bug with different inputs, silent wrong data vs. a crash. Note these; the regression test should cover the worst one.

## Outcomes

| Outcome | When | Next |
| --- | --- | --- |
| `confirmed` | Root cause located on current branch and (ideally) reproduced | Step 3 |
| `already-fixed` | Bug existed in the reported version but not on current branch, or an open PR already fixes it | Step 7, cite the fixing commit or open PR |
| `not-a-bug` | Behavior is intended/documented, or caused by user code/config | Step 7, explain why |
| `not-reproducible` | Code path doesn't do what the report says and repro passes | Step 7, describe what was tried |
| `needs-info` | Report lacks the detail needed to locate or reproduce | Step 7, list exactly what's missing |
| `needs-team` | Bug is real, but the fix exceeds the size/path limits or needs a migration, dependency, public API, or event change (see `fixing.md`) | Step 7, name what the fix would need |

> **CRITICAL:** Only `confirmed` proceeds to code changes. When in doubt between `confirmed` and `needs-info`, pick `needs-info`.

## Common Mistakes

- [ ] Re-fixing a bug that an open PR already fixes (duplicate tickets are common)
- [ ] Trusting the reporter's diagnosis without reading the code
- [ ] Validating against the reporter's version instead of the current branch
- [ ] Calling documented behavior a bug
- [ ] Leaving the throwaway repro file behind
