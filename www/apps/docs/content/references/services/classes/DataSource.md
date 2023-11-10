# DataSource

DataSource is a pre-defined connection configuration to a specific database.
You can have multiple data sources connected (with multiple connections in it),
connected to multiple databases in your application.

Before, it was called `Connection`, but now `Connection` is deprecated
because `Connection` isn't the best name for what it's actually is.

## Constructors

### constructor

**new DataSource**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`DataSourceOptions`](../index.md#datasourceoptions) |

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:95

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:34

___

### driver

 **driver**: [`Driver`](../interfaces/Driver.md)

Database driver used by this connection.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:52

___

### entityMetadatas

 `Readonly` **entityMetadatas**: [`EntityMetadata`](EntityMetadata.md)[]

All entity metadatas that are registered for this connection.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:80

___

### entityMetadatasMap

 `Readonly` **entityMetadatasMap**: `Map`<[`EntityTarget`](../index.md#entitytarget)<`any`\>, [`EntityMetadata`](EntityMetadata.md)\>

All entity metadatas that are registered for this connection.
This is a copy of #.entityMetadatas property -> used for more performant searches.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:85

___

### isInitialized

 `Readonly` **isInitialized**: `boolean`

Indicates if DataSource is initialized or not.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:48

___

### logger

 **logger**: [`Logger`](../interfaces/Logger-1.md)

Logger used to log orm events.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:68

___

### manager

 `Readonly` **manager**: [`EntityManager`](EntityManager.md)

EntityManager of this connection.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:56

___

### metadataTableName

 `Readonly` **metadataTableName**: `string`

Name for the metadata table

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:64

___

### migrations

 `Readonly` **migrations**: [`MigrationInterface`](../interfaces/MigrationInterface.md)[]

Migration instances that are registered for this connection.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:72

___

### name

 `Readonly` **name**: `string`

Connection name.

**Deprecated**

we don't need names anymore since we are going to drop all related methods relying on this property.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:40

___

### namingStrategy

 **namingStrategy**: [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md)

Naming strategy used in the connection.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:60

___

### options

 `Readonly` **options**: [`DataSourceOptions`](../index.md#datasourceoptions)

Connection options.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:44

___

### queryResultCache

 `Optional` **queryResultCache**: [`QueryResultCache`](../interfaces/QueryResultCache.md)

Used to work with query result cache.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:89

___

### relationIdLoader

 `Readonly` **relationIdLoader**: [`RelationIdLoader`](RelationIdLoader.md)

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:94

___

### relationLoader

 `Readonly` **relationLoader**: [`RelationLoader`](RelationLoader.md)

Used to load relations and work with lazy relations.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:93

___

### subscribers

 `Readonly` **subscribers**: [`EntitySubscriberInterface`](../interfaces/EntitySubscriberInterface.md)<`any`\>[]

Entity subscriber instances that are registered for this connection.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:76

## Accessors

### isConnected

`get` **isConnected**(): `boolean`

Indicates if DataSource is initialized or not.
*
*

#### Returns

`boolean`

-`boolean`: (optional) 

**Deprecated**

use .isInitialized instead

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:101

___

### mongoManager

`get` **mongoManager**(): [`MongoEntityManager`](MongoEntityManager.md)

Gets the mongodb entity manager that allows to perform mongodb-specific repository operations
with any entity in this connection.

Available only in mongodb connections.

#### Returns

[`MongoEntityManager`](MongoEntityManager.md)

-`MongoEntityManager`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:108

___

### sqljsManager

`get` **sqljsManager**(): [`SqljsEntityManager`](SqljsEntityManager.md)

Gets a sql.js specific Entity Manager that allows to perform special load and save operations

Available only in connection with the sqljs driver.

#### Returns

[`SqljsEntityManager`](SqljsEntityManager.md)

-`SqljsEntityManager`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:114

## Methods

### buildMetadatas

`Protected` **buildMetadatas**(): `Promise`<`void`\>

Builds metadatas for all registered classes inside this connection.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:253

___

### close

**close**(): `Promise`<`void`\>

Closes connection with the database.
Once connection is closed, you cannot use repositories or perform any operations except opening connection again.

#### Returns

`Promise`<`void`\>

-`Promise`: 

**Deprecated**

use .destroy method instead

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:146

___

### connect

**connect**(): `Promise`<[`DataSource`](DataSource.md)\>

Performs connection to the database.
This method should be called once on application bootstrap.
This method not necessarily creates database connection (depend on database type),
but it also can setup a connection pool with database to use.

#### Returns

`Promise`<[`DataSource`](DataSource.md)\>

-`Promise`: 
	-`DataSource`: 

**Deprecated**

use .initialize method instead

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:134

___

### createEntityManager

**createEntityManager**(`queryRunner?`): [`EntityManager`](EntityManager.md)

Creates an Entity Manager for the current connection with the help of the EntityManagerFactory.

#### Parameters

| Name |
| :------ |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:245

___

### createQueryBuilder

**createQueryBuilder**<`Entity`\>(`entityClass`, `alias`, `queryRunner?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates a new query builder that can be used to build a SQL query.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `alias` | `string` |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:222

**createQueryBuilder**(`queryRunner?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

Creates a new query builder that can be used to build a SQL query.

#### Parameters

| Name |
| :------ |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:226

___

### createQueryRunner

**createQueryRunner**(`mode?`): [`QueryRunner`](../interfaces/QueryRunner.md)

Creates a query runner used for perform queries on a single database connection.
Using query runners you can control your queries to execute using single database connection and
manually control your database transaction.

Mode is used in replication mode and indicates whatever you want to connect
to master database or any of slave databases.
If you perform writes you must use master database,
if you perform reads you can use slave databases.

#### Parameters

| Name |
| :------ |
| `mode?` | [`ReplicationMode`](../index.md#replicationmode) |

#### Returns

[`QueryRunner`](../interfaces/QueryRunner.md)

-`broadcaster`: Broadcaster used on this query runner to broadcast entity events.
	-`queryRunner`: 
-`connection`: Connection used by this query runner.
	-`@instanceof`: 
	-`driver`: Database driver used by this connection.
		-`cteCapabilities`: 
		-`dataTypeDefaults`: Default values of length, precision and scale depends on column data type. Used in the cases when length/precision/scale is not specified by user.
		-`database`: (optional) Database name used to perform all write queries. todo: probably move into query runner.
		-`dummyTableName`: (optional) Dummy table name
		-`isReplicated`: Indicates if replication is enabled.
		-`mappedDataTypes`: Orm has special columns and we need to know what database column types should be for those types. Column types are driver dependant.
		-`maxAliasLength`: (optional) Max length allowed by the DBMS for aliases (execution of queries).
		-`options`: Connection options.
		-`schema`: (optional) Schema name used to perform all write queries.
		-`spatialTypes`: Gets list of spatial column data types.
		-`supportedDataTypes`: Gets list of supported column data types by a driver.
		-`supportedOnDeleteTypes`: (optional) Returns list of supported onDelete types by driver
		-`supportedOnUpdateTypes`: (optional) Returns list of supported onUpdate types by driver
		-`supportedUpsertTypes`: Returns type of upsert supported by driver if any
		-`transactionSupport`: Represent transaction support by this driver
		-`treeSupport`: Indicates if tree tables are supported by this driver.
		-`version`: (optional) Database version/release. Often requires a SQL query to the DB, so it is not always set
		-`withLengthColumnTypes`: Gets list of column data types that support length by a driver.
		-`withPrecisionColumnTypes`: Gets list of column data types that support precision by a driver.
		-`withScaleColumnTypes`: Gets list of column data types that support scale by a driver.
	-`entityMetadatas`: All entity metadatas that are registered for this connection.
		-`@instanceof`: 
		-`afterInsertListeners`: Listener metadatas with "AFTER INSERT" type.
		-`afterLoadListeners`: Listener metadatas with "AFTER LOAD" type.
		-`afterRecoverListeners`: Listener metadatas with "AFTER RECOVER" type.
		-`afterRemoveListeners`: Listener metadatas with "AFTER REMOVE" type.
		-`afterSoftRemoveListeners`: Listener metadatas with "AFTER SOFT REMOVE" type.
		-`afterUpdateListeners`: Listener metadatas with "AFTER UPDATE" type.
		-`allEmbeddeds`: All embeddeds - embeddeds from this entity metadata and from all child embeddeds, etc.
		-`ancestorColumns`: Ancestor columns used only in closure junction tables.
		-`beforeInsertListeners`: Listener metadatas with "AFTER INSERT" type.
		-`beforeRecoverListeners`: Listener metadatas with "BEFORE RECOVER" type.
		-`beforeRemoveListeners`: Listener metadatas with "AFTER REMOVE" type.
		-`beforeSoftRemoveListeners`: Listener metadatas with "BEFORE SOFT REMOVE" type.
		-`beforeUpdateListeners`: Listener metadatas with "AFTER UPDATE" type.
		-`checks`: Entity's check metadatas.
		-`childEntityMetadatas`: Children entity metadatas. Used in inheritance patterns.
		-`closureJunctionTable`: If entity's table is a closure-typed table, then this entity will have a closure junction table metadata.
		-`columns`: Columns of the entity, including columns that are coming from the embeddeds of this entity.
		-`connection`: Connection where this entity metadata is created.
		-`createDateColumn`: (optional) Gets entity column which contains a create date value.
		-`database`: (optional) Database name.
		-`deleteDateColumn`: (optional) Gets entity column which contains a delete date value.
		-`dependsOn`: (optional) View's dependencies. Used in views
		-`descendantColumns`: Descendant columns used only in closure junction tables.
		-`discriminatorColumn`: (optional) Gets the discriminator column used to store entity identificator in single-table inheritance tables.
		-`discriminatorValue`: (optional) If this entity metadata is a child table of some table, it should have a discriminator value. Used to store a value in a discriminator column.
		-`eagerRelations`: List of eager relations this metadata has.
		-`embeddeds`: Entity's embedded metadatas.
		-`engine`: (optional) Table's database engine type (like "InnoDB", "MyISAM", etc).
		-`exclusions`: Entity's exclusion metadatas.
		-`expression`: (optional) View's expression. Used in views
		-`foreignKeys`: Entity's foreign key metadatas.
		-`generatedColumns`: Gets the column with generated flag.
		-`givenTableName`: (optional) Original user-given table name (taken from schema or @Entity(tableName) decorator). If user haven't specified a table name this property will be undefined.
		-`hasMultiplePrimaryKeys`: Checks if entity's table has multiple primary columns.
		-`hasNonNullableRelations`: Checks if there any non-nullable column exist in this entity.
		-`hasUUIDGeneratedColumns`: Indicates if this entity metadata has uuid generated columns.
		-`indices`: Entity's index metadatas.
		-`inheritancePattern`: (optional) If this entity metadata's table using one of the inheritance patterns, then this will contain what pattern it uses.
		-`inheritanceTree`: All "inheritance tree" from a target entity. For example for target Post < ContentModel < Unit it will be an array of [Post, ContentModel, Unit]. It also contains child entities for single table inheritance.
		-`inverseColumns`: In the case if this entity metadata is junction table's entity metadata, this will contain all referenced columns of inverse entity.
		-`isAlwaysUsingConstructor`: Indicates if the entity should be instantiated using the constructor or via allocating a new object via `Object.create()`.
		-`isClosureJunction`: Checks if this table is a junction table of the closure table. This type is for tables that contain junction metadata of the closure tables.
		-`isJunction`: Indicates if this entity metadata of a junction table, or not. Junction table is a table created by many-to-many relationship. Its also possible to understand if entity is junction via tableType.
		-`lazyRelations`: List of eager relations this metadata has.
		-`listeners`: Entity listener metadatas.
		-`manyToManyRelations`: Gets only many-to-many relations of the entity.
		-`manyToOneRelations`: Gets only many-to-one relations of the entity.
		-`materializedPathColumn`: (optional) Materialized path column. Used only in tree entities with materialized path pattern applied.
		-`name`: Entity's name. Equal to entity target class's name if target is set to table. If target class is not then then it equals to table name.
		-`nestedSetLeftColumn`: (optional) Nested set's left value column. Used only in tree entities with nested set pattern applied.
		-`nestedSetRightColumn`: (optional) Nested set's right value column. Used only in tree entities with nested set pattern applied.
		-`nonVirtualColumns`: All columns except for virtual columns.
		-`objectIdColumn`: (optional) Gets the object id column used with mongodb database.
		-`oneToManyRelations`: Gets only one-to-many relations of the entity.
		-`oneToOneRelations`: Gets only one-to-one relations of the entity.
		-`orderBy`: (optional) Specifies a default order by used for queries from this table when no explicit order by is specified.
		-`ownColumns`: Entity's column metadatas defined by user.
		-`ownIndices`: Entity's own indices.
		-`ownListeners`: Entity's own listener metadatas.
		-`ownRelations`: Entity's relation metadatas.
		-`ownUniques`: Entity's own uniques.
		-`ownerColumns`: In the case if this entity metadata is junction table's entity metadata, this will contain all referenced columns of owner entity.
		-`ownerManyToManyRelations`: Gets only owner many-to-many relations of the entity.
		-`ownerOneToOneRelations`: Gets only owner one-to-one relations of the entity.
		-`parentClosureEntityMetadata`: If this is entity metadata for a junction closure table then its owner closure table metadata will be set here.
		-`parentEntityMetadata`: Parent's entity metadata. Used in inheritance patterns.
		-`primaryColumns`: Gets the primary columns.
		-`propertiesMap`: Map of columns and relations of the entity. example: Post{ id: number, name: string, counterEmbed: { count: number }, category: Category }. This method will create following object: { id: "id", counterEmbed: { count: "counterEmbed.count" }, category: "category" }
		-`relationCounts`: Entity's relation id metadatas.
		-`relationIds`: Entity's relation id metadatas.
		-`relations`: Relations of the entity, including relations that are coming from the embeddeds of this entity.
		-`relationsWithJoinColumns`: Gets only owner one-to-one and many-to-one relations.
		-`schema`: (optional) Schema name. Used in Postgres and Sql Server.
		-`synchronize`: Indicates if schema will be synchronized for this entity or not.
		-`tableMetadataArgs`: Metadata arguments used to build this entity metadata.
		-`tableName`: Entity table name in the database. This is final table name of the entity. This name already passed naming strategy, and generated based on multiple criteria, including user table name and global table prefix.
		-`tableNameWithoutPrefix`: Gets the table name without global table prefix. When querying table you need a table name with prefix, but in some scenarios, for example when you want to name a junction table that contains names of two other tables, you may want a table name without prefix.
		-`tablePath`: Entity table path. Contains database name, schema name and table name. E.g. myDB.mySchema.myTable
		-`tableType`: Table type. Tables can be closure, junction, etc.
		-`target`: Target class to which this entity metadata is bind. Note, that when using table inheritance patterns target can be different rather then table's target. For virtual tables which lack of real entity (like junction tables) target is equal to their table name.
		-`targetName`: Gets the name of the target.
		-`treeChildrenRelation`: (optional) Tree children relation. Used only in tree-tables.
		-`treeLevelColumn`: (optional) Special column that stores tree level in tree entities.
		-`treeOptions`: (optional) Indicates if this entity is a tree, what options of tree it has.
		-`treeParentRelation`: (optional) Tree parent relation. Used only in tree-tables.
		-`treeType`: (optional) Indicates if this entity is a tree, what type of tree it is.
		-`uniques`: Entity's unique metadatas.
		-`updateDateColumn`: (optional) Gets entity column which contains an update date value.
		-`versionColumn`: (optional) Gets entity column which contains an entity version.
		-`withoutRowid`: (optional) Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
		-`getInverseEntityMetadata`: 
	-`entityMetadatasMap`: All entity metadatas that are registered for this connection. This is a copy of #.entityMetadatas property -> used for more performant searches.
	-`isInitialized`: Indicates if DataSource is initialized or not.
	-`logger`: Logger used to log orm events.
	-`manager`: EntityManager of this connection.
		-`@instanceof`: 
		-`callAggregateFun`: 
		-`connection`: Connection used by this entity manager.
		-`plainObjectToEntityTransformer`: Plain to object transformer used in create and merge operations.
		-`queryRunner`: (optional) Custom query runner to be used for operations in this entity manager. Used only in non-global entity manager.
		-`repositories`: Once created and then reused by repositories. Created as a future replacement for the #repositories to provide a bit more perf optimization.
		-`treeRepositories`: Once created and then reused by repositories.
	-`metadataTableName`: Name for the metadata table
	-`migrations`: Migration instances that are registered for this connection.
		-`name`: (optional) Optional migration name, defaults to class name.
		-`transaction`: (optional) Optional flag to determine whether to run the migration in a transaction or not. Can only be used when `migrationsTransactionMode` is either "each" or "none" Defaults to `true` when `migrationsTransactionMode` is "each" Defaults to `false` when `migrationsTransactionMode` is "none"
	-`name`: Connection name.
	-`namingStrategy`: Naming strategy used in the connection.
		-`materializedPathColumnName`: Column name for materialized paths.
		-`name`: (optional) Naming strategy name.
		-`nestedSetColumnNames`: Column names for nested sets.
	-`options`: Connection options.
	-`queryResultCache`: (optional) Used to work with query result cache.
	-`relationIdLoader`: 
		-`connection`: 
		-`queryRunner`: (optional) 
	-`relationLoader`: Used to load relations and work with lazy relations.
		-`connection`: 
	-`subscribers`: Entity subscriber instances that are registered for this connection.
-`data`: Stores temporarily user data. Useful for sharing data with subscribers.
-`isReleased`: Indicates if connection for this query runner is released. Once its released, query runner cannot run queries anymore.
-`isTransactionActive`: Indicates if transaction is in progress.
-`loadedTables`: All synchronized tables in the database.
	-`@instanceof`: 
	-`checks`: Table check constraints.
		-`@instanceof`: 
		-`columnNames`: (optional) Column that contains this constraint.
		-`expression`: (optional) Check expression.
		-`name`: (optional) Constraint name.
	-`columns`: Table columns.
		-`@instanceof`: 
		-`asExpression`: (optional) Generated column expression.
		-`charset`: (optional) Defines column character set.
		-`collation`: (optional) Defines column collation.
		-`comment`: (optional) Column's comment.
		-`default`: (optional) Column's default value.
		-`enum`: (optional) Array of possible enumerated values.
		-`enumName`: (optional) Exact name of enum
		-`generatedIdentity`: (optional) Identity column type. Supports only in Postgres 10+.
		-`generatedType`: (optional) Generated column type.
		-`generationStrategy`: (optional) Specifies generation strategy if this column will use auto increment. `rowid` option supported only in CockroachDB.
		-`isArray`: Indicates if column stores array.
		-`isGenerated`: Indicates if column is auto-generated sequence.
		-`isNullable`: Indicates if column is NULL, or is NOT NULL in the database.
		-`isPrimary`: Indicates if column is a primary key.
		-`isUnique`: Indicates if column has unique value.
		-`length`: Column type's length. Used only on some column types. For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).
		-`name`: Column name.
		-`onUpdate`: (optional) ON UPDATE trigger. Works only for MySQL.
		-`precision`: (optional) The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum number of digits that are stored for the values.
		-`primaryKeyConstraintName`: (optional) Name of the primary key constraint for primary column.
		-`scale`: (optional) The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number of digits to the right of the decimal point and must not be greater than precision.
		-`spatialFeatureType`: (optional) Spatial Feature Type (Geometry, Point, Polygon, etc.)
		-`srid`: (optional) SRID (Spatial Reference ID (EPSG code))
		-`type`: Column type.
		-`unsigned`: Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
		-`width`: (optional) Column type's display width. Used only on some column types in MySQL. For example, INT(4) specifies an INT with a display width of four digits.
		-`zerofill`: Puts ZEROFILL attribute on to numeric column. Works only for MySQL. If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column
	-`database`: (optional) Database name that this table resides in if it applies.
	-`engine`: (optional) Table engine.
	-`exclusions`: Table exclusion constraints.
		-`@instanceof`: 
		-`expression`: (optional) Exclusion expression.
		-`name`: (optional) Constraint name.
	-`foreignKeys`: Table foreign keys.
		-`@instanceof`: 
		-`columnNames`: Column names which included by this foreign key.
		-`deferrable`: (optional) Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start or at the end of a transaction
		-`name`: (optional) Name of the foreign key constraint.
		-`onDelete`: (optional) "ON DELETE" of this foreign key, e.g. what action database should perform when referenced stuff is being deleted.
		-`onUpdate`: (optional) "ON UPDATE" of this foreign key, e.g. what action database should perform when referenced stuff is being updated.
		-`referencedColumnNames`: Column names which included by this foreign key.
		-`referencedDatabase`: (optional) Database of Table referenced in the foreign key.
		-`referencedSchema`: (optional) Database of Table referenced in the foreign key.
		-`referencedTableName`: Table referenced in the foreign key.
	-`indices`: Table indices.
		-`@instanceof`: 
		-`columnNames`: Columns included in this index.
		-`isFulltext`: The FULLTEXT modifier indexes the entire column and does not allow prefixing. Works only in MySQL.
		-`isNullFiltered`: NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value. In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than a normal index that includes NULL values. Works only in Spanner.
		-`isSpatial`: The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values. Works only in MySQL.
		-`isUnique`: Indicates if this index is unique.
		-`name`: (optional) Index name.
		-`parser`: (optional) Fulltext parser. Works only in MySQL.
		-`where`: Index filter condition.
	-`justCreated`: Indicates if table was just created. This is needed, for example to check if we need to skip primary keys creation for new tables.
	-`name`: May contain database name, schema name and table name, unless they're the current database. E.g. myDB.mySchema.myTable
	-`schema`: (optional) Schema name that this table resides in if it applies.
	-`uniques`: Table unique constraints.
		-`@instanceof`: 
		-`columnNames`: Columns that contains this constraint.
		-`deferrable`: (optional) Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start or at the end of a transaction
		-`name`: (optional) Constraint name.
	-`withoutRowid`: (optional) Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
-`loadedViews`: All synchronized views in the database.
	-`@instanceof`: 
	-`database`: (optional) Database name that this view resides in if it applies.
	-`expression`: View definition.
	-`indices`: View Indices
		-`@instanceof`: 
		-`columnNames`: Columns included in this index.
		-`isFulltext`: The FULLTEXT modifier indexes the entire column and does not allow prefixing. Works only in MySQL.
		-`isNullFiltered`: NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value. In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than a normal index that includes NULL values. Works only in Spanner.
		-`isSpatial`: The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values. Works only in MySQL.
		-`isUnique`: Indicates if this index is unique.
		-`name`: (optional) Index name.
		-`parser`: (optional) Fulltext parser. Works only in MySQL.
		-`where`: Index filter condition.
	-`materialized`: Indicates if view is materialized.
	-`name`: View name
	-`schema`: (optional) Schema name that this view resides in if it applies.
-`manager`: Entity manager working only with this query runner.
	-`@instanceof`: 
	-`callAggregateFun`: 
	-`connection`: Connection used by this entity manager.
		-`@instanceof`: 
		-`driver`: Database driver used by this connection.
		-`entityMetadatas`: All entity metadatas that are registered for this connection.
		-`entityMetadatasMap`: All entity metadatas that are registered for this connection. This is a copy of #.entityMetadatas property -> used for more performant searches.
		-`isInitialized`: Indicates if DataSource is initialized or not.
		-`logger`: Logger used to log orm events.
		-`manager`: EntityManager of this connection.
		-`metadataTableName`: Name for the metadata table
		-`migrations`: Migration instances that are registered for this connection.
		-`name`: Connection name.
		-`namingStrategy`: Naming strategy used in the connection.
		-`options`: Connection options.
		-`queryResultCache`: (optional) Used to work with query result cache.
		-`relationIdLoader`: 
		-`relationLoader`: Used to load relations and work with lazy relations.
		-`subscribers`: Entity subscriber instances that are registered for this connection.
	-`plainObjectToEntityTransformer`: Plain to object transformer used in create and merge operations.
		-`groupAndTransform`: Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated we need to group our result and we must have some unique id (primary key in our case)
	-`queryRunner`: (optional) Custom query runner to be used for operations in this entity manager. Used only in non-global entity manager.
		-`broadcaster`: Broadcaster used on this query runner to broadcast entity events.
		-`connection`: Connection used by this query runner.
		-`data`: Stores temporarily user data. Useful for sharing data with subscribers.
		-`isReleased`: Indicates if connection for this query runner is released. Once its released, query runner cannot run queries anymore.
		-`isTransactionActive`: Indicates if transaction is in progress.
		-`loadedTables`: All synchronized tables in the database.
		-`loadedViews`: All synchronized views in the database.
		-`manager`: Entity manager working only with this query runner.
	-`repositories`: Once created and then reused by repositories. Created as a future replacement for the #repositories to provide a bit more perf optimization.
	-`treeRepositories`: Once created and then reused by repositories.
		-`manager`: Entity Manager used by this repository.
		-`queryRunner`: (optional) Query runner provider used for this repository.
		-`target`: Entity target that is managed by this repository. If this repository manages entity from schema, then it returns a name of that schema instead.
-`addColumn`: 
-`addColumns`: 
-`afterMigration`: 
-`beforeMigration`: 
-`changeColumn`: 
-`changeColumns`: 
-`clearDatabase`: 
-`clearSqlMemory`: 
-`clearTable`: 
-`commitTransaction`: 
-`connect`: 
-`createCheckConstraint`: 
-`createCheckConstraints`: 
-`createDatabase`: 
-`createExclusionConstraint`: 
-`createExclusionConstraints`: 
-`createForeignKey`: 
-`createForeignKeys`: 
-`createIndex`: 
-`createIndices`: 
-`createPrimaryKey`: 
-`createSchema`: 
-`createTable`: 
-`createUniqueConstraint`: 
-`createUniqueConstraints`: 
-`createView`: 
-`disableSqlMemory`: 
-`dropCheckConstraint`: 
-`dropCheckConstraints`: 
-`dropColumn`: 
-`dropColumns`: 
-`dropDatabase`: 
-`dropExclusionConstraint`: 
-`dropExclusionConstraints`: 
-`dropForeignKey`: 
-`dropForeignKeys`: 
-`dropIndex`: 
-`dropIndices`: 
-`dropPrimaryKey`: 
-`dropSchema`: 
-`dropTable`: 
-`dropUniqueConstraint`: 
-`dropUniqueConstraints`: 
-`dropView`: 
-`enableSqlMemory`: 
-`executeMemoryDownSql`: 
-`executeMemoryUpSql`: 
-`getCurrentDatabase`: 
-`getCurrentSchema`: 
-`getDatabases`: 
-`getMemorySql`: 
-`getReplicationMode`: 
-`getSchemas`: 
-`getTable`: 
-`getTables`: 
-`getView`: 
-`getViews`: 
-`hasColumn`: 
-`hasDatabase`: 
-`hasSchema`: 
-`hasTable`: 
-`query`: 
-`release`: 
-`renameColumn`: 
-`renameTable`: 
-`rollbackTransaction`: 
-`startTransaction`: 
-`stream`: 
-`updatePrimaryKeys`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:237

___

### destroy

**destroy**(): `Promise`<`void`\>

Closes connection with the database.
Once connection is closed, you cannot use repositories or perform any operations except opening connection again.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:139

___

### dropDatabase

**dropDatabase**(): `Promise`<`void`\>

Drops the database and all its data.
Be careful with this method on production since this method will erase all your database tables and their data.
Can be used only after connection to the database is established.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:159

___

### findMetadata

`Protected` **findMetadata**(`target`): `undefined` \| [`EntityMetadata`](EntityMetadata.md)

Finds exist entity metadata by the given entity class, target name or table name.

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`any`\> |

#### Returns

`undefined` \| [`EntityMetadata`](EntityMetadata.md)

-`undefined \| EntityMetadata`: (optional) 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:249

___

### getCustomRepository

**getCustomRepository**<`T`\>(`customRepository`): `T`

Gets custom entity repository marked with

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `customRepository` | [`ObjectType`](../index.md#objecttype)<`T`\> |

#### Returns

`T`

**Entity Repository**

decorator.

**Deprecated**

use Repository.extend function to create a custom repository

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:208

___

### getManyToManyMetadata

**getManyToManyMetadata**(`entityTarget`, `relationPropertyPath`): `undefined` \| [`EntityMetadata`](EntityMetadata.md)

Gets entity metadata of the junction table (many-to-many table).

#### Parameters

| Name |
| :------ |
| `entityTarget` | [`EntityTarget`](../index.md#entitytarget)<`any`\> |
| `relationPropertyPath` | `string` |

#### Returns

`undefined` \| [`EntityMetadata`](EntityMetadata.md)

-`undefined \| EntityMetadata`: (optional) 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:241

___

### getMetadata

**getMetadata**(`target`): [`EntityMetadata`](EntityMetadata.md)

Gets entity metadata for the given entity class or schema name.

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`any`\> |

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:188

___

### getMongoRepository

**getMongoRepository**<`Entity`\>(`target`): [`MongoRepository`](MongoRepository.md)<`Entity`\>

Gets mongodb-specific repository for the given entity class or name.
Works only if connection is mongodb-specific.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

#### Returns

[`MongoRepository`](MongoRepository.md)<`Entity`\>

-`MongoRepository`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:202

___

### getRepository

**getRepository**<`Entity`\>(`target`): [`Repository`](Repository.md)<`Entity`\>

Gets repository for the given entity.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

#### Returns

[`Repository`](Repository.md)<`Entity`\>

-`Repository`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:192

___

### getTreeRepository

**getTreeRepository**<`Entity`\>(`target`): [`TreeRepository`](TreeRepository.md)<`Entity`\>

Gets tree repository for the given entity class or name.
Only tree-type entities can have a TreeRepository, like ones decorated with

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

#### Returns

[`TreeRepository`](TreeRepository.md)<`Entity`\>

-`TreeRepository`: 

**Tree**

decorator.

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:197

___

### hasMetadata

**hasMetadata**(`target`): `boolean`

Checks if entity metadata exist for the given entity class, target name or table name.

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`any`\> |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:184

___

### initialize

**initialize**(): `Promise`<[`DataSource`](DataSource.md)\>

Performs connection to the database.
This method should be called once on application bootstrap.
This method not necessarily creates database connection (depend on database type),
but it also can setup a connection pool with database to use.

#### Returns

`Promise`<[`DataSource`](DataSource.md)\>

-`Promise`: 
	-`DataSource`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:125

___

### query

**query**<`T`\>(`query`, `parameters?`, `queryRunner?`): `Promise`<`T`\>

Executes raw SQL query and returns raw database results.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:218

___

### runMigrations

**runMigrations**(`options?`): `Promise`<[`Migration`](Migration.md)[]\>

Runs all pending migrations.
Can be used only after connection to the database is established.

#### Parameters

| Name |
| :------ |
| `options?` | `object` |
| `options.fake?` | `boolean` |
| `options.transaction?` | ``"all"`` \| ``"none"`` \| ``"each"`` |

#### Returns

`Promise`<[`Migration`](Migration.md)[]\>

-`Promise`: 
	-`Migration[]`: 
		-`Migration`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:164

___

### setOptions

**setOptions**(`options`): [`DataSource`](DataSource.md)

Updates current connection options with provided options.

#### Parameters

| Name |
| :------ |
| `options` | [`Partial`](../index.md#partial)<[`DataSourceOptions`](../index.md#datasourceoptions)\> |

#### Returns

[`DataSource`](DataSource.md)

-`DataSource`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:118

___

### showMigrations

**showMigrations**(): `Promise`<`boolean`\>

Lists all migrations and whether they have been run.
Returns true if there are pending migrations

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:180

___

### synchronize

**synchronize**(`dropBeforeSync?`): `Promise`<`void`\>

Creates database schema for all entities registered in this connection.
Can be used only after connection to the database is established.

#### Parameters

| Name | Description |
| :------ | :------ |
| `dropBeforeSync?` | `boolean` | If set to true then it drops the database with all its tables and data |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:153

___

### transaction

**transaction**<`T`\>(`runInTransaction`): `Promise`<`T`\>

Wraps given function execution (and all operations made there) into a transaction.
All database operations must be executed using provided entity manager.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `runInTransaction` | (`entityManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:213

**transaction**<`T`\>(`isolationLevel`, `runInTransaction`): `Promise`<`T`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `isolationLevel` | [`IsolationLevel`](../index.md#isolationlevel) |
| `runInTransaction` | (`entityManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:214

___

### undoLastMigration

**undoLastMigration**(`options?`): `Promise`<`void`\>

Reverts last executed migration.
Can be used only after connection to the database is established.

#### Parameters

| Name |
| :------ |
| `options?` | `object` |
| `options.fake?` | `boolean` |
| `options.transaction?` | ``"all"`` \| ``"none"`` \| ``"each"`` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/data-source/DataSource.d.ts:172
