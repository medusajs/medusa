---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteUploadsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeleteUploadsReq

**`Schema`**

AdminDeleteUploadsReq
type: object
required:
  - file_key
properties:
  file_key:
    description: "key of the file to delete. This is obtained when you first uploaded the file, or by the file service if you used it directly."
    type: string

## Properties

### file\_key

• **file\_key**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/uploads/delete-upload.d.ts:73
