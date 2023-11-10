# Db

The **Db** class is a class that represents a MongoDB Database.

**Example**

```ts
import { MongoClient } from 'mongodb';

interface Pet {
  name: string;
  kind: 'dog' | 'cat' | 'fish';
}

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db();

// Create a collection that validates our union
await db.createCollection<Pet>('pets', {
  validator: { $expr: { $in: ['$kind', ['dog', 'cat', 'fish']] } }
})
```

## Constructors

### constructor

**new Db**(`client`, `databaseName`, `options?`)

Creates a new Db instance

#### Parameters

| Name | Description |
| :------ | :------ |
| `client` | [`MongoClient`](MongoClient.md) | The MongoClient for the database. |
| `databaseName` | `string` | The name of the database this instance represents. |
| `options?` | [`DbOptions`](../interfaces/DbOptions.md) | Optional settings for Db construction |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2365

## Properties

### SYSTEM\_COMMAND\_COLLECTION

 `Static` **SYSTEM\_COMMAND\_COLLECTION**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2356

___

### SYSTEM\_INDEX\_COLLECTION

 `Static` **SYSTEM\_INDEX\_COLLECTION**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2353

___

### SYSTEM\_JS\_COLLECTION

 `Static` **SYSTEM\_JS\_COLLECTION**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2357

___

### SYSTEM\_NAMESPACE\_COLLECTION

 `Static` **SYSTEM\_NAMESPACE\_COLLECTION**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2352

___

### SYSTEM\_PROFILE\_COLLECTION

 `Static` **SYSTEM\_PROFILE\_COLLECTION**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2354

___

### SYSTEM\_USER\_COLLECTION

 `Static` **SYSTEM\_USER\_COLLECTION**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2355

## Accessors

### bsonOptions

