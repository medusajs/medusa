---
"@medusajs/admin-ui": patch
"@medusajs/medusa": patch
"@medusajs/admin": patch
---

fix(admin,admin-ui,medusa): Fixes an issue where the `host` option did not have a default value. Updates the version of `tailwindcss`, `autoprefixer`, and `postcss` in `@medusajs/admin-ui`, to avoid issues when importing components using `tailwindcss@4`. Fixes an issue in `@medusajs/medusa` where the `develop` command would throw an error when `@medusajs/admin` was not installed.
