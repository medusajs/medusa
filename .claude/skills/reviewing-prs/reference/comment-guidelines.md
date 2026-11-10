# Comment Writing Guidelines

The exact layout of `summary` and `blocking_points` is in **Report Format**
in `SKILL.md`. This file covers tone and the contextual assessment.

## Tone

- **Concise:** state what's needed and why, nothing more. One point per
  sentence, short sentences, no preamble.
- **Specific:** name the file, the line, the input, and the fix. Never write
  "this needs improvement" or "this looks wrong" without saying how.
- **Supportive, not effusive:** the template already thanks the contributor.
  Skip "Great work!" and similar filler.
- **"We"** when speaking for the Medusa team. Refer to the author in the
  third person; the template doesn't mention them.
- **Questions for uncertainty:** "Should `X` also handle a null `Y`?" reads
  better than a hedge, and the author can answer it directly.

## Contextual Assessment

Before composing the review, check whether the change makes sense in the
broader codebase, beyond conventions:

- **Is the behavior being changed intentional and documented?** If the PR
  modifies existing behavior, check whether the docs
  (`www/apps/book/app/learn/`) describe it as by design. If they do, the PR
  changes intended behavior: report a blocking point that cites the doc
  page, and don't apply `initial-approval`.
- **Does it solve the problem?** Does the implementation fix what the PR or
  linked issue describes? Is there a simpler or safer approach?
- **Side effects:** could it change behavior elsewhere, through shared
  utilities, middleware, event handlers, or widely used types? Grep for
  usages of what changed.
- **Scope:** does the PR do more or less than the linked issue asks for?
  Unrelated changes are a flag.
- **Coverage:** are the edge cases and regressions it could cause covered by
  the added tests?

Blocking concerns become blocking points (`[Bug]`, `[Tests]`, or
`[Convention]` as fits). Non-blocking ones go under
**Suggestions (non-blocking)** in `summary`, one line each.

## Formatting

- Bold labels (`**Verdict:**`, `**Fix:**`), not `##` headings.
- Inline code for paths, identifiers, labels, and values.
- Fenced code blocks with a language tag for code copied from the diff,
  at most 8 lines each.
- No emojis, no checkboxes, no tables.
