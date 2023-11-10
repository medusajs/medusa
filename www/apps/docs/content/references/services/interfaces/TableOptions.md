# TableOptions

Table options.

## Properties

### checks

 `Optional` **checks**: [`TableCheckOptions`](TableCheckOptions.md)[]

Table check constraints.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:42

___

### columns

 `Optional` **columns**: [`TableColumnOptions`](TableColumnOptions.md)[]

Table columns.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:26

___

### database

 `Optional` **database**: `string`

Table database.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:18

___

### engine

 `Optional` **engine**: `string`

Table engine.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:60

___

### exclusions

 `Optional` **exclusions**: [`TableExclusionOptions`](TableExclusionOptions.md)[]

Table check constraints.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:46

___

### foreignKeys

 `Optional` **foreignKeys**: [`TableForeignKeyOptions`](TableForeignKeyOptions.md)[]

Table foreign keys.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:34

___

### indices

 `Optional` **indices**: [`TableIndexOptions`](TableIndexOptions.md)[]

Table indices.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:30

___

### justCreated

 `Optional` **justCreated**: `boolean`

Indicates if table was just created.
This is needed, for example to check if we need to skip primary keys creation
for new tables.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:52

___

### name

 **name**: `string`

Table name.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:22

___

### schema

 `Optional` **schema**: `string`

Table schema.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:14

___

### uniques

 `Optional` **uniques**: [`TableUniqueOptions`](TableUniqueOptions.md)[]

Table unique constraints.

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:38

___

### withoutRowid

 `Optional` **withoutRowid**: `boolean`

Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement

#### Defined in

node_modules/typeorm/schema-builder/options/TableOptions.d.ts:56
