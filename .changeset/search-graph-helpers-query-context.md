---
"@medusajs/utils": patch
---

feat(utils): extend the `graphSeed` and `graphConsume` search helpers so an index whose documents need more than one `query.graph` read can use them instead of a hand-written `seed` and `consume`: a `context` option forwarded to every read including the catch-up pass (e.g. the pricing context `variants.calculated_price` needs), and a `transform` that receives the whole page, may be async, and marks a row as leaving the index by returning no document for it — so enrichment such as prices in several currencies costs a fixed number of reads per page, and an awaited `resolve_ids` that receives the ingestion context, so an event about a related entity can be mapped to the documents it affects
