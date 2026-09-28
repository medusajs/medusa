---
"@medusajs/framework": patch
---

fix(framework): only skip HTTP logging for the root `/health` endpoint, so requests like `/admin/health` are logged
