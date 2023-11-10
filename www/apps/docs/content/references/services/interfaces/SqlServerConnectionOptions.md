# SqlServerConnectionOptions

Microsoft Sql Server specific connection options.

## Hierarchy

- [`BaseDataSourceOptions`](BaseDataSourceOptions.md)

- [`SqlServerConnectionCredentialsOptions`](SqlServerConnectionCredentialsOptions.md)

  ↳ **`SqlServerConnectionOptions`**

## Properties

### authentication

 `Optional` `Readonly` **authentication**: [`SqlServerConnectionCredentialsAuthenticationOptions`](../index.md#sqlserverconnectioncredentialsauthenticationoptions)

Authentication settings
It overrides username and password, when passed.

#### Inherited from

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[authentication](SqlServerConnectionCredentialsOptions.md#authentication)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:41

___

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[cache](BaseDataSourceOptions.md#cache)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### connectionTimeout

 `Optional` `Readonly` **connectionTimeout**: `number`

Connection timeout in ms (default: 15000).

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:14

___

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Inherited from

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[database](SqlServerConnectionCredentialsOptions.md#database)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:28

___

### domain

 `Optional` `Readonly` **domain**: `string`

Once you set domain, driver will connect to SQL Server using domain login.

**See**

 - SqlServerConnectionCredentialsOptions.authentication
 - NtlmAuthentication

**Deprecated**

#### Inherited from

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[domain](SqlServerConnectionCredentialsOptions.md#domain)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:48

___

### driver

 `Optional` `Readonly` **driver**: `any`

The driver object
This defaults to `require("mssql")`

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:33

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

 `Optional` `Readonly` **entities**: [`MixedList`](../index.md#mixedlist)<`string` \| `Function` \| [`EntitySchema`](../classes/EntitySchema.md)<`any`\>\>

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

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[host](SqlServerConnectionCredentialsOptions.md#host)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:20

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

 `Optional` `Readonly` **logging**: [`LoggerOptions`](../index.md#loggeroptions)

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

 `Optional` `Readonly` **migrations**: [`MixedList`](../index.md#mixedlist)<`string` \| `Function`\>

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

### options

 `Optional` `Readonly` **options**: `Object`

Extra options

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `abortTransactionOnError?` | `boolean` | A boolean determining whether to rollback a transaction automatically if any error is encountered during the given transaction's execution. This sets the value for SET XACT_ABORT during the initial SQL phase of a connection (documentation). |
| `appName?` | `string` | Application name used for identifying a specific application in profiling, logging or tracing tools of SQL Server. (default: node-mssql) |
| `camelCaseColumns?` | `boolean` | A boolean, controlling whether the column names returned will have the first letter converted to lower case (true) or not. This value is ignored if you provide a columnNameReplacer. (default: false). |
| `cancelTimeout?` | `number` | The number of milliseconds before the cancel (abort) of a request is considered failed (default: 5000). |
| `connectTimeout?` | `number` | The number of milliseconds before the attempt to connect is considered failed (default: 15000). |
| `connectionIsolationLevel?` | ``"SERIALIZABLE"`` \| ``"READ_UNCOMMITTED"`` \| ``"READ_COMMITTED"`` \| ``"REPEATABLE_READ"`` \| ``"SNAPSHOT"`` | The default isolation level for new connections. All out-of-transaction queries are executed with this setting. The isolation levels are available from require('tedious').ISOLATION_LEVEL . |
| `cryptoCredentialsDetails?` | `any` | When encryption is used, an object may be supplied that will be used for the first argument when calling tls.createSecurePair (default: {}). |
| `debug?` | { `data?`: `boolean` ; `packet?`: `boolean` ; `payload?`: `boolean` ; `token?`: `boolean`  } | Debug options |
| `debug.data?` | `boolean` | A boolean, controlling whether debug events will be emitted with text describing packet data details (default: false). |
| `debug.packet?` | `boolean` | A boolean, controlling whether debug events will be emitted with text describing packet details (default: false). |
| `debug.payload?` | `boolean` | A boolean, controlling whether debug events will be emitted with text describing packet payload details (default: false). |
| `debug.token?` | `boolean` | A boolean, controlling whether debug events will be emitted with text describing token stream tokens (default: false). |
| `disableOutputReturning?` | `boolean` | A boolean, controlling whatever to disable RETURNING / OUTPUT statements. |
| `enableAnsiNullDefault?` | `boolean` | If true, SET ANSI_NULL_DFLT_ON ON will be set in the initial sql. This means new columns will be nullable by default. See the T-SQL documentation for more details. (Default: true). |
| `enableArithAbort?` | `boolean` | A boolean, that when true will abort a query when an overflow or divide-by-zero error occurs during query execution. |
| `encrypt?` | `boolean` | A boolean determining whether or not the connection will be encrypted. Set to true if you're on Windows Azure. (default: true). |
| `fallbackToDefaultDb?` | `boolean` | By default, if the database requestion by options.database cannot be accessed, the connection will fail with an error. However, if options.fallbackToDefaultDb is set to true, then the user's default database will be used instead (Default: false). |
| `instanceName?` | `string` | The named instance to connect to |
| `isolation?` | ``"SERIALIZABLE"`` \| ``"READ_UNCOMMITTED"`` \| ``"READ_COMMITTED"`` \| ``"REPEATABLE_READ"`` \| ``"SNAPSHOT"`` | The default isolation level that transactions will be run with. The isolation levels are available from require('tedious').ISOLATION_LEVEL. (default: READ_COMMITTED). |
| `localAddress?` | `string` | A string indicating which network interface (ip address) to use when connecting to SQL Server. |
| `packetSize?` | `number` | The size of TDS packets (subject to negotiation with the server). Should be a power of 2. (default: 4096). |
| `readOnlyIntent?` | `boolean` | A boolean, determining whether the connection will request read only access from a SQL Server Availability Group. For more information, see here. (default: false). |
| `rowCollectionOnDone?` | `boolean` | A boolean, that when true will expose received rows in Requests' done* events. See done, doneInProc and doneProc. (default: false) Caution: If many row are received, enabling this option could result in excessive memory usage. |
| `rowCollectionOnRequestCompletion?` | `boolean` | A boolean, that when true will expose received rows in Requests' completion callback. See new Request. (default: false) Caution: If many row are received, enabling this option could result in excessive memory usage. |
| `tdsVersion?` | `string` | The version of TDS to use. If server doesn't support specified version, negotiated version is used instead. The versions are available from require('tedious').TDS_VERSION. (default: 7_4). |
| `trustServerCertificate?` | `boolean` | A boolean, controlling whether encryption occurs if there is no verifiable server certificate. (default: false) |
| `useColumnNames?` | `boolean` | A boolean determining whether to return rows as arrays or key-value collections. (default: false). |
| `useUTC?` | `boolean` | A boolean determining whether to pass time values in UTC or local time. (default: false). |

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:96

___

### password

 `Optional` `Readonly` **password**: `string`

Database password.

#### Inherited from

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[password](SqlServerConnectionCredentialsOptions.md#password)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:36

___

### pool

 `Optional` `Readonly` **pool**: `Object`

An optional object/dictionary with the any of the properties

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `acquireTimeoutMillis?` | `number` | Max milliseconds an acquire call will wait for a resource before timing out. (default no limit), if supplied should non-zero positive integer. |
| `errorHandler?` | (`err`: `any`) => `any` | - |
| `evictionRunIntervalMillis?` | `number` | How often to run eviction checks. Default: 0 (does not run). |
| `fifo?` | `boolean` | If true the oldest resources will be first to be allocated. If false the most recently released resources will be the first to be allocated. This in effect turns the pool's behaviour from a queue into a stack. boolean, (default true) |
| `idleTimeoutMillis?` | `number` | The minimum amount of time that an object may sit idle in the pool before it is eligible for eviction due to idle time. Supercedes softIdleTimeoutMillis Default: 30000 |
| `max?` | `number` | Maximum number of resources to create at any given time. (default=1) |
| `maxWaitingClients?` | `number` | Maximum number of queued requests allowed, additional acquire calls will be callback with an err in a future cycle of the event loop. |
| `min?` | `number` | Minimum number of resources to keep in pool at any given time. If this is set >= max, the pool will silently set the min to equal max. (default=0) |
| `numTestsPerRun?` | `number` | Number of resources to check each eviction run. Default: 3. |
| `priorityRange?` | `number` | Int between 1 and x - if set, borrowers can specify their relative priority in the queue if no resources are available. see example. (default 1) |
| `softIdleTimeoutMillis?` | `number` | Amount of time an object may sit idle in the pool before it is eligible for eviction by the idle object evictor (if any), with the extra condition that at least "min idle" object instances remain in the pool. Default -1 (nothing can get evicted) |
| `testOnBorrow?` | `boolean` | Should the pool validate resources before giving them to clients. Requires that either factory.validate or factory.validateAsync to be specified |

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:37

___

### poolSize

 `Optional` `Readonly` **poolSize**: `undefined`

Maximum number of clients the pool should contain.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[poolSize](BaseDataSourceOptions.md#poolsize)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:245

___

### port

 `Optional` `Readonly` **port**: `number`

Database host port.

#### Inherited from

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[port](SqlServerConnectionCredentialsOptions.md#port)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:24

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
| `master` | [`SqlServerConnectionCredentialsOptions`](SqlServerConnectionCredentialsOptions.md) | Master server used by orm to perform writes. |
| `slaves` | [`SqlServerConnectionCredentialsOptions`](SqlServerConnectionCredentialsOptions.md)[] | List of read-from severs (slaves). |

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:235

___

### requestTimeout

 `Optional` `Readonly` **requestTimeout**: `number`

Request timeout in ms (default: 15000). NOTE: msnodesqlv8 driver doesn't support timeouts < 1 second.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:18

___

### schema

 `Optional` `Readonly` **schema**: `string`

Database schema.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:28

___

### stream

 `Optional` `Readonly` **stream**: `boolean`

Stream recordsets/rows instead of returning them all at once as an argument of callback (default: false).
You can also enable streaming for each request independently (request.stream = true).
Always set to true if you plan to work with large amount of rows.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:24

___

### subscribers

 `Optional` `Readonly` **subscribers**: [`MixedList`](../index.md#mixedlist)<`string` \| `Function`\>

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

 `Readonly` **type**: ``"mssql"``

Database type.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[type](BaseDataSourceOptions.md#type)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionOptions.d.ts:10

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

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[url](SqlServerConnectionCredentialsOptions.md#url)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:16

___

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Inherited from

[SqlServerConnectionCredentialsOptions](SqlServerConnectionCredentialsOptions.md).[username](SqlServerConnectionCredentialsOptions.md#username)

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:32
