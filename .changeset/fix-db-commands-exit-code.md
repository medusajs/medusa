---
"@medusajs/medusa": patch
"@medusajs/cli": patch
"@medusajs/loyalty-plugin": patch
---

fix(medusa, cli): db commands now exit with code 1 when container initialization fails
chore(loyalty,draft-order): update build process to handle plugin build without cyclic deps issue
