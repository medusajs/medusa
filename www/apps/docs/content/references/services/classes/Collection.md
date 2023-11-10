# Collection

The **Collection** class is an internal class that embodies a MongoDB collection
allowing for insert/find/update/delete and other command operation on that MongoDB collection.

**COLLECTION Cannot directly be instantiated**

**Example**

```ts
import { MongoClient } from 'mongodb';

interface Pet {
  name: string;
  kind: 'dog' | 'cat' | 'fish';
}

const client = new MongoClient('mongodb://localhost:27017');
const pets = client.db().collection<Pet>('pets');

const petCursor = pets.find();

for await (const pet of petCursor) {
  console.log(`${pet.name} is a ${pet.kind}!`);
}
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) |

## Constructors

### constructor

**new Collection**<`TSchema`\>()

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) |

## Accessors

### bsonOptions

`get` **bsonOptions**(): [`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

#### Returns

[`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

-`BSONSerializeOptions`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1496

___

### collectionName

`get` **collectionName**(): `string`

The name of this collection

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1481

___

### dbName

`get` **dbName**(): `string`

The name of the database this collection belongs to

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1477

___

### hint

`get` **hint**(): `undefined` \| [`Hint`](../index.md#hint)

The current index hint for the collection

#### Returns

`undefined` \| [`Hint`](../index.md#hint)

-`undefined \| Hint`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1503

`set` **hint**(`v`): `void`

#### Parameters

| Name |
| :------ |
| `v` | `undefined` \| [`Hint`](../index.md#hint) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1504

___

### namespace

`get` **namespace**(): `string`

The namespace of this collection, in the format `${this.dbName}.${this.collectionName}`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1485

___

### readConcern

`get` **readConcern**(): `undefined` \| [`ReadConcern`](ReadConcern.md)

The current readConcern of the collection. If not explicitly defined for
this collection, will be inherited from the parent DB

#### Returns

`undefined` \| [`ReadConcern`](ReadConcern.md)

-`undefined \| ReadConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1490

___

### readPreference

`get` **readPreference**(): `undefined` \| [`ReadPreference`](ReadPreference.md)

The current readPreference of the collection. If not explicitly defined for
this collection, will be inherited from the parent DB

#### Returns

`undefined` \| [`ReadPreference`](ReadPreference.md)

-`undefined \| ReadPreference`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1495

___

### writeConcern

`get` **writeConcern**(): `undefined` \| [`WriteConcern`](WriteConcern.md)

The current writeConcern of the collection. If not explicitly defined for
this collection, will be inherited from the parent DB

#### Returns

`undefined` \| [`WriteConcern`](WriteConcern.md)

-`undefined \| WriteConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1501

## Methods

### aggregate

**aggregate**<`T`\>(`pipeline?`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`T`\>

Execute an aggregation framework pipeline against the collection, needs MongoDB \>= 2.2

| Name | Type |
| :------ | :------ |
| `T` | [`Document`](../interfaces/Document.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] | An array of aggregation pipelines to execute |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) | Optional settings for the command |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`T`\>

-`AggregationCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1816

___

### bulkWrite

**bulkWrite**(`operations`, `options?`): `Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

Perform a bulkWrite operation without a fluent API

Legal operation types are
- `insertOne`
- `replaceOne`
- `updateOne`
- `updateMany`
- `deleteOne`
- `deleteMany`

If documents passed in do not contain the **_id** field,
one will be added to each of the documents missing it by the driver, mutating the document. This behavior
can be overridden by setting the **forceServerObjectId** flag.

#### Parameters

| Name | Description |
| :------ | :------ |
| `operations` | [`AnyBulkWriteOperation`](../index.md#anybulkwriteoperation)<`TSchema`\>[] | Bulk operations to perform |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

-`Promise`: 
	-`BulkWriteResult`: 

**Throws**

MongoDriverError if operations is not an array

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1542

___

### count

**count**(`filter?`, `options?`): `Promise`<`number`\>

An estimated count of matching documents in the db to a filter.

**NOTE:** This method has been deprecated, since it does not provide an accurate count of the documents
in a collection. To obtain an accurate count of documents in the collection, use [countDocuments](Collection.md#countdocuments).
To obtain an estimated count of all documents in the collection, use [estimatedDocumentCount](Collection.md#estimateddocumentcount).

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter?` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter for the count. |
| `options?` | [`CountOptions`](../interfaces/CountOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

**Deprecated**

use [countDocuments](Collection.md#countdocuments) or [estimatedDocumentCount](Collection.md#estimateddocumentcount) instead

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1886

___

### countDocuments

**countDocuments**(`filter?`, `options?`): `Promise`<`number`\>

Gets the number of documents matching the filter.
For a fast count of the total documents in a collection see [estimatedDocumentCount](Collection.md#estimateddocumentcount).
**Note**: When migrating from [count](Collection.md#count) to [countDocuments](Collection.md#countdocuments)
the following query operators must be replaced:

| Operator | Replacement |
| -------- | ----------- |
| `$where`   | [`$expr`][1] |
| `$near`    | [`$geoWithin`][2] with [`$center`][3] |
| `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |

[1]: https://www.mongodb.com/docs/manual/reference/operator/query/expr/
[2]: https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
[3]: https://www.mongodb.com/docs/manual/reference/operator/query/center/#op._S_center
[4]: https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#op._S_centerSphere

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter?` | [`Document`](../interfaces/Document.md) | The filter for the count |
| `options?` | [`CountDocumentsOptions`](../interfaces/CountDocumentsOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

**See**

 - https://www.mongodb.com/docs/manual/reference/operator/query/expr/
 - https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
 - https://www.mongodb.com/docs/manual/reference/operator/query/center/#op._S_center
 - https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#op._S_centerSphere

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1761

___

### createIndex

**createIndex**(`indexSpec`, `options?`): `Promise`<`string`\>

Creates an index on the db and collection collection.

**Example**

```ts
const collection = client.db("foo").collection("bar")

await collection.createIndex({ a: 1, b: -1 })

// Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
await collection.createIndex([
  [c, 1],
  [d, -1],
])

// Equivalent to { e: 1 }
await collection.createIndex("e")

// Equivalent to { f: 1, g: 1 }
await collection.createIndex(["f", "g"])

// Equivalent to { h: 1, i: -1 }
await collection.createIndex([{ h: 1 }, { i: -1 }])

// Equivalent to { j: 1, k: -1, l: 2d }
await collection.createIndex(["j", ["k", -1], { l: "2d" }])
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexSpec` | [`IndexSpecification`](../index.md#indexspecification) | The field name or index specification to create an index for |
| `options?` | [`CreateIndexesOptions`](../interfaces/CreateIndexesOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1657

___

### createIndexes

**createIndexes**(`indexSpecs`, `options?`): `Promise`<`string`[]\>

Creates multiple indexes in the collection, this method is only supported for
MongoDB 2.6 or higher. Earlier version of MongoDB will throw a command not supported
error.

**Note**: Unlike [createIndex](Collection.md#createindex), this function takes in raw index specifications.
Index specifications are defined [here](https://www.mongodb.com/docs/manual/reference/command/createIndexes/|).

**Example**

```ts
const collection = client.db('foo').collection('bar');
await collection.createIndexes([
  // Simple index on field fizz
  {
    key: { fizz: 1 },
  }
  // wildcard index
  {
    key: { '$**': 1 }
  },
  // named index on darmok and jalad
  {
    key: { darmok: 1, jalad: -1 }
    name: 'tanagra'
  }
]);
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexSpecs` | [`IndexDescription`](../interfaces/IndexDescription.md)[] | An array of index specifications to be created |
| `options?` | [`CreateIndexesOptions`](../interfaces/CreateIndexesOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1689

___

### deleteMany

**deleteMany**(`filter?`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete multiple documents from a collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter?` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the documents to remove |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1580

___

### deleteOne

**deleteOne**(`filter?`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete a document from a collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter?` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the document to remove |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1573

___

### distinct

**distinct**<`Key`\>(`key`): `Promise`<[`Flatten`](../index.md#flatten)<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]\>

The distinct command returns a list of distinct values for the given key across a collection.

| Name | Type |
| :------ | :------ |
| `Key` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `key` | `Key` | Field of the document to find distinct values for |

#### Returns

`Promise`<[`Flatten`](../index.md#flatten)<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]\>

-`Promise`: 
	-`Flatten<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]`: 
		-`Flatten`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1769

**distinct**<`Key`\>(`key`, `filter`): `Promise`<[`Flatten`](../index.md#flatten)<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]\>

| Name | Type |
| :------ | :------ |
| `Key` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `key` | `Key` |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |

#### Returns

`Promise`<[`Flatten`](../index.md#flatten)<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]\>

-`Promise`: 
	-`Flatten<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]`: 
		-`Flatten`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1770

**distinct**<`Key`\>(`key`, `filter`, `options`): `Promise`<[`Flatten`](../index.md#flatten)<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]\>

| Name | Type |
| :------ | :------ |
| `Key` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `key` | `Key` |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |
| `options` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<[`Flatten`](../index.md#flatten)<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]\>

-`Promise`: 
	-`Flatten<[`WithId`](../index.md#withid)<`TSchema`\>[`Key`]\>[]`: 
		-`Flatten`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1771

**distinct**(`key`): `Promise`<`any`[]\>

#### Parameters

| Name |
| :------ |
| `key` | `string` |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1772

**distinct**(`key`, `filter`): `Promise`<`any`[]\>

#### Parameters

| Name |
| :------ |
| `key` | `string` |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1773

**distinct**(`key`, `filter`, `options`): `Promise`<`any`[]\>

#### Parameters

| Name |
| :------ |
| `key` | `string` |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |
| `options` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1774

___

### drop

**drop**(`options?`): `Promise`<`boolean`\>

Drop the collection from the database, removing it permanently. New accesses will create a new collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`DropCollectionOptions`](../interfaces/DropCollectionOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1596

___

### dropIndex

**dropIndex**(`indexName`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Drops an index from this collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | Name of the index to drop. |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1696

___

### dropIndexes

**dropIndexes**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Drops all indexes from this collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1702

___

### estimatedDocumentCount

**estimatedDocumentCount**(`options?`): `Promise`<`number`\>

Gets an estimate of the count of documents in a collection using collection metadata.
This will always run a count command on all server versions.

due to an oversight in versions 5.0.0-5.0.8 of MongoDB, the count command,
which estimatedDocumentCount uses in its implementation, was not included in v1 of
the Stable API, and so users of the Stable API with estimatedDocumentCount are
recommended to upgrade their server version to 5.0.9+ or set apiStrict: false to avoid
encountering errors.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`EstimatedDocumentCountOptions`](../interfaces/EstimatedDocumentCountOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

**See**

[Behavior](https://www.mongodb.com/docs/manual/reference/command/count/#behavior|Count:)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1735

___

### find

**find**(): [`FindCursor`](FindCursor.md)<[`WithId`](../index.md#withid)<`TSchema`\>\>

Creates a cursor for a filter that can be used to iterate over results from MongoDB

#### Returns

[`FindCursor`](FindCursor.md)<[`WithId`](../index.md#withid)<`TSchema`\>\>

-`FindCursor`: 
	-`WithId`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1614

**find**(`filter`, `options?`): [`FindCursor`](FindCursor.md)<[`WithId`](../index.md#withid)<`TSchema`\>\>

#### Parameters

| Name |
| :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |
| `options?` | [`FindOptions`](../interfaces/FindOptions.md)<[`Document`](../interfaces/Document.md)\> |

#### Returns

[`FindCursor`](FindCursor.md)<[`WithId`](../index.md#withid)<`TSchema`\>\>

-`FindCursor`: 
	-`WithId`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1615

**find**<`T`\>(`filter`, `options?`): [`FindCursor`](FindCursor.md)<`T`\>

| Name | Type |
| :------ | :------ |
| `T` | [`Document`](../interfaces/Document.md) |

#### Parameters

| Name |
| :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |
| `options?` | [`FindOptions`](../interfaces/FindOptions.md)<[`Document`](../interfaces/Document.md)\> |

#### Returns

[`FindCursor`](FindCursor.md)<`T`\>

-`FindCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1616

___

### findOne

**findOne**(): `Promise`<``null`` \| [`WithId`](../index.md#withid)<`TSchema`\>\>

Fetches the first document that matches the filter

#### Returns

`Promise`<``null`` \| [`WithId`](../index.md#withid)<`TSchema`\>\>

-`Promise`: 
	-```null`` \| WithId<TSchema\>`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1603

**findOne**(`filter`): `Promise`<``null`` \| [`WithId`](../index.md#withid)<`TSchema`\>\>

#### Parameters

| Name |
| :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |

#### Returns

`Promise`<``null`` \| [`WithId`](../index.md#withid)<`TSchema`\>\>

-`Promise`: 
	-```null`` \| WithId<TSchema\>`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1604

**findOne**(`filter`, `options`): `Promise`<``null`` \| [`WithId`](../index.md#withid)<`TSchema`\>\>

#### Parameters

| Name |
| :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |
| `options` | [`FindOptions`](../interfaces/FindOptions.md)<[`Document`](../interfaces/Document.md)\> |

#### Returns

`Promise`<``null`` \| [`WithId`](../index.md#withid)<`TSchema`\>\>

-`Promise`: 
	-```null`` \| WithId<TSchema\>`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1605

**findOne**<`T`\>(): `Promise`<``null`` \| `T`\>

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Returns

`Promise`<``null`` \| `T`\>

-`Promise`: 
	-```null`` \| T`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1606

**findOne**<`T`\>(`filter`): `Promise`<``null`` \| `T`\>

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |

#### Returns

`Promise`<``null`` \| `T`\>

-`Promise`: 
	-```null`` \| T`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1607

**findOne**<`T`\>(`filter`, `options?`): `Promise`<``null`` \| `T`\>

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> |
| `options?` | [`FindOptions`](../interfaces/FindOptions.md)<[`Document`](../interfaces/Document.md)\> |

#### Returns

`Promise`<``null`` \| `T`\>

-`Promise`: 
	-```null`` \| T`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1608

___

### findOneAndDelete

**findOneAndDelete**(`filter`, `options?`): `Promise`<[`ModifyResult`](../interfaces/ModifyResult.md)<`TSchema`\>\>

Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the document to remove |
| `options?` | [`FindOneAndDeleteOptions`](../interfaces/FindOneAndDeleteOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`ModifyResult`](../interfaces/ModifyResult.md)<`TSchema`\>\>

-`Promise`: 
	-`ModifyResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1793

___

### findOneAndReplace

**findOneAndReplace**(`filter`, `replacement`, `options?`): `Promise`<[`ModifyResult`](../interfaces/ModifyResult.md)<`TSchema`\>\>

Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the document to replace |
| `replacement` | [`WithoutId`](../index.md#withoutid)<`TSchema`\> | The Document that replaces the matching document |
| `options?` | [`FindOneAndReplaceOptions`](../interfaces/FindOneAndReplaceOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`ModifyResult`](../interfaces/ModifyResult.md)<`TSchema`\>\>

-`Promise`: 
	-`ModifyResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1801

___

### findOneAndUpdate

**findOneAndUpdate**(`filter`, `update`, `options?`): `Promise`<[`ModifyResult`](../interfaces/ModifyResult.md)<`TSchema`\>\>

Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the document to update |
| `update` | [`UpdateFilter`](../index.md#updatefilter)<`TSchema`\> | Update operations to be performed on the document |
| `options?` | [`FindOneAndUpdateOptions`](../interfaces/FindOneAndUpdateOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`ModifyResult`](../interfaces/ModifyResult.md)<`TSchema`\>\>

-`Promise`: 
	-`ModifyResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1809

___

### indexExists

**indexExists**(`indexes`, `options?`): `Promise`<`boolean`\>

Checks if one or more indexes exist on the collection, fails on first non-existing index

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexes` | `string` \| `string`[] | One or more index names to check. |
| `options?` | [`IndexInformationOptions`](../interfaces/IndexInformationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1715

___

### indexInformation

**indexInformation**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieves this collections index info.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`IndexInformationOptions`](../interfaces/IndexInformationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1721

___

### indexes

**indexes**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)[]\>

Retrieve all the indexes on the collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`IndexInformationOptions`](../interfaces/IndexInformationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)[]\>

-`Promise`: 
	-`Document[]`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1780

___

### initializeOrderedBulkOp

**initializeOrderedBulkOp**(`options?`): [`OrderedBulkOperation`](OrderedBulkOperation.md)

Initiate an In order bulk write operation. Operations will be serially executed in the order they are added, creating a new operation for each switch in types.

#### Parameters

| Name |
| :------ |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`OrderedBulkOperation`](OrderedBulkOperation.md)

-`OrderedBulkOperation`: 

**Throws**

MongoNotConnectedError

**Remarks**

**NOTE:** MongoClient must be connected prior to calling this method due to a known limitation in this legacy implementation.
However, `collection.bulkWrite()` provides an equivalent API that does not require prior connecting.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1873

___

### initializeUnorderedBulkOp

**initializeUnorderedBulkOp**(`options?`): [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

Initiate an Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.

#### Parameters

| Name |
| :------ |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`UnorderedBulkOperation`](UnorderedBulkOperation.md)

-`UnorderedBulkOperation`: 

**Throws**

MongoNotConnectedError

**Remarks**

**NOTE:** MongoClient must be connected prior to calling this method due to a known limitation in this legacy implementation.
However, `collection.bulkWrite()` provides an equivalent API that does not require prior connecting.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1864

___

### insertMany

**insertMany**(`docs`, `options?`): `Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<`TSchema`\>\>

Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
one will be added to each of the documents missing it by the driver, mutating the document. This behavior
can be overridden by setting the **forceServerObjectId** flag.

#### Parameters

| Name | Description |
| :------ | :------ |
| `docs` | [`OptionalUnlessRequiredId`](../index.md#optionalunlessrequiredid)<`TSchema`\>[] | The documents to insert |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<`TSchema`\>\>

-`Promise`: 
	-`InsertManyResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1522

___

### insertOne

**insertOne**(`doc`, `options?`): `Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<`TSchema`\>\>

Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
one will be added to each of the documents missing it by the driver, mutating the document. This behavior
can be overridden by setting the **forceServerObjectId** flag.

#### Parameters

| Name | Description |
| :------ | :------ |
| `doc` | [`OptionalUnlessRequiredId`](../index.md#optionalunlessrequiredid)<`TSchema`\> | The document to insert |
| `options?` | [`InsertOneOptions`](../interfaces/InsertOneOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<`TSchema`\>\>

-`Promise`: 
	-`InsertOneResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1513

___

### isCapped

**isCapped**(`options?`): `Promise`<`boolean`\>

Returns if the collection is a capped collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`OperationOptions`](../interfaces/OperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1628

___

### listIndexes

**listIndexes**(`options?`): [`ListIndexesCursor`](ListIndexesCursor.md)

Get the list of all indexes information for the collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`ListIndexesOptions`](../interfaces/ListIndexesOptions.md) | Optional settings for the command |

#### Returns

[`ListIndexesCursor`](ListIndexesCursor.md)

-`ListIndexesCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1708

___

### options

**options**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Returns the options of the collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`OperationOptions`](../interfaces/OperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1622

___

### rename

**rename**(`newName`, `options?`): `Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

Rename the collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `newName` | `string` | New name of of the collection. |
| `options?` | [`RenameOptions`](../interfaces/RenameOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`Collection`: 
		-`Document`: 

**Remarks**

This operation does not inherit options from the Db or MongoClient.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1590

___

### replaceOne

**replaceOne**(`filter`, `replacement`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Replace a document in a collection with another document

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the document to replace |
| `replacement` | [`WithoutId`](../index.md#withoutid)<`TSchema`\> | The Document that replaces the matching document |
| `options?` | [`ReplaceOptions`](../interfaces/ReplaceOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1558

___

### stats

**stats**(`options?`): `Promise`<[`CollStats`](../interfaces/CollStats.md)\>

Get all the collection statistics.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CollStatsOptions`](../interfaces/CollStatsOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`CollStats`](../interfaces/CollStats.md)\>

-`Promise`: 
	-`avgObjSize`: Average object size in bytes
	-`capped`: `true` if the collection is capped
	-`count`: Number of documents
	-`freeStorageSize`: (optional) The amount of storage available for reuse. The scale argument affects this value.
	-`indexBuilds`: (optional) An array that contains the names of the indexes that are currently being built on the collection
	-`indexDetails`: (optional) The fields in this document are the names of the indexes, while the values themselves are documents that contain statistics for the index provided by the storage engine
	-`indexSizes`: Size of specific indexes in bytes
		-`_id_`: 
	-`lastExtentSize`: Size of the most recently created extent in bytes
	-`max`: The maximum number of documents that may be present in a capped collection
	-`maxSize`: The maximum size of a capped collection
	-`nindexes`: Number of indexes
	-`ns`: Namespace
	-`numExtents`: Number of extents (contiguously allocated chunks of datafile space)
	-`ok`: 
	-`paddingFactor`: Padding can speed up updates if documents grow
	-`scaleFactor`: The scale value used by the command.
	-`size`: Collection size in bytes
	-`storageSize`: (Pre)allocated space for the collection in bytes
	-`totalIndexSize`: Total index size in bytes
	-`totalSize`: The sum of the storageSize and totalIndexSize. The scale argument affects this value
	-`userFlags`: (optional) A number that indicates the user-set flags on the collection. userFlags only appears when using the mmapv1 storage engine
	-`wiredTiger`: (optional) This document contains data reported directly by the WiredTiger engine and other data for internal diagnostic use
		-`LSM`: 
		-`block-manager`: 
		-`btree`: 
		-`cache`: 
		-`cache_walk`: 
		-`compression`: 
		-`cursor`: 
		-`reconciliation`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1786

___

### updateMany

**updateMany**(`filter`, `update`, `options?`): `Promise`<[`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update multiple documents in a collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the documents to update |
| `update` | [`UpdateFilter`](../index.md#updatefilter)<`TSchema`\> | The update operations to be applied to the documents |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined
	-`matchedCount`: The number of documents that matched the filter
	-`modifiedCount`: The number of documents that were modified
	-`upsertedCount`: The number of documents that were upserted
	-`upsertedId`: The identifier of the inserted document if an upsert took place
		-`cacheHexString`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1566

___

### updateOne

**updateOne**(`filter`, `update`, `options?`): `Promise`<[`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update a single document in a collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Filter`](../index.md#filter)<`TSchema`\> | The filter used to select the document to update |
| `update` | [`UpdateFilter`](../index.md#updatefilter)<`TSchema`\> \| [`Partial`](../index.md#partial)<`TSchema`\> | The update operations to be applied to the document |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined
	-`matchedCount`: The number of documents that matched the filter
	-`modifiedCount`: The number of documents that were modified
	-`upsertedCount`: The number of documents that were upserted
	-`upsertedId`: The identifier of the inserted document if an upsert took place
		-`cacheHexString`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1550

___

### watch

**watch**<`TLocal`, `TChange`\>(`pipeline?`, `options?`): [`ChangeStream`](ChangeStream.md)<`TLocal`, `TChange`\>

Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.

| Name | Type | Description |
| :------ | :------ | :------ |
| `TLocal` | [`Document`](../interfaces/Document.md) | Type of the data being detected by the change stream |
| `TChange` | [`Document`](../interfaces/Document.md) | Type of the whole change stream document emitted |

**Example**

By just providing the first argument I can type the change to be `ChangeStreamDocument<{ _id: number }>`
```ts
collection.watch<{ _id: number }>()
  .on('change', change => console.log(change._id.toFixed(4)));
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] | An array of [pipeline stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/\|aggregation) through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents. |
| `options?` | [`ChangeStreamOptions`](../interfaces/ChangeStreamOptions.md) | Optional settings for the command |

#### Returns

[`ChangeStream`](ChangeStream.md)<`TLocal`, `TChange`\>

-`ChangeStream`: 

**Remarks**

watch() accepts two generic arguments for distinct use cases:
- The first is to override the schema that may be defined for this specific collection
- The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1855
