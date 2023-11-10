# SpannerConnectionOptions

Spanner specific connection options.

## Hierarchy

- [`BaseConnectionOptions`](../types/BaseConnectionOptions.md)

- [`SpannerConnectionCredentialsOptions`](SpannerConnectionCredentialsOptions.md)

  ↳ **`SpannerConnectionOptions`**

## Properties

### acquireTimeout

 `Optional` `Readonly` **acquireTimeout**: `number`

The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)
This difference between connectTimeout and acquireTimeout is subtle and is described in the mysqljs/mysql docs
https://github.com/mysqljs/mysql/tree/master#pool-options

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:39

___

### bigNumberStrings

 `Optional` `Readonly` **bigNumberStrings**: `boolean`

Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always
returned as JavaScript String objects (Default: false). Enabling supportBigNumbers but leaving bigNumberStrings
disabled will return big numbers as String objects only when they cannot be accurately represented with
[JavaScript Number objects](http://ecma262-5.com/ELS5_HTML.htm#Section_8.5) (which happens when they exceed the [-2^53, +2^53] range),
otherwise they will be returned as Number objects. This option is ignored if supportBigNumbers is disabled.

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:55

___

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Inherited from

BaseConnectionOptions.cache

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### charset

 `Optional` `Readonly` **charset**: `string`

The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci).
If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used.
Default: 'UTF8_GENERAL_CI'

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:23

___

### connectTimeout

 `Optional` `Readonly` **connectTimeout**: `number`

The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:33

___

### database

 `Optional` `Readonly` **database**: `string`

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:16

___

### databaseId

 `Optional` `Readonly` **databaseId**: `string`

Database host port.

#### Inherited from

