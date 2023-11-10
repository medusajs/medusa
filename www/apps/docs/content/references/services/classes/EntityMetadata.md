# EntityMetadata

Contains all entity metadata.

## Constructors

### constructor

**new EntityMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`TableMetadataArgs`](../interfaces/TableMetadataArgs.md) |
| `options.connection` | [`DataSource`](DataSource.md) |
| `options.inheritancePattern?` | ``"STI"`` |
| `options.inheritanceTree?` | `Function`[] |
| `options.parentClosureEntityMetadata?` | [`EntityMetadata`](EntityMetadata.md) |
| `options.tableTree?` | [`TreeMetadataArgs`](../interfaces/TreeMetadataArgs.md) |

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:418

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:25

___

### afterInsertListeners

 **afterInsertListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER INSERT" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:377

___

### afterLoadListeners

 **afterLoadListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER LOAD" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:369

___

### afterRecoverListeners

 **afterRecoverListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER RECOVER" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:409

___

### afterRemoveListeners

 **afterRemoveListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER REMOVE" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:401

___

### afterSoftRemoveListeners

 **afterSoftRemoveListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER SOFT REMOVE" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:405

___

### afterUpdateListeners

 **afterUpdateListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER UPDATE" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:385

___

### allEmbeddeds

 **allEmbeddeds**: [`EmbeddedMetadata`](EmbeddedMetadata.md)[]

All embeddeds - embeddeds from this entity metadata and from all child embeddeds, etc.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:333

___

### ancestorColumns

 **ancestorColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Ancestor columns used only in closure junction tables.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:192

___

### beforeInsertListeners

 **beforeInsertListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER INSERT" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:373

___

### beforeRecoverListeners

 **beforeRecoverListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "BEFORE RECOVER" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:397

___

### beforeRemoveListeners

 **beforeRemoveListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER REMOVE" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:389

___

### beforeSoftRemoveListeners

 **beforeSoftRemoveListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "BEFORE SOFT REMOVE" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:393

___

### beforeUpdateListeners

 **beforeUpdateListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Listener metadatas with "AFTER UPDATE" type.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:381

___

### checks

 **checks**: [`CheckMetadata`](CheckMetadata.md)[]

Entity's check metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:353

___

### childEntityMetadatas

 **childEntityMetadatas**: [`EntityMetadata`](EntityMetadata.md)[]

Children entity metadatas. Used in inheritance patterns.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:49

___

### closureJunctionTable

 **closureJunctionTable**: [`EntityMetadata`](EntityMetadata.md)

If entity's table is a closure-typed table, then this entity will have a closure junction table metadata.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:37

___

### columns

 **columns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Columns of the entity, including columns that are coming from the embeddeds of this entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:188

___

### connection

 **connection**: [`DataSource`](DataSource.md)

Connection where this entity metadata is created.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:29

___

### createDateColumn

 `Optional` **createDateColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Gets entity column which contains a create date value.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:222

___

### database

 `Optional` **database**: `string`

Database name.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:125

___

### deleteDateColumn

 `Optional` **deleteDateColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Gets entity column which contains a delete date value.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:230

___

### dependsOn

 `Optional` **dependsOn**: `Set`<`string` \| `Function`\>

View's dependencies.
Used in views

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:85

___

### descendantColumns

 **descendantColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Descendant columns used only in closure junction tables.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:196

___

### discriminatorColumn

 `Optional` **discriminatorColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Gets the discriminator column used to store entity identificator in single-table inheritance tables.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:238

___

### discriminatorValue

 `Optional` **discriminatorValue**: `string`

If this entity metadata is a child table of some table, it should have a discriminator value.
Used to store a value in a discriminator column.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:180

___

### eagerRelations

 **eagerRelations**: [`RelationMetadata`](RelationMetadata.md)[]

List of eager relations this metadata has.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:273

___

### embeddeds

 **embeddeds**: [`EmbeddedMetadata`](EmbeddedMetadata.md)[]

Entity's embedded metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:329

___

### engine

 `Optional` **engine**: `string`

Table's database engine type (like "InnoDB", "MyISAM", etc).

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:121

___

### exclusions

 **exclusions**: [`ExclusionMetadata`](ExclusionMetadata.md)[]

Entity's exclusion metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:357

