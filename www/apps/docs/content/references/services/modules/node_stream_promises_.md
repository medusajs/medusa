# "node:stream/promises"

## Functions

### finished

**finished**(`stream`, `options?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `stream` | [`ReadableStream`](../interfaces/ReadableStream.md) \| [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) |
| `options?` | [`FinishedOptions`](../internal/interfaces/internal.FinishedOptions.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:10

___

### pipeline

**pipeline**<`A`, `B`\>(`source`, `destination`, `options?`): [`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:14

**pipeline**<`A`, `T1`, `B`\>(`source`, `transform1`, `destination`, `options?`): [`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:19

**pipeline**<`A`, `T1`, `T2`, `B`\>(`source`, `transform1`, `transform2`, `destination`, `options?`): [`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:29

**pipeline**<`A`, `T1`, `T2`, `T3`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `destination`, `options?`): [`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `T3` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T2`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:41

**pipeline**<`A`, `T1`, `T2`, `T3`, `T4`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `transform4`, `destination`, `options?`): [`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `T3` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T2`, `any`\> |
| `T4` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T3`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `transform4` | `T4` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../internal/types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:55

**pipeline**(`streams`, `options?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `streams` | readonly ([`ReadableStream`](../interfaces/ReadableStream.md) \| [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md))[] |
| `options?` | [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:71

**pipeline**(`stream1`, `stream2`, `...streams`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `stream1` | [`ReadableStream`](../interfaces/ReadableStream.md) |
| `stream2` | [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) |
| `...streams` | ([`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) \| [`PipelineOptions`](../internal/interfaces/internal.PipelineOptions.md))[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/promises.d.ts:75
