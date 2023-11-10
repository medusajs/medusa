# TableColumnOptions

Table's column options.

## Properties

### asExpression

 `Optional` **asExpression**: `string`

Generated column expression.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:105

___

### charset

 `Optional` **charset**: `string`

Defines column character set.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:62

___

### collation

 `Optional` **collation**: `string`

Defines column collation.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:66

___

### comment

 `Optional` **comment**: `string`

Column's comment.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:48

___

### default

 `Optional` **default**: `any`

Column's default value.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:16

___

### enum

 `Optional` **enum**: `string`[]

Array of possible enumerated values.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:89

___

### enumName

 `Optional` **enumName**: `string`

Exact name of enum

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:93

___

### foreignKeyConstraintName

 `Optional` **foreignKeyConstraintName**: `string`

If this column is foreign key then this specifies the name for it.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:101

___

### generatedIdentity

 `Optional` **generatedIdentity**: ``"ALWAYS"`` \| ``"BY DEFAULT"``

Identity column type. Supports only in Postgres 10+.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:113

___

### generatedType

 `Optional` **generatedType**: ``"VIRTUAL"`` \| ``"STORED"``

Generated column type.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:109

___

### generationStrategy

 `Optional` **generationStrategy**: ``"uuid"`` \| ``"rowid"`` \| ``"increment"`` \| ``"identity"``

Specifies generation strategy if this column will use auto increment.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:32

___

### isArray

 `Optional` **isArray**: `boolean`

Indicates if column stores array.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:44

___

### isGenerated

 `Optional` **isGenerated**: `boolean`

Indicates if column is auto-generated sequence.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:28

___

### isNullable

 `Optional` **isNullable**: `boolean`

Indicates if column is NULL, or is NOT NULL in the database.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:24

___

### isPrimary

 `Optional` **isPrimary**: `boolean`

Indicates if column is a primary key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:36

___

### isUnique

 `Optional` **isUnique**: `boolean`

Indicates if column has unique value.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:40

___

### length

 `Optional` **length**: `string`

Column type's length. Used only on some column types.
For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:53

___

### name

 **name**: `string`

Column name.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:8

___

### onUpdate

 `Optional` **onUpdate**: `string`

ON UPDATE trigger. Works only for MySQL.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:20

___

### precision

 `Optional` **precision**: ``null`` \| `number`

The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
number of digits that are stored for the values.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:71

___

### primaryKeyConstraintName

 `Optional` **primaryKeyConstraintName**: `string`

If this column is primary key then this specifies the name for it.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:97

___

### scale

 `Optional` **scale**: `number`

The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
of digits to the right of the decimal point and must not be greater than precision.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:76

___

### spatialFeatureType

 `Optional` **spatialFeatureType**: `string`

Spatial Feature Type (Geometry, Point, Polygon, etc.)

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:117

___

### srid

 `Optional` **srid**: `number`

SRID (Spatial Reference ID (EPSG code))

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:121

___

### type

 **type**: `string`

Column type.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:12

___

### unsigned

 `Optional` **unsigned**: `boolean`

Puts UNSIGNED attribute on to numeric column. Works only for MySQL.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:85

___

### width

 `Optional` **width**: `number`

Column type's display width. Used only on some column types in MySQL.
For example, INT(4) specifies an INT with a display width of four digits.

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:58

___

### zerofill

 `Optional` **zerofill**: `boolean`

Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column

#### Defined in

node_modules/typeorm/schema-builder/options/TableColumnOptions.d.ts:81
