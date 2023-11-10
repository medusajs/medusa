# ChangeStreamReplaceDocument

**See**

https://www.mongodb.com/docs/manual/reference/change-events/#replace-event

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](Document.md) |

## Hierarchy

- [`ChangeStreamDocumentCommon`](ChangeStreamDocumentCommon.md)

- [`ChangeStreamDocumentKey`](ChangeStreamDocumentKey.md)<`TSchema`\>

  ↳ **`ChangeStreamReplaceDocument`**

## Properties

### \_id

 **\_id**: `unknown`

The id functions as an opaque token for use when resuming an interrupted
change stream.

#### Inherited from

[ChangeStreamDocumentCommon](ChangeStreamDocumentCommon.md).[_id](ChangeStreamDocumentCommon.md#_id)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1008

___

### clusterTime

 `Optional` **clusterTime**: [`Timestamp`](../classes/Timestamp.md)

The timestamp from the oplog entry associated with the event.
For events that happened as part of a multi-document transaction, the associated change stream
notifications will have the same clusterTime value, namely the time when the transaction was committed.
On a sharded cluster, events that occur on different shards can have the same clusterTime but be
associated with different transactions or even not be associated with any transaction.
To identify events for a single transaction, you can use the combination of lsid and txnNumber in the change stream event document.

#### Inherited from

[ChangeStreamDocumentCommon](ChangeStreamDocumentCommon.md).[clusterTime](ChangeStreamDocumentCommon.md#clustertime)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1017

___

### documentKey

 **documentKey**: `Object`

For unsharded collections this contains a single field `_id`.
For sharded collections, this will contain all the components of the shard key

#### Index signature

▪ [shardKey: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | [`InferIdType`](../types/InferIdType.md)<`TSchema`\> |

#### Inherited from

[ChangeStreamDocumentKey](ChangeStreamDocumentKey.md).[documentKey](ChangeStreamDocumentKey.md#documentkey)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1037

___

### fullDocument

 **fullDocument**: `TSchema`

The fullDocument of a replace event represents the document after the insert of the replacement document

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1216

___

### fullDocumentBeforeChange

 `Optional` **fullDocumentBeforeChange**: `TSchema`

Contains the pre-image of the modified or deleted document if the
pre-image is available for the change event and either 'required' or
'whenAvailable' was specified for the 'fullDocumentBeforeChange' option
when creating the change stream. If 'whenAvailable' was specified but the
pre-image is unavailable, this will be explicitly set to null.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1226

___

### lsid

 `Optional` **lsid**: [`ServerSessionId`](../types/ServerSessionId.md)

The identifier for the session associated with the transaction.
Only present if the operation is part of a multi-document transaction.

#### Inherited from

[ChangeStreamDocumentCommon](ChangeStreamDocumentCommon.md).[lsid](ChangeStreamDocumentCommon.md#lsid)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1029

___

### ns

 **ns**: [`ChangeStreamNameSpace`](ChangeStreamNameSpace.md)

Namespace the replace event occurred on

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1218

___

### operationType

 **operationType**: ``"replace"``

Describes the type of operation represented in this change notification

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1214

___

### txnNumber

 `Optional` **txnNumber**: `number`

The transaction number.
Only present if the operation is part of a multi-document transaction.

**NOTE:** txnNumber can be a Long if promoteLongs is set to false

#### Inherited from

[ChangeStreamDocumentCommon](ChangeStreamDocumentCommon.md).[txnNumber](ChangeStreamDocumentCommon.md#txnnumber)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1024
