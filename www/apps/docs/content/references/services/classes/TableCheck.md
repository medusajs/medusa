# TableCheck

Database's table check constraint stored in this class.

## Constructors

### constructor

**new TableCheck**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`TableCheckOptions`](../interfaces/TableCheckOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:20

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:7

___

### columnNames

 `Optional` **columnNames**: `string`[]

Column that contains this constraint.

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:15

___

### expression

 `Optional` **expression**: `string`

Check expression.

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:19

___

### name

 `Optional` **name**: `string`

Constraint name.

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:11

## Methods

### clone

**clone**(): [`TableCheck`](TableCheck.md)

Creates a new copy of this constraint with exactly same properties.

#### Returns

[`TableCheck`](TableCheck.md)

-`TableCheck`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:24

___

### create

`Static` **create**(`checkMetadata`): [`TableCheck`](TableCheck.md)

Creates checks from the check metadata object.

#### Parameters

| Name |
| :------ |
| `checkMetadata` | [`CheckMetadata`](CheckMetadata.md) |

#### Returns

[`TableCheck`](TableCheck.md)

-`TableCheck`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableCheck.d.ts:28
