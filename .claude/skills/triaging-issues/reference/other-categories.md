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

Add a comment and close the issue. Keep the tone friendly and invite the user to reopen with more details.

**Comment template:**
```
Thanks for opening this issue! Unfortunately, there isn't enough information here for us to understand or investigate the problem.

We're going to close this for now, but you're welcome to reopen it with more details, such as:
- What you're trying to do
- What's going wrong
- Steps to reproduce
- Any error messages or logs

We're happy to help once we have more context!
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
