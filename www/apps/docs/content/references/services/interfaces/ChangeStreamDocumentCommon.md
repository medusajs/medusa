# ChangeStreamDocumentCommon

## Hierarchy

- **`ChangeStreamDocumentCommon`**

  ↳ [`ChangeStreamInsertDocument`](ChangeStreamInsertDocument.md)

  ↳ [`ChangeStreamUpdateDocument`](ChangeStreamUpdateDocument.md)

  ↳ [`ChangeStreamReplaceDocument`](ChangeStreamReplaceDocument.md)

  ↳ [`ChangeStreamDeleteDocument`](ChangeStreamDeleteDocument.md)

  ↳ [`ChangeStreamDropDocument`](ChangeStreamDropDocument.md)

  ↳ [`ChangeStreamRenameDocument`](ChangeStreamRenameDocument.md)

  ↳ [`ChangeStreamDropDatabaseDocument`](ChangeStreamDropDatabaseDocument.md)

  ↳ [`ChangeStreamInvalidateDocument`](ChangeStreamInvalidateDocument.md)

  ↳ [`ChangeStreamCreateIndexDocument`](ChangeStreamCreateIndexDocument.md)

  ↳ [`ChangeStreamCreateDocument`](ChangeStreamCreateDocument.md)

  ↳ [`ChangeStreamCollModDocument`](ChangeStreamCollModDocument.md)

  ↳ [`ChangeStreamDropIndexDocument`](ChangeStreamDropIndexDocument.md)

  ↳ [`ChangeStreamShardCollectionDocument`](ChangeStreamShardCollectionDocument.md)

  ↳ [`ChangeStreamReshardCollectionDocument`](ChangeStreamReshardCollectionDocument.md)

  ↳ [`ChangeStreamRefineCollectionShardKeyDocument`](ChangeStreamRefineCollectionShardKeyDocument.md)

## Properties

### \_id

 **\_id**: `unknown`

The id functions as an opaque token for use when resuming an interrupted
change stream.

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

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1017

___

### lsid

 `Optional` **lsid**: [`ServerSessionId`](../types/ServerSessionId.md)

The identifier for the session associated with the transaction.
Only present if the operation is part of a multi-document transaction.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1029

___

### txnNumber

 `Optional` **txnNumber**: `number`

The transaction number.
Only present if the operation is part of a multi-document transaction.

**NOTE:** txnNumber can be a Long if promoteLongs is set to false

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1024
