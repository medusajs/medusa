# EntitySchemaOptions

Interface for entity metadata mappings stored inside "schemas" instead of models decorated by decorators.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Constructors

### constructor

**new EntitySchemaOptions**<`T`\>()

| Name |
| :------ |
| `T` | `object` |

## Properties

### checks

 `Optional` **checks**: [`EntitySchemaCheckOptions`](../interfaces/EntitySchemaCheckOptions.md)[]

Entity check options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:73

___

### columns

 **columns**: { [P in string \| number \| symbol]?: EntitySchemaColumnOptions }

Entity column's options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:47

___

### database

 `Optional` **database**: `string`

Database name. Used in MySql and Sql Server.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:31

___

### embeddeds

 `Optional` **embeddeds**: { [P in string \| number \| symbol]: EntitySchemaEmbeddedColumnOptions }

Embedded Entities options

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:81

___

### exclusions

 `Optional` **exclusions**: [`EntitySchemaExclusionOptions`](../interfaces/EntitySchemaExclusionOptions.md)[]

Entity exclusion options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:77

___

### expression

 `Optional` **expression**: `string` \| (`connection`: [`DataSource`](DataSource.md)) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

View expression.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:99

___

### indices

 `Optional` **indices**: [`EntitySchemaIndexOptions`](../interfaces/EntitySchemaIndexOptions.md)[]

Entity indices options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:65

___

### inheritance

 `Optional` **inheritance**: [`EntitySchemaInheritanceOptions`](../interfaces/EntitySchemaInheritanceOptions.md)

Inheritance options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:103

___

### name

 **name**: `string`

Entity name.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:23

___

### orderBy

 `Optional` **orderBy**: [`OrderByCondition`](../types/OrderByCondition.md)

Specifies a property name by which queries will perform ordering by default when fetching rows.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:43

___

### relationIds

 `Optional` **relationIds**: { [P in string \| number \| symbol]?: EntitySchemaRelationIdOptions }

Entity relation id options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:59

___

### relations

 `Optional` **relations**: { [P in string \| number \| symbol]?: EntitySchemaRelationOptions }

Entity relation's options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:53

___

### schema

 `Optional` **schema**: `string`

Schema name. Used in Postgres and Sql Server.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:35

___

### synchronize

 `Optional` **synchronize**: `boolean`

Indicates if schema synchronization is enabled or disabled for this entity.
If it will be set to false then schema sync will and migrations ignore this entity.
By default schema synchronization is enabled for all entities.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:89

___

### tableName

 `Optional` **tableName**: `string`

Table name.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:27

___

### target

 `Optional` **target**: `Function`

Target bind to this entity schema. Optional.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:19

___

### type

 `Optional` **type**: [`TableType`](../types/TableType.md)

Table type.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:39

___

### uniques

 `Optional` **uniques**: [`EntitySchemaUniqueOptions`](../interfaces/EntitySchemaUniqueOptions.md)[]

Entity uniques options.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:69

___

### withoutRowid

 `Optional` **withoutRowid**: `boolean`

If set to 'true' this option disables Sqlite's default behaviour of secretly creating
an integer primary key column named 'rowid' on table creation.

**See**

https://www.sqlite.org/withoutrowid.html.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaOptions.d.ts:95