`get` **bsonOptions**(): [`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

#### Returns

[`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

-`BSONSerializeOptions`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2378

___

### databaseName

`get` **databaseName**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2366

___

### namespace

`get` **namespace**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2380

___

### options

`get` **options**(): `undefined` \| [`DbOptions`](../interfaces/DbOptions.md)

#### Returns

`undefined` \| [`DbOptions`](../interfaces/DbOptions.md)

-`undefined \| DbOptions`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2367

___

### readConcern

`get` **readConcern**(): `undefined` \| [`ReadConcern`](ReadConcern.md)

#### Returns

`undefined` \| [`ReadConcern`](ReadConcern.md)

-`undefined \| ReadConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2372

___

### readPreference

`get` **readPreference**(): [`ReadPreference`](ReadPreference.md)

The current readPreference of the Db. If not explicitly defined for
this Db, will be inherited from the parent MongoClient

#### Returns

[`ReadPreference`](ReadPreference.md)

-`ReadPreference`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2377

___

### secondaryOk

`get` **secondaryOk**(): `boolean`

Check if a secondary can be used (because the read preference is *not* set to primary)

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2371

___

### writeConcern

`get` **writeConcern**(): `undefined` \| [`WriteConcern`](WriteConcern.md)

#### Returns

`undefined` \| [`WriteConcern`](WriteConcern.md)

-`undefined \| WriteConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2379

## Methods

### addUser

**addUser**(`username`, `passwordOrOptions?`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Add a user to the database

#### Parameters

| Name | Description |
| :------ | :------ |
| `username` | `string` | The username for the new user |
| `passwordOrOptions?` | `string` \| [`AddUserOptions`](../interfaces/AddUserOptions.md) | An optional password for the new user, or the options for the command |
| `options?` | [`AddUserOptions`](../interfaces/AddUserOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2479

___

### admin

**admin**(): [`Admin`](Admin.md)

Return the Admin db instance

#### Returns

[`Admin`](Admin.md)

-`Admin`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2407

___

### aggregate

**aggregate**<`T`\>(`pipeline?`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`T`\>

Execute an aggregation framework pipeline against the database, needs MongoDB \>= 3.6

| Name | Type |
| :------ | :------ |
| `T` | [`Document`](../interfaces/Document.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] | An array of aggregation stages to be executed |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) | Optional settings for the command |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`T`\>

-`AggregationCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2405

___

### collection

**collection**<`TSchema`\>(`name`, `options?`): [`Collection`](Collection.md)<`TSchema`\>

Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | the collection name we wish to access. |
| `options?` | [`CollectionOptions`](../interfaces/CollectionOptions.md) |

#### Returns

[`Collection`](Collection.md)<`TSchema`\>

-`Collection`: return the new Collection instance

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2414

___

### collections

**collections**(`options?`): `Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>[]\>

Fetch all collections for the current db.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`ListCollectionsOptions`](../interfaces/ListCollectionsOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>[]\>

-`Promise`: 
	-`Collection<Document\>[]`: 
		-`Collection`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2463

___

### command

**command**(`command`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Execute a command

#### Parameters

| Name | Description |
| :------ | :------ |
| `command` | [`Document`](../interfaces/Document.md) | The command to run |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

**Remarks**

This command does not inherit options from the MongoClient.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2398

___

### createCollection

**createCollection**<`TSchema`\>(`name`, `options?`): `Promise`<[`Collection`](Collection.md)<`TSchema`\>\>

Create a new collection on a server with the specified options. Use this to create capped collections.
More information about command options available at https://www.mongodb.com/docs/manual/reference/command/create/

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | The name of the collection to create |
| `options?` | [`CreateCollectionOptions`](../interfaces/CreateCollectionOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Collection`](Collection.md)<`TSchema`\>\>

-`Promise`: 
	-`Collection`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2388

___

### createIndex

**createIndex**(`name`, `indexSpec`, `options?`): `Promise`<`string`\>

Creates an index on the db and collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | Name of the collection to create the index on. |
| `indexSpec` | [`IndexSpecification`](../index.md#indexspecification) | Specify the field to index, or an index specification |
| `options?` | [`CreateIndexesOptions`](../interfaces/CreateIndexesOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2471

___

### dropCollection

**dropCollection**(`name`, `options?`): `Promise`<`boolean`\>

Drop a collection from the database, removing it permanently. New accesses will create a new collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | Name of collection to drop |
| `options?` | [`DropCollectionOptions`](../interfaces/DropCollectionOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2451

___

### dropDatabase

**dropDatabase**(`options?`): `Promise`<`boolean`\>

Drop a database, removing it permanently from the server.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2457

___

### indexInformation

**indexInformation**(`name`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieves this collections index info.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | The name of the collection. |
| `options?` | [`IndexInformationOptions`](../interfaces/IndexInformationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2506

___

### listCollections

**listCollections**(`filter`, `options`): [`ListCollectionsCursor`](ListCollectionsCursor.md)<[`Pick`](../index.md#pick)<[`CollectionInfo`](../interfaces/CollectionInfo.md), ``"name"`` \| ``"type"``\>\>

List all collections of this database with optional filter

#### Parameters

| Name | Description |
| :------ | :------ |
| `filter` | [`Document`](../interfaces/Document.md) | Query to filter collections by |
| `options` | [`ListCollectionsOptions`](../interfaces/ListCollectionsOptions.md) & { `nameOnly`: ``true``  } | Optional settings for the command |

#### Returns

[`ListCollectionsCursor`](ListCollectionsCursor.md)<[`Pick`](../index.md#pick)<[`CollectionInfo`](../interfaces/CollectionInfo.md), ``"name"`` \| ``"type"``\>\>

-`ListCollectionsCursor`: 
	-`Pick`: 
		-`idIndex`: (optional) 
		-`info`: (optional) 
		-`name`: 
		-`options`: (optional) 
		-`type`: (optional) 
		-```"name"`` \| ``"type"```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2427

**listCollections**(`filter`, `options`): [`ListCollectionsCursor`](ListCollectionsCursor.md)<[`CollectionInfo`](../interfaces/CollectionInfo.md)\>

#### Parameters

| Name |
| :------ |
| `filter` | [`Document`](../interfaces/Document.md) |
| `options` | [`ListCollectionsOptions`](../interfaces/ListCollectionsOptions.md) & { `nameOnly`: ``false``  } |

#### Returns

[`ListCollectionsCursor`](ListCollectionsCursor.md)<[`CollectionInfo`](../interfaces/CollectionInfo.md)\>

-`ListCollectionsCursor`: 
	-`idIndex`: (optional) 
	-`info`: (optional) 
		-`readOnly`: (optional) 
		-`uuid`: (optional) 
	-`name`: 
	-`options`: (optional) 
	-`type`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2430

**listCollections**<`T`\>(`filter?`, `options?`): [`ListCollectionsCursor`](ListCollectionsCursor.md)<`T`\>

| Name | Type |
| :------ | :------ |
| `T` | [`CollectionInfo`](../interfaces/CollectionInfo.md) \| [`Pick`](../index.md#pick)<[`CollectionInfo`](../interfaces/CollectionInfo.md), ``"name"`` \| ``"type"``\> |

#### Parameters

| Name |
| :------ |
| `filter?` | [`Document`](../interfaces/Document.md) |
| `options?` | [`ListCollectionsOptions`](../interfaces/ListCollectionsOptions.md) |

#### Returns

[`ListCollectionsCursor`](ListCollectionsCursor.md)<`T`\>

-`ListCollectionsCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2433

___

### profilingLevel

**profilingLevel**(`options?`): `Promise`<`string`\>

Retrieve the current profiling Level for MongoDB

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2499

___

### removeUser

**removeUser**(`username`, `options?`): `Promise`<`boolean`\>

Remove a user from a database

#### Parameters

| Name | Description |
| :------ | :------ |
| `username` | `string` | The username to remove |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2486

___

### renameCollection

**renameCollection**<`TSchema`\>(`fromCollection`, `toCollection`, `options?`): `Promise`<[`Collection`](Collection.md)<`TSchema`\>\>

Rename a collection.

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `fromCollection` | `string` | Name of current collection to rename |
| `toCollection` | `string` | New name of of the collection |
| `options?` | [`RenameOptions`](../interfaces/RenameOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Collection`](Collection.md)<`TSchema`\>\>

-`Promise`: 
	-`Collection`: 

**Remarks**

This operation does not inherit options from the MongoClient.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2444

___

### setProfilingLevel

**setProfilingLevel**(`level`, `options?`): `Promise`<[`ProfilingLevel`](../index.md#profilinglevel-1)\>

Set the current profiling level of MongoDB

#### Parameters

| Name | Description |
| :------ | :------ |
| `level` | [`ProfilingLevel`](../index.md#profilinglevel-1) | The new profiling level (off, slow_only, all). |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`ProfilingLevel`](../index.md#profilinglevel-1)\>

-`Promise`: 
	-`ProfilingLevel`: 
		-`all`: 
		-`off`: 
		-`slowOnly`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2493

___

### stats

**stats**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Get all the db statistics.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`DbStatsOptions`](../interfaces/DbStatsOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2420

___

### watch

**watch**<`TSchema`, `TChange`\>(`pipeline?`, `options?`): [`ChangeStream`](ChangeStream.md)<`TSchema`, `TChange`\>

Create a new Change Stream, watching for new changes (insertions, updates,
replacements, deletions, and invalidations) in this database. Will ignore all
changes to system collections.

| Name | Type | Description |
| :------ | :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) | Type of the data being detected by the change stream |
| `TChange` | [`Document`](../interfaces/Document.md) | Type of the whole change stream document emitted |

#### Parameters

| Name | Description |
| :------ | :------ |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] | An array of [pipeline stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/\|aggregation) through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents. |
| `options?` | [`ChangeStreamOptions`](../interfaces/ChangeStreamOptions.md) | Optional settings for the command |

#### Returns

[`ChangeStream`](ChangeStream.md)<`TSchema`, `TChange`\>

-`ChangeStream`: 

**Remarks**

watch() accepts two generic arguments for distinct use cases:
- The first is to provide the schema that may be defined for all the collections within this database
- The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2522
