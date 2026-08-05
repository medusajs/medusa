---
"@medusajs/types": patch
---

fix(types): widen the vite peer range so consumers on any vite major can install

The optional `vite` peer was `^5.4.21`, and npm enforces optional peers that are present but conflicting, so `npm install @medusajs/types` failed with `ERESOLVE` in any project running Vite 6 or newer. The constraint is transitive, so storefronts were affected too. Vite is used here for a single type-only import, so the range is now `>=5` and should stay open-ended.