___

### expression

 `Optional` **expression**: `string` \| (`connection`: [`DataSource`](DataSource.md)) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

View's expression.
Used in views

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:80

___

### foreignKeys

 **foreignKeys**: [`ForeignKeyMetadata`](ForeignKeyMetadata.md)[]

Entity's foreign key metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:325

___

### generatedColumns

 **generatedColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Gets the column with generated flag.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:214

___

### givenTableName

 `Optional` **givenTableName**: `string`

Original user-given table name (taken from schema or @Entity(tableName) decorator).
If user haven't specified a table name this property will be undefined.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:94

___

### hasMultiplePrimaryKeys

 **hasMultiplePrimaryKeys**: `boolean`

Checks if entity's table has multiple primary columns.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:171

___

### hasNonNullableRelations

 **hasNonNullableRelations**: `boolean`

Checks if there any non-nullable column exist in this entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:142

___

### hasUUIDGeneratedColumns

 **hasUUIDGeneratedColumns**: `boolean`

Indicates if this entity metadata has uuid generated columns.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:175

___

### indices

 **indices**: [`IndexMetadata`](IndexMetadata.md)[]

Entity's index metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:341

___

### inheritancePattern

 `Optional` **inheritancePattern**: ``"STI"``

If this entity metadata's table using one of the inheritance patterns,
then this will contain what pattern it uses.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:138

___

### inheritanceTree

 **inheritanceTree**: `Function`[]

All "inheritance tree" from a target entity.
For example for target Post < ContentModel < Unit it will be an array of [Post, ContentModel, Unit].
It also contains child entities for single table inheritance.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:55

___

### inverseColumns

 **inverseColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

In the case if this entity metadata is junction table's entity metadata,
this will contain all referenced columns of inverse entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:210

___

### isAlwaysUsingConstructor

 **isAlwaysUsingConstructor**: `boolean`

Indicates if the entity should be instantiated using the constructor
or via allocating a new object via `Object.create()`.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:154

___

### isClosureJunction

 **isClosureJunction**: `boolean`

Checks if this table is a junction table of the closure table.
This type is for tables that contain junction metadata of the closure tables.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:167

___

### isJunction

 **isJunction**: `boolean`

Indicates if this entity metadata of a junction table, or not.
Junction table is a table created by many-to-many relationship.

Its also possible to understand if entity is junction via tableType.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:149

___

### lazyRelations

 **lazyRelations**: [`RelationMetadata`](RelationMetadata.md)[]

List of eager relations this metadata has.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:277

___

### listeners

 **listeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Entity listener metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:365

___

### manyToManyRelations

 **manyToManyRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only many-to-many relations of the entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:297

___

### manyToOneRelations

 **manyToOneRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only many-to-one relations of the entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:293

___

### materializedPathColumn

 `Optional` **materializedPathColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Materialized path column.
Used only in tree entities with materialized path pattern applied.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:257

___

### name

 **name**: `string`

Entity's name.
Equal to entity target class's name if target is set to table.
If target class is not then then it equals to table name.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:75

___

### nestedSetLeftColumn

 `Optional` **nestedSetLeftColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Nested set's left value column.
Used only in tree entities with nested set pattern applied.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:247

___

### nestedSetRightColumn

 `Optional` **nestedSetRightColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Nested set's right value column.
Used only in tree entities with nested set pattern applied.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:252

___

### nonVirtualColumns

 **nonVirtualColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

All columns except for virtual columns.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:200

___

### objectIdColumn

 `Optional` **objectIdColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Gets the object id column used with mongodb database.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:218

___

### oneToManyRelations

 **oneToManyRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only one-to-many relations of the entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:289

___

### oneToOneRelations

 **oneToOneRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only one-to-one relations of the entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:281

___

