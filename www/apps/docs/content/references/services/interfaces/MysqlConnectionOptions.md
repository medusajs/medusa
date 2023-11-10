# MysqlConnectionOptions

MySQL specific connection options.

**See**

https://github.com/mysqljs/mysql#connection-options

## Hierarchy

- [`BaseDataSourceOptions`](BaseDataSourceOptions.md)

- [`MysqlConnectionCredentialsOptions`](MysqlConnectionCredentialsOptions.md)

  ↳ **`MysqlConnectionOptions`**

## Properties

### acquireTimeout

 `Optional` `Readonly` **acquireTimeout**: `number`

The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)
This difference between connectTimeout and acquireTimeout is subtle and is described in the mysqljs/mysql docs
https://github.com/mysqljs/mysql/tree/master#pool-options

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:40

___

### bigNumberStrings

 `Optional` `Readonly` **bigNumberStrings**: `boolean`

Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always
returned as JavaScript String objects (Default: false). Enabling supportBigNumbers but leaving bigNumberStrings
disabled will return big numbers as String objects only when they cannot be accurately represented with
[JavaScript Number objects](http://ecma262-5.com/ELS5_HTML.htm#Section_8.5) (which happens when they exceed the [-2^53, +2^53] range),
otherwise they will be returned as Number objects. This option is ignored if supportBigNumbers is disabled.

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:56

___

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[cache](BaseDataSourceOptions.md#cache)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### charset

 `Optional` `Readonly` **charset**: `string`

The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci).
If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used.
Default: 'UTF8_GENERAL_CI'

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:24

___

### connectTimeout

 `Optional` `Readonly` **connectTimeout**: `number`

The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:34

___

### connectorPackage

 `Optional` `Readonly` **connectorPackage**: ``"mysql"`` \| ``"mysql2"``

TypeORM will automatically use package found in your node_modules, prioritizing mysql over mysql2,
but you can specify it manually

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:91

___

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Inherited from

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[database](MysqlConnectionCredentialsOptions.md#database)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:30

___

### dateStrings

 `Optional` `Readonly` **dateStrings**: `boolean` \| `string`[]

Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects.
Can be true/false or an array of type names to keep as strings.

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:61

___

### debug

 `Optional` `Readonly` **debug**: `boolean` \| `string`[]

Prints protocol details to stdout. Can be true/false or an array of packet type names that should be printed.
(Default: false)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:66

___

### driver

 `Optional` `Readonly` **driver**: `any`

The driver object
This defaults to require("mysql").
Falls back to require("mysql2")

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:18

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

### flags

 `Optional` `Readonly` **flags**: `string`[]

List of connection flags to use other than the default ones. It is also possible to blacklist default ones.
For more information, check https://github.com/mysqljs/mysql#connection-flags.

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:86

___

### host

 `Optional` `Readonly` **host**: `string`

Database host.

#### Inherited from

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[host](MysqlConnectionCredentialsOptions.md#host)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:14

___

### insecureAuth

 `Optional` `Readonly` **insecureAuth**: `boolean`

Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:44

___

### legacySpatialSupport

 `Optional` `Readonly` **legacySpatialSupport**: `boolean`

Use spatial functions like GeomFromText and AsText which are removed in MySQL 8.
(Default: true)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:81

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

### multipleStatements

 `Optional` `Readonly` **multipleStatements**: `boolean`

Allow multiple mysql statements per query. Be careful with this, it could increase the scope of SQL injection attacks.
(Default: false)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:76

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

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[password](MysqlConnectionCredentialsOptions.md#password)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:26

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

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[port](MysqlConnectionCredentialsOptions.md#port)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:18

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
| `canRetry?` | `boolean` | If true, PoolCluster will attempt to reconnect when connection fails. (Default: true) |
| `master` | [`MysqlConnectionCredentialsOptions`](MysqlConnectionCredentialsOptions.md) | Master server used by orm to perform writes. |
| `removeNodeErrorCount?` | `number` | If connection fails, node's errorCount increases. When errorCount is greater than removeNodeErrorCount, remove a node in the PoolCluster. (Default: 5) |
| `restoreNodeTimeout?` | `number` | If connection fails, specifies the number of milliseconds before another connection attempt will be made. If set to 0, then node will be removed instead and never re-used. (Default: 0) |
| `selector?` | ``"RR"`` \| ``"RANDOM"`` \| ``"ORDER"`` | Determines how slaves are selected: RR: Select one alternately (Round-Robin). RANDOM: Select the node by random function. ORDER: Select the first node available unconditionally. |
| `slaves` | [`MysqlConnectionCredentialsOptions`](MysqlConnectionCredentialsOptions.md)[] | List of read-from severs (slaves). |

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:95

___

### socketPath

 `Optional` `Readonly` **socketPath**: `string`

Database socket path

#### Inherited from

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[socketPath](MysqlConnectionCredentialsOptions.md#socketpath)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:38

___

### ssl

 `Optional` `Readonly` **ssl**: `any`

Object with ssl parameters or a string containing name of ssl profile.

#### Inherited from

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[ssl](MysqlConnectionCredentialsOptions.md#ssl)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:34

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

### supportBigNumbers

 `Optional` `Readonly` **supportBigNumbers**: `boolean`

When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option (Default: false)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:48

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

### timezone

 `Optional` `Readonly` **timezone**: `string`

The timezone configured on the MySQL server.
This is used to type cast server date/time values to JavaScript Date object and vice versa.
This can be 'local', 'Z', or an offset in the form +HH:MM or -HH:MM. (Default: 'local')

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:30

___

### trace

 `Optional` `Readonly` **trace**: `boolean`

Generates stack traces on Error to include call site of library entrance ("long stack traces").
Slight performance penalty for most calls. (Default: true)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:71

___

### type

 `Readonly` **type**: ``"mysql"`` \| ``"mariadb"``

Database type.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[type](BaseDataSourceOptions.md#type)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionOptions.d.ts:12

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

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[url](MysqlConnectionCredentialsOptions.md#url)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:10

___

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Inherited from

[MysqlConnectionCredentialsOptions](MysqlConnectionCredentialsOptions.md).[username](MysqlConnectionCredentialsOptions.md#username)

#### Defined in

node_modules/typeorm/driver/mysql/MysqlConnectionCredentialsOptions.d.ts:22
