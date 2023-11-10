# TableUnique

Database's table unique constraint stored in this class.

## Constructors

### constructor

**new TableUnique**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`TableUniqueOptions`](../interfaces/TableUniqueOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:21

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:7

___

### columnNames

 **columnNames**: `string`[]

Columns that contains this constraint.

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:15

___

### deferrable

 `Optional` **deferrable**: `string`

Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start
or at the end of a transaction

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:20

___

### name

 `Optional` **name**: `string`

Constraint name.

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:11

## Methods

### clone

**clone**(): [`TableUnique`](TableUnique.md)

Creates a new copy of this constraint with exactly same properties.

#### Returns

[`TableUnique`](TableUnique.md)

-`TableUnique`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:25

___

### create

`Static` **create**(`uniqueMetadata`): [`TableUnique`](TableUnique.md)

Creates unique from the unique metadata object.

#### Parameters

| Name |
| :------ |
| `uniqueMetadata` | [`UniqueMetadata`](UniqueMetadata.md) |

#### Returns

[`TableUnique`](TableUnique.md)

-`TableUnique`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableUnique.d.ts:29
