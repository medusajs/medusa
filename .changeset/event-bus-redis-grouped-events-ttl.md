---
"@medusajs/event-bus-redis": patch
---

fix(event-bus-redis): set grouped events TTL in the same pipeline as the push that creates the key

`RedisEventBusService.emit()` staged a group's events with `RPUSH` and separately issued an `EXPIRE` for the same key beforehand. `EXPIRE` against a key that does not exist yet is a no-op, so a group that only ever received a single `emit()` call ended up with no TTL and stayed in Redis indefinitely if it was never released. The `RPUSH` and `EXPIRE` are now sent in a single pipeline, with `EXPIRE` after the `RPUSH`, so the TTL always applies from the moment the key is created.

Also guards `clearGroupedEvents` against issuing an `RPUSH` with no members when clearing by event names leaves nothing to keep, which Redis rejects with a "wrong number of arguments" error.
