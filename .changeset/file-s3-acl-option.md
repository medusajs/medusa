---
"@medusajs/file-s3": patch
"@medusajs/types": patch
---

feat(file-s3): add `acl` option to disable ACL headers on uploads

Adds an `acl` configuration option to the S3 file provider:
- `undefined` (default): existing behaviour (public-read for public, private for private)
- `false`: omit the ACL header entirely, required for buckets with BucketOwnerEnforced Object Ownership or Block Public Access enabled
- A canned ACL string: use that ACL for all uploads
