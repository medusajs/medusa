# TableForeignKeyOptions

Foreign key options.

## Properties

### columnNames

 **columnNames**: `string`[]

Column names which included by this foreign key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:12

___

### deferrable

 `Optional` **deferrable**: `string`

Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start
or at the end of a transaction

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:43

___

### name

 `Optional` **name**: `string`

Name of the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:8

___

### onDelete

 `Optional` **onDelete**: `string`

"ON DELETE" of this foreign key, e.g. what action database should perform when
referenced stuff is being deleted.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:33

___

### onUpdate

 `Optional` **onUpdate**: `string`

"ON UPDATE" of this foreign key, e.g. what action database should perform when
referenced stuff is being updated.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:38

___

### referencedColumnNames

 **referencedColumnNames**: `string`[]

Column names which included by this foreign key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:28

___

### referencedDatabase

 `Optional` **referencedDatabase**: `string`

Database of the Table referenced in the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:16

___

### referencedSchema

 `Optional` **referencedSchema**: `string`

Schema of the Table referenced in the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:20

___

### referencedTableName

 **referencedTableName**: `string`

Table referenced in the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/options/TableForeignKeyOptions.d.ts:24
