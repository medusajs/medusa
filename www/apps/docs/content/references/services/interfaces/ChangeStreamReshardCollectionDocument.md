# ChangeStreamReshardCollectionDocument

**See**

https://www.mongodb.com/docs/manual/reference/change-events/

## Hierarchy

- [`ChangeStreamDocumentCommon`](ChangeStreamDocumentCommon.md)

- [`ChangeStreamDocumentCollectionUUID`](ChangeStreamDocumentCollectionUUID.md)

- [`ChangeStreamDocumentOperationDescription`](ChangeStreamDocumentOperationDescription.md)

  ↳ **`ChangeStreamReshardCollectionDocument`**

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

### collectionUUID

 **collectionUUID**: [`Binary`](../classes/Binary.md)

The UUID (Binary subtype 4) of the collection that the operation was performed on.

Only present when the `showExpandedEvents` flag is enabled.

**NOTE:** collectionUUID will be converted to a NodeJS Buffer if the promoteBuffers
   flag is enabled.

**Since Server Version**

6.1.0

#### Inherited from

[ChangeStreamDocumentCollectionUUID](ChangeStreamDocumentCollectionUUID.md).[collectionUUID](ChangeStreamDocumentCollectionUUID.md#collectionuuid)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1000

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

### operationDescription

 `Optional` **operationDescription**: [`Document`](Document.md)

An description of the operation.

Only present when the `showExpandedEvents` flag is enabled.

**Since Server Version**

6.1.0

#### Inherited from

[ChangeStreamDocumentOperationDescription](ChangeStreamDocumentOperationDescription.md).[operationDescription](ChangeStreamDocumentOperationDescription.md#operationdescription)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1051

___

### operationType

 **operationType**: ``"reshardCollection"``

Describes the type of operation represented in this change notification

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1234

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
