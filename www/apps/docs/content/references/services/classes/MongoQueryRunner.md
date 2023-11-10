# MongoQueryRunner

Runs queries on a single MongoDB connection.

## Implements

- [`QueryRunner`](../interfaces/QueryRunner.md)

## Constructors

### constructor

**new MongoQueryRunner**(`connection`, `databaseConnection`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |
| `databaseConnection` | [`MongoClient`](MongoClient.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:62

## Properties

### broadcaster

 **broadcaster**: [`Broadcaster`](Broadcaster.md)

Broadcaster used on this query runner to broadcast entity events.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[broadcaster](../interfaces/QueryRunner.md#broadcaster)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:29

___

### connection

 **connection**: [`DataSource`](DataSource.md)

Connection used by this query runner.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[connection](../interfaces/QueryRunner.md#connection)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:25

___

### data

 **data**: `object`

Stores temporarily user data.
Useful for sharing data with subscribers.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[data](../interfaces/QueryRunner.md#data)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:49

___

### databaseConnection

 **databaseConnection**: [`MongoClient`](MongoClient.md)

Real database connection from a connection pool used to perform queries.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:61

___

### isReleased

 **isReleased**: `boolean`

Indicates if connection for this query runner is released.
Once its released, query runner cannot run queries anymore.
Always false for mongodb since mongodb has a single query executor instance.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[isReleased](../interfaces/QueryRunner.md#isreleased)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:39

___

### isTransactionActive

 **isTransactionActive**: `boolean`

Indicates if transaction is active in this query executor.
Always false for mongodb since mongodb does not support transactions.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[isTransactionActive](../interfaces/QueryRunner.md#istransactionactive)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:44

___

### loadedTables

 **loadedTables**: [`Table`](Table.md)[]

All synchronized tables in the database.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[loadedTables](../interfaces/QueryRunner.md#loadedtables)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:53

___

### loadedViews

 **loadedViews**: [`View`](View.md)[]

All synchronized views in the database.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[loadedViews](../interfaces/QueryRunner.md#loadedviews)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:57

___

### manager

 **manager**: [`MongoEntityManager`](MongoEntityManager.md)

Entity manager working only with current query runner.

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[manager](../interfaces/QueryRunner.md#manager)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:33

## Methods

### addColumn

**addColumn**(`tableOrName`, `column`): `Promise`<`void`\>

Creates a new column from the column in the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[addColumn](../interfaces/QueryRunner.md#addcolumn)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:348

___

### addColumns

**addColumns**(`tableOrName`, `columns`): `Promise`<`void`\>

Creates a new columns from the column in the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `columns` | [`TableColumn`](TableColumn.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[addColumns](../interfaces/QueryRunner.md#addcolumns)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:352

___

### afterMigration

**afterMigration**(): `Promise`<`void`\>

Called after migrations are run.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[afterMigration](../interfaces/QueryRunner.md#aftermigration)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:70

___

### aggregate

**aggregate**(`collectionName`, `pipeline`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`any`\>

Execute an aggregation framework pipeline against the collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `pipeline` | [`Document`](../interfaces/Document.md)[] |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`any`\>

-`AggregationCursor`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:78

___

### beforeMigration

**beforeMigration**(): `Promise`<`void`\>

Called before migrations are run.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[beforeMigration](../interfaces/QueryRunner.md#beforemigration)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:66

___

### bulkWrite

**bulkWrite**(`collectionName`, `operations`, `options?`): `Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

Perform a bulkWrite operation without a fluent API.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `operations` | [`AnyBulkWriteOperation`](../index.md#anybulkwriteoperation)<[`Document`](../interfaces/Document.md)\>[] |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

-`Promise`: 
	-`BulkWriteResult`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:82

___

### changeColumn

**changeColumn**(`tableOrName`, `oldTableColumnOrName`, `newColumn`): `Promise`<`void`\>

Changes a column in the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `oldTableColumnOrName` | `string` \| [`TableColumn`](TableColumn.md) |
| `newColumn` | [`TableColumn`](TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[changeColumn](../interfaces/QueryRunner.md#changecolumn)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:360

___

### changeColumns

**changeColumns**(`tableOrName`, `changedColumns`): `Promise`<`void`\>

Changes a column in the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `changedColumns` | { `newColumn`: [`TableColumn`](TableColumn.md) ; `oldColumn`: [`TableColumn`](TableColumn.md)  }[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[changeColumns](../interfaces/QueryRunner.md#changecolumns)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:364

___

### clearDatabase

**clearDatabase**(): `Promise`<`void`\>

Removes all collections from the currently connected database.
Be careful with using this method and avoid using it in production or migrations
(because it can clear all your database).

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[clearDatabase](../interfaces/QueryRunner.md#cleardatabase)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:197

___

### clearSqlMemory

**clearSqlMemory**(): `void`

Flushes all memorized sqls.

#### Returns

`void`

-`void`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[clearSqlMemory](../interfaces/QueryRunner.md#clearsqlmemory)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:488

___

### clearTable

**clearTable**(`collectionName`): `Promise`<`void`\>

Drops collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[clearTable](../interfaces/QueryRunner.md#cleartable)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:471

___

### collectionIndexExists

**collectionIndexExists**(`collectionName`, `indexes`): `Promise`<`boolean`\>

Retrieve all the indexes on the collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `indexes` | `string` \| `string`[] |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:139

___

### collectionIndexInformation

**collectionIndexInformation**(`collectionName`, `options?`): `Promise`<`any`\>

Retrieves this collections index info.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `options?` | [`IndexInformationOptions`](../interfaces/IndexInformationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:143

___

### collectionIndexes

**collectionIndexes**(`collectionName`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieve all the indexes on the collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:135

___

### commitTransaction

**commitTransaction**(): `Promise`<`void`\>

Commits transaction.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[commitTransaction](../interfaces/QueryRunner.md#committransaction)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:213

___

### connect

**connect**(): `Promise`<`any`\>

For MongoDB database we don't create connection, because its single connection already created by a driver.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[connect](../interfaces/QueryRunner.md#connect)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:201

___

### count

**count**(`collectionName`, `filter`, `options?`): `Promise`<`number`\>

Count number of matching documents in the db to a query.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`CountOptions`](../interfaces/CountOptions.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:86

___

### countDocuments

**countDocuments**(`collectionName`, `filter`, `options?`): `Promise`<`any`\>

Count number of matching documents in the db to a query.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`CountDocumentsOptions`](../interfaces/CountDocumentsOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:90

___

### createCheckConstraint

**createCheckConstraint**(`tableOrName`, `checkConstraint`): `Promise`<`void`\>

Creates a new check constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `checkConstraint` | [`TableCheck`](TableCheck.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createCheckConstraint](../interfaces/QueryRunner.md#createcheckconstraint)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:407

___

### createCheckConstraints

**createCheckConstraints**(`tableOrName`, `checkConstraints`): `Promise`<`void`\>

Creates a new check constraints.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `checkConstraints` | [`TableCheck`](TableCheck.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createCheckConstraints](../interfaces/QueryRunner.md#createcheckconstraints)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:411

___

### createCollectionIndex

**createCollectionIndex**(`collectionName`, `indexSpec`, `options?`): `Promise`<`string`\>

Creates an index on the db and collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `indexSpec` | [`IndexSpecification`](../index.md#indexspecification) |
| `options?` | [`CreateIndexesOptions`](../interfaces/CreateIndexesOptions.md) |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:94

___

### createCollectionIndexes

**createCollectionIndexes**(`collectionName`, `indexSpecs`): `Promise`<`string`[]\>

Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
Earlier version of MongoDB will throw a command not supported error. Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `indexSpecs` | [`IndexDescription`](../interfaces/IndexDescription.md)[] |

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:99

___

### createDatabase

**createDatabase**(`database`): `Promise`<`void`\>

Creates a database if it's not created.

#### Parameters

| Name |
| :------ |
| `database` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createDatabase](../interfaces/QueryRunner.md#createdatabase)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:312

___

### createExclusionConstraint

**createExclusionConstraint**(`tableOrName`, `exclusionConstraint`): `Promise`<`void`\>

Creates a new exclusion constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `exclusionConstraint` | [`TableExclusion`](TableExclusion.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createExclusionConstraint](../interfaces/QueryRunner.md#createexclusionconstraint)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:423

___

### createExclusionConstraints

**createExclusionConstraints**(`tableOrName`, `exclusionConstraints`): `Promise`<`void`\>

Creates a new exclusion constraints.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `exclusionConstraints` | [`TableExclusion`](TableExclusion.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createExclusionConstraints](../interfaces/QueryRunner.md#createexclusionconstraints)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:427

___

### createForeignKey

**createForeignKey**(`tableOrName`, `foreignKey`): `Promise`<`void`\>

Creates a new foreign key.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `foreignKey` | [`TableForeignKey`](TableForeignKey.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createForeignKey](../interfaces/QueryRunner.md#createforeignkey)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:439

___

### createForeignKeys

**createForeignKeys**(`tableOrName`, `foreignKeys`): `Promise`<`void`\>

Creates a new foreign keys.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `foreignKeys` | [`TableForeignKey`](TableForeignKey.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createForeignKeys](../interfaces/QueryRunner.md#createforeignkeys)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:443

___

### createIndex

**createIndex**(`tableOrName`, `index`): `Promise`<`void`\>

Creates a new index.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `index` | [`TableIndex`](TableIndex.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createIndex](../interfaces/QueryRunner.md#createindex)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:455

___

### createIndices

**createIndices**(`tableOrName`, `indices`): `Promise`<`void`\>

Creates a new indices

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `indices` | [`TableIndex`](TableIndex.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createIndices](../interfaces/QueryRunner.md#createindices)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:459

___

### createPrimaryKey

**createPrimaryKey**(`tableOrName`, `columnNames`): `Promise`<`void`\>

Creates a new primary key.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `columnNames` | `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createPrimaryKey](../interfaces/QueryRunner.md#createprimarykey)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:379

___

### createSchema

**createSchema**(`schemaPath`, `ifNotExist?`): `Promise`<`void`\>

Creates a new table schema.

#### Parameters

| Name |
| :------ |
| `schemaPath` | `string` |
| `ifNotExist?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createSchema](../interfaces/QueryRunner.md#createschema)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:320

___

### createTable

**createTable**(`table`): `Promise`<`void`\>

Creates a new table from the given table and columns inside it.

#### Parameters

| Name |
| :------ |
| `table` | [`Table`](Table.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createTable](../interfaces/QueryRunner.md#createtable)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:328

___

### createUniqueConstraint

**createUniqueConstraint**(`tableOrName`, `uniqueConstraint`): `Promise`<`void`\>

Creates a new unique constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `uniqueConstraint` | [`TableUnique`](TableUnique.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createUniqueConstraint](../interfaces/QueryRunner.md#createuniqueconstraint)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:391

___

### createUniqueConstraints

**createUniqueConstraints**(`tableOrName`, `uniqueConstraints`): `Promise`<`void`\>

Creates a new unique constraints.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `uniqueConstraints` | [`TableUnique`](TableUnique.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createUniqueConstraints](../interfaces/QueryRunner.md#createuniqueconstraints)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:395

___

### createView

**createView**(`view`): `Promise`<`void`\>

Creates a new view.

#### Parameters

| Name |
| :------ |
| `view` | [`View`](View.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[createView](../interfaces/QueryRunner.md#createview)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:336

___

### cursor

**cursor**(`collectionName`, `filter`): [`FindCursor`](FindCursor.md)<`any`\>

Creates a cursor for a query that can be used to iterate over results from MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |

#### Returns

[`FindCursor`](FindCursor.md)<`any`\>

-`FindCursor`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:74

___

### deleteMany

**deleteMany**(`collectionName`, `filter`, `options`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete multiple documents on MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `options` | [`DeleteOptions`](../interfaces/DeleteOptions.md) |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:103

___

### deleteOne

**deleteOne**(`collectionName`, `filter`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete a document on MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:107

___

### disableSqlMemory

**disableSqlMemory**(): `void`

Disables special query runner mode in which sql queries won't be executed
started by calling enableSqlMemory() method.

Previously memorized sql will be flushed.

#### Returns

`void`

-`void`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[disableSqlMemory](../interfaces/QueryRunner.md#disablesqlmemory)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:484

___

### distinct

**distinct**(`collectionName`, `key`, `filter`, `options?`): `Promise`<`any`\>

The distinct command returns returns a list of distinct values for the given key across a collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `key` | `any` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:111

___

### dropCheckConstraint

**dropCheckConstraint**(`tableOrName`, `checkOrName`): `Promise`<`void`\>

Drops check constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `checkOrName` | `string` \| [`TableCheck`](TableCheck.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropCheckConstraint](../interfaces/QueryRunner.md#dropcheckconstraint)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:415

___

### dropCheckConstraints

**dropCheckConstraints**(`tableOrName`, `checkConstraints`): `Promise`<`void`\>

Drops check constraints.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `checkConstraints` | [`TableCheck`](TableCheck.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropCheckConstraints](../interfaces/QueryRunner.md#dropcheckconstraints)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:419

___

### dropCollectionIndex

**dropCollectionIndex**(`collectionName`, `indexName`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Drops an index from this collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `indexName` | `string` |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:115

___

### dropCollectionIndexes

**dropCollectionIndexes**(`collectionName`): `Promise`<[`Document`](../interfaces/Document.md)\>

Drops all indexes from the collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:119

___

### dropColumn

**dropColumn**(`tableOrName`, `columnOrName`): `Promise`<`void`\>

Drops column in the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `columnOrName` | `string` \| [`TableColumn`](TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropColumn](../interfaces/QueryRunner.md#dropcolumn)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:371

___

### dropColumns

**dropColumns**(`tableOrName`, `columns`): `Promise`<`void`\>

Drops the columns in the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `columns` | `string`[] \| [`TableColumn`](TableColumn.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropColumns](../interfaces/QueryRunner.md#dropcolumns)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:375

___

### dropDatabase

**dropDatabase**(`database`, `ifExist?`): `Promise`<`void`\>

Drops database.

#### Parameters

| Name |
| :------ |
| `database` | `string` |
| `ifExist?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropDatabase](../interfaces/QueryRunner.md#dropdatabase)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:316

___

### dropExclusionConstraint

**dropExclusionConstraint**(`tableOrName`, `exclusionOrName`): `Promise`<`void`\>

Drops exclusion constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `exclusionOrName` | `string` \| [`TableExclusion`](TableExclusion.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropExclusionConstraint](../interfaces/QueryRunner.md#dropexclusionconstraint)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:431

___

### dropExclusionConstraints

**dropExclusionConstraints**(`tableOrName`, `exclusionConstraints`): `Promise`<`void`\>

Drops exclusion constraints.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `exclusionConstraints` | [`TableExclusion`](TableExclusion.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropExclusionConstraints](../interfaces/QueryRunner.md#dropexclusionconstraints)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:435

___

### dropForeignKey

**dropForeignKey**(`tableOrName`, `foreignKey`): `Promise`<`void`\>

Drops a foreign key from the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `foreignKey` | [`TableForeignKey`](TableForeignKey.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropForeignKey](../interfaces/QueryRunner.md#dropforeignkey)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:447

___

### dropForeignKeys

**dropForeignKeys**(`tableOrName`, `foreignKeys`): `Promise`<`void`\>

Drops a foreign keys from the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `foreignKeys` | [`TableForeignKey`](TableForeignKey.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropForeignKeys](../interfaces/QueryRunner.md#dropforeignkeys)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:451

___

### dropIndex

**dropIndex**(`collectionName`, `indexName`): `Promise`<`void`\>

Drops an index from the table.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `indexName` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropIndex](../interfaces/QueryRunner.md#dropindex)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:463

___

### dropIndices

**dropIndices**(`tableOrName`, `indices`): `Promise`<`void`\>

Drops an indices from the table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `indices` | [`TableIndex`](TableIndex.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropIndices](../interfaces/QueryRunner.md#dropindices)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:467

___

### dropPrimaryKey

**dropPrimaryKey**(`tableOrName`): `Promise`<`void`\>

Drops a primary key.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropPrimaryKey](../interfaces/QueryRunner.md#dropprimarykey)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:387

___

### dropSchema

**dropSchema**(`schemaPath`, `ifExist?`): `Promise`<`void`\>

Drops table schema.

#### Parameters

| Name |
| :------ |
| `schemaPath` | `string` |
| `ifExist?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropSchema](../interfaces/QueryRunner.md#dropschema)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:324

___

### dropTable

**dropTable**(`tableName`): `Promise`<`void`\>

Drops the table.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` \| [`Table`](Table.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropTable](../interfaces/QueryRunner.md#droptable)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:332

___

### dropUniqueConstraint

**dropUniqueConstraint**(`tableOrName`, `uniqueOrName`): `Promise`<`void`\>

Drops an unique constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `uniqueOrName` | `string` \| [`TableUnique`](TableUnique.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropUniqueConstraint](../interfaces/QueryRunner.md#dropuniqueconstraint)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:399

___

### dropUniqueConstraints

**dropUniqueConstraints**(`tableOrName`, `uniqueConstraints`): `Promise`<`void`\>

Drops an unique constraints.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `uniqueConstraints` | [`TableUnique`](TableUnique.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropUniqueConstraints](../interfaces/QueryRunner.md#dropuniqueconstraints)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:403

___

### dropView

**dropView**(`target`): `Promise`<`void`\>

Drops the view.

#### Parameters

| Name |
| :------ |
| `target` | `string` \| [`View`](View.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[dropView](../interfaces/QueryRunner.md#dropview)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:340

___

### enableSqlMemory

**enableSqlMemory**(): `void`

Enables special query runner mode in which sql queries won't be executed,
instead they will be memorized into a special variable inside query runner.
You can get memorized sql using getMemorySql() method.

#### Returns

`void`

-`void`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[enableSqlMemory](../interfaces/QueryRunner.md#enablesqlmemory)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:477

___

### executeMemoryDownSql

**executeMemoryDownSql**(): `Promise`<`void`\>

Executes down sql queries.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[executeMemoryDownSql](../interfaces/QueryRunner.md#executememorydownsql)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:500

___

### executeMemoryUpSql

**executeMemoryUpSql**(): `Promise`<`void`\>

Executes up sql queries.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[executeMemoryUpSql](../interfaces/QueryRunner.md#executememoryupsql)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:496

___

### findOneAndDelete

**findOneAndDelete**(`collectionName`, `filter`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`FindOneAndDeleteOptions`](../interfaces/FindOneAndDeleteOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:123

___

### findOneAndReplace

**findOneAndReplace**(`collectionName`, `filter`, `replacement`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `replacement` | [`Document`](../interfaces/Document.md) |
| `options?` | [`FindOneAndReplaceOptions`](../interfaces/FindOneAndReplaceOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:127

___

### findOneAndUpdate

**findOneAndUpdate**(`collectionName`, `filter`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `update` | [`UpdateFilter`](../index.md#updatefilter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`FindOneAndUpdateOptions`](../interfaces/FindOneAndUpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:131

___

### getCollection

`Protected` **getCollection**(`collectionName`): [`Collection`](Collection.md)<`any`\>

Gets collection from the database with a given name.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

[`Collection`](Collection.md)<`any`\>

-`Collection`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:504

___

### getCurrentDatabase

**getCurrentDatabase**(): `Promise`<`undefined`\>

Loads currently using database

#### Returns

`Promise`<`undefined`\>

-`Promise`: 
	-`undefined`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getCurrentDatabase](../interfaces/QueryRunner.md#getcurrentdatabase)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:292

___

### getCurrentSchema

**getCurrentSchema**(): `Promise`<`undefined`\>

Loads currently using database schema

#### Returns

`Promise`<`undefined`\>

-`Promise`: 
	-`undefined`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getCurrentSchema](../interfaces/QueryRunner.md#getcurrentschema)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:300

___

### getDatabases

**getDatabases**(): `Promise`<`string`[]\>

Returns all available database names including system databases.

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getDatabases](../interfaces/QueryRunner.md#getdatabases)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:262

___

### getMemorySql

**getMemorySql**(): [`SqlInMemory`](SqlInMemory.md)

Gets sql stored in the memory. Parameters in the sql are already replaced.

#### Returns

[`SqlInMemory`](SqlInMemory.md)

-`SqlInMemory`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getMemorySql](../interfaces/QueryRunner.md#getmemorysql)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:492

___

### getReplicationMode

**getReplicationMode**(): [`ReplicationMode`](../index.md#replicationmode)

Returns replication mode (ex: `master` or `slave`).

#### Returns

[`ReplicationMode`](../index.md#replicationmode)

-`ReplicationMode`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getReplicationMode](../interfaces/QueryRunner.md#getreplicationmode)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:284

___

### getSchemas

**getSchemas**(`database?`): `Promise`<`string`[]\>

Returns all available schema names including system schemas.
If database parameter specified, returns schemas of that database.

#### Parameters

| Name |
| :------ |
| `database?` | `string` |

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getSchemas](../interfaces/QueryRunner.md#getschemas)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:267

___

### getTable

**getTable**(`collectionName`): `Promise`<`undefined` \| [`Table`](Table.md)\>

Loads given table's data from the database.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<`undefined` \| [`Table`](Table.md)\>

-`Promise`: 
	-`undefined \| Table`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getTable](../interfaces/QueryRunner.md#gettable)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:271

___

### getTables

**getTables**(`collectionNames`): `Promise`<[`Table`](Table.md)[]\>

Loads all tables (with given names) from the database and creates a Table from them.

#### Parameters

| Name |
| :------ |
| `collectionNames` | `string`[] |

#### Returns

`Promise`<[`Table`](Table.md)[]\>

-`Promise`: 
	-`Table[]`: 
		-`Table`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getTables](../interfaces/QueryRunner.md#gettables)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:275

___

### getView

**getView**(`collectionName`): `Promise`<`undefined` \| [`View`](View.md)\>

Loads given views's data from the database.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<`undefined` \| [`View`](View.md)\>

-`Promise`: 
	-`undefined \| View`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getView](../interfaces/QueryRunner.md#getview)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:279

___

### getViews

**getViews**(`collectionNames`): `Promise`<[`View`](View.md)[]\>

Loads all views (with given names) from the database and creates a Table from them.

#### Parameters

| Name |
| :------ |
| `collectionNames` | `string`[] |

#### Returns

`Promise`<[`View`](View.md)[]\>

-`Promise`: 
	-`View[]`: 
		-`View`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[getViews](../interfaces/QueryRunner.md#getviews)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:283

___

### hasColumn

**hasColumn**(`tableOrName`, `columnName`): `Promise`<`boolean`\>

Checks if column with the given name exist in the given table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `columnName` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[hasColumn](../interfaces/QueryRunner.md#hascolumn)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:308

___

### hasDatabase

**hasDatabase**(`database`): `Promise`<`boolean`\>

Checks if database with the given name exist.

#### Parameters

| Name |
| :------ |
| `database` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[hasDatabase](../interfaces/QueryRunner.md#hasdatabase)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:288

___

### hasSchema

**hasSchema**(`schema`): `Promise`<`boolean`\>

Checks if schema with the given name exist.

#### Parameters

| Name |
| :------ |
| `schema` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[hasSchema](../interfaces/QueryRunner.md#hasschema)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:296

___

### hasTable

**hasTable**(`collectionName`): `Promise`<`boolean`\>

Checks if table with the given name exist in the database.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[hasTable](../interfaces/QueryRunner.md#hastable)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:304

___

### initializeOrderedBulkOp

**initializeOrderedBulkOp**(`collectionName`, `options?`): [`OrderedBulkOperation`](OrderedBulkOperation.md)

Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`OrderedBulkOperation`](OrderedBulkOperation.md)

-`OrderedBulkOperation`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:147

___

### initializeUnorderedBulkOp

**initializeUnorderedBulkOp**(`collectionName`, `options?`): [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`UnorderedBulkOperation`](UnorderedBulkOperation.md)

-`UnorderedBulkOperation`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:151

___

### insertMany

**insertMany**(`collectionName`, `docs`, `options?`): `Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<[`Document`](../interfaces/Document.md)\>\>

Inserts an array of documents into MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `docs` | [`OptionalId`](../index.md#optionalid)<[`Document`](../interfaces/Document.md)\>[] |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`InsertManyResult`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:155

___

### insertOne

**insertOne**(`collectionName`, `doc`, `options?`): `Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<[`Document`](../interfaces/Document.md)\>\>

Inserts a single document into MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `doc` | [`OptionalId`](../index.md#optionalid)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`InsertOneOptions`](../interfaces/InsertOneOptions.md) |

#### Returns

`Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`InsertOneResult`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:159

___

### isCapped

**isCapped**(`collectionName`): `Promise`<`boolean`\>

Returns if the collection is a capped collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:163

___

### listCollectionIndexes

**listCollectionIndexes**(`collectionName`, `options?`): [`ListIndexesCursor`](ListIndexesCursor.md)

Get the list of all indexes information for the collection.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `options?` | [`ListIndexesOptions`](../interfaces/ListIndexesOptions.md) |

#### Returns

[`ListIndexesCursor`](ListIndexesCursor.md)

-`ListIndexesCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:167

___

### query

**query**(`query`, `parameters?`): `Promise`<`any`\>

Executes a given SQL query.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[query](../interfaces/QueryRunner.md#query)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:221

___

### release

**release**(): `Promise`<`void`\>

For MongoDB database we don't release connection, because its single connection.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[release](../interfaces/QueryRunner.md#release)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:205

___

### rename

**rename**(`collectionName`, `newName`, `options?`): `Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `newName` | `string` |
| `options?` | [`RenameOptions`](../interfaces/RenameOptions.md) |

#### Returns

`Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`Collection`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:171

___

### renameColumn

**renameColumn**(`tableOrName`, `oldTableColumnOrName`, `newTableColumnOrName`): `Promise`<`void`\>

Renames column in the given table.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `oldTableColumnOrName` | `string` \| [`TableColumn`](TableColumn.md) |
| `newTableColumnOrName` | `string` \| [`TableColumn`](TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[renameColumn](../interfaces/QueryRunner.md#renamecolumn)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:356

___

### renameTable

**renameTable**(`oldTableOrName`, `newTableOrName`): `Promise`<`void`\>

Renames the given table.

#### Parameters

| Name |
| :------ |
| `oldTableOrName` | `string` \| [`Table`](Table.md) |
| `newTableOrName` | `string` \| [`Table`](Table.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[renameTable](../interfaces/QueryRunner.md#renametable)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:344

___

### replaceOne

**replaceOne**(`collectionName`, `filter`, `replacement`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Replace a document on MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `replacement` | [`Document`](../interfaces/Document.md) |
| `options?` | [`ReplaceOptions`](../interfaces/ReplaceOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:175

___

### rollbackTransaction

**rollbackTransaction**(): `Promise`<`void`\>

Rollbacks transaction.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[rollbackTransaction](../interfaces/QueryRunner.md#rollbacktransaction)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:217

___

### startTransaction

**startTransaction**(): `Promise`<`void`\>

Starts transaction.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[startTransaction](../interfaces/QueryRunner.md#starttransaction)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:209

___

### stats

**stats**(`collectionName`, `options?`): `Promise`<[`CollStats`](../interfaces/CollStats.md)\>

Get all the collection statistics.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `options?` | [`CollStatsOptions`](../interfaces/CollStatsOptions.md) |

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

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:179

___

### stream

**stream**(`query`, `parameters?`, `onEnd?`, `onError?`): `Promise`<[`ReadStream`](ReadStream.md)\>

Returns raw data stream.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |
| `onEnd?` | `Function` |
| `onError?` | `Function` |

#### Returns

`Promise`<[`ReadStream`](ReadStream.md)\>

-`Promise`: 
	-`ReadStream`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[stream](../interfaces/QueryRunner.md#stream)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:225

___

### updateMany

**updateMany**(`collectionName`, `filter`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update multiple documents on MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `update` | [`UpdateFilter`](../index.md#updatefilter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:187

___

### updateOne

**updateOne**(`collectionName`, `filter`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update a single document on MongoDB.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `filter` | [`Filter`](../index.md#filter)<[`Document`](../interfaces/Document.md)\> |
| `update` | [`UpdateFilter`](../index.md#updatefilter)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:191

___

### updatePrimaryKeys

**updatePrimaryKeys**(`tableOrName`, `columns`): `Promise`<`void`\>

Updates composite primary keys.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](Table.md) |
| `columns` | [`TableColumn`](TableColumn.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[QueryRunner](../interfaces/QueryRunner.md).[updatePrimaryKeys](../interfaces/QueryRunner.md#updateprimarykeys)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:383

___

### watch

**watch**(`collectionName`, `pipeline?`, `options?`): [`ChangeStream`](ChangeStream.md)<[`Document`](../interfaces/Document.md), [`ChangeStreamDocument`](../index.md#changestreamdocument)<[`Document`](../interfaces/Document.md)\>\>

Watching new changes as stream.

#### Parameters

| Name |
| :------ |
| `collectionName` | `string` |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] |
| `options?` | [`ChangeStreamOptions`](../interfaces/ChangeStreamOptions.md) |

#### Returns

[`ChangeStream`](ChangeStream.md)<[`Document`](../interfaces/Document.md), [`ChangeStreamDocument`](../index.md#changestreamdocument)<[`Document`](../interfaces/Document.md)\>\>

-`ChangeStream`: 
	-`Document`: 
	-`ChangeStreamDocument`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/MongoQueryRunner.d.ts:183
