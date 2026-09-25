---
"@medusajs/caching": patch
---

fix(caching): bound automatic invalidation and keep it off `worker_mode: "server"` processes

Automatic cache invalidation could exhaust the Node heap during a burst of writes, such as a catalogue sync through the Admin API:

- `performCacheClear` and `performCacheSet` dispatched provider work with `void`, so `clear`/`set` resolved before the provider had done anything. Nothing could apply backpressure and the `ongoingRequests` coalescing never deduped, letting concurrent clears accumulate without limit. Both are now awaited.
- The invalidation handler was registered both as a `"*"` subscriber and as an event bus interceptor. Interceptors run in whichever process *emits* the event, so a process started with `projectConfig.workerMode: "server"` ran the full invalidation for every write it served while also serving HTTP traffic, and in a server/worker split every event was invalidated twice. The interceptor registration is removed; events with a matching subscriber are queued to the worker regardless.
- Tags from a burst of events are now deduplicated into a pending set and drained one batch at a time, instead of issuing one clear per event.
