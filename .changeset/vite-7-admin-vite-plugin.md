---
"@medusajs/admin-vite-plugin": minor
---

chore(admin-vite-plugin): widen the vite peer range to v5, v6 and v7

The peer range is now `^5.4.21 || ^6.0.0 || ^7.0.0`, so plugin authors on any of those majors are supported. Also drops the unused `chokidar` dependency — it was declared but never imported, since the plugin uses the watcher Vite provides.
