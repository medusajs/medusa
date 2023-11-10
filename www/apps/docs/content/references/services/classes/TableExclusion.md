# TableExclusion

Database's table exclusion constraint stored in this class.

## Constructors

### constructor

**new TableExclusion**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`TableExclusionOptions`](../interfaces/TableExclusionOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/TableExclusion.d.ts:16

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/TableExclusion.d.ts:7

___

### expression

 `Optional` **expression**: `string`

Exclusion expression.

#### Defined in

node_modules/typeorm/schema-builder/table/TableExclusion.d.ts:15

___

### name

 `Optional` **name**: `string`

Constraint name.

#### Defined in

node_modules/typeorm/schema-builder/table/TableExclusion.d.ts:11

## Methods

### clone

**clone**(): [`TableExclusion`](TableExclusion.md)

Creates a new copy of this constraint with exactly same properties.

#### Returns

[`TableExclusion`](TableExclusion.md)

-`TableExclusion`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableExclusion.d.ts:20

___

### create

`Static` **create**(`exclusionMetadata`): [`TableExclusion`](TableExclusion.md)

Creates exclusions from the exclusion metadata object.

#### Parameters

| Name |
| :------ |
| `exclusionMetadata` | [`ExclusionMetadata`](ExclusionMetadata.md) |

#### Returns

[`TableExclusion`](TableExclusion.md)

-`TableExclusion`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableExclusion.d.ts:24
