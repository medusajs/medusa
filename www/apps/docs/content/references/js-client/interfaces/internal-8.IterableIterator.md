---
displayed_sidebar: jsClientSidebar
---

# Interface: IterableIterator<T\>

[internal](../modules/internal-8.md).IterableIterator

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`Iterator`](internal-8.Iterator.md)<`T`\>

  ↳ **`IterableIterator`**

## Methods

### [iterator]

▸ **[iterator]**(): [`IterableIterator`](internal-8.IterableIterator.md)<`T`\>

#### Returns

[`IterableIterator`](internal-8.IterableIterator.md)<`T`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:53

___

### next

▸ **next**(`...args`): [`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] \| [`undefined`] |

#### Returns

[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>

#### Inherited from

[Iterator](internal-8.Iterator.md).[next](internal-8.Iterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:43

___

### return

▸ `Optional` **return**(`value?`): [`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `any` |

#### Returns

[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>

#### Inherited from

[Iterator](internal-8.Iterator.md).[return](internal-8.Iterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:44

___

### throw

▸ `Optional` **throw**(`e?`): [`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `e?` | `any` |

#### Returns

[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>

#### Inherited from

[Iterator](internal-8.Iterator.md).[throw](internal-8.Iterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:45
