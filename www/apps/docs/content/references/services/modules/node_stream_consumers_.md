# "node:stream/consumers"

## Functions

### arrayBuffer

**arrayBuffer**(`stream`): `Promise`<`ArrayBuffer`\>

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`any`\> |

#### Returns

`Promise`<`ArrayBuffer`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/consumers.d.ts:6

___

### blob

**blob**(`stream`): `Promise`<[`Blob`](../classes/Blob.md)\>

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`any`\> |

#### Returns

`Promise`<[`Blob`](../classes/Blob.md)\>

-`Promise`: 
	-`constructor`: 
	-`size`: The total size of the `Blob` in bytes.
	-`type`: The content-type of the `Blob`.
	-`arrayBuffer`: 
	-`slice`: 
	-`stream`: 
	-`text`: 

#### Defined in

docs-util/node_modules/@types/node/stream/consumers.d.ts:7

___

### buffer

**buffer**(`stream`): `Promise`<[`Buffer`](../index.md#buffer)\>

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`any`\> |

#### Returns

`Promise`<[`Buffer`](../index.md#buffer)\>

-`Promise`: 
	-`Buffer`: 
		-`poolSize`: This is the size (in bytes) of pre-allocated internal `Buffer` instances used for pooling. This value may be modified.

#### Defined in

docs-util/node_modules/@types/node/stream/consumers.d.ts:4

___

### json

**json**(`stream`): `Promise`<`unknown`\>

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`any`\> |

#### Returns

`Promise`<`unknown`\>

-`Promise`: 
	-`unknown`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream/consumers.d.ts:8

___

### text

**text**(`stream`): `Promise`<`string`\>

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`any`\> |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream/consumers.d.ts:5
