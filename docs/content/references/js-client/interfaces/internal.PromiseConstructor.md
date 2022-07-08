---
displayed_sidebar: jsClientSidebar
---

# Interface: PromiseConstructor

[internal](../modules/internal.md).PromiseConstructor

## Properties

### [species]

• `Readonly` **[species]**: [`PromiseConstructor`](internal.PromiseConstructor.md)

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:178

___

### prototype

• `Readonly` **prototype**: [`Promise`](../modules/internal.md#promise)<`any`\>

A reference to the prototype.

#### Defined in

node_modules/typescript/lib/lib.es2015.promise.d.ts:25

## Methods

### all

▸ **all**<`T`\>(`values`): [`Promise`](../modules/internal.md#promise)<[`Awaited`](../modules/internal.md#awaited)<`T`\>[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | [`Iterable`](internal.Iterable.md)<`T` \| [`PromiseLike`](internal.PromiseLike.md)<`T`\>\> | An iterable of Promises. |

#### Returns

[`Promise`](../modules/internal.md#promise)<[`Awaited`](../modules/internal.md#awaited)<`T`\>[]\>

A new Promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:226

▸ **all**<`T`\>(`values`): [`Promise`](../modules/internal.md#promise)<{ -readonly [P in string \| number \| symbol]: Awaited<T[P]\> }\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends readonly `unknown`[] \| [] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

[`Promise`](../modules/internal.md#promise)<{ -readonly [P in string \| number \| symbol]: Awaited<T[P]\> }\>

A new Promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.promise.d.ts:41

___

### allSettled

▸ **allSettled**<`T`\>(`values`): [`Promise`](../modules/internal.md#promise)<{ -readonly [P in string \| number \| symbol]: PromiseSettledResult<Awaited<T[P]\>\> }\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends readonly `unknown`[] \| [] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

[`Promise`](../modules/internal.md#promise)<{ -readonly [P in string \| number \| symbol]: PromiseSettledResult<Awaited<T[P]\>\> }\>

A new Promise.

#### Defined in

node_modules/typescript/lib/lib.es2020.promise.d.ts:40

▸ **allSettled**<`T`\>(`values`): [`Promise`](../modules/internal.md#promise)<[`PromiseSettledResult`](../modules/internal.md#promisesettledresult)<[`Awaited`](../modules/internal.md#awaited)<`T`\>\>[]\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | [`Iterable`](internal.Iterable.md)<`T` \| [`PromiseLike`](internal.PromiseLike.md)<`T`\>\> | An array of Promises. |

#### Returns

[`Promise`](../modules/internal.md#promise)<[`PromiseSettledResult`](../modules/internal.md#promisesettledresult)<[`Awaited`](../modules/internal.md#awaited)<`T`\>\>[]\>

A new Promise.

#### Defined in

node_modules/typescript/lib/lib.es2020.promise.d.ts:48

___

### race

▸ **race**<`T`\>(`values`): [`Promise`](../modules/internal.md#promise)<[`Awaited`](../modules/internal.md#awaited)<`T`\>\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | [`Iterable`](internal.Iterable.md)<`T` \| [`PromiseLike`](internal.PromiseLike.md)<`T`\>\> | An iterable of Promises. |

#### Returns

[`Promise`](../modules/internal.md#promise)<[`Awaited`](../modules/internal.md#awaited)<`T`\>\>

A new Promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:234

▸ **race**<`T`\>(`values`): [`Promise`](../modules/internal.md#promise)<[`Awaited`](../modules/internal.md#awaited)<`T`[`number`]\>\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends readonly `unknown`[] \| [] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

[`Promise`](../modules/internal.md#promise)<[`Awaited`](../modules/internal.md#awaited)<`T`[`number`]\>\>

A new Promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.promise.d.ts:52

___

### reject

▸ **reject**<`T`\>(`reason?`): [`Promise`](../modules/internal.md#promise)<`T`\>

Creates a new rejected promise for the provided reason.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason?` | `any` | The reason the promise was rejected. |

#### Returns

[`Promise`](../modules/internal.md#promise)<`T`\>

A new rejected Promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.promise.d.ts:62

___

### resolve

▸ **resolve**(): [`Promise`](../modules/internal.md#promise)<`void`\>

Creates a new resolved promise.

#### Returns

[`Promise`](../modules/internal.md#promise)<`void`\>

A resolved promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.promise.d.ts:68

▸ **resolve**<`T`\>(`value`): [`Promise`](../modules/internal.md#promise)<`T`\>

Creates a new resolved promise for the provided value.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` \| [`PromiseLike`](internal.PromiseLike.md)<`T`\> | A promise. |

#### Returns

[`Promise`](../modules/internal.md#promise)<`T`\>

A promise whose internal state matches the provided promise.

#### Defined in

node_modules/typescript/lib/lib.es2015.promise.d.ts:75
