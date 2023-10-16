---
displayed_sidebar: jsClientSidebar
---

# Interface: WritableStream<W\>

[internal](../modules/internal-10.md).WritableStream

This Streams API interface provides a standard abstraction for writing streaming data to a destination, known as a sink. This object comes with built-in backpressure and queuing.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStream)

## Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `any` |

## Properties

### locked

• `Readonly` **locked**: `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStream/locked)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26022

## Methods

### abort

▸ **abort**(`reason?`): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStream/abort)

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26024

___

### close

▸ **close**(): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStream/close)

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26026

___

### getWriter

▸ **getWriter**(): [`WritableStreamDefaultWriter`](../modules/internal-10.md#writablestreamdefaultwriter)<`W`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStream/getWriter)

#### Returns

[`WritableStreamDefaultWriter`](../modules/internal-10.md#writablestreamdefaultwriter)<`W`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26028
