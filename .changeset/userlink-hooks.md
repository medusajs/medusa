---
"@medusajs/dashboard": patch
---

Fix a Rules of Hooks violation in `UserLink`'s `By` component: `useUser` and
`useCustomer` were called after an early `return null` (suppressed with
`eslint-disable react-hooks/rules-of-hooks`), so the hook count could change
between renders of the same instance. The hooks now run unconditionally before
the early return — the existing `{ enabled }` flags already prevent fetching for
the branch that does not apply, so behaviour is unchanged.
