# BulkOperationBase

## Hierarchy

- **`BulkOperationBase`**

  ↳ [`OrderedBulkOperation`](OrderedBulkOperation.md)

  ↳ [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

## Constructors

### constructor

**new BulkOperationBase**()

## Properties

### isOrdered

 **isOrdered**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:724

___

### operationId

 `Optional` **operationId**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:725

## Accessors

### batches

`get` **batches**(): [`Batch`](Batch.md)<[`Document`](../interfaces/Document.md)\>[]

#### Returns

[`Batch`](Batch.md)<[`Document`](../interfaces/Document.md)\>[]

-`Batch<Document\>[]`: 
	-`Batch`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:782

___

### bsonOptions

`get` **bsonOptions**(): [`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

#### Returns

[`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

-`BSONSerializeOptions`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:780

___

### writeConcern

`get` **writeConcern**(): `undefined` \| [`WriteConcern`](WriteConcern.md)

#### Returns

`undefined` \| [`WriteConcern`](WriteConcern.md)

-`undefined \| WriteConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:781

## Methods

### addToOperationsList

`Abstract` **addToOperationsList**(`batchType`, `document`): [`BulkOperationBase`](BulkOperationBase.md)

#### Parameters

| Name |
| :------ |
| `batchType` | [`BatchType`](../index.md#batchtype-1) |
| `document` | [`Document`](../interfaces/Document.md) \| [`UpdateStatement`](../interfaces/UpdateStatement.md) \| [`DeleteStatement`](../interfaces/DeleteStatement.md) |

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:784

___

### execute

**execute**(`options?`): `Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

#### Parameters

| Name |
| :------ |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

-`Promise`: 
	-`BulkWriteResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:783

___

### find

**find**(`selector`): [`FindOperators`](FindOperators.md)

Builds a find operation for an update/updateOne/delete/deleteOne/replaceOne.
Returns a builder object used to complete the definition of the operation.

**Example**

```ts
const bulkOp = collection.initializeOrderedBulkOp()

// Add an updateOne to the bulkOp
bulkOp.find({ a: 1 }).updateOne({ $set: { b: 2 } })

// Add an updateMany to the bulkOp
bulkOp.find({ c: 3 }).update({ $set: { d: 4 } })

// Add an upsert
bulkOp
  .find({ e: 5 })
  .upsert()
  .updateOne({ $set: { f: 6 } })

// Add a deletion
bulkOp.find({ g: 7 }).deleteOne()

// Add a multi deletion
bulkOp.find({ h: 8 }).delete()

// Add a replaceOne
bulkOp.find({ i: 9 }).replaceOne({ writeConcern: { j: 10 } })

// Update using a pipeline (requires Mongodb 4.2 or higher)
bulk
  .find({ k: 11, y: { $exists: true }, z: { $exists: true } })
  .updateOne([{ $set: { total: { $sum: ["$y", "$z"] } } }])

// All of the ops will now be executed
await bulkOp.execute()
```

#### Parameters

| Name |
| :------ |
| `selector` | [`Document`](../interfaces/Document.md) |

#### Returns

[`FindOperators`](FindOperators.md)

-`FindOperators`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:777

___

### insert

**insert**(`document`): [`BulkOperationBase`](BulkOperationBase.md)

Add a single insert document to the bulk operation

**Example**

```ts
const bulkOp = collection.initializeOrderedBulkOp()

// Adds three inserts to the bulkOp.
bulkOp.insert({ a: 1 }).insert({ b: 2 }).insert({ c: 3 })
await bulkOp.execute()
```

#### Parameters

| Name |
| :------ |
| `document` | [`Document`](../interfaces/Document.md) |

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:741

___

### raw

**raw**(`op`): [`BulkOperationBase`](BulkOperationBase.md)

Specifies a raw operation to perform in the bulk write.

#### Parameters

| Name |
| :------ |
| `op` | [`AnyBulkWriteOperation`](../index.md#anybulkwriteoperation)<[`Document`](../interfaces/Document.md)\> |

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:779
