# Generator

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TReturn` | `object` |
| `TNext` | `object` |

## Hierarchy

- [`Iterator`](Iterator.md)<`T`, `TReturn`, `TNext`\>

  ↳ **`Generator`**

## Methods

### [iterator]

**[iterator]**(): [`Generator`](Generator.md)<`T`, `TReturn`, `TNext`\>

#### Returns

[`Generator`](Generator.md)<`T`, `TReturn`, `TNext`\>

-`Generator`: 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.generator.d.ts:26

___

### next

**next**(`...args`): [`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

#### Parameters

| Name |
| :------ |
| `...args` | [] \| [`TNext`] |

#### Returns

[`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

-`IteratorResult`: 

#### Overrides

[Iterator](Iterator.md).[next](Iterator.md#next)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.generator.d.ts:23

___

### return

**return**(`value`): [`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

#### Parameters

| Name |
| :------ |
| `value` | `TReturn` |

#### Returns

[`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

-`IteratorResult`: 

#### Overrides

[Iterator](Iterator.md).[return](Iterator.md#return)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.generator.d.ts:24

___

### throw

**throw**(`e`): [`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

#### Parameters

| Name |
| :------ |
| `e` | `any` |

#### Returns

[`IteratorResult`](../types/IteratorResult.md)<`T`, `TReturn`\>

-`IteratorResult`: 

#### Overrides

[Iterator](Iterator.md).[throw](Iterator.md#throw)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.generator.d.ts:25
