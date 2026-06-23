---
"@medusajs/file-s3": patch
"@medusajs/file-local": patch
---

Fix binary file (image/PDF) upload corruption: decode upload content based on MIME type instead of always falling back to UTF-8, which re-encoded bytes > 127 and corrupted binary files
