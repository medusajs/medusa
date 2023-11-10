# RootFilterOperators

## Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

## Hierarchy

- [`Document`](Document.md)

  ↳ **`RootFilterOperators`**

## Properties

### $and

 `Optional` **$and**: [`Filter`](../types/Filter.md)<`TSchema`\>[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4619

___

### $comment

 `Optional` **$comment**: `string` \| [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4629

___

### $nor

 `Optional` **$nor**: [`Filter`](../types/Filter.md)<`TSchema`\>[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4620

___

### $or

 `Optional` **$or**: [`Filter`](../types/Filter.md)<`TSchema`\>[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4621

___

### $text

 `Optional` **$text**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `$caseSensitive?` | `boolean` |
| `$diacriticSensitive?` | `boolean` |
| `$language?` | `string` |
| `$search` | `string` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4622

___

### $where

 `Optional` **$where**: `string` \| (`this`: `TSchema`) => `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4628
