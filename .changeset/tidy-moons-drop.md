---
"@medusajs/medusa": patch
"@medusajs/search": patch
"@medusajs/types": patch
"@medusajs/medusa-test-utils": patch
"medusa-cli": patch
---

feat(medusa,search,types): drop search indexes no definition declares any more

`db:migrate` now plans a `drop` for every search index left without a definition,
the way it already plans deletions for removed links. It asks which ones to drop
before touching them; `--execute-all-search` drops them all without prompting and
`--execute-safe-search` leaves them alone, mirroring the link flags. Unattended
runs with neither flag skip the drops rather than hang on a prompt.
