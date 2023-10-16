---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableStream<R\>

[internal](../modules/internal-10.md).ReadableStream

This Streams API interface represents a readable stream of byte data. The Fetch API offers a concrete instance of a ReadableStream through the body property of a Response object.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream)

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

## Properties

### locked

• `Readonly` **locked**: `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream/locked)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18489

## Methods

### cancel

▸ **cancel**(`reason?`): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream/cancel)

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18491

___

### getReader

▸ **getReader**(`options`): [`ReadableStreamBYOBReader`](../modules/internal-10.md#readablestreambyobreader)

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream/getReader)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.mode` | ``"byob"`` |

#### Returns

[`ReadableStreamBYOBReader`](../modules/internal-10.md#readablestreambyobreader)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18493

▸ **getReader**(): [`ReadableStreamDefaultReader`](../modules/internal-10.md#readablestreamdefaultreader)<`R`\>

#### Returns

[`ReadableStreamDefaultReader`](../modules/internal-10.md#readablestreamdefaultreader)<`R`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18494

▸ **getReader**(`options?`): [`ReadableStreamReader`](../modules/internal-10.md#readablestreamreader)<`R`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ReadableStreamGetReaderOptions`](internal-10.ReadableStreamGetReaderOptions.md) |

#### Returns

[`ReadableStreamReader`](../modules/internal-10.md#readablestreamreader)<`R`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18495

___

### pipeThrough

▸ **pipeThrough**<`T`\>(`transform`, `options?`): [`ReadableStream`](../modules/internal-10.md#readablestream)<`T`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeThrough)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transform` | [`ReadableWritablePair`](internal-10.ReadableWritablePair.md)<`T`, `R`\> |
| `options?` | [`StreamPipeOptions`](internal-10.StreamPipeOptions.md) |

#### Returns

[`ReadableStream`](../modules/internal-10.md#readablestream)<`T`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18497

___

### pipeTo

▸ **pipeTo**(`destination`, `options?`): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeTo)

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`WritableStream`](../modules/internal-10.md#writablestream)<`R`\> |
| `options?` | [`StreamPipeOptions`](internal-10.StreamPipeOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18499

___

### tee

▸ **tee**(): [[`ReadableStream`](../modules/internal-10.md#readablestream)<`R`\>, [`ReadableStream`](../modules/internal-10.md#readablestream)<`R`\>]

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee)

#### Returns

[[`ReadableStream`](../modules/internal-10.md#readablestream)<`R`\>, [`ReadableStream`](../modules/internal-10.md#readablestream)<`R`\>]

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18501
