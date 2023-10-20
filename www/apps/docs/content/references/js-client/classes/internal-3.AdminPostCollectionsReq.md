---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCollectionsReq

[internal](../modules/internal-3.md).AdminPostCollectionsReq

**`Schema`**

AdminPostCollectionsReq
type: object
required:
  - title
properties:
  title:
    type: string
    description: The title of the collection.
  handle:
    type: string
    description: An optional handle to be used in slugs. If none is provided, the kebab-case version of the title will be used.
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### handle

• `Optional` **handle**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/collections/create-collection.d.ts:86

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/collections/create-collection.d.ts:87

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/collections/create-collection.d.ts:85
