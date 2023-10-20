---
displayed_sidebar: jsClientSidebar
---

# Namespace: pipeline

[internal](internal-8.md).[internal](internal-8.internal-2.md).pipeline

## Functions

### \_\_promisify\_\_

▸ **__promisify__**<`A`, `B`\>(`source`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

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

packages/medusa-js/node_modules/@types/node/stream.d.ts:1359

▸ **__promisify__**<`A`, `T1`, `B`\>(`source`, `transform1`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

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

packages/medusa-js/node_modules/@types/node/stream.d.ts:1360

▸ **__promisify__**<`A`, `T1`, `T2`, `B`\>(`source`, `transform1`, `transform2`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

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

packages/medusa-js/node_modules/@types/node/stream.d.ts:1366

▸ **__promisify__**<`A`, `T1`, `T2`, `T3`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

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

packages/medusa-js/node_modules/@types/node/stream.d.ts:1373

▸ **__promisify__**<`A`, `T1`, `T2`, `T3`, `T4`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `transform4`, `destination`, `options?`): [`PipelinePromise`](internal-8.internal-2.md#pipelinepromise)<`B`\>

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

packages/medusa-js/node_modules/@types/node/stream.d.ts:1380

▸ **__promisify__**(`streams`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `streams` | readonly ([`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md))[] |
| `options?` | [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1388

▸ **__promisify__**(`stream1`, `stream2`, `...streams`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream1` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) |
| `stream2` | [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) |
| `...streams` | ([`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) \| [`PipelineOptions`](../interfaces/internal-8.internal-2.PipelineOptions.md))[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1389
