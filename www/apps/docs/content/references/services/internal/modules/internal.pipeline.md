# pipeline

[internal](../../modules/internal.md).pipeline

## Functions

### \_\_promisify\_\_

**__promisify__**<`A`, `B`\>(`source`, `destination`, `options?`): [`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../types/internal.PipelineSource.md)<`any`\> |
| `B` | [`WritableStream`](../../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1608

**__promisify__**<`A`, `T1`, `B`\>(`source`, `transform1`, `destination`, `options?`): [`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`A`, `any`\> |
| `B` | [`WritableStream`](../../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1613

**__promisify__**<`A`, `T1`, `T2`, `B`\>(`source`, `transform1`, `transform2`, `destination`, `options?`): [`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `B` | [`WritableStream`](../../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1623

**__promisify__**<`A`, `T1`, `T2`, `T3`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `destination`, `options?`): [`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `T3` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`T2`, `any`\> |
| `B` | [`WritableStream`](../../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1635

**__promisify__**<`A`, `T1`, `T2`, `T3`, `T4`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `transform4`, `destination`, `options?`): [`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `T3` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`T2`, `any`\> |
| `T4` | [`PipelineTransform`](../types/internal.PipelineTransform.md)<`T3`, `any`\> |
| `B` | [`WritableStream`](../../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `transform4` | `T4` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](../types/internal.PipelinePromise.md)<`B`\>

-`PipelinePromise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1649

**__promisify__**(`streams`, `options?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `streams` | readonly ([`ReadableStream`](../../interfaces/ReadableStream.md) \| [`WritableStream`](../../interfaces/WritableStream.md) \| [`ReadWriteStream`](../../interfaces/ReadWriteStream.md))[] |
| `options?` | [`PipelineOptions`](../interfaces/internal.PipelineOptions.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1665

**__promisify__**(`stream1`, `stream2`, `...streams`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `stream1` | [`ReadableStream`](../../interfaces/ReadableStream.md) |
| `stream2` | [`WritableStream`](../../interfaces/WritableStream.md) \| [`ReadWriteStream`](../../interfaces/ReadWriteStream.md) |
| `...streams` | ([`WritableStream`](../../interfaces/WritableStream.md) \| [`ReadWriteStream`](../../interfaces/ReadWriteStream.md) \| [`PipelineOptions`](../interfaces/internal.PipelineOptions.md))[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1669