[SpannerConnectionCredentialsOptions](SpannerConnectionCredentialsOptions.md).[databaseId](SpannerConnectionCredentialsOptions.md#databaseid)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionCredentialsOptions.d.ts:16

___

### dateStrings

 `Optional` `Readonly` **dateStrings**: `boolean` \| `string`[]

Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects.
Can be true/false or an array of type names to keep as strings.

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:60

___

### debug

 `Optional` `Readonly` **debug**: `boolean` \| `string`[]

Prints protocol details to stdout. Can be true/false or an array of packet type names that should be printed.
(Default: false)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:65

___

### driver

 `Optional` `Readonly` **driver**: `any`

The driver object
This defaults to require("@google-cloud/spanner").

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:15

___

### dropSchema

 `Optional` `Readonly` **dropSchema**: `boolean`

Drops the schema each time connection is being established.
Be careful with this option and don't use this in production - otherwise you'll lose all production data.
This option is useful during debug and development.

#### Inherited from

BaseConnectionOptions.dropSchema

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:95

___

### entities

 `Optional` `Readonly` **entities**: [`MixedList`](../types/MixedList.md)<`string` \| `Function` \| [`EntitySchema`](../classes/EntitySchema.md)<`any`\>\>

Entities to be loaded for this connection.
Accepts both entity classes and directories where from entities need to be loaded.
Directories support glob patterns.

#### Inherited from

BaseConnectionOptions.entities

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:29

___

### entityPrefix

 `Optional` `Readonly` **entityPrefix**: `string`

Prefix to use on all tables (collections) of this connection in the database.

#### Inherited from

BaseConnectionOptions.entityPrefix

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:99

___

### entitySkipConstructor

 `Optional` `Readonly` **entitySkipConstructor**: `boolean`

When creating new Entity instances, skip all constructors when true.

#### Inherited from

BaseConnectionOptions.entitySkipConstructor

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:103

___

### extra

 `Optional` `Readonly` **extra**: `any`

Extra connection options to be passed to the underlying driver.

todo: deprecate this and move all database-specific types into hts own connection options object.

#### Inherited from

BaseConnectionOptions.extra

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:109

___

### flags

 `Optional` `Readonly` **flags**: `string`[]

List of connection flags to use other than the default ones. It is also possible to blacklist default ones.
For more information, check https://github.com/mysqljs/mysql#connection-flags.

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:85

___

### insecureAuth

 `Optional` `Readonly` **insecureAuth**: `boolean`

Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:43

___

### instanceId

 `Optional` `Readonly` **instanceId**: `string`

Connection url where perform connection to.

#### Inherited from

[SpannerConnectionCredentialsOptions](SpannerConnectionCredentialsOptions.md).[instanceId](SpannerConnectionCredentialsOptions.md#instanceid)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionCredentialsOptions.d.ts:8

___

### legacySpatialSupport

 `Optional` `Readonly` **legacySpatialSupport**: `boolean`

Use spatial functions like GeomFromText and AsText which are removed in MySQL 8.
(Default: true)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:80

___

### logger

 `Optional` `Readonly` **logger**: ``"advanced-console"`` \| ``"simple-console"`` \| ``"file"`` \| ``"debug"`` \| [`Logger`](Logger-1.md)

Logger instance used to log queries and events in the ORM.

#### Inherited from

BaseConnectionOptions.logger

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:66

___

### logging

 `Optional` `Readonly` **logging**: [`LoggerOptions`](../types/LoggerOptions.md)

Logging options.

#### Inherited from

BaseConnectionOptions.logging

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:62

___

### maxQueryExecutionTime

 `Optional` `Readonly` **maxQueryExecutionTime**: `number`

Maximum number of milliseconds query should be executed before logger log a warning.

#### Inherited from

BaseConnectionOptions.maxQueryExecutionTime

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:70

___

### metadataTableName

 `Optional` `Readonly` **metadataTableName**: `string`

Typeorm metadata table name, in case of different name from "typeorm_metadata".
Accepts single string name.

#### Inherited from

BaseConnectionOptions.metadataTableName

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:54

___

### migrations

 `Optional` `Readonly` **migrations**: [`MixedList`](../types/MixedList.md)<`string` \| `Function`\>

Migrations to be loaded for this connection.
Accepts both migration classes and glob patterns representing migration files.

#### Inherited from

BaseConnectionOptions.migrations

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:40

___

### migrationsRun

 `Optional` `Readonly` **migrationsRun**: `boolean`

Indicates if migrations should be auto run on every application launch.
Alternative to it, you can use CLI and run migrations:run command.

#### Inherited from

BaseConnectionOptions.migrationsRun

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:89

___

### migrationsTableName

 `Optional` `Readonly` **migrationsTableName**: `string`

Migrations table name, in case of different name from "migrations".
Accepts single string name.

#### Inherited from

BaseConnectionOptions.migrationsTableName

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:45

___

### migrationsTransactionMode

 `Optional` `Readonly` **migrationsTransactionMode**: ``"all"`` \| ``"none"`` \| ``"each"``

Transaction mode for migrations to run in

#### Inherited from

BaseConnectionOptions.migrationsTransactionMode

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:49

___

### multipleStatements

 `Optional` `Readonly` **multipleStatements**: `boolean`

Allow multiple mysql statements per query. Be careful with this, it could increase the scope of SQL injection attacks.
(Default: false)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:75

___

### name

 `Optional` `Readonly` **name**: `string`

Connection name. If connection name is not given then it will be called "default".
Different connections must have different names.

**Deprecated**

#### Inherited from

BaseConnectionOptions.name

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:23

___

### namingStrategy

 `Optional` `Readonly` **namingStrategy**: [`NamingStrategyInterface`](NamingStrategyInterface.md)

Naming strategy to be used to name tables and columns in the database.

#### Inherited from

BaseConnectionOptions.namingStrategy

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:58

___

### poolSize

 `Optional` `Readonly` **poolSize**: `undefined`

#### Overrides

BaseConnectionOptions.poolSize

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:120

___

### projectId

 `Optional` `Readonly` **projectId**: `string`

Database host.

#### Inherited from

[SpannerConnectionCredentialsOptions](SpannerConnectionCredentialsOptions.md).[projectId](SpannerConnectionCredentialsOptions.md#projectid)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionCredentialsOptions.d.ts:12

___

### relationLoadStrategy

 `Optional` `Readonly` **relationLoadStrategy**: ``"join"`` \| ``"query"``

Specifies how relations must be loaded - using "joins" or separate queries.
If you are loading too much data with nested joins it's better to load relations
using separate queries.

Default strategy is "join", but this default can be changed here.
Also, strategy can be set per-query in FindOptions and QueryBuilder.

#### Inherited from

BaseConnectionOptions.relationLoadStrategy

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
| `master` | [`SpannerConnectionCredentialsOptions`](SpannerConnectionCredentialsOptions.md) | Master server used by orm to perform writes. |
| `removeNodeErrorCount?` | `number` | If connection fails, node's errorCount increases. When errorCount is greater than removeNodeErrorCount, remove a node in the PoolCluster. (Default: 5) |
| `restoreNodeTimeout?` | `number` | If connection fails, specifies the number of milliseconds before another connection attempt will be made. If set to 0, then node will be removed instead and never re-used. (Default: 0) |
| `selector?` | ``"RR"`` \| ``"RANDOM"`` \| ``"ORDER"`` | Determines how slaves are selected: RR: Select one alternately (Round-Robin). RANDOM: Select the node by random function. ORDER: Select the first node available unconditionally. |
| `slaves` | [`SpannerConnectionCredentialsOptions`](SpannerConnectionCredentialsOptions.md)[] | List of read-from severs (slaves). |

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:89

___

### schema

 `Optional` `Readonly` **schema**: `string`

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:17

___

### subscribers

 `Optional` `Readonly` **subscribers**: [`MixedList`](../types/MixedList.md)<`string` \| `Function`\>

Subscribers to be loaded for this connection.
Accepts both subscriber classes and directories where from subscribers need to be loaded.
Directories support glob patterns.

#### Inherited from

BaseConnectionOptions.subscribers

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:35

___

### supportBigNumbers

 `Optional` `Readonly` **supportBigNumbers**: `boolean`

When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option (Default: false)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:47

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

BaseConnectionOptions.synchronize

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:84

___

### timezone

 `Optional` `Readonly` **timezone**: `string`

The timezone configured on the MySQL server.
This is used to type cast server date/time values to JavaScript Date object and vice versa.
This can be 'local', 'Z', or an offset in the form +HH:MM or -HH:MM. (Default: 'local')

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:29

___

### trace

 `Optional` `Readonly` **trace**: `boolean`

Generates stack traces on Error to include call site of library entrance ("long stack traces").
Slight performance penalty for most calls. (Default: true)

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:70

___

### type

 `Readonly` **type**: ``"spanner"``

Database type.

#### Overrides

BaseConnectionOptions.type

#### Defined in

node_modules/typeorm/driver/spanner/SpannerConnectionOptions.d.ts:10

___

### typename

 `Optional` `Readonly` **typename**: `string`

Optionally applied "typename" to the model.
If set, then each hydrated model will have this property with the target model / entity name inside.

(works like a discriminator property).

#### Inherited from

BaseConnectionOptions.typename

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:125
