---
"@medusajs/eslint-plugin": patch
---

Fix `link-no-cross-module-relationship` incorrectly flagging in-module relative imports and tsconfig-alias references as cross-module on Windows.

`path.resolve()` returns backslash-separated paths on Windows, while the rule's `moduleRoot` is always forward-slash normalized. Without normalizing the resolved path the same way before comparing, every in-module reference on Windows produced a false-positive cross-module violation. `pathStaysInModule()` now normalizes both sides of the comparison.
