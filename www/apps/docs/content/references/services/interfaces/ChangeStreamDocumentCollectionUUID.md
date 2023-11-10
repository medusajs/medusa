# ChangeStreamDocumentCollectionUUID

## Hierarchy

- **`ChangeStreamDocumentCollectionUUID`**

  ↳ [`ChangeStreamInsertDocument`](ChangeStreamInsertDocument.md)

  ↳ [`ChangeStreamUpdateDocument`](ChangeStreamUpdateDocument.md)

  ↳ [`ChangeStreamDeleteDocument`](ChangeStreamDeleteDocument.md)

  ↳ [`ChangeStreamDropDocument`](ChangeStreamDropDocument.md)

  ↳ [`ChangeStreamRenameDocument`](ChangeStreamRenameDocument.md)

  ↳ [`ChangeStreamCreateIndexDocument`](ChangeStreamCreateIndexDocument.md)

  ↳ [`ChangeStreamCreateDocument`](ChangeStreamCreateDocument.md)

  ↳ [`ChangeStreamCollModDocument`](ChangeStreamCollModDocument.md)

  ↳ [`ChangeStreamDropIndexDocument`](ChangeStreamDropIndexDocument.md)

  ↳ [`ChangeStreamShardCollectionDocument`](ChangeStreamShardCollectionDocument.md)

  ↳ [`ChangeStreamReshardCollectionDocument`](ChangeStreamReshardCollectionDocument.md)

  ↳ [`ChangeStreamRefineCollectionShardKeyDocument`](ChangeStreamRefineCollectionShardKeyDocument.md)

## Properties

### collectionUUID

 **collectionUUID**: [`Binary`](../classes/Binary.md)

The UUID (Binary subtype 4) of the collection that the operation was performed on.

Only present when the `showExpandedEvents` flag is enabled.

**NOTE:** collectionUUID will be converted to a NodeJS Buffer if the promoteBuffers
   flag is enabled.

**Since Server Version**

6.1.0

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1000
