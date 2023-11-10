# ReadableStream

This Streams API interface represents a readable stream of byte data.

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `object` |

## Properties

### locked

 `Readonly` **locked**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:147

## Methods

### [asyncIterator]

**[asyncIterator]**(): [`AsyncIterableIterator`](AsyncIterableIterator.md)<`R`\>

#### Returns

[`AsyncIterableIterator`](AsyncIterableIterator.md)<`R`\>

-`AsyncIterableIterator`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:155

___

### cancel

**cancel**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:148

___

### getReader

**getReader**(): [`ReadableStreamDefaultReader`](../index.md#readablestreamdefaultreader)<`R`\>

#### Returns

[`ReadableStreamDefaultReader`](../index.md#readablestreamdefaultreader)<`R`\>

-`ReadableStreamDefaultReader`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:149

**getReader**(`options`): [`ReadableStreamBYOBReader`](../index.md#readablestreambyobreader)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.mode` | ``"byob"`` |

#### Returns

[`ReadableStreamBYOBReader`](../index.md#readablestreambyobreader)

-`ReadableStreamBYOBReader`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:150

___

### pipeThrough

**pipeThrough**<`T`\>(`transform`, `options?`): [`ReadableStream`](../index.md#readablestream)<`T`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `transform` | [`ReadableWritablePair`](ReadableWritablePair.md)<`T`, `R`\> |
| `options?` | [`StreamPipeOptions`](StreamPipeOptions.md) |

#### Returns

[`ReadableStream`](../index.md#readablestream)<`T`\>

-`ReadableStream`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:151

___

### pipeTo

**pipeTo**(`destination`, `options?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `destination` | [`WritableStream`](../index.md#writablestream)<`R`\> |
| `options?` | [`StreamPipeOptions`](StreamPipeOptions.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:152

___

### tee

**tee**(): [[`ReadableStream`](../index.md#readablestream)<`R`\>, [`ReadableStream`](../index.md#readablestream)<`R`\>]

#### Returns

[[`ReadableStream`](../index.md#readablestream)<`R`\>, [`ReadableStream`](../index.md#readablestream)<`R`\>]

-`[[`ReadableStream`](../index.md#readablestream)<`R`\>, [`ReadableStream`](../index.md#readablestream)<`R`\>]`: 
	-`ReadableStream`: 
	-`ReadableStream`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:153

___

### values

**values**(`options?`): [`AsyncIterableIterator`](AsyncIterableIterator.md)<`R`\>

#### Parameters

| Name |
| :------ |
| `options?` | `object` |
| `options.preventCancel?` | `boolean` |

#### Returns

[`AsyncIterableIterator`](AsyncIterableIterator.md)<`R`\>

-`AsyncIterableIterator`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:154
