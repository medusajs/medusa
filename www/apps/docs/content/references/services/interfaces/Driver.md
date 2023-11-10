# Driver

Driver organizes TypeORM communication with specific database management system.

## Properties

### cteCapabilities

 **cteCapabilities**: [`CteCapabilities`](CteCapabilities.md)

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:100

___

### dataTypeDefaults

 **dataTypeDefaults**: [`DataTypeDefaults`](DataTypeDefaults.md)

Default values of length, precision and scale depends on column data type.
Used in the cases when length/precision/scale is not specified by user.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:74

___

### database

 `Optional` **database**: `string`

Database name used to perform all write queries.

todo: probably move into query runner.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:37

___

### dummyTableName

 `Optional` **dummyTableName**: `string`

Dummy table name

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:104

___

### isReplicated

 **isReplicated**: `boolean`

Indicates if replication is enabled.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:45

___

### mappedDataTypes

 **mappedDataTypes**: [`MappedColumnTypes`](MappedColumnTypes.md)

Orm has special columns and we need to know what database column types should be for those types.
Column types are driver dependant.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:95

___

### maxAliasLength

 `Optional` **maxAliasLength**: `number`

Max length allowed by the DBMS for aliases (execution of queries).

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:99

___

### options

 **options**: [`BaseDataSourceOptions`](BaseDataSourceOptions.md)

Connection options.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:27

___

### schema

 `Optional` **schema**: `string`

Schema name used to perform all write queries.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:41

___

