---
"@medusajs/admin-ui": major
"@medusajs/admin": major
"medusa-react": patch
"@medusajs/medusa-js": patch
"@medusajs/medusa": patch
---

feat(admin, admin-ui, medusa-react, medusa-js, medusa): Add support for Admin Extensions.

BREAKING CHANGE: Admin Extensions are now supported. This means that the Admin UI can be extended with custom React components. See the docs for more information. This also means that the `medusa-admin eject` command has been removed, as it is no longer needed.
Users that have previously ejected the Admin UI will find that their ejected code is no longer compatible with new versions of `@medusajs/admin-ui`, due to the move from `vite` to `webpack`. We recommend that you port any customizations to Admin Extensions instead.
