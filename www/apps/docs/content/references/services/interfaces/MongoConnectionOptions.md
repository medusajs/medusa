# MongoConnectionOptions

MongoDB specific connection options.
Synced with http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html

## Hierarchy

- [`BaseDataSourceOptions`](BaseDataSourceOptions.md)

  ↳ **`MongoConnectionOptions`**

## Properties

### acceptableLatencyMS

 `Optional` `Readonly` **acceptableLatencyMS**: `number`

Sets the range of servers to pick when using NEAREST (lowest ping ms + the latency fence, ex: range of 1 to (1 + 15) ms).
Default: 15

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:133

___

### appname

 `Optional` `Readonly` **appname**: `string`

The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:233

___

### authMechanism

 `Optional` `Readonly` **authMechanism**: `string`

Sets the authentication mechanism that MongoDB will use to authenticate the connection

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:237

___

### authSource

 `Optional` `Readonly` **authSource**: `string`

If the database authentication is dependent on another databaseName.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:146

___

### autoEncryption

 `Optional` `Readonly` **autoEncryption**: `any`

Automatic Client-Side Field Level Encryption configuration.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:278

___

### autoReconnect

 `Optional` `Readonly` **autoReconnect**: `boolean`

Reconnect on error. Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:87

___

### auto\_reconnect

 `Optional` `Readonly` **auto\_reconnect**: `boolean`

Enable auto reconnecting for single server instances. Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:257

___

### bufferMaxEntries

 `Optional` `Readonly` **bufferMaxEntries**: `number`

Sets a cap on how many operations the driver will buffer up before giving up on getting a working connection,
default is -1 which is unlimited.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:195

