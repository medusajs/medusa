# UnorderedBulkOperation

## Hierarchy

- [`BulkOperationBase`](BulkOperationBase.md)

  ↳ **`UnorderedBulkOperation`**

## Constructors

### constructor

**new UnorderedBulkOperation**()

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[constructor](BulkOperationBase.md#constructor)

## Properties

### isOrdered

 **isOrdered**: `boolean`

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[isOrdered](BulkOperationBase.md#isordered)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:724

___

### operationId

 `Optional` **operationId**: `number`

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[operationId](BulkOperationBase.md#operationid)

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

#### Inherited from

BulkOperationBase.batches

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:782

___

### bsonOptions

`get` **bsonOptions**(): [`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

#### Returns

[`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

-`BSONSerializeOptions`: 

#### Inherited from

BulkOperationBase.bsonOptions

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:780

___

### writeConcern

`get` **writeConcern**(): `undefined` \| [`WriteConcern`](WriteConcern.md)

#### Returns

`undefined` \| [`WriteConcern`](WriteConcern.md)

-`undefined \| WriteConcern`: (optional) 

#### Inherited from

BulkOperationBase.writeConcern

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:781

## Methods

### addToOperationsList

**addToOperationsList**(`batchType`, `document`): [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

#### Parameters

| Name |
| :------ |
| `batchType` | [`BatchType`](../index.md#batchtype) |
| `document` | [`Document`](../interfaces/Document.md) \| [`UpdateStatement`](../interfaces/UpdateStatement.md) \| [`DeleteStatement`](../interfaces/DeleteStatement.md) |

#### Returns

[`UnorderedBulkOperation`](UnorderedBulkOperation.md)

-`UnorderedBulkOperation`: 

#### Overrides

[BulkOperationBase](BulkOperationBase.md).[addToOperationsList](BulkOperationBase.md#addtooperationslist)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5124

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

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[execute](BulkOperationBase.md#execute)

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

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[find](BulkOperationBase.md#find)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:777

___

### handleWriteError

**handleWriteError**(`callback`, `writeResult`): `boolean`

#### Parameters

| Name |
| :------ |
| `callback` | [`Callback`](../types/Callback.md)<`any`\> |
| `writeResult` | [`BulkWriteResult`](BulkWriteResult.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5123

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

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[insert](BulkOperationBase.md#insert)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:741

___

### raw

**raw**(`op`): [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

Specifies a raw operation to perform in the bulk write.

#### Parameters

| Name |
| :------ |
| `op` | [`AnyBulkWriteOperation`](../types/AnyBulkWriteOperation.md)<[`Document`](../interfaces/Document.md)\> |

#### Returns

[`UnorderedBulkOperation`](UnorderedBulkOperation.md)

-`UnorderedBulkOperation`: 

#### Inherited from

[BulkOperationBase](BulkOperationBase.md).[raw](BulkOperationBase.md#raw)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:779
