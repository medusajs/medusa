---
"@medusajs/admin-ui": patch
"@medusajs/admin": patch
---

fix(admin,admin-ui): Copy `/public` folder to admin build folder during build, in order for the build to include translation files. Also bumps the version of `dotenv` to match the version used in other Medusa dependencies.
