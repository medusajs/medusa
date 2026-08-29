---
"@medusajs/event-bus-redis": patch
---

fix(event-bus-redis): set group TTL in the same pipeline as the push

`EXPIRE` was issued before the `RPUSH` that creates the `staging:<eventGroupId>` key, so `EXPIRE` against a nonexistent key was a silent no-op — a group whose events all arrived in a single `emit()` call ended up with no expiry at all. `groupEvents` now issues `RPUSH` + `EXPIRE` in a single pipeline, so the TTL always lands atomically with key creation. Also guards `clearGroupedEvents`' partial-clear `RPUSH` against a zero-member spread.
