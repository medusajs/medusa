---
"@medusajs/utils": patch
---

fix(utils): parseStringifyIfNecessary no longer throws on null-prototype objects or objects with an own `hasOwnProperty` key
