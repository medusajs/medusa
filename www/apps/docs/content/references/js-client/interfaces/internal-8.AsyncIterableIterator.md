---
displayed_sidebar: jsClientSidebar
---

# Interface: AsyncIterableIterator<T\>

[internal](../modules/internal-8.md).AsyncIterableIterator

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`AsyncIterator`](internal-8.AsyncIterator.md)<`T`\>

  ↳ **`AsyncIterableIterator`**

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`T`\>

#### Returns

[`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`T`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:42

___

### next

▸ **next**(`...args`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] \| [`undefined`] |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>\>

#### Inherited from

[AsyncIterator](internal-8.AsyncIterator.md).[next](internal-8.AsyncIterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:32

___

### return

▸ `Optional` **return**(`value?`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>\>

#### Inherited from

[AsyncIterator](internal-8.AsyncIterator.md).[return](internal-8.AsyncIterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:33

___

### throw

▸ `Optional` **throw**(`e?`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `e?` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `any`\>\>

#### Inherited from

[AsyncIterator](internal-8.AsyncIterator.md).[throw](internal-8.AsyncIterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:34
