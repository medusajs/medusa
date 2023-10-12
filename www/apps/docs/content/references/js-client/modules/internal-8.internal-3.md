---
displayed_sidebar: jsClientSidebar
---

# Namespace: internal

[internal](internal-8.md).internal

## Functions

### finished

▸ **finished**(`stream`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) |
| `options?` | [`FinishedOptions`](../interfaces/internal-8.internal-2.FinishedOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:3

___

### pipeline

▸ **pipeline**<`A`, `B`\>(`source`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:4

▸ **pipeline**<`A`, `T1`, `B`\>(`source`, `transform1`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:5

▸ **pipeline**<`A`, `T1`, `T2`, `B`\>(`source`, `transform1`, `transform2`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `T2` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T1`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:11

▸ **pipeline**<`A`, `T1`, `T2`, `T3`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `T2` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T1`, `any`\> |
| `T3` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T2`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:18

▸ **pipeline**<`A`, `T1`, `T2`, `T3`, `T4`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `transform4`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `T2` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T1`, `any`\> |
| `T3` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T2`, `any`\> |
| `T4` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T3`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `transform4` | `T4` |
| `destination` | `B` |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

[`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:25

▸ **pipeline**(`streams`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `streams` | readonly ([`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md))[] |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:33

▸ **pipeline**(`stream1`, `stream2`, `...streams`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream1` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) |
| `stream2` | [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) |
| `...streams` | ([`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) \| [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md))[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/promises.d.ts:34
