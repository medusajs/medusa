# TableMetadataArgs

Arguments for TableMetadata class, helps to construct an TableMetadata object.

## Properties

### database

 `Optional` **database**: `string`

Database name. Used in MySql and Sql Server.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:33

___

### dependsOn

 `Optional` **dependsOn**: `Set`<`string` \| `Function`\>

View dependencies.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:51

___

### engine

 `Optional` **engine**: `string`

Table's database engine type (like "InnoDB", "MyISAM", etc).

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:29

___

### expression

 `Optional` **expression**: `string` \| (`connection`: [`DataSource`](../classes/DataSource.md)) => [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

View expression.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:47

___

### materialized

 `Optional` **materialized**: `boolean`

Indicates if view is materialized

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:55

___

### name

 `Optional` **name**: `string`

Table's name. If name is not set then table's name will be generated from target's name.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:17

___

### orderBy

 `Optional` **orderBy**: [`OrderByCondition`](../types/OrderByCondition.md) \| (`object`: `any`) => `any`

Specifies a default order by used for queries from this table when no explicit order by is specified.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:25

___

### schema

 `Optional` **schema**: `string`

Schema name. Used in Postgres and Sql Server.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:37

___

### synchronize

 `Optional` **synchronize**: `boolean`

Indicates if schema synchronization is enabled or disabled for this entity.
If it will be set to false then schema sync will and migrations ignore this entity.
By default schema synchronization is enabled for all entities.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:43

___

### target

 **target**: `string` \| `Function`

Class to which table is applied.
Function target is a table defined in the class.
String target is a table defined in a json schema.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:13

___

### type

 **type**: [`TableType`](../types/TableType.md)

Table type. Tables can be abstract, closure, junction, embedded, etc.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:21

___

### withoutRowid

 `Optional` **withoutRowid**: `boolean`

If set to 'true' this option disables Sqlite's default behaviour of secretly creating
an integer primary key column named 'rowid' on table creation.

#### Defined in

node_modules/typeorm/metadata-args/TableMetadataArgs.d.ts:60
