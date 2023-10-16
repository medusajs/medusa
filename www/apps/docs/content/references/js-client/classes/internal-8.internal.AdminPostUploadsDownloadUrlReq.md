---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostUploadsDownloadUrlReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostUploadsDownloadUrlReq

**`Schema`**

AdminPostUploadsDownloadUrlReq
type: object
required:
  - file_key
properties:
  file_key:
    description: "key of the file to obtain the download link for. This is obtained when you first uploaded the file, or by the file service if you used it directly."
    type: string

## Properties

### file\_key

• **file\_key**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/uploads/get-download-url.d.ts:73
