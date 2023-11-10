# ChangeStreamDocumentKey

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](Document.md) |

## Hierarchy

- **`ChangeStreamDocumentKey`**

  ↳ [`ChangeStreamInsertDocument`](ChangeStreamInsertDocument.md)

  ↳ [`ChangeStreamUpdateDocument`](ChangeStreamUpdateDocument.md)

  ↳ [`ChangeStreamReplaceDocument`](ChangeStreamReplaceDocument.md)

  ↳ [`ChangeStreamDeleteDocument`](ChangeStreamDeleteDocument.md)

## Properties

### documentKey

 **documentKey**: `Object`

For unsharded collections this contains a single field `_id`.
For sharded collections, this will contain all the components of the shard key

#### Index signature

▪ [shardKey: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | [`InferIdType`](../index.md#inferidtype)<`TSchema`\> |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1037
