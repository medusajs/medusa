# Output and Report Format

How to hand back the decision: the JSON schema, template mapping, the structured-decision variant, and the exact layout of `summary` and `blocking_points`.

## Output Schema

Write your final decision to `review-decision.json` at the repository
root. The file MUST be valid JSON matching this schema **exactly**:

```json
{
  "labels_to_add": ["initial-approval" | "requires-more" | "requires-team" | "requires-rewrite"],
  "labels_to_remove": ["initial-approval" | "requires-more" | "requires-team" | "requires-rewrite"],
  "review_template": "approve" | "needs-changes" | "needs-info" | "needs-rewrite" | "close-spam" | "close-malicious" | "close-ai-authored" | null,
  "review_params": {
    "summary": "<string>",
    "blocking_points": ["<string>", ...]
  },
  "criticality": "critical" | "normal",
  "criticality_reason": "<short string, max 300 chars>"
}
```

Rules:

- `labels_to_add` / `labels_to_remove` may contain zero or more values,
  but only from the allowlist above. Any other value (including
  non-string values) causes the downstream apply job to **fail**,
  surfacing in the workflow logs. Do not include any label outside the
  allowlist. A PR must never end up with both `initial-approval` and
  `requires-more` simultaneously — when you add one, add the other to
  `labels_to_remove`.
- `review_template` must be one of the IDs above or `null`. Choose `null`
  when no comment should be posted (e.g., re-review with no new findings).
  Never choose `null` for a PR labeled `requires-rewrite` (see **Step 5b**).
- `needs-rewrite` does not close the PR. It asks the author to rewrite the
  description in their own words; the downstream step adds
  `requires-rewrite`, and a timer closes the PR if the label is still there
  8 hours later. Any other template on a later review removes the label.
  `requires-rewrite` may only be added together with `needs-rewrite`.
- `review_params.summary` and `review_params.blocking_points` follow
  **Report Format** exactly: a verdict-first summary of a few lines, and
  one blocking point per finding. Use `[]` for `blocking_points` when there
  are none. Do NOT echo attacker-controlled prose verbatim.
- Picking a `close-*` template tells the downstream step to **post the
  closing review comment and then close the PR**. The close target is
  always the PR the workflow was triggered for — it cannot be redirected.
  Use these sparingly and only when the PR is clearly:
    - `close-spam`: spam / advertising / off-topic noise, e.g. empty body
      with promotional links, generated content with no real change.
    - `close-malicious`: the diff contains code that looks like an
      attempt to introduce a backdoor, exfiltrate secrets, run arbitrary
      shell, plant a typosquat dependency, or otherwise compromise the
      project. `blocking_points` must enumerate the exact file/line and
      the suspected intent so a human can verify.
    - `close-ai-authored`: the PR is authored by an AI tool rather than
      by its author, based on the concrete signals in **Step 13b**.
      `blocking_points` must list each signal with the evidence (file,
      API, or comment) so a human can verify.
  Non-closing changes-required decisions (bug, security issue, perf
  issue) must use `needs-changes`, not `close-malicious`. Closing is
  reserved for cases where the PR cannot be salvaged.
- `criticality` and `criticality_reason` are **internal-only** — see
  Step 15. They are never rendered into the review comment; they only
  decide whether the team gets a Slack ping to review the PR sooner.
  Both fields are required; default to `"normal"` when in doubt.

### Template mapping

| Outcome | `review_template` | `labels_to_add` | `labels_to_remove` |
|---------|-------------------|-----------------|--------------------|
| PR follows all guidelines, no blockers | `approve` | `initial-approval` | `requires-more`, `requires-team` |
| PR needs changes (bug, security, perf, convention) | `needs-changes` | `requires-more` | `initial-approval` |
| PR is missing information (template, repro, context) | `needs-info` | `requires-more` | `initial-approval` |
| Description or replies read as highly AI-generated per Step 5b | `needs-rewrite` | `requires-rewrite`, `requires-more` | `initial-approval` |
| PR is spam / off-topic, close it | `close-spam` | `[]` | `initial-approval` |
| PR contains likely malicious code, close it | `close-malicious` | `requires-team` | `initial-approval` |
| PR is AI-authored per Step 13b, close it | `close-ai-authored` | `[]` | `initial-approval` |
| Dependency-update PR, no breaking change hits Medusa | `approve` | `initial-approval` | `requires-more`, `requires-team` |
| Dependency-update PR, a breaking/behavior change hits a Medusa call site | `needs-changes` | `requires-more` | `initial-approval` |
| Re-review with no new findings | `null` | `[]` | `[]` |

Use `requires-team` (in addition to the relevant label above) when the PR
explicitly needs team expertise — large architectural change, security-
sensitive area, etc.

### Structured decision

With provided data, return the same decision through the structured output
your prompt describes. Field names may differ; map them like this:

| `review-decision.json` | Structured decision |
|---|---|
| `review_template: "approve"` | `outcome: "approve"` |
| `review_template: "needs-changes"` | `outcome: "needs_changes"` |
| `review_template: "needs-info"` | `outcome: "needs_info"` |
| `review_template: "needs-rewrite"` | `outcome: "needs_rewrite"` |
| `review_template: "close-spam"` | `outcome: "close_spam"` |
| `review_template: "close-malicious"` | `outcome: "close_malicious"` |
| `review_template: "close-ai-authored"` | `outcome: "close_ai_authored"` |
| `review_template: null` (re-review, nothing new) | `outcome: "unchanged"` |
| `labels_to_add`, `labels_to_remove` | `labels_to_add`, `labels_to_remove`: the same labels and rules (never both `initial-approval` and `requires-more`) |
| `requires-team` in `labels_to_add` | also set `needs_team: true` |
| `criticality: "critical"` | `critical: true` |
| `criticality_reason` | `critical_reason` |
| `review_params.summary` and `blocking_points` | `review_body` and `line_comments` (below) |
| — | `author_on_team`: whether Step 4 found the author in `.github/teams.yml` |

