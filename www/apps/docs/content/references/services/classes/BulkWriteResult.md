# BulkWriteResult

The result of a bulk write.

## Constructors

### constructor

**new BulkWriteResult**()

## Properties

### deletedCount

 `Readonly` **deletedCount**: `number`

Number of documents deleted.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:818

___

### insertedCount

 `Readonly` **insertedCount**: `number`

Number of documents inserted.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:812

___

### insertedIds

 `Readonly` **insertedIds**: `object`

Inserted document generated Id's, hash key is the index of the originating operation

#### Index signature

▪ [key: `number`]: `any`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:826

___

### matchedCount

 `Readonly` **matchedCount**: `number`

Number of documents matched for update.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:814

___

### modifiedCount

 `Readonly` **modifiedCount**: `number`

Number of documents modified.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:816

___

### result

 `Private` `Readonly` **result**: `any`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:810

___

### upsertedCount

 `Readonly` **upsertedCount**: `number`

Number of documents upserted.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:820

___

### upsertedIds

 `Readonly` **upsertedIds**: `object`

Upserted document generated Id's, hash key is the index of the originating operation

#### Index signature

▪ [key: `number`]: `any`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:822

___

### generateIdMap

 `Static` `Private` **generateIdMap**: `any`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:829

## Accessors

### nInserted

`get` **nInserted**(): `number`

The number of inserted documents

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:833

___

### nMatched

`get` **nMatched**(): `number`

Number of matched documents

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:837

___

### nModified

`get` **nModified**(): `number`

Number of documents updated physically on disk

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:839

___

### nRemoved

`get` **nRemoved**(): `number`

Number of removed documents

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:841

___

### nUpserted

`get` **nUpserted**(): `number`

Number of upserted documents

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:835

___

### ok

`get` **ok**(): `number`

Evaluates to true if the bulk operation correctly executes

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:831

## Methods

### getInsertedIds

**getInsertedIds**(): [`Document`](../interfaces/Document.md)[]

Returns an array of all inserted ids

#### Returns

[`Document`](../interfaces/Document.md)[]

-`Document[]`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:843

___

### getRawResponse

**getRawResponse**(): [`Document`](../interfaces/Document.md)

Returns raw internal result

#### Returns

[`Document`](../interfaces/Document.md)

-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:849

___

### getUpsertedIdAt

**getUpsertedIdAt**(`index`): `undefined` \| [`Document`](../interfaces/Document.md)

Returns the upserted id at the given index

#### Parameters

| Name |
| :------ |
| `index` | `number` |

#### Returns

`undefined` \| [`Document`](../interfaces/Document.md)

-`undefined \| Document`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:847

___

### getUpsertedIds

**getUpsertedIds**(): [`Document`](../interfaces/Document.md)[]

Returns an array of all upserted ids

#### Returns

[`Document`](../interfaces/Document.md)[]

-`Document[]`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:845

___

### getWriteConcernError

**getWriteConcernError**(): `undefined` \| [`WriteConcernError`](WriteConcernError.md)

Retrieve the write concern error if one exists

#### Returns

`undefined` \| [`WriteConcernError`](WriteConcernError.md)

-`undefined \| WriteConcernError`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:859

___

### getWriteErrorAt

**getWriteErrorAt**(`index`): `undefined` \| [`WriteError`](WriteError.md)

Returns a specific write error object

#### Parameters

| Name |
| :------ |
| `index` | `number` |

#### Returns

`undefined` \| [`WriteError`](WriteError.md)

-`undefined \| WriteError`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:855

___

### getWriteErrorCount

**getWriteErrorCount**(): `number`

Returns the number of write errors off the bulk operation

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:853

___

### getWriteErrors

**getWriteErrors**(): [`WriteError`](WriteError.md)[]

Retrieve all write errors

#### Returns

[`WriteError`](WriteError.md)[]

-`WriteError[]`: 
	-`WriteError`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:857

___

### hasWriteErrors

**hasWriteErrors**(): `boolean`

Returns true if the bulk operation contains a write error

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:851

___

### isOk

**isOk**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:861

___

### toString

**toString**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:860
