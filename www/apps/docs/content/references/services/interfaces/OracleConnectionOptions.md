# OracleConnectionOptions

Oracle-specific connection options.

## Hierarchy

- [`BaseDataSourceOptions`](BaseDataSourceOptions.md)

- [`OracleConnectionCredentialsOptions`](OracleConnectionCredentialsOptions.md)

  ↳ **`OracleConnectionOptions`**

## Properties

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[cache](BaseDataSourceOptions.md#cache)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### connectString

 `Optional` `Readonly` **connectString**: `string`

Embedded TNS Connection String

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[connectString](OracleConnectionCredentialsOptions.md#connectstring)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:40

___

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[database](OracleConnectionCredentialsOptions.md#database)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:28

___

### driver

 `Optional` `Readonly` **driver**: `any`

The driver object
This defaults to require("oracledb")

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionOptions.d.ts:19

___

### dropSchema

 `Optional` `Readonly` **dropSchema**: `boolean`

Drops the schema each time connection is being established.
Be careful with this option and don't use this in production - otherwise you'll lose all production data.
This option is useful during debug and development.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[dropSchema](BaseDataSourceOptions.md#dropschema)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:95

___

### entities

 `Optional` `Readonly` **entities**: [`MixedList`](../types/MixedList.md)<`string` \| `Function` \| [`EntitySchema`](../classes/EntitySchema.md)<`any`\>\>

Entities to be loaded for this connection.
Accepts both entity classes and directories where from entities need to be loaded.
Directories support glob patterns.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[entities](BaseDataSourceOptions.md#entities)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:29

___

### entityPrefix

 `Optional` `Readonly` **entityPrefix**: `string`

Prefix to use on all tables (collections) of this connection in the database.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[entityPrefix](BaseDataSourceOptions.md#entityprefix)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:99

___

### entitySkipConstructor

 `Optional` `Readonly` **entitySkipConstructor**: `boolean`

When creating new Entity instances, skip all constructors when true.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[entitySkipConstructor](BaseDataSourceOptions.md#entityskipconstructor)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:103

___

### extra

 `Optional` `Readonly` **extra**: `any`

Extra connection options to be passed to the underlying driver.

todo: deprecate this and move all database-specific types into hts own connection options object.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[extra](BaseDataSourceOptions.md#extra)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:109

___

### host

 `Optional` `Readonly` **host**: `string`

Database host.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[host](OracleConnectionCredentialsOptions.md#host)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:12

___

### logger

 `Optional` `Readonly` **logger**: ``"advanced-console"`` \| ``"simple-console"`` \| ``"file"`` \| ``"debug"`` \| [`Logger`](Logger-1.md)

Logger instance used to log queries and events in the ORM.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[logger](BaseDataSourceOptions.md#logger)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:66

___

### logging

 `Optional` `Readonly` **logging**: [`LoggerOptions`](../types/LoggerOptions.md)

Logging options.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[logging](BaseDataSourceOptions.md#logging)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:62

___

### maxQueryExecutionTime

 `Optional` `Readonly` **maxQueryExecutionTime**: `number`

Maximum number of milliseconds query should be executed before logger log a warning.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[maxQueryExecutionTime](BaseDataSourceOptions.md#maxqueryexecutiontime)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:70

___

### metadataTableName

 `Optional` `Readonly` **metadataTableName**: `string`

Typeorm metadata table name, in case of different name from "typeorm_metadata".
Accepts single string name.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[metadataTableName](BaseDataSourceOptions.md#metadatatablename)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:54

___

### migrations

 `Optional` `Readonly` **migrations**: [`MixedList`](../types/MixedList.md)<`string` \| `Function`\>

Migrations to be loaded for this connection.
Accepts both migration classes and glob patterns representing migration files.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[migrations](BaseDataSourceOptions.md#migrations)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:40

___

### migrationsRun

 `Optional` `Readonly` **migrationsRun**: `boolean`

Indicates if migrations should be auto run on every application launch.
Alternative to it, you can use CLI and run migrations:run command.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[migrationsRun](BaseDataSourceOptions.md#migrationsrun)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:89

___

### migrationsTableName

 `Optional` `Readonly` **migrationsTableName**: `string`

Migrations table name, in case of different name from "migrations".
Accepts single string name.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[migrationsTableName](BaseDataSourceOptions.md#migrationstablename)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:45

___

### migrationsTransactionMode

 `Optional` `Readonly` **migrationsTransactionMode**: ``"all"`` \| ``"none"`` \| ``"each"``

Transaction mode for migrations to run in

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[migrationsTransactionMode](BaseDataSourceOptions.md#migrationstransactionmode)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:49

___

### name

 `Optional` `Readonly` **name**: `string`

Connection name. If connection name is not given then it will be called "default".
Different connections must have different names.

**Deprecated**

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[name](BaseDataSourceOptions.md#name)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:23

___

### namingStrategy

 `Optional` `Readonly` **namingStrategy**: [`NamingStrategyInterface`](NamingStrategyInterface.md)

Naming strategy to be used to name tables and columns in the database.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[namingStrategy](BaseDataSourceOptions.md#namingstrategy)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:58

___

### password

 `Optional` `Readonly` **password**: `string`

Database password.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[password](OracleConnectionCredentialsOptions.md#password)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:24

___

### poolSize

 `Optional` `Readonly` **poolSize**: `number`

Maximum number of clients the pool should contain.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[poolSize](BaseDataSourceOptions.md#poolsize)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:74

___

### port

 `Optional` `Readonly` **port**: `number`

Database host port.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[port](OracleConnectionCredentialsOptions.md#port)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:16

___

### relationLoadStrategy

 `Optional` `Readonly` **relationLoadStrategy**: ``"join"`` \| ``"query"``

Specifies how relations must be loaded - using "joins" or separate queries.
If you are loading too much data with nested joins it's better to load relations
using separate queries.

Default strategy is "join", but this default can be changed here.
Also, strategy can be set per-query in FindOptions and QueryBuilder.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[relationLoadStrategy](BaseDataSourceOptions.md#relationloadstrategy)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:118

___

### replication

 `Optional` `Readonly` **replication**: `Object`

Replication setup.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `master` | [`OracleConnectionCredentialsOptions`](OracleConnectionCredentialsOptions.md) | Master server used by orm to perform writes. |
| `slaves` | [`OracleConnectionCredentialsOptions`](OracleConnectionCredentialsOptions.md)[] | List of read-from severs (slaves). |

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionOptions.d.ts:27

___

### schema

 `Optional` `Readonly` **schema**: `string`

Schema name. By default is "public".

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionOptions.d.ts:14

___

### serviceName

 `Optional` `Readonly` **serviceName**: `string`

Connection Service Name.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[serviceName](OracleConnectionCredentialsOptions.md#servicename)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:36

___

### sid

 `Optional` `Readonly` **sid**: `string`

Connection SID.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[sid](OracleConnectionCredentialsOptions.md#sid)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:32

___

### subscribers

 `Optional` `Readonly` **subscribers**: [`MixedList`](../types/MixedList.md)<`string` \| `Function`\>

Subscribers to be loaded for this connection.
Accepts both subscriber classes and directories where from subscribers need to be loaded.
Directories support glob patterns.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[subscribers](BaseDataSourceOptions.md#subscribers)

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

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[synchronize](BaseDataSourceOptions.md#synchronize)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:84

___

### type

 `Readonly` **type**: ``"oracle"``

Database type.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[type](BaseDataSourceOptions.md#type)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionOptions.d.ts:10

___

### typename

 `Optional` `Readonly` **typename**: `string`

Optionally applied "typename" to the model.
If set, then each hydrated model will have this property with the target model / entity name inside.

(works like a discriminator property).

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[typename](BaseDataSourceOptions.md#typename)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:125

___

### url

 `Optional` `Readonly` **url**: `string`

Connection url where perform connection to.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[url](OracleConnectionCredentialsOptions.md#url)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:8

___

### useUTC

 `Optional` `Readonly` **useUTC**: `boolean`

A boolean determining whether to pass time values in UTC or local time. (default: false).

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionOptions.d.ts:23

___

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Inherited from

[OracleConnectionCredentialsOptions](OracleConnectionCredentialsOptions.md).[username](OracleConnectionCredentialsOptions.md#username)

#### Defined in

node_modules/typeorm/driver/oracle/OracleConnectionCredentialsOptions.d.ts:20
