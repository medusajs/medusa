---
displayed_sidebar: jsClientSidebar
---

# Interface: WritableStream<W\>

[internal](../modules/internal-8.md).WritableStream

This Streams API interface provides a standard abstraction for writing
streaming data to a destination, known as a sink. This object comes with
built-in back pressure and queuing.

## Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `any` |

## Properties

### locked

• `Readonly` **locked**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:212

## Methods

### abort

▸ **abort**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:213

___

### close

▸ **close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:214

___

### getWriter

▸ **getWriter**(): [`WritableStreamDefaultWriter`](../modules/internal-8.md#writablestreamdefaultwriter)<`W`\>

#### Returns

[`WritableStreamDefaultWriter`](../modules/internal-8.md#writablestreamdefaultwriter)<`W`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:215
