# QueryRunner

Runs queries on a single database connection.

## Implemented by

- [`MongoQueryRunner`](../classes/MongoQueryRunner.md)

## Properties

### broadcaster

 `Readonly` **broadcaster**: [`Broadcaster`](../classes/Broadcaster.md)

Broadcaster used on this query runner to broadcast entity events.

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:30

___

### connection

 `Readonly` **connection**: [`DataSource`](../classes/DataSource.md)

Connection used by this query runner.

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:26

___

### data

 **data**: [`ObjectLiteral`](ObjectLiteral.md)

Stores temporarily user data.
Useful for sharing data with subscribers.

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:48

___

### isReleased

 `Readonly` **isReleased**: `boolean`

Indicates if connection for this query runner is released.
Once its released, query runner cannot run queries anymore.

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:39

___

### isTransactionActive

 `Readonly` **isTransactionActive**: `boolean`

Indicates if transaction is in progress.

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:43

___

### loadedTables

 **loadedTables**: [`Table`](../classes/Table.md)[]

All synchronized tables in the database.

**Deprecated**

Call `getTables()`

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:54

___

### loadedViews

 **loadedViews**: [`View`](../classes/View.md)[]

All synchronized views in the database.

**Deprecated**

Call `getViews()`

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:60

___

### manager

 `Readonly` **manager**: [`EntityManager`](../classes/EntityManager.md)

Entity manager working only with this query runner.

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:34

## Methods

### addColumn

**addColumn**(`table`, `column`): `Promise`<`void`\>

