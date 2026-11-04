# Bug Report Triage

Full flow for triaging bug reports. Follow all steps in order.

## Step 1 — Check for Sufficient Details

A valid bug report needs:
- Clear description of what's wrong
- Steps to reproduce (or enough context to infer them)
- Expected vs actual behavior
- Medusa version (or at minimum, the package/feature affected)

If the report is missing critical details, pick `needs-info` with
`needs-repro` (no reproduction) or `needs-info` (other details missing), and
list what's missing in the summary. **Stop** — do not proceed until details
are provided.

**Example of what to ask for:**
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

**If the behavior is explicitly documented as by design:** pick `close`
with `close-invalid`; the summary explains the behavior is intentional and
links the docs section. **Stop** — this is not a bug.

**Example summary content:**
```
Thank you for the report! After investigating, the behavior you're describing is actually intentional and documented.

[Explain the behavior and why it works this way]

You can find more details in our [documentation](link-to-relevant-docs-section).

If you'd like a different behavior, we'd suggest [workaround or alternative approach if applicable].

```

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

If you identify a likely user error, still continue to Step 3 to check
whether a real bug exists. If no bug is found, pick `needs-info` with
`needs-info`: the summary explains what looks incorrect and the documented
approach, and asks the author to confirm. Don't close; they may confirm it's
something different.

**Example summary content:**
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

If the code behaves correctly but the documentation is missing, unclear, or
misleading in a way that caused the user to believe it was a bug, load
`reference/docs.md` and continue there. The outcome is `fix` with
`fix_route: "docs"` when the doc change fits the fix limits, otherwise
`escalate`. The summary says the code works as intended and the docs will
be clarified.

### Bug NOT confirmed — expected behavior

Pick `close` with `close-invalid`. The summary explains why the behavior is
expected, with a reference to the relevant code or docs.

### Bug NOT confirmed — can't tell

If the details are there but you can't confirm or rule out the bug, pick
`escalate` and say so in `linear.root_cause`.

### Bug confirmed — continue to Step 4

---

## Step 4 — Assess Priority

| Priority | Criteria |
|----------|----------|
| `critical` | Data loss, security vulnerability, complete feature unusable for all users, production blocker |
| `high` | Major feature broken with no workaround, affects many users |
| `medium` | Feature partially broken, workaround exists, or affects a subset of users |
| `low` | Minor issue, edge case, cosmetic problem, or easy workaround |

Mention the priority in the summary or the Linear ticket.

---

## Step 5 — Choose the Outcome

Load `reference/outcomes.md` and apply the fix limits.

| Condition | Outcome |
|-----------|---------|
| `critical` priority, security, or data loss | `escalate` |
| Fits every fix limit, root cause confirmed in code | `fix`, `fix_route: "bug"`, template `fix-queued` |
| Anything architectural or over the limits | `escalate`, template `escalated`, plus `linear` |

**`fix` summary:** one or two sentences on what's wrong and where (e.g.
"`getVariantAvailability` ignores the sales channel filter when the
variant has no inventory items, in `packages/core/core-flows/...`").

**`escalate` summary:** what's wrong and why it needs the team, without
internal detail the reporter can't act on. The detail goes in `linear`.
