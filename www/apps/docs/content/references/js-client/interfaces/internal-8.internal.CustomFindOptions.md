---
displayed_sidebar: jsClientSidebar
---

# Interface: CustomFindOptions<TModel, InKeys\>

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).CustomFindOptions

## Type parameters

| Name | Type |
| :------ | :------ |
| `TModel` | `TModel` |
| `InKeys` | extends keyof `TModel` |

## Properties

### order

• `Optional` **order**: `OrderByCondition`

#### Defined in

packages/medusa/dist/types/common.d.ts:51

___

### select

• `Optional` **select**: `FindOptionsSelect`<`TModel`\> \| `FindOptionsSelectByString`<`TModel`\>

#### Defined in

packages/medusa/dist/types/common.d.ts:47

___

### skip

• `Optional` **skip**: `number`

#### Defined in

packages/medusa/dist/types/common.d.ts:52

___

### take

• `Optional` **take**: `number`

#### Defined in

packages/medusa/dist/types/common.d.ts:53

___

### where

• `Optional` **where**: `FindOptionsWhere`<`TModel`\> & { [P in string \| number \| symbol]?: TModel[P][] } \| `FindOptionsWhere`<`TModel`\>[] & { [P in string \| number \| symbol]?: TModel[P][] }

#### Defined in

packages/medusa/dist/types/common.d.ts:48