Adds a new column.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `column` | [`TableColumn`](../classes/TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:206

___

### addColumns

**addColumns**(`table`, `columns`): `Promise`<`void`\>

Adds new columns.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `columns` | [`TableColumn`](../classes/TableColumn.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:210

___

### afterMigration

**afterMigration**(): `Promise`<`void`\>

Called after migrations are run.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:73

___

### beforeMigration

**beforeMigration**(): `Promise`<`void`\>

Called before migrations are run.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:69

___

### changeColumn

**changeColumn**(`table`, `oldColumn`, `newColumn`): `Promise`<`void`\>

Changes a column in the table.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `oldColumn` | `string` \| [`TableColumn`](../classes/TableColumn.md) |
| `newColumn` | [`TableColumn`](../classes/TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:218

___

### changeColumns

**changeColumns**(`table`, `changedColumns`): `Promise`<`void`\>

Changes columns in the table.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `changedColumns` | { `newColumn`: [`TableColumn`](../classes/TableColumn.md) ; `oldColumn`: [`TableColumn`](../classes/TableColumn.md)  }[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:222

___

### clearDatabase

**clearDatabase**(`database?`): `Promise`<`void`\>

Removes all tables from the currently connected database.
Be careful with using this method and avoid using it in production or migrations
(because it can clear all your database).

#### Parameters

| Name |
| :------ |
| `database?` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:84

___

### clearSqlMemory

**clearSqlMemory**(): `void`

Flushes all memorized sqls.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:347

___

### clearTable

**clearTable**(`tableName`): `Promise`<`void`\>

Clears all table contents.
Note: this operation uses SQL's TRUNCATE query which cannot be reverted in transactions.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:330

___

### commitTransaction

**commitTransaction**(): `Promise`<`void`\>

Commits transaction.
Error will be thrown if transaction was not started.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:93

___

### connect

**connect**(): `Promise`<`any`\>

Creates/uses database connection from the connection pool to perform further operations.
Returns obtained database connection.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:65

___

### createCheckConstraint

**createCheckConstraint**(`table`, `checkConstraint`): `Promise`<`void`\>

Creates a new check constraint.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `checkConstraint` | [`TableCheck`](../classes/TableCheck.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:265

___

### createCheckConstraints

**createCheckConstraints**(`table`, `checkConstraints`): `Promise`<`void`\>

Creates new check constraints.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `checkConstraints` | [`TableCheck`](../classes/TableCheck.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:269

___

### createDatabase

**createDatabase**(`database`, `ifNotExist?`): `Promise`<`void`\>

Creates a new database.

#### Parameters

| Name |
| :------ |
| `database` | `string` |
| `ifNotExist?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:168

___

### createExclusionConstraint

**createExclusionConstraint**(`table`, `exclusionConstraint`): `Promise`<`void`\>

Creates a new exclusion constraint.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `exclusionConstraint` | [`TableExclusion`](../classes/TableExclusion.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:281

___

### createExclusionConstraints

**createExclusionConstraints**(`table`, `exclusionConstraints`): `Promise`<`void`\>

Creates new exclusion constraints.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `exclusionConstraints` | [`TableExclusion`](../classes/TableExclusion.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:285

___

### createForeignKey

**createForeignKey**(`table`, `foreignKey`): `Promise`<`void`\>

Creates a new foreign key.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `foreignKey` | [`TableForeignKey`](../classes/TableForeignKey.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:297

___

### createForeignKeys

**createForeignKeys**(`table`, `foreignKeys`): `Promise`<`void`\>

Creates new foreign keys.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `foreignKeys` | [`TableForeignKey`](../classes/TableForeignKey.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:301

___

### createIndex

**createIndex**(`table`, `index`): `Promise`<`void`\>

Creates a new index.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `index` | [`TableIndex`](../classes/TableIndex.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:313

___

### createIndices

**createIndices**(`table`, `indices`): `Promise`<`void`\>

Creates new indices.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `indices` | [`TableIndex`](../classes/TableIndex.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:317

___

### createPrimaryKey

**createPrimaryKey**(`table`, `columnNames`, `constraintName?`): `Promise`<`void`\>

Creates a new primary key.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `columnNames` | `string`[] |
| `constraintName?` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:237

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

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:176

___

### createTable

**createTable**(`table`, `ifNotExist?`, `createForeignKeys?`, `createIndices?`): `Promise`<`void`\>

Creates a new table.

#### Parameters

| Name |
| :------ |
| `table` | [`Table`](../classes/Table.md) |
| `ifNotExist?` | `boolean` |
| `createForeignKeys?` | `boolean` |
| `createIndices?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:186

___

### createUniqueConstraint

**createUniqueConstraint**(`table`, `uniqueConstraint`): `Promise`<`void`\>

Creates a new unique constraint.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `uniqueConstraint` | [`TableUnique`](../classes/TableUnique.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:249

___

### createUniqueConstraints

**createUniqueConstraints**(`table`, `uniqueConstraints`): `Promise`<`void`\>

Creates new unique constraints.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `uniqueConstraints` | [`TableUnique`](../classes/TableUnique.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:253

___

### createView

**createView**(`view`, `syncWithMetadata?`, `oldView?`): `Promise`<`void`\>

Creates a new view.

#### Parameters

| Name |
| :------ |
| `view` | [`View`](../classes/View.md) |
| `syncWithMetadata?` | `boolean` |
| `oldView?` | [`View`](../classes/View.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:194

___

### disableSqlMemory

**disableSqlMemory**(): `void`

Disables special query runner mode in which sql queries won't be executed
started by calling enableSqlMemory() method.

Previously memorized sql will be flushed.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:343

___

### dropCheckConstraint

**dropCheckConstraint**(`table`, `checkOrName`): `Promise`<`void`\>

Drops a check constraint.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `checkOrName` | `string` \| [`TableCheck`](../classes/TableCheck.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:273

___

### dropCheckConstraints

**dropCheckConstraints**(`table`, `checkConstraints`): `Promise`<`void`\>

Drops check constraints.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `checkConstraints` | [`TableCheck`](../classes/TableCheck.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:277

___

### dropColumn

**dropColumn**(`table`, `column`): `Promise`<`void`\>

Drops a column in the table.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `column` | `string` \| [`TableColumn`](../classes/TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:229

___

### dropColumns

**dropColumns**(`table`, `columns`): `Promise`<`void`\>

Drops columns in the table.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `columns` | `string`[] \| [`TableColumn`](../classes/TableColumn.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:233

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

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:172

___

### dropExclusionConstraint

**dropExclusionConstraint**(`table`, `exclusionOrName`): `Promise`<`void`\>

Drops a exclusion constraint.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `exclusionOrName` | `string` \| [`TableExclusion`](../classes/TableExclusion.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:289

___

### dropExclusionConstraints

**dropExclusionConstraints**(`table`, `exclusionConstraints`): `Promise`<`void`\>

Drops exclusion constraints.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `exclusionConstraints` | [`TableExclusion`](../classes/TableExclusion.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:293

___

### dropForeignKey

**dropForeignKey**(`table`, `foreignKeyOrName`): `Promise`<`void`\>

Drops a foreign key.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `foreignKeyOrName` | `string` \| [`TableForeignKey`](../classes/TableForeignKey.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:305

___

### dropForeignKeys

**dropForeignKeys**(`table`, `foreignKeys`): `Promise`<`void`\>

Drops foreign keys.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `foreignKeys` | [`TableForeignKey`](../classes/TableForeignKey.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:309

___

### dropIndex

**dropIndex**(`table`, `index`): `Promise`<`void`\>

Drops an index.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `index` | `string` \| [`TableIndex`](../classes/TableIndex.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:321

___

### dropIndices

**dropIndices**(`table`, `indices`): `Promise`<`void`\>

Drops indices.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `indices` | [`TableIndex`](../classes/TableIndex.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:325

___

### dropPrimaryKey

**dropPrimaryKey**(`table`, `constraintName?`): `Promise`<`void`\>

Drops a primary key.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `constraintName?` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:245

___

### dropSchema

**dropSchema**(`schemaPath`, `ifExist?`, `isCascade?`): `Promise`<`void`\>

Drops table schema.
For SqlServer can accept schema path (e.g. 'dbName.schemaName') as parameter.
If schema path passed, it will drop schema in specified database.

#### Parameters

| Name |
| :------ |
| `schemaPath` | `string` |
| `ifExist?` | `boolean` |
| `isCascade?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:182

___

### dropTable

**dropTable**(`table`, `ifExist?`, `dropForeignKeys?`, `dropIndices?`): `Promise`<`void`\>

Drops a table.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `ifExist?` | `boolean` |
| `dropForeignKeys?` | `boolean` |
| `dropIndices?` | `boolean` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:190

___

### dropUniqueConstraint

**dropUniqueConstraint**(`table`, `uniqueOrName`): `Promise`<`void`\>

Drops an unique constraint.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `uniqueOrName` | `string` \| [`TableUnique`](../classes/TableUnique.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:257

___

### dropUniqueConstraints

**dropUniqueConstraints**(`table`, `uniqueConstraints`): `Promise`<`void`\>

Drops unique constraints.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `uniqueConstraints` | [`TableUnique`](../classes/TableUnique.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:261

___

### dropView

**dropView**(`view`): `Promise`<`void`\>

Drops a view.

#### Parameters

| Name |
| :------ |
| `view` | `string` \| [`View`](../classes/View.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:198

___

### enableSqlMemory

**enableSqlMemory**(): `void`

Enables special query runner mode in which sql queries won't be executed,
instead they will be memorized into a special variable inside query runner.
You can get memorized sql using getMemorySql() method.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:336

___

### executeMemoryDownSql

**executeMemoryDownSql**(): `Promise`<`void`\>

Executes down sql queries.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:359

___

### executeMemoryUpSql

**executeMemoryUpSql**(): `Promise`<`void`\>

Executes up sql queries.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:355

___

### getCurrentDatabase

**getCurrentDatabase**(): `Promise`<`undefined` \| `string`\>

Loads currently using database

#### Returns

`Promise`<`undefined` \| `string`\>

-`Promise`: 
	-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:148

___

### getCurrentSchema

**getCurrentSchema**(): `Promise`<`undefined` \| `string`\>

Loads currently using database schema

#### Returns

`Promise`<`undefined` \| `string`\>

-`Promise`: 
	-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:156

___

### getDatabases

**getDatabases**(): `Promise`<`string`[]\>

Returns all available database names including system databases.

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:114

___

### getMemorySql

**getMemorySql**(): [`SqlInMemory`](../classes/SqlInMemory.md)

Gets sql stored in the memory. Parameters in the sql are already replaced.

#### Returns

[`SqlInMemory`](../classes/SqlInMemory.md)

-`SqlInMemory`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:351

___

### getReplicationMode

**getReplicationMode**(): [`ReplicationMode`](../index.md#replicationmode)

Returns replication mode (ex: `master` or `slave`).

#### Returns

[`ReplicationMode`](../index.md#replicationmode)

-`ReplicationMode`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:140

___

### getSchemas

**getSchemas**(`database?`): `Promise`<`string`[]\>

Returns all available schema names including system schemas.
If database parameter specified, returns schemas of that database.
Useful for SQLServer and Postgres only.

#### Parameters

| Name |
| :------ |
| `database?` | `string` |

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:120

___

### getTable

**getTable**(`tablePath`): `Promise`<`undefined` \| [`Table`](../classes/Table.md)\>

Loads a table by a given name from the database.

#### Parameters

| Name |
| :------ |
| `tablePath` | `string` |

#### Returns

`Promise`<`undefined` \| [`Table`](../classes/Table.md)\>

-`Promise`: 
	-`undefined \| Table`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:124

___

### getTables

**getTables**(`tablePaths?`): `Promise`<[`Table`](../classes/Table.md)[]\>

Loads all tables from the database and returns them.

#### Parameters

| Name |
| :------ |
| `tablePaths?` | `string`[] |

#### Returns

`Promise`<[`Table`](../classes/Table.md)[]\>

-`Promise`: 
	-`Table[]`: 
		-`Table`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:128

___

### getView

**getView**(`viewPath`): `Promise`<`undefined` \| [`View`](../classes/View.md)\>

Loads a view by a given name from the database.

#### Parameters

| Name |
| :------ |
| `viewPath` | `string` |

#### Returns

`Promise`<`undefined` \| [`View`](../classes/View.md)\>

-`Promise`: 
	-`undefined \| View`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:132

___

### getViews

**getViews**(`viewPaths?`): `Promise`<[`View`](../classes/View.md)[]\>

Loads all views from the database and returns them.

#### Parameters

| Name |
| :------ |
| `viewPaths?` | `string`[] |

#### Returns

`Promise`<[`View`](../classes/View.md)[]\>

-`Promise`: 
	-`View[]`: 
		-`View`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:136

___

### hasColumn

**hasColumn**(`table`, `columnName`): `Promise`<`boolean`\>

Checks if a column exist in the table.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `columnName` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:164

___

### hasDatabase

**hasDatabase**(`database`): `Promise`<`boolean`\>

Checks if a database with the given name exist.

#### Parameters

| Name |
| :------ |
| `database` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:144

___

### hasSchema

**hasSchema**(`schema`): `Promise`<`boolean`\>

Checks if a schema with the given name exist.

#### Parameters

| Name |
| :------ |
| `schema` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:152

___

### hasTable

**hasTable**(`table`): `Promise`<`boolean`\>

Checks if a table with the given name exist.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:160

___

### query

**query**(`query`, `parameters`, `useStructuredResult`): `Promise`<[`QueryResult`](../classes/QueryResult.md)\>

Executes a given SQL query and returns raw database results.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters` | `undefined` \| `any`[] |
| `useStructuredResult` | ``true`` |

#### Returns

`Promise`<[`QueryResult`](../classes/QueryResult.md)\>

-`Promise`: 
	-`QueryResult`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:102

**query**(`query`, `parameters?`): `Promise`<`any`\>

Executes a given SQL query and returns raw database results.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:106

___

### release

**release**(): `Promise`<`void`\>

Releases used database connection.
You cannot use query runner methods after connection is released.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:78

___

### renameColumn

**renameColumn**(`table`, `oldColumnOrName`, `newColumnOrName`): `Promise`<`void`\>

Renames a column.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `oldColumnOrName` | `string` \| [`TableColumn`](../classes/TableColumn.md) |
| `newColumnOrName` | `string` \| [`TableColumn`](../classes/TableColumn.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:214

___

### renameTable

**renameTable**(`oldTableOrName`, `newTableName`): `Promise`<`void`\>

Renames a table.

#### Parameters

| Name |
| :------ |
| `oldTableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `newTableName` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:202

___

### rollbackTransaction

**rollbackTransaction**(): `Promise`<`void`\>

Rollbacks transaction.
Error will be thrown if transaction was not started.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:98

___

### startTransaction

**startTransaction**(`isolationLevel?`): `Promise`<`void`\>

Starts transaction.

#### Parameters

| Name |
| :------ |
| `isolationLevel?` | [`IsolationLevel`](../index.md#isolationlevel) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:88

___

### stream

**stream**(`query`, `parameters?`, `onEnd?`, `onError?`): `Promise`<[`ReadStream`](../classes/ReadStream.md)\>

Returns raw data stream.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |
| `onEnd?` | `Function` |
| `onError?` | `Function` |

#### Returns

`Promise`<[`ReadStream`](../classes/ReadStream.md)\>

-`Promise`: 
	-`ReadStream`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:110

___

### updatePrimaryKeys

**updatePrimaryKeys**(`table`, `columns`): `Promise`<`void`\>

Updates composite primary keys.

#### Parameters

| Name |
| :------ |
| `table` | `string` \| [`Table`](../classes/Table.md) |
| `columns` | [`TableColumn`](../classes/TableColumn.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-runner/QueryRunner.d.ts:241
