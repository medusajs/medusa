# AsyncIterableIterator

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- [`AsyncIterator`](AsyncIterator.md)<`T`\>

  ↳ **`AsyncIterableIterator`**

## Methods

### [asyncIterator]

**[asyncIterator]**(): [`AsyncIterableIterator`](AsyncIterableIterator.md)<`T`\>

#### Returns

[`AsyncIterableIterator`](AsyncIterableIterator.md)<`T`\>

-`AsyncIterableIterator`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:42

___

### next

**next**(`...args`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>\>

#### Parameters

| Name |
| :------ |
| `...args` | [] \| [`undefined`] |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>\>

-`Promise`: 
	-`IteratorResult`: 
		-`any`: (optional) 

#### Inherited from

[AsyncIterator](AsyncIterator.md).[next](AsyncIterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:32

___

### return

`Optional` **return**(`value?`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>\>

#### Parameters

| Name |
| :------ |
| `value?` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>\>

-`Promise`: 
	-`IteratorResult`: 
		-`any`: (optional) 

#### Inherited from

[AsyncIterator](AsyncIterator.md).[return](AsyncIterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:33

___

### throw

`Optional` **throw**(`e?`): `Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>\>

#### Parameters

| Name |
| :------ |
| `e?` | `any` |

#### Returns

`Promise`<[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>\>

-`Promise`: 
	-`IteratorResult`: 
		-`any`: (optional) 

#### Inherited from

[AsyncIterator](AsyncIterator.md).[throw](AsyncIterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:34
