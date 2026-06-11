---
"@medusajs/medusa": patch
---

fix(plugin:develop): invoke yalc via process.execPath on Windows

The watch-mode publisher in `medusa plugin:develop` now spawns the yalc CLI with `node yalc.js …` instead of relying on yalc's shebang. Windows does not honor shebangs, so the previous `execFile(yalcBin, …)` threw `Error: spawn EFTYPE` on every file change and the post-build yalc push never ran — `yarn dev` was effectively unusable for plugin authors on Windows.
