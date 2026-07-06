# Other Category Flows

## Feedback

Add an appreciative comment and apply the `feedback` label. The team reviews these periodically.

**Comment template:**
```
Thanks for sharing your feedback — we really appreciate it! The team will review this.

If you'd like to continue the discussion or see how others feel about this, feel free to also post in [GitHub Discussions](https://github.com/medusajs/medusa/discussions).
```

```bash
bash scripts/labels.sh <issue_number> add feedback
```

---

## Vague Issues

First, assess whether the issue has a **discernible intent** even if details are missing.

**Does it hint at a bug, installation problem, error, or usage question?**
- "I keep running into errors", "this isn't working", "I'm having trouble with X" — these suggest a real problem even without details.
- In these cases: **ask for more information and add `requires-more`**. Do NOT close.

**Comment template — vague but has intent:**
```
Thanks for opening this issue! It looks like you're running into a problem, but we need a bit more information to help investigate.

Could you share:
- [ ] What you're trying to do
- [ ] What's going wrong (error messages, logs, unexpected behavior)
- [ ] Steps to reproduce
- [ ] Medusa version and Node.js version

We're happy to look into it once we have more context!
```

```bash
bash scripts/labels.sh <issue_number> add requires-more
```

---

**Is the body completely empty, a single word, or genuinely incomprehensible with no discernible intent?**
- In these cases: add a comment and close.

**Comment template — truly empty/incomprehensible:**
```
Thanks for opening this issue! Unfortunately, there isn't enough information here for us to understand what you're running into.

Feel free to reopen it with more details — such as what you're trying to do, what's going wrong, and any error messages or logs. We're happy to help once we have more context!
```

```bash
bash scripts/close_issue.sh <issue_number>
```

---

## Other

When the issue doesn't clearly fit any category, add the `requires-team` label without commenting. The team will handle it.

```bash
bash scripts/labels.sh <issue_number> add requires-team
```
