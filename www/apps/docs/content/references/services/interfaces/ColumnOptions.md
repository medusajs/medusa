# ColumnOptions

Describes all column's options.

## Hierarchy

- [`ColumnCommonOptions`](ColumnCommonOptions.md)

  ↳ **`ColumnOptions`**

## Properties

### array

 `Optional` **array**: `boolean`

Indicates if this column is an array.
Can be simply set to true or array length can be specified.
Supported only by postgres.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[array](ColumnCommonOptions.md#array)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:144

___

### asExpression

 `Optional` **asExpression**: `string`

Generated column expression.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:125

___

### charset

 `Optional` **charset**: `string`

Defines a column character set.
Not supported by all database types.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:101

___

### collation

 `Optional` **collation**: `string`

Defines a column collation.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:105

___

### comment

 `Optional` **comment**: `string`

Column comment. Not supported by all database types.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[comment](ColumnCommonOptions.md#comment)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:77

___

### default

 `Optional` **default**: `any`

Default database value.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[default](ColumnCommonOptions.md#default)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:60

___

### enum

 `Optional` **enum**: `Object` \| (`string` \| `number`)[]

Array of possible enumerated values.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:109

___

### enumName

 `Optional` **enumName**: `string`

Exact name of enum

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:113

___

### foreignKeyConstraintName

 `Optional` **foreignKeyConstraintName**: `string`

If this column is foreign key then this specifies the name for it.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:121

___

### generated

 `Optional` **generated**: `boolean` \| ``"uuid"`` \| ``"rowid"`` \| ``"increment"`` \| ``"identity"``

Specifies if this column will use auto increment (sequence, generated identity, rowid).
Note that in some databases only one column in entity can be marked as generated, and it must be a primary column.

#### Inherited from

[ColumnCommonOptions](ColumnCommonOptions.md).[generated](ColumnCommonOptions.md#generated)

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:24

___

### generatedIdentity

 `Optional` **generatedIdentity**: ``"ALWAYS"`` \| ``"BY DEFAULT"``

Identity column type. Supports only in Postgres 10+.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:133

___

### generatedType

 `Optional` **generatedType**: ``"VIRTUAL"`` \| ``"STORED"``

Generated column type.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:129

___

### hstoreType

 `Optional` **hstoreType**: ``"string"`` \| ``"object"``

Return type of HSTORE column.
Returns value as string or as object.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:138

___

### insert

 `Optional` **insert**: `boolean`

Indicates if column is inserted by default.
Default value is "true".

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:56

___

### length

 `Optional` **length**: `string` \| `number`

Column type's length. Used only on some column types.
For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:20

___

### name

 `Optional` **name**: `string`

Column name in the database.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[name](ColumnCommonOptions.md#name)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:15

___

### nullable

 `Optional` **nullable**: `boolean`

Indicates if column's value can be set to NULL.
Default value is "false".

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[nullable](ColumnCommonOptions.md#nullable)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:30

___

### onUpdate

 `Optional` **onUpdate**: `string`

ON UPDATE trigger. Works only for MySQL.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[onUpdate](ColumnCommonOptions.md#onupdate)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:64

___

### precision

 `Optional` **precision**: ``null`` \| `number`

The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
number of digits that are stored for the values.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:82

___

### primary

 `Optional` **primary**: `boolean`

Indicates if this column is a primary key.
Same can be achieved when

**Primary Column**

decorator is used.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[primary](ColumnCommonOptions.md#primary)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:69

___

### primaryKeyConstraintName

 `Optional` **primaryKeyConstraintName**: `string`

If this column is primary key then this specifies the name for it.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:117

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

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:40

___

### scale

 `Optional` **scale**: `number`

The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
of digits to the right of the decimal point and must not be greater than precision.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:87

___

### select

 `Optional` **select**: `boolean`

Indicates if column is always selected by QueryBuilder and find operations.
Default value is "true".

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[select](ColumnCommonOptions.md#select)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:51

___

### spatialFeatureType

 `Optional` **spatialFeatureType**: `string`

Spatial Feature Type (Geometry, Point, Polygon, etc.)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:153

___

### srid

 `Optional` **srid**: `number`

SRID (Spatial Reference ID (EPSG code))

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:157

___

### transformer

 `Optional` **transformer**: [`ValueTransformer`](ValueTransformer.md) \| [`ValueTransformer`](ValueTransformer.md)[]

Specifies a value transformer that is to be used to (un)marshal
this column when reading or writing to the database.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[transformer](ColumnCommonOptions.md#transformer)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:149

___

### type

 `Optional` **type**: [`ColumnType`](../index.md#columntype)

Column type. Must be one of the value from the ColumnTypes class.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:11

___

### unique

 `Optional` **unique**: `boolean`

Specifies if column's value must be unique or not.

#### Overrides

[ColumnCommonOptions](ColumnCommonOptions.md).[unique](ColumnCommonOptions.md#unique)

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:73

___

### unsigned

 `Optional` **unsigned**: `boolean`

Puts UNSIGNED attribute on to numeric column. Works only for MySQL.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:96

___

### update

 `Optional` **update**: `boolean`

Indicates if column value is updated by "save" operation.
If false, you'll be able to write this value only when you first time insert the object.
Default value is "true".

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:46

___

### width

 `Optional` **width**: `number`

Column type's display width. Used only on some column types in MySQL.
For example, INT(4) specifies an INT with a display width of four digits.

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:25

___

### zerofill

 `Optional` **zerofill**: `boolean`

Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to this column

#### Defined in

node_modules/typeorm/decorator/options/ColumnOptions.d.ts:92
