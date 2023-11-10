# TableColumn

Table's columns in the database represented in this class.

## Constructors

### constructor

**new TableColumn**(`options?`)

#### Parameters

| Name |
| :------ |
| `options?` | [`TableColumnOptions`](../interfaces/TableColumnOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:121

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:6

___

### asExpression

 `Optional` **asExpression**: `string`

Generated column expression.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:104

___

### charset

 `Optional` **charset**: `string`

Defines column character set.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:65

___

### collation

 `Optional` **collation**: `string`

Defines column collation.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:69

___

### comment

 `Optional` **comment**: `string`

Column's comment.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:51

___

### default

 `Optional` **default**: `any`

Column's default value.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:18

___

### enum

 `Optional` **enum**: `string`[]

Array of possible enumerated values.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:92

___

### enumName

 `Optional` **enumName**: `string`

Exact name of enum

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:96

___

### generatedIdentity

 `Optional` **generatedIdentity**: ``"ALWAYS"`` \| ``"BY DEFAULT"``

Identity column type. Supports only in Postgres 10+.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:112

___

### generatedType

 `Optional` **generatedType**: ``"VIRTUAL"`` \| ``"STORED"``

Generated column type.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:108

___

### generationStrategy

 `Optional` **generationStrategy**: ``"uuid"`` \| ``"rowid"`` \| ``"increment"`` \| ``"identity"``

Specifies generation strategy if this column will use auto increment.
`rowid` option supported only in CockroachDB.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:35

___

### isArray

 **isArray**: `boolean`

Indicates if column stores array.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:47

___

### isGenerated

 **isGenerated**: `boolean`

Indicates if column is auto-generated sequence.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:30

___

### isNullable

 **isNullable**: `boolean`

Indicates if column is NULL, or is NOT NULL in the database.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:26

___

### isPrimary

 **isPrimary**: `boolean`

Indicates if column is a primary key.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:39

___

### isUnique

 **isUnique**: `boolean`

Indicates if column has unique value.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:43

___

### length

 **length**: `string`

Column type's length. Used only on some column types.
For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:56

___

### name

 **name**: `string`

Column name.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:10

___

### onUpdate

 `Optional` **onUpdate**: `string`

ON UPDATE trigger. Works only for MySQL.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:22

___

### precision

 `Optional` **precision**: ``null`` \| `number`

The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
number of digits that are stored for the values.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:74

___

### primaryKeyConstraintName

 `Optional` **primaryKeyConstraintName**: `string`

Name of the primary key constraint for primary column.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:100

___

### scale

 `Optional` **scale**: `number`

The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
of digits to the right of the decimal point and must not be greater than precision.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:79

___

### spatialFeatureType

 `Optional` **spatialFeatureType**: `string`

Spatial Feature Type (Geometry, Point, Polygon, etc.)

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:116

___

### srid

 `Optional` **srid**: `number`

SRID (Spatial Reference ID (EPSG code))

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:120

___

### type

 **type**: `string`

Column type.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:14

___

### unsigned

 **unsigned**: `boolean`

Puts UNSIGNED attribute on to numeric column. Works only for MySQL.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:88

___

### width

 `Optional` **width**: `number`

Column type's display width. Used only on some column types in MySQL.
For example, INT(4) specifies an INT with a display width of four digits.

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:61

___

### zerofill

 **zerofill**: `boolean`

Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:84

## Methods

### clone

**clone**(): [`TableColumn`](TableColumn.md)

Clones this column to a new column with exact same properties as this column has.

#### Returns

[`TableColumn`](TableColumn.md)

-`TableColumn`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableColumn.d.ts:125
