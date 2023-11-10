# IterableIterator

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- [`Iterator`](Iterator.md)<`T`\>

  ↳ **`IterableIterator`**

## Methods

### [iterator]

**[iterator]**(): [`IterableIterator`](IterableIterator.md)<`T`\>

#### Returns

[`IterableIterator`](IterableIterator.md)<`T`\>

-`IterableIterator`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:53

___

### next

**next**(`...args`): [`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>

#### Parameters

| Name |
| :------ |
| `...args` | [] \| [`undefined`] |

#### Returns

[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>

-`IteratorResult`: 
	-`any`: (optional) 

#### Inherited from

[Iterator](Iterator.md).[next](Iterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:43

___

### return

`Optional` **return**(`value?`): [`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>

#### Parameters

| Name |
| :------ |
| `value?` | `any` |

#### Returns

[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>

-`IteratorResult`: 
	-`any`: (optional) 

#### Inherited from

[Iterator](Iterator.md).[return](Iterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:44

___

### throw

`Optional` **throw**(`e?`): [`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>

#### Parameters

| Name |
| :------ |
| `e?` | `any` |

#### Returns

[`IteratorResult`](../index.md#iteratorresult)<`T`, `any`\>

-`IteratorResult`: 
	-`any`: (optional) 

#### Inherited from

[Iterator](Iterator.md).[throw](Iterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:45
