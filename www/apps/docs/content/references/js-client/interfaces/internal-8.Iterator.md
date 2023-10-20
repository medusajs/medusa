---
displayed_sidebar: jsClientSidebar
---

# Interface: Iterator<T, TReturn, TNext\>

[internal](../modules/internal-8.md).Iterator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `TReturn` | `any` |
| `TNext` | `undefined` |

## Hierarchy

- **`Iterator`**

  ↳ [`IterableIterator`](internal-8.IterableIterator.md)

## Methods

### next

▸ **next**(`...args`): [`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] \| [`TNext`] |

#### Returns

[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:43

___

### return

▸ `Optional` **return**(`value?`): [`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `TReturn` |

#### Returns

[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:44

___

### throw

▸ `Optional` **throw**(`e?`): [`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `e?` | `any` |

#### Returns

[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:45
