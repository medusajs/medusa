---
"@medusajs/dashboard": patch
---

fix(dashboard): Fix a Rules of Hooks violation in `RouteFocusModal`: `useStateAwareTo` was
called conditionally inside a ternary
(`typeof prev === "number" ? prev : useStateAwareTo(prev)`, suppressed with
`eslint-disable react-hooks/rules-of-hooks`). `useStateAwareTo` now accepts a
`number` and returns it unchanged, so it can be called unconditionally.
