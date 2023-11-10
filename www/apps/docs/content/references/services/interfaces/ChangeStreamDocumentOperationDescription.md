# ChangeStreamDocumentOperationDescription

## Hierarchy

- **`ChangeStreamDocumentOperationDescription`**

  ↳ [`ChangeStreamCreateIndexDocument`](ChangeStreamCreateIndexDocument.md)

  ↳ [`ChangeStreamDropIndexDocument`](ChangeStreamDropIndexDocument.md)

  ↳ [`ChangeStreamShardCollectionDocument`](ChangeStreamShardCollectionDocument.md)

  ↳ [`ChangeStreamReshardCollectionDocument`](ChangeStreamReshardCollectionDocument.md)

  ↳ [`ChangeStreamRefineCollectionShardKeyDocument`](ChangeStreamRefineCollectionShardKeyDocument.md)

## Properties

### operationDescription

 `Optional` **operationDescription**: [`Document`](Document.md)

An description of the operation.

Only present when the `showExpandedEvents` flag is enabled.

**Since Server Version**

6.1.0

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1051
