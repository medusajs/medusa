# Iterator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TReturn` | `object` |
| `TNext` | `object` |

## Hierarchy

- **`Iterator`**

  ↳ [`Generator`](Generator.md)

  ↳ [`IterableIterator`](IterableIterator.md)

## Methods

### next

**next**(`...args`): [`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

#### Parameters

| Name |
| :------ |
| `...args` | [] \| [`TNext`] |

#### Returns

[`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

-`IteratorResult`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:43

___

### return

`Optional` **return**(`value?`): [`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

#### Parameters

| Name |
| :------ |
| `value?` | `TReturn` |

#### Returns

[`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

-`IteratorResult`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:44

___

### throw

`Optional` **throw**(`e?`): [`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

#### Parameters

| Name |
| :------ |
| `e?` | `any` |

#### Returns

[`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

-`IteratorResult`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:45
