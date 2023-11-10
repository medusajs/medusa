# ColumnCommonOptions

Column options specific to all column types.

## Hierarchy

- **`ColumnCommonOptions`**

  ↳ [`ColumnOptions`](ColumnOptions.md)

## Properties

### array

 `Optional` **array**: `boolean`

Indicates if this column is an array.
Can be simply set to true or array length can be specified.
Supported only by postgres.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:51

___

### comment

 `Optional` **comment**: `string`

Column comment. Not supported by all database types.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:45

___

### default

 `Optional` **default**: `any`

Default database value.
Note that default value is not supported when column type is 'json' of mysql.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:37

___

### generated

 `Optional` **generated**: `boolean` \| ``"uuid"`` \| ``"rowid"`` \| ``"increment"`` \| ``"identity"``

Specifies if this column will use auto increment (sequence, generated identity, rowid).
Note that in some databases only one column in entity can be marked as generated, and it must be a primary column.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:24

___

### name

 `Optional` **name**: `string`

Column name in the database.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:14

___

### nullable

 `Optional` **nullable**: `boolean`

Indicates if column's value can be set to NULL.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:32

___

### onUpdate

 `Optional` **onUpdate**: `string`

ON UPDATE trigger. Works only for MySQL.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:41

___

### primary

 `Optional` **primary**: `boolean`

Indicates if this column is a primary key.
Same can be achieved when

**Primary Column**

decorator is used.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:19

___

### select

 `Optional` **select**: `boolean`

Indicates if column is always selected by QueryBuilder and find operations.
Default value is "true".

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:10

___

### transformer

 `Optional` **transformer**: [`ValueTransformer`](ValueTransformer.md) \| [`ValueTransformer`](ValueTransformer.md)[]

Specifies a value transformer that is to be used to (un)marshal
this column when reading or writing to the database.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:56

___

### unique

 `Optional` **unique**: `boolean`

Specifies if column's value must be unique or not.

#### Defined in

node_modules/typeorm/decorator/options/ColumnCommonOptions.d.ts:28
