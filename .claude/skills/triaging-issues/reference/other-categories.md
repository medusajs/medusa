# Other Category Flows

## Feedback

General feedback and suggestions without a concrete bug are handled like
feature requests: pick `feature` with `close-feature`. The summary thanks
the author and restates the suggestion in one sentence.

If the feedback describes a concrete problem with existing behavior, treat
it as a bug report instead (`reference/bug-report.md`).

---

## Vague Issues

First, assess whether the issue has a **discernible intent** even if details are missing.

**Does it hint at a bug, installation problem, error, or usage question?**
- "I keep running into errors", "this isn't working", "I'm having trouble with X" — these suggest a real problem even without details.
- Pick `needs-info` with `needs-info`. The summary asks for what they're
  trying to do, what's going wrong (errors, logs), steps to reproduce, and
  the Medusa and Node.js versions. Do NOT close.

**Is the body completely empty, a single word, or genuinely incomprehensible with no discernible intent?**
- Pick `close` with `close-invalid`. The summary says there isn't enough
  information to understand the problem and what a new report should
  include.

---

## Other

When the issue doesn't clearly fit any category:

- It describes a real problem you can't classify: `escalate`, with what you
  found in `linear`.
- Otherwise: `needs-info`, asking the author what they need.
