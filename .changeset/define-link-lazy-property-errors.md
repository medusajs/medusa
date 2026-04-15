---
"@medusajs/utils": patch
---

fix(utils): surface clear error when `defineLink()` properties are read before app bootstrap

`defineLink()` returns an object whose `serviceName`, `entity`, and `entryPoint`
are populated asynchronously during `MedusaModule.bootstrapAll()`. Capturing
any of them as a primitive at import time (e.g. `const ep = MyLink.entryPoint`)
used to silently freeze the empty string and later surface as an opaque
`Service "undefined" was not found` at runtime. These properties are now
exposed through getters that throw a descriptive error pointing at the real
cause when read before registration. The setters used by the internal
`register` callback flip an `_registered` flag, so normal usage after
bootstrap is unchanged.