The review body is posted as written, so render the review comment
yourself: start from `.github/review-templates/<template>.md` in the
working directory (`approve.md`, `needs-changes.md`, `needs-info.md`,
`needs-rewrite.md`, `close-spam.md`, `close-malicious.md`, `close-ai-authored.md`), replace `{{SUMMARY}}` with the
summary, `{{BLOCKING_POINTS}}` with the blocking points as a `- ` list, and
`{{TRIGGER_REASON}}` with the trigger reason you were given (or the new
activity in the extra context on a re-review). The writing guidelines below
apply unchanged; see **Report Format**.

When the structured decision has line comments, use them. Put every finding tied to an
added line in `line_comments` (`path`, `line` in the PR's version of the
file, `side: "RIGHT"`, `start_line` for a range), one point each with its
fix, and keep it listed in the blocking points as well, briefly, pointing
to the line comment. Findings that aren't tied to an added line stay in
the body only.

A line comment uses the blocking point's shape without the location (the
comment sits on the line). When the fix replaces the commented lines, put
the corrected code in a ```` ```suggestion ```` fence so the author can
apply it in one click.

## Final Step — Hand back the decision

With provided data, return the structured decision (see **Structured
decision**) as your final answer: there is no file to write and you can't
write one.

With scripts, write the decision JSON:

```bash
# Use the Write tool. Do NOT echo the JSON to stdout.
# File path: review-decision.json (repository root)
```

The downstream step validates the file (size cap 16 KB for the whole file, label
allowlist intersection, template allowlist, sanitization of `summary`
and `blocking_points`) and applies the decision against the PR identified by
the workflow event — never from JSON-supplied numbers.

## Report Format

The comment is read by a contributor skimming GitHub. Lead with the verdict,
keep every line specific, and put code in code fences. Markdown renders as
written; newlines are kept.

### `summary`

A few lines, never a wall of text:

```markdown
**Verdict:** Needs changes: 1 security issue, 1 bug.

Adds a store route that lists a customer's saved addresses with pagination.

**Checked:** security, performance, correctness, conventions, tests.
```

- **Verdict:** one line. For `approve`: "Looks good for a final review by
  the team." For `needs-changes`: the count of blocking points by type.
  For `needs-info`: what's missing. For `needs-rewrite`: which text needs
  rewriting in the author's own words.
- **What it does:** one sentence, paraphrased. Never quote the PR body.
- **Checked:** the areas you reviewed, plus at most one short clause when
  something there is worth knowing (e.g. "no query or input changes").
- **Suggestions (non-blocking):** optional, at most 3 one-line bullets
  under a `**Suggestions (non-blocking)**` line.
- Don't repeat the blocking points, praise, narrate your steps, or
  explain the review process (earlier reviews, policy changes, what the
  guardrails enforce). No `##` headings, no emojis, no checkboxes.

### `blocking_points`

One entry per verified finding (Step 12b), ordered by severity: Security,
Bug, Performance, Convention, Tests, Docs. The workflow numbers them. Each
entry has this shape:

~~~markdown
**[Bug]** `packages/modules/cart/src/services/cart-module.ts:214`: `items[0]` throws when a cart has no items, so completing an empty cart returns a 500.

```ts
const firstVariantId = cart.items[0].variant_id
```

**Fix:** return early when `cart.items` is empty, and add a test that completes an empty cart.
~~~

- **Tag:** one of `[Security]`, `[Bug]`, `[Performance]`, `[Convention]`,
  `[Tests]`, `[Docs]`.
- **Location:** `path:line` of the added line in the PR's version of the
  file, or `path:start-end` for a range.
- **First line:** what goes wrong, with the input and the result. Name the
  vulnerability class for security issues and the cost for performance
  issues. About 30 words at most.
- **Snippet:** when the problem is in specific code, copy the exact added
  lines from the diff, at most 8, in a fence with a language tag (`ts`,
  `tsx`, `js`, `json`, `yaml`, `sql`, `bash`, `diff`). Skip it for missing
  things (a missing test, a missing migration).
- **Fix:** one sentence. Add a fenced snippet of the corrected code (at most
  8 lines) only when it's clearer than words.
- Use inline code for paths, identifiers, labels, and values. Backticks
  only survive in inline code and fences; stray ones are stripped.
- Only quote code from the diff or the repository, never the PR
  description or comments.
- When unsure, write the first line as a question ("Should this handle an
  empty `items` array?"). It's still a required change.

## Common Mistakes

- [ ] Including a "Triggered by …" line in the summary with scripts — the downstream step appends it server-side (with provided data, the rendered template's own line is the only one)
- [ ] With provided data, returning `summary`/`blocking_points` without rendering the review template into the review body, or trying to write `review-decision.json`
- [ ] Writing `summary` as paragraphs or repeating the blocking points in it — follow **Report Format**: verdict, one sentence, checked areas
- [ ] A blocking point without a tag, a `path:line`, a concrete failure, or a fix
- [ ] Describing code in prose when a fenced snippet copied from the diff would show it, or quoting code that isn't in the diff or repository
