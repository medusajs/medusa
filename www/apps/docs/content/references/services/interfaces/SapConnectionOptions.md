# SapConnectionOptions

SAP Hana specific connection options.

## Hierarchy

- [`BaseDataSourceOptions`](BaseDataSourceOptions.md)

- [`SapConnectionCredentialsOptions`](SapConnectionCredentialsOptions.md)

  ↳ **`SapConnectionOptions`**

## Properties

### ca

 `Optional` `Readonly` **ca**: `string`

Ca for encrypted connection

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[ca](SapConnectionCredentialsOptions.md#ca)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:44

___

### cache

 `Optional` `Readonly` **cache**: `boolean` \| { `alwaysEnabled?`: `boolean` ; `duration?`: `number` ; `ignoreErrors?`: `boolean` ; `options?`: `any` ; `provider?`: (`connection`: [`DataSource`](../classes/DataSource.md)) => [`QueryResultCache`](QueryResultCache.md) ; `tableName?`: `string` ; `type?`: ``"database"`` \| ``"redis"`` \| ``"ioredis"`` \| ``"ioredis/cluster"``  }

Allows to setup cache options.

#### Inherited from

[BaseDataSourceOptions](BaseDataSourceOptions.md).[cache](BaseDataSourceOptions.md#cache)

#### Defined in

node_modules/typeorm/data-source/BaseDataSourceOptions.d.ts:129

___

### cert

 `Optional` `Readonly` **cert**: `string`

Cert for encrypted connection

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[cert](SapConnectionCredentialsOptions.md#cert)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:40

___

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[database](SapConnectionCredentialsOptions.md#database)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:24

___

### driver

 `Optional` `Readonly` **driver**: `any`

The driver objects
This defaults to require("hdb-pool")

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionOptions.d.ts:19

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

### encrypt

 `Optional` `Readonly` **encrypt**: `boolean`

Encrypt database connection

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[encrypt](SapConnectionCredentialsOptions.md#encrypt)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:28

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

### hanaClientDriver

 `Optional` `Readonly` **hanaClientDriver**: `any`

The driver objects
This defaults to require("@sap/hana-client")

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionOptions.d.ts:24

___

### host

 `Optional` `Readonly` **host**: `string`

Database host.

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[host](SapConnectionCredentialsOptions.md#host)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:8

___

### key

 `Optional` `Readonly` **key**: `string`

Key for encrypted connection

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[key](SapConnectionCredentialsOptions.md#key)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:36

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

### password

 `Optional` `Readonly` **password**: `string`

Database password.

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[password](SapConnectionCredentialsOptions.md#password)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:20

___

### pool

 `Optional` `Readonly` **pool**: `Object`

Pool options.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `checkInterval?` | `number` | How often to run resource timeout checks. (default=0, disabled) |
| `idleTimeout?` | `number` | Idle timeout |
| `max?` | `number` | Max number of connections. |
| `maxWaitingRequests?` | `number` | Maximum number of waiting requests allowed. (default=0, no limit). |
| `min?` | `number` | Minimum number of connections. |
| `poolErrorHandler?` | (`err`: `any`) => `any` | Function handling errors thrown by drivers pool. Defaults to logging error with `warn` level. |
| `requestTimeout?` | `number` | Max milliseconds a request will wait for a resource before timing out. (default=5000) |

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionOptions.d.ts:28

___

### poolSize

 `Optional` `Readonly` **poolSize**: `undefined`

Maximum number of clients the pool should contain.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[poolSize](BaseDataSourceOptions.md#poolsize)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionOptions.d.ts:59

___

### port

 `Optional` `Readonly` **port**: `number`

Database host port.

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[port](SapConnectionCredentialsOptions.md#port)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:12

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

### schema

 `Optional` `Readonly` **schema**: `string`

Database schema.

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionOptions.d.ts:14

___

### sslValidateCertificate

 `Optional` `Readonly` **sslValidateCertificate**: `boolean`

Validate database certificate

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[sslValidateCertificate](SapConnectionCredentialsOptions.md#sslvalidatecertificate)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:32

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

 `Readonly` **type**: ``"sap"``

Database type.

#### Overrides

[BaseDataSourceOptions](BaseDataSourceOptions.md).[type](BaseDataSourceOptions.md#type)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionOptions.d.ts:10

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

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Inherited from

[SapConnectionCredentialsOptions](SapConnectionCredentialsOptions.md).[username](SapConnectionCredentialsOptions.md#username)

#### Defined in

node_modules/typeorm/driver/sap/SapConnectionCredentialsOptions.d.ts:16