### orderBy

 `Optional` **orderBy**: [`OrderByCondition`](../index.md#orderbycondition)

Specifies a default order by used for queries from this table when no explicit order by is specified.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:133

___

### ownColumns

 **ownColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Entity's column metadatas defined by user.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:184

___

### ownIndices

 **ownIndices**: [`IndexMetadata`](IndexMetadata.md)[]

Entity's own indices.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:337

___

### ownListeners

 **ownListeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Entity's own listener metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:361

___

### ownRelations

 **ownRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Entity's relation metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:265

___

### ownUniques

 **ownUniques**: [`UniqueMetadata`](UniqueMetadata.md)[]

Entity's own uniques.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:349

___

### ownerColumns

 **ownerColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

In the case if this entity metadata is junction table's entity metadata,
this will contain all referenced columns of owner entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:205

___

### ownerManyToManyRelations

 **ownerManyToManyRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only owner many-to-many relations of the entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:301

___

### ownerOneToOneRelations

 **ownerOneToOneRelations**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only owner one-to-one relations of the entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:285

___

### parentClosureEntityMetadata

 **parentClosureEntityMetadata**: [`EntityMetadata`](EntityMetadata.md)

If this is entity metadata for a junction closure table then its owner closure table metadata will be set here.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:41

___

### parentEntityMetadata

 **parentEntityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Parent's entity metadata. Used in inheritance patterns.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:45

___

### primaryColumns

 **primaryColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Gets the primary columns.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:261

___

### propertiesMap

 **propertiesMap**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Map of columns and relations of the entity.

example: Post{ id: number, name: string, counterEmbed: { count: number }, category: Category }.
This method will create following object:
{ id: "id", counterEmbed: { count: "counterEmbed.count" }, category: "category" }

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:417

___

### relationCounts

 **relationCounts**: [`RelationCountMetadata`](RelationCountMetadata.md)[]

Entity's relation id metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:321

___

### relationIds

 **relationIds**: [`RelationIdMetadata`](RelationIdMetadata.md)[]

Entity's relation id metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:317

___

### relations

 **relations**: [`RelationMetadata`](RelationMetadata.md)[]

Relations of the entity, including relations that are coming from the embeddeds of this entity.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:269

___

### relationsWithJoinColumns

 **relationsWithJoinColumns**: [`RelationMetadata`](RelationMetadata.md)[]

Gets only owner one-to-one and many-to-one relations.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:305

___

### schema

 `Optional` **schema**: `string`

Schema name. Used in Postgres and Sql Server.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:129

___

### synchronize

 **synchronize**: `boolean`

Indicates if schema will be synchronized for this entity or not.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:117

___

### tableMetadataArgs

 **tableMetadataArgs**: [`TableMetadataArgs`](../interfaces/TableMetadataArgs.md)

Metadata arguments used to build this entity metadata.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:33

___

### tableName

 **tableName**: `string`

Entity table name in the database.
This is final table name of the entity.
This name already passed naming strategy, and generated based on
multiple criteria, including user table name and global table prefix.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:101

___

### tableNameWithoutPrefix

 **tableNameWithoutPrefix**: `string`

Gets the table name without global table prefix.
When querying table you need a table name with prefix, but in some scenarios,
for example when you want to name a junction table that contains names of two other tables,
you may want a table name without prefix.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:113

___

### tablePath

 **tablePath**: `string`

Entity table path. Contains database name, schema name and table name.
E.g. myDB.mySchema.myTable

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:106

___

### tableType

 **tableType**: [`TableType`](../index.md#tabletype)

Table type. Tables can be closure, junction, etc.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:59

___

### target

 **target**: `string` \| `Function`

Target class to which this entity metadata is bind.
Note, that when using table inheritance patterns target can be different rather then table's target.
For virtual tables which lack of real entity (like junction tables) target is equal to their table name.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:65

___

### targetName

 **targetName**: `string`

Gets the name of the target.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:69

___

### treeChildrenRelation

 `Optional` **treeChildrenRelation**: [`RelationMetadata`](RelationMetadata.md)

Tree children relation. Used only in tree-tables.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:313

___

### treeLevelColumn

 `Optional` **treeLevelColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Special column that stores tree level in tree entities.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:242

___

### treeOptions

 `Optional` **treeOptions**: [`ClosureTreeOptions`](../interfaces/ClosureTreeOptions.md)

Indicates if this entity is a tree, what options of tree it has.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:162

___

### treeParentRelation

 `Optional` **treeParentRelation**: [`RelationMetadata`](RelationMetadata.md)

Tree parent relation. Used only in tree-tables.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:309

___

### treeType

 `Optional` **treeType**: [`TreeType`](../index.md#treetype)

Indicates if this entity is a tree, what type of tree it is.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:158

___

### uniques

 **uniques**: [`UniqueMetadata`](UniqueMetadata.md)[]

Entity's unique metadatas.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:345

___

### updateDateColumn

 `Optional` **updateDateColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Gets entity column which contains an update date value.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:226

___

### versionColumn

 `Optional` **versionColumn**: [`ColumnMetadata`](ColumnMetadata.md)

Gets entity column which contains an entity version.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:234

___

### withoutRowid

 `Optional` **withoutRowid**: `boolean`

Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:89

___

### getInverseEntityMetadata

 `Static` `Private` **getInverseEntityMetadata**: `any`

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:528

## Methods

### build

**build**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:547

___

### compareEntities

**compareEntities**(`firstEntity`, `secondEntity`): `boolean`

Compares two different entities by their ids.
Returns true if they match, false otherwise.

#### Parameters

| Name |
| :------ |
| `firstEntity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `secondEntity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:467

___

### create

**create**(`queryRunner?`, `options?`): `any`

Creates a new entity.

#### Parameters

| Name |
| :------ |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |
| `options?` | `object` |
| `options.fromDeserializer?` | `boolean` |
| `options.pojo?` | `boolean` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:429

___

### createPropertiesMap

**createPropertiesMap**(): { `[name: string]`: `string` \| `any`;  }

Creates a special object - all columns and relations of the object (plus columns and relations from embeds)
in a special format - { propertyName: propertyName }.

example: Post{ id: number, name: string, counterEmbed: { count: number }, category: Category }.
This method will create following object:
{ id: "id", counterEmbed: { count: "counterEmbed.count" }, category: "category" }

#### Returns

`object`

-``object``: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:560

___

### ensureEntityIdMap

**ensureEntityIdMap**(`id`): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Ensures that given object is an entity id map.
If given id is an object then it means its already id map.
If given id isn't an object then it means its a value of the id column
and it creates a new id map with this value and name of the primary column.

#### Parameters

| Name |
| :------ |
| `id` | `any` |

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:448

___

### extractRelationValuesFromEntity

**extractRelationValuesFromEntity**(`entity`, `relations`): [[`RelationMetadata`](RelationMetadata.md), `any`, [`EntityMetadata`](EntityMetadata.md)][]

Iterates through entity and finds and extracts all values from relations in the entity.
If relation value is an array its being flattened.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `relations` | [`RelationMetadata`](RelationMetadata.md)[] |

#### Returns

[[`RelationMetadata`](RelationMetadata.md), `any`, [`EntityMetadata`](EntityMetadata.md)][]

-`[[`RelationMetadata`](RelationMetadata.md), `any`, [`EntityMetadata`](EntityMetadata.md)][]`: 
	-`RelationMetadata`: 
	-`any`: (optional) 
	-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:518

___

### findColumnWithDatabaseName

**findColumnWithDatabaseName**(`databaseName`): `undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

Finds column with a given database name.

#### Parameters

| Name |
| :------ |
| `databaseName` | `string` |

#### Returns

`undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

-`undefined \| ColumnMetadata`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:475

___

### findColumnWithPropertyName

**findColumnWithPropertyName**(`propertyName`): `undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

Finds column with a given property name.

#### Parameters

| Name |
| :------ |
| `propertyName` | `string` |

#### Returns

`undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

-`undefined \| ColumnMetadata`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:471

___

### findColumnWithPropertyPath

**findColumnWithPropertyPath**(`propertyPath`): `undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

Finds column with a given property path.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

-`undefined \| ColumnMetadata`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:483

___

### findColumnWithPropertyPathStrict

**findColumnWithPropertyPathStrict**(`propertyPath`): `undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

Finds column with a given property path.
Does not search in relation unlike findColumnWithPropertyPath.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

-`undefined \| ColumnMetadata`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:488

___

### findColumnsWithPropertyPath

**findColumnsWithPropertyPath**(`propertyPath`): [`ColumnMetadata`](ColumnMetadata.md)[]

Finds columns with a given property path.
Property path can match a relation, and relations can contain multiple columns.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:493

___

### findEmbeddedWithPropertyPath

**findEmbeddedWithPropertyPath**(`propertyPath`): `undefined` \| [`EmbeddedMetadata`](EmbeddedMetadata.md)

Finds embedded with a given property path.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`undefined` \| [`EmbeddedMetadata`](EmbeddedMetadata.md)

-`undefined \| EmbeddedMetadata`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:509

___

### findInheritanceMetadata

**findInheritanceMetadata**(`value`): [`EntityMetadata`](EntityMetadata.md)

In the case of SingleTableInheritance, find the correct metadata
for a given value.

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `any` | The value to find the metadata for. |

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: The found metadata for the entity or the base metadata if no matching metadata
         was found in the whole inheritance tree.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:527

___

### findRelationWithPropertyPath

**findRelationWithPropertyPath**(`propertyPath`): `undefined` \| [`RelationMetadata`](RelationMetadata.md)

Finds relation with the given property path.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`undefined` \| [`RelationMetadata`](RelationMetadata.md)

-`undefined \| RelationMetadata`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:501

___

### getEntityIdMap

**getEntityIdMap**(`entity`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Gets primary keys of the entity and returns them in a literal object.
For example, for Post{ id: 1, title: "hello" } where id is primary it will return { id: 1 }
For multiple primary keys it returns multiple keys in object.
For primary keys inside embeds it returns complex object literal with keys in them.

#### Parameters

| Name |
| :------ |
| `entity` | `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:455

___

### getEntityIdMixedMap

**getEntityIdMixedMap**(`entity`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Creates a "mixed id map".
If entity has multiple primary keys (ids) then it will return just regular id map, like what getEntityIdMap returns.
But if entity has a single primary key then it will return just value of the id column of the entity, just value.
This is called mixed id map.

#### Parameters

| Name |
| :------ |
| `entity` | `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:462

___

### getInsertionReturningColumns

**getInsertionReturningColumns**(): [`ColumnMetadata`](ColumnMetadata.md)[]

Checks if entity has any column which rely on returning data,
e.g. columns with auto generated value, DEFAULT values considered as dependant of returning data.
For example, if we need to have RETURNING after INSERT (or we need returned id for DBs not supporting RETURNING),
it means we cannot execute bulk inserts in some cases.

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:569

___

### hasAllPrimaryKeys

**hasAllPrimaryKeys**(`entity`): `boolean`

Checks if given entity / object contains ALL primary keys entity must have.
Returns true if it contains all of them, false if at least one of them is not defined.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:441

___

### hasColumnWithPropertyPath

**hasColumnWithPropertyPath**(`propertyPath`): `boolean`

Checks if there is a column or relationship with a given property path.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:479

___

### hasEmbeddedWithPropertyPath

**hasEmbeddedWithPropertyPath**(`propertyPath`): `boolean`

Checks if there is an embedded with a given property path.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:505

___

### hasId

**hasId**(`entity`): `boolean`

Checks if given entity has an id.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:436

___

### hasRelationWithPropertyPath

**hasRelationWithPropertyPath**(`propertyPath`): `boolean`

Checks if there is a relation with the given property path.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:497

___

### mapPropertyPathsToColumns

**mapPropertyPathsToColumns**(`propertyPaths`): [`ColumnMetadata`](ColumnMetadata.md)[]

Returns an array of databaseNames mapped from provided propertyPaths

#### Parameters

| Name |
| :------ |
| `propertyPaths` | `string`[] |

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:513

___

### registerColumn

**registerColumn**(`column`): `void`

Registers a new column in the entity and recomputes all depend properties.

#### Parameters

| Name |
| :------ |
| `column` | [`ColumnMetadata`](ColumnMetadata.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:551

___

### createPropertyPath

`Static` **createPropertyPath**(`metadata`, `entity`, `prefix?`): `string`[]

Creates a property paths for a given entity.

#### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `prefix?` | `string` |

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

**Deprecated**

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:534

___

### difference

`Static` **difference**(`firstIdMaps`, `secondIdMaps`): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

Finds difference between two entity id maps.
Returns items that exist in the first array and absent in the second array.

#### Parameters

| Name |
| :------ |
| `firstIdMaps` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `secondIdMaps` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

-`ObjectLiteral[]`: 
	-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:539

___

### getValueMap

`Static` **getValueMap**(`entity`, `columns`, `options?`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Creates value map from the given values and columns.
Examples of usages are primary columns map and join columns map.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `columns` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `options?` | `object` |
| `options.skipNulls?` | `boolean` |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityMetadata.d.ts:544
