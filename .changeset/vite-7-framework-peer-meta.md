---
"@medusajs/framework": patch
---

chore(framework): remove the orphaned vite peerDependenciesMeta entry

There was a `peerDependenciesMeta.vite` entry with no matching `peerDependencies` entry. The package does not import Vite; it depends on `@medusajs/admin-bundler`, which owns the real dependency.
