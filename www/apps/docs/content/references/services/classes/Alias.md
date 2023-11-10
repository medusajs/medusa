# Alias

## Constructors

### constructor

**new Alias**(`alias?`)

#### Parameters

| Name |
| :------ |
| `alias?` | [`Alias`](Alias.md) |

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:16

## Properties

### \_metadata

 `Private` `Optional` **\_metadata**: `any`

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:17

___

### name

 **name**: `string`

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:6

___

### subQuery

 `Optional` **subQuery**: `string`

If this alias is for sub query.

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:15

___

### tablePath

 `Optional` **tablePath**: `string`

Table on which this alias is applied.
Used only for aliases which select custom tables.

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:11

___

### type

 **type**: ``"join"`` \| ``"select"`` \| ``"from"`` \| ``"other"``

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:5

## Accessors

### hasMetadata

`get` **hasMetadata**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:19

___

### metadata

`get` **metadata**(): [`EntityMetadata`](EntityMetadata.md)

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:21

`set` **metadata**(`metadata`): `void`

#### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:20

___

### target

`get` **target**(): `string` \| `Function`

#### Returns

`string` \| `Function`

-`string \| Function`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/Alias.d.ts:18
