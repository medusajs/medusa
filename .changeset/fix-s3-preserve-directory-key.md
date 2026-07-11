---
"@medusajs/file-s3": patch
---

fix(file-s3): preserve directory portion of filename in object key

The S3 file provider was ignoring the directory segment of a supplied filename when constructing the object key, dropping any path structure (e.g. `vendor_123/logo.png` became `logo-<ulid>.png`). The directory is now preserved so the key becomes `vendor_123/logo-<ulid>.png`. Filenames without a directory are unchanged.
