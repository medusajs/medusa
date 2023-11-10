# EntitySchemaColumnOptions

Options for spatial columns.

## Hierarchy

- [`SpatialColumnOptions`](SpatialColumnOptions.md)

  ↳ **`EntitySchemaColumnOptions`**

## Properties

### array

 `Optional` **array**: `boolean`

Indicates if this column is an array.
Can be simply set to true or array length can be specified.
Supported only by postgres.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:164

___

### asExpression

 `Optional` **asExpression**: `string`

Generated column expression.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:149

___

### charset

 `Optional` **charset**: `string`

Defines a column character set.
Not supported by all database types.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:133

___

### collation

 `Optional` **collation**: `string`

Defines a column collation.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:137

___

### columnDefinition

 `Optional` **columnDefinition**: `string`

Extra column definition. Should be used only in emergency situations. Note that if you'll use this property
auto schema generation will not work properly anymore. Avoid using it.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:97

___

### comment

 `Optional` **comment**: `string`

Column comment.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:101

___

### createDate

 `Optional` **createDate**: `boolean`

Indicates if this column is a created date column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:16

___

### default

 `Optional` **default**: `any`

Default database value.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:105

___

### deleteDate

 `Optional` **deleteDate**: `boolean`

Indicates if this column is a delete date column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:24

___

### enum

 `Optional` **enum**: `Object` \| `any`[]

Array of possible enumerated values.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:141

___

### enumName

 `Optional` **enumName**: `string`

Exact name of enum

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:145

___

### generated

 `Optional` **generated**: ``true`` \| ``"uuid"`` \| ``"rowid"`` \| ``"increment"``

Specifies if this column will use AUTO_INCREMENT or not (e.g. generated number).

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:88

___

### generatedType

 `Optional` **generatedType**: ``"VIRTUAL"`` \| ``"STORED"``

Generated column type.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:153

___

### hstoreType

 `Optional` **hstoreType**: ``"string"`` \| ``"object"``

Return type of HSTORE column.
Returns value as string or as object.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:158

___

### insert

 `Optional` **insert**: `boolean`

Indicates if column is inserted by default.
Default value is "true".

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:84

___

### length

 `Optional` **length**: `string` \| `number`

Column type's length. For example type = "string" and length = 100 means that ORM will create a column with
type varchar(100).

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:49

___

### name

 `Optional` **name**: `string`

Column name in the database.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:44

___

### nullable

 `Optional` **nullable**: `boolean`

Indicates if column's value can be set to NULL.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:58

___

### objectId

 `Optional` **objectId**: `boolean`

Indicates if this column is of type ObjectId

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:12

___

### onUpdate

 `Optional` **onUpdate**: `string`

ON UPDATE trigger. Works only for MySQL.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:109

___

### precision

 `Optional` **precision**: `number`

The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
number of digits that are stored for the values.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:114

___

### primary

 `Optional` **primary**: `boolean`

Indicates if this column is a primary column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:8

___

### primaryKeyConstraintName

 `Optional` **primaryKeyConstraintName**: `string`

Name of the primary key constraint.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:173

___

### readonly

 `Optional` **readonly**: `boolean`

Indicates if column value is not updated by "save" operation.
It means you'll be able to write this value only when you first time insert the object.
Default value is "false".

**Deprecated**

Please use the `update` option instead.  Careful, it takes
the opposite value to readonly.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:68

___

### scale

 `Optional` **scale**: `number`

The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
of digits to the right of the decimal point and must not be greater than precision.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:119

___

### select

 `Optional` **select**: `boolean`

Indicates if column is always selected by QueryBuilder and find operations.
Default value is "true".

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:79

___

### spatialFeatureType

 `Optional` **spatialFeatureType**: ``"Point"`` \| ``"LineString"`` \| ``"Polygon"`` \| ``"MultiPoint"`` \| ``"MultiLineString"`` \| ``"MultiPolygon"`` \| ``"GeometryCollection"``

Column type's feature type.
Geometry, Point, Polygon, etc.

#### Inherited from

[SpatialColumnOptions](SpatialColumnOptions.md).[spatialFeatureType](SpatialColumnOptions.md#spatialfeaturetype)

#### Defined in

node_modules/typeorm/decorator/options/SpatialColumnOptions.d.ts:10

___

### srid

 `Optional` **srid**: `number`

Column type's SRID.
Spatial Reference ID or EPSG code.

#### Inherited from

[SpatialColumnOptions](SpatialColumnOptions.md).[srid](SpatialColumnOptions.md#srid)

#### Defined in

node_modules/typeorm/decorator/options/SpatialColumnOptions.d.ts:15

___

### transformer

 `Optional` **transformer**: [`ValueTransformer`](ValueTransformer.md) \| [`ValueTransformer`](ValueTransformer.md)[]

Specifies a value transformer that is to be used to (un)marshal
this column when reading or writing to the database.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:169

___

### treeChildrenCount

 `Optional` **treeChildrenCount**: `boolean`

Indicates if this column is a treeChildrenCount column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:32

___

### treeLevel

 `Optional` **treeLevel**: `boolean`

Indicates if this column is a treeLevel column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:36

___

### type

 **type**: [`ColumnType`](../types/ColumnType.md)

Column type. Must be one of the value from the ColumnTypes class.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:40

___

### unique

 `Optional` **unique**: `boolean`

Specifies if column's value must be unique or not.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:92

___

### unsigned

 `Optional` **unsigned**: `boolean`

Puts UNSIGNED attribute on to numeric column. Works only for MySQL.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:128

___

### update

 `Optional` **update**: `boolean`

Indicates if column value is updated by "save" operation.
If false you'll be able to write this value only when you first time insert the object.
Default value is "true".

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:74

___

### updateDate

 `Optional` **updateDate**: `boolean`

Indicates if this column is an update date column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:20

___

### version

 `Optional` **version**: `boolean`

Indicates if this column is a version column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:28

___

### width

 `Optional` **width**: `number`

Column type's display width. Used only on some column types in MySQL.
For example, INT(4) specifies an INT with a display width of four digits.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:54

___

### zerofill

 `Optional` **zerofill**: `boolean`

Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaColumnOptions.d.ts:124
