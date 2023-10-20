---
displayed_sidebar: jsClientSidebar
---

# Interface: AsyncGenerator<T, TReturn, TNext\>

[internal](../modules/internal-8.md).AsyncGenerator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |
| `TReturn` | `any` |
| `TNext` | `unknown` |

## Hierarchy

- [`AsyncIterator`](internal-8.AsyncIterator.md)<`T`, `TReturn`, `TNext`\>

  ↳ **`AsyncGenerator`**

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncGenerator`](internal-8.AsyncGenerator.md)<`T`, `TReturn`, `TNext`\>

#### Returns

[`AsyncGenerator`](internal-8.AsyncGenerator.md)<`T`, `TReturn`, `TNext`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:26

___

### next

▸ **next**(`...args`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] \| [`TNext`] |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Overrides

[AsyncIterator](internal-8.AsyncIterator.md).[next](internal-8.AsyncIterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:23

___

### return

▸ **return**(`value`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TReturn` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TReturn`\> |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Overrides

[AsyncIterator](internal-8.AsyncIterator.md).[return](internal-8.AsyncIterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:24

___

### throw

▸ **throw**(`e`): `Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../modules/internal-8.md#iteratorresult)<`T`, `TReturn`\>\>

#### Overrides

[AsyncIterator](internal-8.AsyncIterator.md).[throw](internal-8.AsyncIterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:25