___

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[cache](BaseDataSourceOptions.md#cache)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### checkServerIdentity

 `Optional` `Readonly` **checkServerIdentity**: `boolean` \| `Function`

Ensure we check server identify during SSL, set to false to disable checking. Only works for Node 0.12.x or higher. You can pass in a boolean or your own checkServerIdentity override function
Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:225

___

### compression

 `Optional` `Readonly` **compression**: `any`

Type of compression to use: snappy or zlib

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:241

___

### connectTimeoutMS

 `Optional` `Readonly` **connectTimeoutMS**: `number`

TCP Connection timeout setting. Default: 30000

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:99

___

### connectWithNoPrimary

 `Optional` `Readonly` **connectWithNoPrimary**: `boolean`

Sets if the driver should connect even if no primary is available. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:142

___

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:40

___

### directConnection

 `Optional` `Readonly` **directConnection**: `boolean`

Specifies whether to force dispatch all operations to the specified host. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:44

___

### domainsEnabled

 `Optional` `Readonly` **domainsEnabled**: `boolean`

Enable the wrapping of the callback in the current domain, disabled by default to avoid perf hit. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:190

___

### driver

 `Optional` `Readonly` **driver**: `any`

The driver object
This defaults to require("mongodb")

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:49

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

### family

 `Optional` `Readonly` **family**: `number`

Version of IP stack. Can be 4, 6.
If undefined, will attempt to connect with IPv6, and will fall back to IPv4 on failure

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:104

___

### forceServerObjectId

 `Optional` `Readonly` **forceServerObjectId**: `boolean`

Force server to assign _id values instead of driver. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:162

___

### fsync

 `Optional` `Readonly` **fsync**: `boolean`

Specify a file sync write concern. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:245

___

### ha

 `Optional` `Readonly` **ha**: `boolean`

Control if high availability monitoring runs for Replicaset or Mongos proxies. Default true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:120

___

### haInterval

 `Optional` `Readonly` **haInterval**: `number`

The High availability period for replicaset inquiry. Default: 10000

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:124

___

### host

 `Optional` `Readonly` **host**: `string`

Database host.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:20

___

### hostReplicaSet

 `Optional` `Readonly` **hostReplicaSet**: `string`

Database host replica set.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:24

___

### ignoreUndefined

 `Optional` `Readonly` **ignoreUndefined**: `boolean`

Specify if the BSON serializer should ignore undefined fields. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:170

___

### j

 `Optional` `Readonly` **j**: `boolean`

Specify a journal write concern. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:158

___

### keepAlive

 `Optional` `Readonly` **keepAlive**: `number`

The number of milliseconds to wait before initiating keepAlive on the TCP socket. Default: 30000

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:95

___

### logger

 `Optional` `Readonly` **logger**: ``"advanced-console"`` \| ``"simple-console"`` \| ``"file"`` \| ``"debug"`` \| [`Logger`](Logger-1.md)

Logger instance used to log queries and events in the ORM.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[logger](BaseDataSourceOptions.md#logger)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:66

___

### loggerLevel

 `Optional` `Readonly` **loggerLevel**: ``"info"`` \| ``"debug"`` \| ``"error"`` \| ``"warn"``

Specify the log level used by the driver logger (error/warn/info/debug).

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:220

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

### maxStalenessSeconds

 `Optional` `Readonly` **maxStalenessSeconds**: `number`

Specify a maxStalenessSeconds value for secondary reads, minimum is 90 seconds

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:216

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

### minSize

 `Optional` `Readonly` **minSize**: `number`

If present, the connection pool will be initialized with minSize connections, and will never dip below minSize connections

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:265

___

### monitorCommands

 `Optional` `Readonly` **monitorCommands**: `boolean`

Enable command monitoring for this client. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:261

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

### noDelay

 `Optional` `Readonly` **noDelay**: `boolean`

TCP Socket NoDelay option. Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:91

___

### numberOfRetries

 `Optional` `Readonly` **numberOfRetries**: `number`

The number of retries for a tailable cursor. Default: 5

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:253

___

### password

 `Optional` `Readonly` **password**: `string`

Database password.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:36

___

### pkFactory

 `Optional` `Readonly` **pkFactory**: `any`

A primary key factory object for generation of custom _id keys.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:204

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

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:28

___

### promiseLibrary

 `Optional` `Readonly` **promiseLibrary**: `any`

A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:208

___

### promoteBuffers

 `Optional` `Readonly` **promoteBuffers**: `boolean`

Promotes Binary BSON values to native Node Buffers. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:182

___

### promoteLongs

 `Optional` `Readonly` **promoteLongs**: `boolean`

Promotes Long values to number if they fit inside the 53 bits resolution. Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:178

___

### promoteValues

 `Optional` `Readonly` **promoteValues**: `boolean`

Promotes BSON values to native types where possible, set to false to only receive wrapper types. Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:186

___

### raw

 `Optional` `Readonly` **raw**: `boolean`

Return document results as raw BSON buffers. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:174

___

### readConcern

 `Optional` `Readonly` **readConcern**: `any`

Specify a read concern for the collection. (only MongoDB 3.2 or higher supported).

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:212

___

### readPreference

 `Optional` `Readonly` **readPreference**: `string` \| [`ReadPreference`](../classes/ReadPreference.md)

The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY,
ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:200

___

### readPreferenceTags

 `Optional` `Readonly` **readPreferenceTags**: `any`[]

Read preference tags

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:249

___

### reconnectInterval

 `Optional` `Readonly` **reconnectInterval**: `number`

Server will wait #milliseconds between retries. Default 1000

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:116

___

### reconnectTries

 `Optional` `Readonly` **reconnectTries**: `number`

Server attempt to reconnect #times. Default 30

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:112

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

### replicaSet

 `Optional` `Readonly` **replicaSet**: `string`

The name of the replicaset to connect to

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:128

___

### retryWrites

 `Optional` `Readonly` **retryWrites**: `boolean`

Enables or disables the ability to retry writes upon encountering transient network errors.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:282

___

### secondaryAcceptableLatencyMS

 `Optional` `Readonly` **secondaryAcceptableLatencyMS**: `number`

Sets the range of servers to pick when using NEAREST (lowest ping ms + the latency fence, ex: range of 1 to (1 + 15) ms).
Default: 15

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:138

___

### serializeFunctions

 `Optional` `Readonly` **serializeFunctions**: `boolean`

Serialize functions on any object. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:166

___

### socketTimeoutMS

 `Optional` `Readonly` **socketTimeoutMS**: `number`

TCP Socket timeout setting. Default: 360000

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:108

___

### ssl

 `Optional` `Readonly` **ssl**: `boolean`

Use ssl connection (needs to have a mongod server with ssl support). Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:53

___

### sslCA

 `Optional` `Readonly` **sslCA**: `string` \| [`Buffer`](../index.md#buffer)

Array of valid certificates either as Buffers or Strings
(needs to have a mongod server with ssl support, 2.4 or higher).

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:63

___

### sslCRL

 `Optional` `Readonly` **sslCRL**: `string` \| [`Buffer`](../index.md#buffer)

SSL Certificate revocation list binary buffer
(needs to have a mongod server with ssl support, 2.4 or higher)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:83

___

### sslCert

 `Optional` `Readonly` **sslCert**: `string` \| [`Buffer`](../index.md#buffer)

String or buffer containing the certificate we wish to present
(needs to have a mongod server with ssl support, 2.4 or higher)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:68

___

### sslKey

 `Optional` `Readonly` **sslKey**: `string`

String or buffer containing the certificate private key we wish to present
(needs to have a mongod server with ssl support, 2.4 or higher)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:73

___

### sslPass

 `Optional` `Readonly` **sslPass**: `string` \| [`Buffer`](../index.md#buffer)

String or buffer containing the certificate password
(needs to have a mongod server with ssl support, 2.4 or higher)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:78

___

### sslValidate

 `Optional` `Readonly` **sslValidate**: `boolean`

Validate mongod server certificate against ca (needs to have a mongod server with ssl support, 2.4 or higher).
Default: true

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:58

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

 `Readonly` **type**: ``"mongodb"``

Database type.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[type](BaseDataSourceOptions.md#type)

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:12

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

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:16

___

### useNewUrlParser

 `Optional` `Readonly` **useNewUrlParser**: `boolean`

Determines whether or not to use the new url parser. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:269

___

### useUnifiedTopology

 `Optional` `Readonly` **useUnifiedTopology**: `boolean`

Determines whether or not to use the new Server Discovery and Monitoring engine. Default: false
https://github.com/mongodb/node-mongodb-native/releases/tag/v3.2.1

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:274

___

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:32

___

### validateOptions

 `Optional` `Readonly` **validateOptions**: `any`

Validate MongoClient passed in options for correctness. Default: false

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:229

___

### w

 `Optional` `Readonly` **w**: `string` \| `number`

The write concern.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:150

___

### wtimeout

 `Optional` `Readonly` **wtimeout**: `number`

The write concern timeout value.

#### Defined in

node_modules/typeorm/driver/mongodb/MongoConnectionOptions.d.ts:154
