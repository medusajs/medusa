# Bug Report Triage

Full flow for triaging bug reports. Follow all steps in order.

## Step 1 — Check for Sufficient Details

A valid bug report needs:
- Clear description of what's wrong
- Steps to reproduce (or enough context to infer them)
- Expected vs actual behavior
- Medusa version (or at minimum, the package/feature affected)

If the report is missing critical details:
1. Add comment asking for the missing information (see template below)
2. Add label: `requires-more`
3. **Stop** — do not proceed to further steps until details are provided

**Comment template — missing details:**
```
Thank you for the report! To help us investigate, could you please provide:

- [ ] Steps to reproduce the issue
- [ ] Expected behavior
- [ ] Actual behavior / error message (include full stack trace if available)
- [ ] Medusa version (`@medusajs/medusa` version and any relevant package versions)
- [ ] Node.js version
- [ ] Any relevant configuration or custom code

Once we have this information, we'll look into it further.
```

---

## Step 2 — Check Documentation for Intentional Behavior

> **CRITICAL:** Before treating anything as a bug, check the official Medusa documentation to determine if the reported behavior is **intentional and documented**. Do this actively — search the docs and the codebase for explanations of the feature.

Read the relevant documentation section (e.g. `www/apps/book/app/learn/fundamentals/`) for the feature mentioned in the issue. Ask: "Is the behavior the user is reporting described as by design anywhere in the docs?"

**If the behavior is explicitly documented as by design:**
1. Add a comment explaining the behavior is intentional, referencing the relevant documentation section
2. Close the issue
3. **Stop** — this is not a bug

**Comment template — documented intentional behavior:**
```
Thank you for the report! After investigating, the behavior you're describing is actually intentional and documented.

[Explain the behavior and why it works this way]

You can find more details in our [documentation](link-to-relevant-docs-section).

If you'd like a different behavior, we'd suggest [workaround or alternative approach if applicable].

I'm going to close this issue, but feel free to reopen if your situation differs from what I've described.
```

Then: `bash scripts/close_issue.sh <issue_number>`

---

**If the behavior is undocumented or the docs are unclear/misleading** (but it still turns out to be by design after codebase review), treat it as a documentation gap — see Step 3 below.

---

**If the behavior is NOT described in the docs at all**, continue to Step 2.5.

---

## Step 2.5 — Check for User Error

After verifying it's not documented intentional behavior, assess whether the issue may be caused by the user:

- Incorrect usage not matching the [Medusa docs](https://docs.medusajs.com)
- Custom code that diverges from documented patterns
- Misconfiguration or missing setup steps
- Using deprecated APIs or patterns from older versions

If you identify a likely user error:
1. Add a comment explaining what the user may be doing incorrectly, with a reference to the relevant docs or correct pattern
2. Do **not** close the issue — the user may confirm it's something different
3. Continue to Step 3 to still validate whether a real bug exists

**Comment template — possible user error:**
```
Looking at your report, this might be related to how [X] is being used rather than a bug in Medusa itself.

[Specific explanation of what looks incorrect]

According to the [documentation](link), the correct approach is:

[Code example or explanation]

Could you check if this resolves your issue? If the problem persists after trying this, please let us know and we'll continue investigating.
```

---

## Step 3 — Validate the Bug in the Codebase

Search the Medusa codebase to confirm whether the reported behavior is actually a bug.

**How to investigate:**
- Search for the relevant module, service, or API route code
- Trace the code path described in the issue
- Look for missing validations, incorrect logic, or edge cases not handled
- Check recent commits/PRs that may have introduced a regression

**Outcomes:**

### Bug NOT confirmed — documentation gap

If the code behaves correctly but the documentation is missing, unclear, or misleading in a way that caused the user to believe it was a bug:

1. Add a comment explaining that the code is working as intended and that the confusion stems from a documentation gap
2. Add label: `type: docs`
3. Load `reference/docs.md` and continue the docs triage flow for the gap identified
4. **Do NOT close the issue** — it remains open as a documentation task

**Comment template — documentation gap:**
```
After investigating this, the code is actually working as intended — the behavior you're seeing is expected.

However, I agree this isn't well documented, and it's understandable why it looked like a bug. We'll track this as a documentation improvement to make [X] clearer.

[Optional: briefly explain the correct behavior or link to any existing docs that partially cover it]
```

```bash
bash scripts/labels.sh <issue_number> add "type: docs"
```

### Bug NOT confirmed — expected behavior

Add a comment explaining why the behavior is expected or what was found, then close the issue.

**Comment template — not a valid bug:**
```
After investigating this, I believe this is the expected behavior because [explanation].

[Optional: reference to relevant code or docs]

I'm going to close this issue, but please feel free to reopen it if your situation is different from what I've described, or if you have additional information that suggests otherwise.
```

Then: `bash scripts/close_issue.sh <issue_number>`

### Bug confirmed — continue to Step 4

---

## Step 4 — Assess Priority

Assign a priority based on impact:

| Priority | Criteria |
|----------|----------|
| `critical` | Data loss, security vulnerability, complete feature unusable for all users, production blocker |
| `high` | Major feature broken with no workaround, affects many users |
| `medium` | Feature partially broken, workaround exists, or affects a subset of users |
| `low` | Minor issue, edge case, cosmetic problem, or easy workaround |

---

## Step 5 — Add Comment and Labels

Post a validation comment summarizing the finding, then apply labels.

**Comment template — bug confirmed (no community label):**
```
I was able to reproduce/confirm this issue. [Brief explanation of what's happening and why.]

[Optional: point to the relevant code location if found]

We'll track this for a fix. Thank you for the detailed report!
```

**Comment template — bug confirmed, PR already linked:**

> Use this when Step 0.5 detected a linked open PR. Do NOT add `good-first-issue` or `help-wanted`.

```
I was able to confirm this issue. [Brief explanation of what's happening and why.]

[Optional: point to the relevant code location if found]

It looks like #[pr_number] is already addressing this — we'll track progress there. Thank you for the report!
```

**Comment template — bug confirmed with `good-first-issue`:**
```
I was able to reproduce/confirm this issue. [Brief explanation of what's happening and why.]

[Optional: point to the relevant code location if found]

This looks like a good opportunity for a community contribution — the fix should be relatively straightforward. We'd welcome a PR if you or anyone else would like to take a stab at it! Check out our [contribution guidelines](https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md) to get started.
```

**Comment template — bug confirmed with `help-wanted`:**
```
I was able to reproduce/confirm this issue. [Brief explanation of what's happening and why.]

[Optional: point to the relevant code location if found]

The fix may be a bit involved, but we'd welcome community contributions on this one if anyone wants to dig in! Check out our [contribution guidelines](https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md) to get started.
```

**Label assignment:**

| Condition | Labels to add |
|-----------|---------------|
| Bug confirmed (always) | `type: bug` |
| Priority is `critical` or `high` | `requires-team` |
| Claude couldn't clearly identify root cause despite sufficient details | `requires-team` |
| Issue is WWW-related (plugin not featured, etc.) | `requires-team` |
| Bug confirmed, fix appears straightforward, **no linked PR** | `good-first-issue` |
| Bug confirmed, fix appears complex, **no linked PR** | `help-wanted` |
| Bug confirmed, **open PR already linked** | Do NOT add `good-first-issue` or `help-wanted` |
| Report lacks details (from Step 1) | `requires-more` |

```bash
bash scripts/labels.sh <issue_number> add <label>
```

> **Note:** `good-first-issue` and `help-wanted` are mutually exclusive. Only add one based on estimated fix complexity. Always add `type: bug` when the bug is confirmed.