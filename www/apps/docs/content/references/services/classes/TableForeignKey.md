# TableForeignKey

Foreign key from the database stored in this class.

## Constructors

### constructor

**new TableForeignKey**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`TableForeignKeyOptions`](../interfaces/TableForeignKeyOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:48

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:8

___

### columnNames

 **columnNames**: `string`[]

Column names which included by this foreign key.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:16

___

### deferrable

 `Optional` **deferrable**: `string`

Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start
or at the end of a transaction

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:47

___

### name

 `Optional` **name**: `string`

Name of the foreign key constraint.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:12

___

### onDelete

 `Optional` **onDelete**: `string`

"ON DELETE" of this foreign key, e.g. what action database should perform when
referenced stuff is being deleted.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:37

___

### onUpdate

 `Optional` **onUpdate**: `string`

"ON UPDATE" of this foreign key, e.g. what action database should perform when
referenced stuff is being updated.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:42

___

### referencedColumnNames

 **referencedColumnNames**: `string`[]

Column names which included by this foreign key.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:32

___

### referencedDatabase

 `Optional` **referencedDatabase**: `string`

Database of Table referenced in the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:20

___

### referencedSchema

 `Optional` **referencedSchema**: `string`

Database of Table referenced in the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:24

___

### referencedTableName

 **referencedTableName**: `string`

Table referenced in the foreign key.

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:28

## Methods

### clone

**clone**(): [`TableForeignKey`](TableForeignKey.md)

Creates a new copy of this foreign key with exactly same properties.

#### Returns

[`TableForeignKey`](TableForeignKey.md)

-`TableForeignKey`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:52

___

### create

`Static` **create**(`metadata`, `driver`): [`TableForeignKey`](TableForeignKey.md)

Creates a new table foreign key from the given foreign key metadata.

#### Parameters

| Name |
| :------ |
| `metadata` | [`ForeignKeyMetadata`](ForeignKeyMetadata.md) |
| `driver` | [`Driver`](../interfaces/Driver.md) |

#### Returns

[`TableForeignKey`](TableForeignKey.md)

-`TableForeignKey`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableForeignKey.d.ts:56
