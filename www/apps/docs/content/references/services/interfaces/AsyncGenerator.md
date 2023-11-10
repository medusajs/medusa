# AsyncGenerator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TReturn` | `object` |
| `TNext` | `object` |

## Hierarchy

- [`AsyncIterator`](AsyncIterator.md)<`T`, `TReturn`, `TNext`\>

  ↳ **`AsyncGenerator`**

## Methods

### [asyncIterator]

**[asyncIterator]**(): [`AsyncGenerator`](AsyncGenerator.md)<`T`, `TReturn`, `TNext`\>

#### Returns

[`AsyncGenerator`](AsyncGenerator.md)<`T`, `TReturn`, `TNext`\>

-`AsyncGenerator`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:26

___

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

#### Overrides

[AsyncIterator](AsyncIterator.md).[next](AsyncIterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:23

___

### return

**return**(`value`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name |
| :------ |
| `value` | `TReturn` \| [`PromiseLike`](PromiseLike.md)<`TReturn`\> |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

-`Promise`: 
	-`IteratorResult`: 

#### Overrides

[AsyncIterator](AsyncIterator.md).[return](AsyncIterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:24

___

### throw

**throw**(`e`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

#### Parameters

| Name |
| :------ |
| `e` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `TReturn`\>\>

-`Promise`: 
	-`IteratorResult`: 

#### Overrides

[AsyncIterator](AsyncIterator.md).[throw](AsyncIterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts:25
