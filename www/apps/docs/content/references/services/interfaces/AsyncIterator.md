# AsyncIterator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TReturn` | `object` |
| `TNext` | `object` |

## Hierarchy

- **`AsyncIterator`**

  ↳ [`AsyncIterableIterator`](AsyncIterableIterator.md)

  ↳ [`AsyncGenerator`](AsyncGenerator.md)

## Methods

### next

**next**(`...args`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name |
| :------ |
| `...args` | [] \| [`TNext`] |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

-`Promise`: 
	-`IteratorResult`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:32

___

### return

`Optional` **return**(`value?`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name |
| :------ |
| `value?` | `TReturn` \| [`PromiseLike`](PromiseLike.md)<`TReturn`\> |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

-`Promise`: 
	-`IteratorResult`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:33

___

### throw

`Optional` **throw**(`e?`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name |
| :------ |
| `e?` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

-`Promise`: 
	-`IteratorResult`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:34
