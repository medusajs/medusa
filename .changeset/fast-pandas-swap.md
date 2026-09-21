---
"@medusajs/search": patch
---

fix(search): send writes to the version that currently serves reads

Which physical index backs a logical index is cached per process, and only the
process performing a swap updated its own copy. Another process kept resolving
the retired version, so its writes landed somewhere nothing reads and were lost
once that version was cleaned up. Writes now resolve the active version fresh,
and a read whose cached version has since been dropped resolves again instead of
failing.

Also fixes the background refresh latching off after a single failure, which
pinned a process to a stale version until the hard TTL expired. That TTL is now
2 minutes rather than 10.
