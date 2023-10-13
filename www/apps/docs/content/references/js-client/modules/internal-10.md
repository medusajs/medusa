---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Interfaces

- [BlobPropertyBag](../interfaces/internal-10.BlobPropertyBag.md)
- [File](../interfaces/internal-10.File.md)
- [FilePropertyBag](../interfaces/internal-10.FilePropertyBag.md)
- [QueuingStrategy](../interfaces/internal-10.QueuingStrategy.md)
- [QueuingStrategySize](../interfaces/internal-10.QueuingStrategySize.md)
- [ReadableByteStreamController](../interfaces/internal-10.ReadableByteStreamController.md)
- [ReadableStream](../interfaces/internal-10.ReadableStream.md)
- [ReadableStreamBYOBReader](../interfaces/internal-10.ReadableStreamBYOBReader.md)
- [ReadableStreamBYOBRequest](../interfaces/internal-10.ReadableStreamBYOBRequest.md)
- [ReadableStreamDefaultController](../interfaces/internal-10.ReadableStreamDefaultController.md)
- [ReadableStreamDefaultReader](../interfaces/internal-10.ReadableStreamDefaultReader.md)
- [ReadableStreamGenericReader](../interfaces/internal-10.ReadableStreamGenericReader.md)
- [ReadableStreamGetReaderOptions](../interfaces/internal-10.ReadableStreamGetReaderOptions.md)
- [ReadableStreamReadDoneResult](../interfaces/internal-10.ReadableStreamReadDoneResult.md)
- [ReadableStreamReadValueResult](../interfaces/internal-10.ReadableStreamReadValueResult.md)
- [ReadableWritablePair](../interfaces/internal-10.ReadableWritablePair.md)
- [StreamPipeOptions](../interfaces/internal-10.StreamPipeOptions.md)
- [UnderlyingByteSource](../interfaces/internal-10.UnderlyingByteSource.md)
- [UnderlyingDefaultSource](../interfaces/internal-10.UnderlyingDefaultSource.md)
- [UnderlyingSink](../interfaces/internal-10.UnderlyingSink.md)
- [UnderlyingSinkAbortCallback](../interfaces/internal-10.UnderlyingSinkAbortCallback.md)
- [UnderlyingSinkCloseCallback](../interfaces/internal-10.UnderlyingSinkCloseCallback.md)
- [UnderlyingSinkStartCallback](../interfaces/internal-10.UnderlyingSinkStartCallback.md)
- [UnderlyingSinkWriteCallback](../interfaces/internal-10.UnderlyingSinkWriteCallback.md)
- [UnderlyingSource](../interfaces/internal-10.UnderlyingSource.md)
- [UnderlyingSourceCancelCallback](../interfaces/internal-10.UnderlyingSourceCancelCallback.md)
- [UnderlyingSourcePullCallback](../interfaces/internal-10.UnderlyingSourcePullCallback.md)
- [UnderlyingSourceStartCallback](../interfaces/internal-10.UnderlyingSourceStartCallback.md)
- [WritableStream](../interfaces/internal-10.WritableStream.md)
- [WritableStreamDefaultController](../interfaces/internal-10.WritableStreamDefaultController.md)
- [WritableStreamDefaultWriter](../interfaces/internal-10.WritableStreamDefaultWriter.md)

## Type Aliases

### AdminCreateUploadPayload

