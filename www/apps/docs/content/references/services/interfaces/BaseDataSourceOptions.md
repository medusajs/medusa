# BaseDataSourceOptions

BaseDataSourceOptions is set of DataSourceOptions shared by all database types.

## Hierarchy

- **`BaseDataSourceOptions`**

  ↳ [`MysqlConnectionOptions`](MysqlConnectionOptions.md)

  ↳ [`PostgresConnectionOptions`](PostgresConnectionOptions.md)

  ↳ [`CockroachConnectionOptions`](CockroachConnectionOptions.md)

  ↳ [`SqliteConnectionOptions`](SqliteConnectionOptions.md)

  ↳ [`SqlServerConnectionOptions`](SqlServerConnectionOptions.md)

  ↳ [`SapConnectionOptions`](SapConnectionOptions.md)

  ↳ [`OracleConnectionOptions`](OracleConnectionOptions.md)

  ↳ [`CordovaConnectionOptions`](CordovaConnectionOptions.md)

  ↳ [`NativescriptConnectionOptions`](NativescriptConnectionOptions.md)

  ↳ [`ReactNativeConnectionOptions`](ReactNativeConnectionOptions.md)

  ↳ [`SqljsConnectionOptions`](SqljsConnectionOptions.md)

  ↳ [`MongoConnectionOptions`](MongoConnectionOptions.md)

  ↳ [`AuroraMysqlConnectionOptions`](AuroraMysqlConnectionOptions.md)

  ↳ [`AuroraPostgresConnectionOptions`](AuroraPostgresConnectionOptions.md)

  ↳ [`ExpoConnectionOptions`](ExpoConnectionOptions.md)

  ↳ [`BetterSqlite3ConnectionOptions`](BetterSqlite3ConnectionOptions.md)

  ↳ [`CapacitorConnectionOptions`](CapacitorConnectionOptions.md)

## Properties

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### dropSchema

 `Optional` `Readonly` **dropSchema**: `boolean`

Drops the schema each time connection is being established.
Be careful with this option and don't use this in production - otherwise you'll lose all production data.
This option is useful during debug and development.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:95

___

### entities

 `Optional` `Readonly` **entities**: [`MixedList`](../index.md#mixedlist)<`string` \| `Function` \| [`EntitySchema`](../classes/EntitySchema.md)<`any`\>\>

Entities to be loaded for this connection.
Accepts both entity classes and directories where from entities need to be loaded.
Directories support glob patterns.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:29

___

### entityPrefix

 `Optional` `Readonly` **entityPrefix**: `string`

Prefix to use on all tables (collections) of this connection in the database.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:99

___

### entitySkipConstructor

 `Optional` `Readonly` **entitySkipConstructor**: `boolean`

When creating new Entity instances, skip all constructors when true.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:103

___

### extra

 `Optional` `Readonly` **extra**: `any`

Extra connection options to be passed to the underlying driver.

todo: deprecate this and move all database-specific types into hts own connection options object.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:109

___

### logger

 `Optional` `Readonly` **logger**: ``"advanced-console"`` \| ``"simple-console"`` \| ``"file"`` \| ``"debug"`` \| [`Logger`](Logger-1.md)

Logger instance used to log queries and events in the ORM.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:66

___

### logging

 `Optional` `Readonly` **logging**: [`LoggerOptions`](../index.md#loggeroptions)

Logging options.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:62

___

### maxQueryExecutionTime

 `Optional` `Readonly` **maxQueryExecutionTime**: `number`

Maximum number of milliseconds query should be executed before logger log a warning.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:70

___

### metadataTableName

 `Optional` `Readonly` **metadataTableName**: `string`

Typeorm metadata table name, in case of different name from "typeorm_metadata".
Accepts single string name.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:54

___

### migrations

 `Optional` `Readonly` **migrations**: [`MixedList`](../index.md#mixedlist)<`string` \| `Function`\>

Migrations to be loaded for this connection.
Accepts both migration classes and glob patterns representing migration files.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:40

___

### migrationsRun

 `Optional` `Readonly` **migrationsRun**: `boolean`

Indicates if migrations should be auto run on every application launch.
Alternative to it, you can use CLI and run migrations:run command.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:89

___

### migrationsTableName

 `Optional` `Readonly` **migrationsTableName**: `string`

Migrations table name, in case of different name from "migrations".
Accepts single string name.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:45

___

### migrationsTransactionMode

 `Optional` `Readonly` **migrationsTransactionMode**: ``"all"`` \| ``"none"`` \| ``"each"``

Transaction mode for migrations to run in

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:49

___

### name

 `Optional` `Readonly` **name**: `string`

Connection name. If connection name is not given then it will be called "default".
Different connections must have different names.

**Deprecated**

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:23

___

### namingStrategy

 `Optional` `Readonly` **namingStrategy**: [`NamingStrategyInterface`](NamingStrategyInterface.md)

Naming strategy to be used to name tables and columns in the database.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:58

___

### poolSize

 `Optional` `Readonly` **poolSize**: `number`

Maximum number of clients the pool should contain.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:74

___

### relationLoadStrategy

 `Optional` `Readonly` **relationLoadStrategy**: ``"join"`` \| ``"query"``

Specifies how relations must be loaded - using "joins" or separate queries.
If you are loading too much data with nested joins it's better to load relations
using separate queries.

Default strategy is "join", but this default can be changed here.
Also, strategy can be set per-query in FindOptions and QueryBuilder.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:118

___

### subscribers

 `Optional` `Readonly` **subscribers**: [`MixedList`](../index.md#mixedlist)<`string` \| `Function`\>

Subscribers to be loaded for this connection.
Accepts both subscriber classes and directories where from subscribers need to be loaded.
Directories support glob patterns.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:35

___

### synchronize

 `Optional` `Readonly` **synchronize**: `boolean`

Indicates if database schema should be auto created on every application launch.
Be careful with this option and don't use this in production - otherwise you can lose production data.
This option is useful during debug and development.
Alternative to it, you can use CLI and run schema:sync command.

Note that for MongoDB database it does not create schema, because MongoDB is schemaless.
Instead, it syncs just by creating indices.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:84

___

### type

 `Readonly` **type**: [`DatabaseType`](../index.md#databasetype)

Database type. This value is required.

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:16

___

### typename

 `Optional` `Readonly` **typename**: `string`

Optionally applied "typename" to the model.
If set, then each hydrated model will have this property with the target model / entity name inside.

(works like a discriminator property).

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:125
