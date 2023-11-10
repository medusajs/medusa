# ColumnMetadata

This metadata contains all information about entity's column.

## Constructors

### constructor

**new ColumnMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`ColumnMetadataArgs`](../interfaces/ColumnMetadataArgs.md) |
| `options.closureType?` | ``"ancestor"`` \| ``"descendant"`` |
| `options.connection` | [`DataSource`](DataSource.md) |
| `options.embeddedMetadata?` | [`EmbeddedMetadata`](EmbeddedMetadata.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |
| `options.materializedPath?` | `boolean` |
| `options.nestedSetLeft?` | `boolean` |
| `options.nestedSetRight?` | `boolean` |
| `options.referencedColumn?` | [`ColumnMetadata`](ColumnMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:272

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:13

___

### asExpression

 `Optional` **asExpression**: `string`

Generated column expression.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:137

___

### charset

 `Optional` **charset**: `string`

Defines column character set.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:54

___

### closureType

 `Optional` **closureType**: ``"ancestor"`` \| ``"descendant"``

Column type in the case if this column is in the closure table.
Column can be ancestor or descendant in the closure tables.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:248

___

### collation

 `Optional` **collation**: `string`

Defines column collation.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:58

___

### comment

 `Optional` **comment**: `string`

Column comment.
This feature is not supported by all databases.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:95

___

### databaseName

 **databaseName**: `string`

Complete column name in the database including its embedded prefixes.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:173

___

### databaseNameWithoutPrefixes

 **databaseNameWithoutPrefixes**: `string`

Database name in the database without embedded prefixes applied.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:177

___

### databasePath

 **databasePath**: `string`

Gets full path to this column database name (including column database name).
Full path is relevant when column is used in embeds (one or multiple nested).
For example it will return "counters.subcounters.likes".
If property is not in embeds then it returns just database name of the column.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:169

___

### default

 `Optional` **default**: ``null`` \| `string` \| `number` \| `boolean` \| (`string` \| `number` \| `boolean`)[] \| Record<`string`, `object`\> \| () => `string`

Default database value.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:99

___

### embeddedMetadata

 `Optional` **embeddedMetadata**: [`EmbeddedMetadata`](EmbeddedMetadata.md)

Embedded metadata where this column metadata is.
If this column is not in embed then this property value is undefined.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:29

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata where this column metadata is.

For example for @Column() name: string in Post, entityMetadata will be metadata of Post entity.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:24

___

### enum

 `Optional` **enum**: (`string` \| `number`)[]

Array of possible enumerated values.

`postgres` and `mysql` store enum values as strings but we want to keep support
for numeric and heterogeneous based typescript enums, so we need (string|number)[]

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:129

___

### enumName

 `Optional` **enumName**: `string`

Exact name of enum

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:133

___

### foreignKeyConstraintName

 `Optional` **foreignKeyConstraintName**: `string`

If this column is foreign key then this specifies the name for it.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:238

___

### generatedIdentity

 `Optional` **generatedIdentity**: ``"ALWAYS"`` \| ``"BY DEFAULT"``

Identity column type. Supports only in Postgres 10+.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:90

___

### generatedType

 `Optional` **generatedType**: ``"VIRTUAL"`` \| ``"STORED"``

Generated column type.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:141

___

### generationStrategy

 `Optional` **generationStrategy**: ``"uuid"`` \| ``"rowid"`` \| ``"increment"``

Specifies generation strategy if this column will use auto increment.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:86

___

### givenDatabaseName

 `Optional` **givenDatabaseName**: `string`

Database name set by entity metadata builder, not yet passed naming strategy process and without embedded prefixes.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:181

___

### hstoreType

 `Optional` **hstoreType**: ``"string"`` \| ``"object"``

Return type of HSTORE column.
Returns value as string or as object.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:146

___

### isArray

 **isArray**: `boolean`

Indicates if this column is an array.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:150

___

### isCreateDate

 **isCreateDate**: `boolean`

Indicates if this column contains an entity creation date.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:209

___

### isDeleteDate

 **isDeleteDate**: `boolean`

Indicates if this column contains an entity delete date.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:217

___

### isDiscriminator

 **isDiscriminator**: `boolean`

Indicates if column is discriminator. Discriminator columns are not mapped to the entity.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:201

___

### isGenerated

 **isGenerated**: `boolean`

Indicates if this column is generated (auto increment or generated other way).

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:66

___

### isInsert

 **isInsert**: `boolean`

Indicates if column is inserted by default or not.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:78

___

### isMaterializedPath

 **isMaterializedPath**: `boolean`

Indicates if this column is materialized path's path column.
Used only in tree entities with materialized path type.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:263

___

### isNestedSetLeft

 **isNestedSetLeft**: `boolean`

Indicates if this column is nested set's left column.
Used only in tree entities with nested-set type.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:253

___

### isNestedSetRight

 **isNestedSetRight**: `boolean`

Indicates if this column is nested set's right column.
Used only in tree entities with nested-set type.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:258

___

### isNullable

 **isNullable**: `boolean`

Indicates if column can contain nulls or not.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:70

___

### isObjectId

 **isObjectId**: `boolean`

Indicates if this column contains an object id.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:225

___

### isPrimary

 **isPrimary**: `boolean`

Indicates if this column is a primary key.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:62

___

### isSelect

 **isSelect**: `boolean`

Indicates if column is selected by query builder or not.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:74

___

### isTreeLevel

 **isTreeLevel**: `boolean`

Indicates if column is tree-level column. Tree-level columns are used in closure entities.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:205

___

### isUpdate

 **isUpdate**: `boolean`

Indicates if column allows updates or not.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:82

___

### isUpdateDate

 **isUpdateDate**: `boolean`

Indicates if this column contains an entity update date.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:213

___

### isVersion

 **isVersion**: `boolean`

Indicates if this column contains an entity version.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:221

___

### isVirtual

 **isVirtual**: `boolean`

Indicates if column is virtual. Virtual columns are not mapped to the entity.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:185

___

### isVirtualProperty

 **isVirtualProperty**: `boolean`

Indicates if column is a virtual property. Virtual properties are not mapped to the entity.
This property is used in tandem the virtual column decorator.

**See**

https://typeorm.io/decorator-reference#virtualcolumn for more details.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:191

___

### length

 **length**: `string`

Type's length in the database.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:46

___

### onUpdate

 `Optional` **onUpdate**: `string`

ON UPDATE trigger. Works only for MySQL.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:103

___

### precision

 `Optional` **precision**: ``null`` \| `number`

The precision for a decimal (exact numeric) column (applies only for decimal column),
which is the maximum number of digits that are stored for the values.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:108

___

### primaryKeyConstraintName

 `Optional` **primaryKeyConstraintName**: `string`

If this column is primary key then this specifies the name for it.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:234

___

### propertyAliasName

 **propertyAliasName**: `string`

Same as property path, but dots are replaced with '_'.
Used in query builder statements.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:162

___

### propertyName

 **propertyName**: `string`

Class's property name on which this column is applied.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:38

___

### propertyPath

 **propertyPath**: `string`

Gets full path to this column property (including column property name).
Full path is relevant when column is used in embeds (one or multiple nested).
For example it will return "counters.subcounters.likes".
If property is not in embeds then it returns just property name of the column.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:157

___

### query

 `Optional` **query**: (`alias`: `string`) => `string`

#### Type declaration

(`alias`): `string`

Query to be used to populate the column data. This query is used when generating the relational db script.
The query function is called with the current entities alias either defined by the Entity Decorator or automatically

##### Parameters

| Name |
| :------ |
| `alias` | `string` |

##### Returns

`string`

-`string`: (optional) 

**See**

https://typeorm.io/decorator-reference#virtualcolumn for more details.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:197

___

### referencedColumn

 **referencedColumn**: `undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

If this column is foreign key then it references some other column,
and this property will contain reference to this column.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:230

___

### relationMetadata

 `Optional` **relationMetadata**: [`RelationMetadata`](RelationMetadata.md)

If column is a foreign key of some relation then this relation's metadata will be there.
If this column does not have a foreign key then this property value is undefined.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:34

___

### scale

 `Optional` **scale**: `number`

The scale for a decimal (exact numeric) column (applies only for decimal column),
which represents the number of digits to the right of the decimal point and must not be greater than precision.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:113

___

### spatialFeatureType

 `Optional` **spatialFeatureType**: `string`

Spatial Feature Type (Geometry, Point, Polygon, etc.)

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:267

___

### srid

 `Optional` **srid**: `number`

SRID (Spatial Reference ID (EPSG code))

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:271

___

### target

 **target**: `string` \| `Function`

Target class where column decorator is used.
This may not be always equal to entity metadata (for example embeds or inheritance cases).

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:18

___

### transformer

 `Optional` **transformer**: [`ValueTransformer`](../interfaces/ValueTransformer.md) \| [`ValueTransformer`](../interfaces/ValueTransformer.md)[]

Specifies a value transformer that is to be used to (un)marshal
this column when reading or writing to the database.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:243

___

### type

 **type**: [`ColumnType`](../types/ColumnType.md)

The database type of the column.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:42

___

### unsigned

 **unsigned**: `boolean`

Puts UNSIGNED attribute on to numeric column. Works only for MySQL.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:122

___

### width

 `Optional` **width**: `number`

Type's display width in the database.

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:50

___

### zerofill

 **zerofill**: `boolean`

Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:118

## Methods

### build

**build**(`connection`): [`ColumnMetadata`](ColumnMetadata.md)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)

-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:311

___

### buildDatabaseName

`Protected` **buildDatabaseName**(`connection`): `string`

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:314

___

### buildDatabasePath

`Protected` **buildDatabasePath**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:313

___

### buildPropertyPath

`Protected` **buildPropertyPath**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:312

___

### compareEntityValue

**compareEntityValue**(`entity`, `valueToCompareWith`): `any`

Compares given entity's column value with a given value.

#### Parameters

| Name |
| :------ |
| `entity` | `any` |
| `valueToCompareWith` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:310

___

### createValueMap

**createValueMap**(`value`, `useDatabaseName?`): `any`

Creates entity id map from the given entity ids array.

#### Parameters

| Name |
| :------ |
| `value` | `any` |
| `useDatabaseName?` | `boolean` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:286

___

### getEntityValue

**getEntityValue**(`entity`, `transform?`): `any`

Extracts column value from the given entity.
If column is in embedded (or recursive embedded) it extracts its value from there.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `transform?` | `boolean` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:301

___

### getEntityValueMap

**getEntityValueMap**(`entity`, `options?`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Extracts column value and returns its column name with this value in a literal object.
If column is in embedded (or recursive embedded) it returns complex literal object.

Examples what this method can return depend if this column is in embeds.
{ id: 1 } or { title: "hello" }, { counters: { code: 1 } }, { data: { information: { counters: { code: 1 } } } }

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | `object` |
| `options.skipNulls?` | `boolean` |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:294

___

### setEntityValue

**setEntityValue**(`entity`, `value`): `void`

Sets given entity's column value.
Using of this method helps to set entity relation's value of the lazy and non-lazy relations.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `value` | `any` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ColumnMetadata.d.ts:306
