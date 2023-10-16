---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableStream<R\>

[internal](../modules/internal-8.md).ReadableStream

This Streams API interface represents a readable stream of byte data.

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

## Properties

### locked

• `Readonly` **locked**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:136

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`R`\>

#### Returns

[`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`R`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:143

___

### cancel

▸ **cancel**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:137

___

### getReader

▸ **getReader**(): [`ReadableStreamDefaultReader`](../modules/internal-8.md#readablestreamdefaultreader)<`R`\>

#### Returns

[`ReadableStreamDefaultReader`](../modules/internal-8.md#readablestreamdefaultreader)<`R`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:138

___

### pipeThrough

▸ **pipeThrough**<`T`\>(`transform`, `options?`): [`ReadableStream`](../modules/internal-8.md#readablestream)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transform` | [`ReadableWritablePair`](internal-8.ReadableWritablePair.md)<`T`, `R`\> |
| `options?` | [`StreamPipeOptions`](internal-8.StreamPipeOptions.md) |

#### Returns

[`ReadableStream`](../modules/internal-8.md#readablestream)<`T`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:139

___

### pipeTo

▸ **pipeTo**(`destination`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`WritableStream`](../modules/internal-8.md#writablestream)<`R`\> |
| `options?` | [`StreamPipeOptions`](internal-8.StreamPipeOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:140

___

### tee

▸ **tee**(): [[`ReadableStream`](../modules/internal-8.md#readablestream)<`R`\>, [`ReadableStream`](../modules/internal-8.md#readablestream)<`R`\>]

#### Returns

[[`ReadableStream`](../modules/internal-8.md#readablestream)<`R`\>, [`ReadableStream`](../modules/internal-8.md#readablestream)<`R`\>]

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:141

___

### values

▸ **values**(`options?`): [`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`R`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.preventCancel?` | `boolean` |

#### Returns

[`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`R`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:142
