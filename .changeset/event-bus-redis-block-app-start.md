---
"@medusajs/event-bus-redis": patch
---

fix(event-bus-redis): do not await `bullWorker_.run()` in `onApplicationStart`

BullMQ's `Worker.run()` returns a Promise that resolves only when the worker
is closed. Since `MedusaModule.onApplicationStart` now awaits each module's
hook, awaiting `bullWorker_.run()` prevented the application from finishing
boot. Start the worker without awaiting and log any worker-level errors
instead of producing an unhandled rejection.