### spatialTypes

 **spatialTypes**: [`ColumnType`](../index.md#columntype)[]

Gets list of spatial column data types.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:78

___

### supportedDataTypes

 **supportedDataTypes**: [`ColumnType`](../index.md#columntype)[]

Gets list of supported column data types by a driver.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:57

___

### supportedOnDeleteTypes

 `Optional` **supportedOnDeleteTypes**: [`OnDeleteType`](../index.md#ondeletetype)[]

Returns list of supported onDelete types by driver

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:65

___

### supportedOnUpdateTypes

 `Optional` **supportedOnUpdateTypes**: [`OnUpdateType`](../index.md#onupdatetype)[]

Returns list of supported onUpdate types by driver

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:69

___

### supportedUpsertTypes

 **supportedUpsertTypes**: [`UpsertType`](../index.md#upserttype)[]

Returns type of upsert supported by driver if any

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:61

___

### transactionSupport

 **transactionSupport**: ``"none"`` \| ``"simple"`` \| ``"nested"``

Represent transaction support by this driver

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:53

___

### treeSupport

 **treeSupport**: `boolean`

Indicates if tree tables are supported by this driver.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:49

___

### version

 `Optional` **version**: `string`

Database version/release. Often requires a SQL query to the DB, so it is not always set

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:31

___

### withLengthColumnTypes

 **withLengthColumnTypes**: [`ColumnType`](../index.md#columntype)[]

Gets list of column data types that support length by a driver.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:82

___

### withPrecisionColumnTypes

 **withPrecisionColumnTypes**: [`ColumnType`](../index.md#columntype)[]

Gets list of column data types that support precision by a driver.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:86

___

### withScaleColumnTypes

 **withScaleColumnTypes**: [`ColumnType`](../index.md#columntype)[]

Gets list of column data types that support scale by a driver.

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:90

## Methods

### afterConnect

**afterConnect**(): `Promise`<`void`\>

Makes any action after connection (e.g. create extensions in Postgres driver).

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:113

___

### buildTableName

**buildTableName**(`tableName`, `schema?`, `database?`): `string`

Build full table name with database name, schema name and table name.
E.g. myDB.mySchema.myTable

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `schema?` | `string` |
| `database?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:141

___

### connect

**connect**(): `Promise`<`void`\>

Performs connection to the database.
Depend on driver type it may create a connection pool.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:109

___

### createFullType

**createFullType**(`column`): `string`

Normalizes "default" value of the column.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](../classes/TableColumn.md) |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:183

___

### createGeneratedMap

**createGeneratedMap**(`metadata`, `insertResult`, `entityIndex?`, `entityNum?`): `undefined` \| [`ObjectLiteral`](ObjectLiteral.md)

Creates generated map of values generated or returned by database after INSERT query.

#### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `insertResult` | `any` |
| `entityIndex?` | `number` |
| `entityNum?` | `number` |

#### Returns

`undefined` \| [`ObjectLiteral`](ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:199

___

### createParameter

**createParameter**(`parameterName`, `index`): `string`

Creates an escaped parameter.

#### Parameters

| Name |
| :------ |
| `parameterName` | `string` |
| `index` | `number` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:220

___

### createQueryRunner

**createQueryRunner**(`mode`): [`QueryRunner`](QueryRunner.md)

Creates a query runner used for common queries.

#### Parameters

| Name |
| :------ |
| `mode` | [`ReplicationMode`](../index.md#replicationmode) |

#### Returns

[`QueryRunner`](QueryRunner.md)

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

node_modules/typeorm/driver/Driver.d.ts:125

___

### createSchemaBuilder

**createSchemaBuilder**(): [`SchemaBuilder`](SchemaBuilder.md)

Synchronizes database schema (creates tables, indices, etc).

#### Returns

[`SchemaBuilder`](SchemaBuilder.md)

-`build`: 
-`log`: 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:121

___

### disconnect

**disconnect**(): `Promise`<`void`\>

Closes connection with database and releases all resources.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:117

___

### escape

**escape**(`name`): `string`

Escapes a table name, column name or an alias.

todo: probably escape should be able to handle dots in the names and automatically escape them

#### Parameters

| Name |
| :------ |
| `name` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:136

___

### escapeQueryWithParameters

**escapeQueryWithParameters**(`sql`, `parameters`, `nativeParameters`): [`string`, `any`[]]

Replaces parameters in the given sql with special escaping character
and an array of parameter names to be passed to a query.

#### Parameters

| Name |
| :------ |
| `sql` | `string` |
| `parameters` | [`ObjectLiteral`](ObjectLiteral.md) |
| `nativeParameters` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`string`, `any`[]]

-`[`string`, `any`[]]`: 
	-`string`: (optional) 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:130

___

### findChangedColumns

**findChangedColumns**(`tableColumns`, `columnMetadatas`): [`ColumnMetadata`](../classes/ColumnMetadata.md)[]

Differentiate columns of this table and columns from the given column metadatas columns
and returns only changed.

#### Parameters

| Name |
| :------ |
| `tableColumns` | [`TableColumn`](../classes/TableColumn.md)[] |
| `columnMetadatas` | [`ColumnMetadata`](../classes/ColumnMetadata.md)[] |

#### Returns

[`ColumnMetadata`](../classes/ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:204

___

### getColumnLength

**getColumnLength**(`column`): `string`

Calculates column length taking into account the default length values.

#### Parameters

| Name |
| :------ |
| `column` | [`ColumnMetadata`](../classes/ColumnMetadata.md) |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:179

___

### isFullTextColumnTypeSupported

**isFullTextColumnTypeSupported**(): `boolean`

Returns true if driver supports fulltext indices.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:216

___

### isReturningSqlSupported

**isReturningSqlSupported**(`returningType`): `boolean`

Returns true if driver supports RETURNING / OUTPUT statement.

#### Parameters

| Name |
| :------ |
| `returningType` | [`ReturningType`](../index.md#returningtype) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:208

___

### isUUIDGenerationSupported

**isUUIDGenerationSupported**(): `boolean`

Returns true if driver supports uuid values generation on its own.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:212

___

### normalizeDefault

**normalizeDefault**(`columnMetadata`): `undefined` \| `string`

Normalizes "default" value of the column.

#### Parameters

| Name |
| :------ |
| `columnMetadata` | [`ColumnMetadata`](../classes/ColumnMetadata.md) |

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:171

___

### normalizeIsUnique

**normalizeIsUnique**(`column`): `boolean`

Normalizes "isUnique" value of the column.

#### Parameters

| Name |
| :------ |
| `column` | [`ColumnMetadata`](../classes/ColumnMetadata.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:175

___

### normalizeType

**normalizeType**(`column`): `string`

Transforms type of the given column to a database column type.

#### Parameters

| Name |
| :------ |
| `column` | `object` |
| `column.isArray?` | `boolean` |
| `column.length?` | `string` \| `number` |
| `column.precision?` | ``null`` \| `number` |
| `column.scale?` | `number` |
| `column.type?` | `string` \| [`BooleanConstructor`](BooleanConstructor.md) \| `DateConstructor` \| `NumberConstructor` \| `StringConstructor` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:161

___

### obtainMasterConnection

**obtainMasterConnection**(): `Promise`<`any`\>

Obtains a new database connection to a master server.
Used for replication.
If replication is not setup then returns default connection's database connection.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:189

___

### obtainSlaveConnection

**obtainSlaveConnection**(): `Promise`<`any`\>

Obtains a new database connection to a slave server.
Used for replication.
If replication is not setup then returns master (default) connection's database connection.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:195

___

### parseTableName

**parseTableName**(`target`): { `database?`: `string` ; `schema?`: `string` ; `tableName`: `string`  }

Parse a target table name or other types and return a normalized table definition.

#### Parameters

| Name |
| :------ |
| `target` | `string` \| [`EntityMetadata`](../classes/EntityMetadata.md) \| [`Table`](../classes/Table.md) \| [`View`](../classes/View.md) \| [`TableForeignKey`](../classes/TableForeignKey.md) |

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `database?` | `string` |
| `schema?` | `string` |
| `tableName` | `string` |

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:145

___

### prepareHydratedValue

**prepareHydratedValue**(`value`, `column`): `any`

Prepares given value to a value to be persisted, based on its column type.

#### Parameters

| Name |
| :------ |
| `value` | `any` |
| `column` | [`ColumnMetadata`](../classes/ColumnMetadata.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:157

___

### preparePersistentValue

**preparePersistentValue**(`value`, `column`): `any`

Prepares given value to a value to be persisted, based on its column type and metadata.

#### Parameters

| Name |
| :------ |
| `value` | `any` |
| `column` | [`ColumnMetadata`](../classes/ColumnMetadata.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/driver/Driver.d.ts:153