Ƭ **AdminCreateUploadPayload**: [`File`](internal-10.md#file) \| [`File`](internal-10.md#file)[]

#### Defined in

[packages/medusa-js/src/typings.ts:51](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L51)

___

### BlobPart

Ƭ **BlobPart**: [`BufferSource`](internal-10.md#buffersource) \| `Blob` \| `string`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:27961

___

### BufferSource

Ƭ **BufferSource**: [`ArrayBufferView`](../interfaces/internal-8.ArrayBufferView.md) \| `ArrayBuffer`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:27963

___

### EndingType

Ƭ **EndingType**: ``"native"`` \| ``"transparent"``

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:28077

___

### ReadableStreamController

Ƭ **ReadableStreamController**<`T`\>: [`ReadableStreamDefaultController`](internal-10.md#readablestreamdefaultcontroller)<`T`\> \| [`ReadableByteStreamController`](internal-10.md#readablebytestreamcontroller)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:28012

___

### ReadableStreamReadResult

Ƭ **ReadableStreamReadResult**<`T`\>: [`ReadableStreamReadValueResult`](../interfaces/internal-10.ReadableStreamReadValueResult.md)<`T`\> \| [`ReadableStreamReadDoneResult`](../interfaces/internal-10.ReadableStreamReadDoneResult.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:28013

___

### ReadableStreamReader

Ƭ **ReadableStreamReader**<`T`\>: [`ReadableStreamDefaultReader`](internal-10.md#readablestreamdefaultreader)<`T`\> \| [`ReadableStreamBYOBReader`](internal-10.md#readablestreambyobreader)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:28014

## Variables

### File

• **File**: `Object`

#### Call signature

• **new File**(`fileBits`, `fileName`, `options?`): [`File`](internal-10.md#file)

##### Parameters

| Name | Type |
| :------ | :------ |
| `fileBits` | [`BlobPart`](internal-10.md#blobpart)[] |
| `fileName` | `string` |
| `options?` | [`FilePropertyBag`](../interfaces/internal-10.FilePropertyBag.md) |

##### Returns

[`File`](internal-10.md#file)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`File`](internal-10.md#file) |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:8260

docs-util/node_modules/typescript/lib/lib.dom.d.ts:8269

___

### ReadableByteStreamController

• **ReadableByteStreamController**: `Object`

#### Call signature

• **new ReadableByteStreamController**(): [`ReadableByteStreamController`](internal-10.md#readablebytestreamcontroller)

##### Returns

[`ReadableByteStreamController`](internal-10.md#readablebytestreamcontroller)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`ReadableByteStreamController`](internal-10.md#readablebytestreamcontroller) |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18464

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18477

___

### ReadableStream

• **ReadableStream**: `Object`

#### Call signature

• **new ReadableStream**(`underlyingSource`, `strategy?`): [`ReadableStream`](internal-10.md#readablestream)<`Uint8Array`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `underlyingSource` | [`UnderlyingByteSource`](../interfaces/internal-10.UnderlyingByteSource.md) |
| `strategy?` | `Object` |
| `strategy.highWaterMark?` | `number` |

##### Returns

[`ReadableStream`](internal-10.md#readablestream)<`Uint8Array`\>

• **new ReadableStream**<`R`\>(`underlyingSource`, `strategy?`): [`ReadableStream`](internal-10.md#readablestream)<`R`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `underlyingSource` | [`UnderlyingDefaultSource`](../interfaces/internal-10.UnderlyingDefaultSource.md)<`R`\> |
| `strategy?` | [`QueuingStrategy`](../interfaces/internal-10.QueuingStrategy.md)<`R`\> |

##### Returns

[`ReadableStream`](internal-10.md#readablestream)<`R`\>

• **new ReadableStream**<`R`\>(`underlyingSource?`, `strategy?`): [`ReadableStream`](internal-10.md#readablestream)<`R`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `underlyingSource?` | [`UnderlyingSource`](../interfaces/internal-10.UnderlyingSource.md)<`R`\> |
| `strategy?` | [`QueuingStrategy`](../interfaces/internal-10.QueuingStrategy.md)<`R`\> |

##### Returns

[`ReadableStream`](internal-10.md#readablestream)<`R`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`ReadableStream`](internal-10.md#readablestream)<`any`\> |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18487

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18504

___

### ReadableStreamBYOBReader

• **ReadableStreamBYOBReader**: `Object`

#### Call signature

• **new ReadableStreamBYOBReader**(`stream`): [`ReadableStreamBYOBReader`](internal-10.md#readablestreambyobreader)

##### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](internal-10.md#readablestream)<`any`\> |

##### Returns

[`ReadableStreamBYOBReader`](internal-10.md#readablestreambyobreader)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`ReadableStreamBYOBReader`](internal-10.md#readablestreambyobreader) |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18512

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18519

___

### ReadableStreamBYOBRequest

• **ReadableStreamBYOBRequest**: `Object`

#### Call signature

• **new ReadableStreamBYOBRequest**(): [`ReadableStreamBYOBRequest`](internal-10.md#readablestreambyobrequest)

##### Returns

[`ReadableStreamBYOBRequest`](internal-10.md#readablestreambyobrequest)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`ReadableStreamBYOBRequest`](internal-10.md#readablestreambyobrequest) |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18525

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18534

___

### ReadableStreamDefaultController

• **ReadableStreamDefaultController**: `Object`

#### Call signature

• **new ReadableStreamDefaultController**(): [`ReadableStreamDefaultController`](internal-10.md#readablestreamdefaultcontroller)<`any`\>

##### Returns

[`ReadableStreamDefaultController`](internal-10.md#readablestreamdefaultcontroller)<`any`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`ReadableStreamDefaultController`](internal-10.md#readablestreamdefaultcontroller)<`any`\> |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18540

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18551

___

### ReadableStreamDefaultReader

• **ReadableStreamDefaultReader**: `Object`

#### Call signature

• **new ReadableStreamDefaultReader**<`R`\>(`stream`): [`ReadableStreamDefaultReader`](internal-10.md#readablestreamdefaultreader)<`R`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](internal-10.md#readablestream)<`R`\> |

##### Returns

[`ReadableStreamDefaultReader`](internal-10.md#readablestreamdefaultreader)<`R`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`ReadableStreamDefaultReader`](internal-10.md#readablestreamdefaultreader)<`any`\> |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18557

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18564

___

### WritableStream

• **WritableStream**: `Object`

#### Call signature

• **new WritableStream**<`W`\>(`underlyingSink?`, `strategy?`): [`WritableStream`](internal-10.md#writablestream)<`W`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `underlyingSink?` | [`UnderlyingSink`](../interfaces/internal-10.UnderlyingSink.md)<`W`\> |
| `strategy?` | [`QueuingStrategy`](../interfaces/internal-10.QueuingStrategy.md)<`W`\> |

##### Returns

[`WritableStream`](internal-10.md#writablestream)<`W`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`WritableStream`](internal-10.md#writablestream)<`any`\> |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26020

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26031

___

### WritableStreamDefaultController

• **WritableStreamDefaultController**: `Object`

#### Call signature

• **new WritableStreamDefaultController**(): [`WritableStreamDefaultController`](internal-10.md#writablestreamdefaultcontroller)

##### Returns

[`WritableStreamDefaultController`](internal-10.md#writablestreamdefaultcontroller)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`WritableStreamDefaultController`](internal-10.md#writablestreamdefaultcontroller) |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26041

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26048

___

### WritableStreamDefaultWriter

• **WritableStreamDefaultWriter**: `Object`

#### Call signature

• **new WritableStreamDefaultWriter**<`W`\>(`stream`): [`WritableStreamDefaultWriter`](internal-10.md#writablestreamdefaultwriter)<`W`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`WritableStream`](internal-10.md#writablestream)<`W`\> |

##### Returns

[`WritableStreamDefaultWriter`](internal-10.md#writablestreamdefaultwriter)<`W`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`WritableStreamDefaultWriter`](internal-10.md#writablestreamdefaultwriter)<`any`\> |

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26058

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26075
