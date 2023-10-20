---
displayed_sidebar: jsClientSidebar
---

# Interface: AsyncIterator<T, TReturn, TNext\>

[internal](../modules/internal-8.md).AsyncIterator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `TReturn` | `any` |
| `TNext` | `undefined` |

## Hierarchy

- **`AsyncIterator`**

  ↳ [`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)

  ↳ [`AsyncGenerator`](internal-8.AsyncGenerator.md)

## Methods

### next

▸ **next**(`...args`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] \| [`TNext`] |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:32

___

### return

▸ `Optional` **return**(`value?`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `TReturn` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TReturn`\> |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:33

___

### throw

▸ `Optional` **throw**(`e?`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `e?` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:34
