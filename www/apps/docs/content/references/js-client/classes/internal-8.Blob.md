---
displayed_sidebar: jsClientSidebar
---

# Class: Blob

[internal](../modules/internal-8.md).Blob

A [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) encapsulates immutable, raw data that can be safely shared across
multiple worker threads.

**`Since`**

v15.7.0, v14.18.0

## Properties

### size

• `Readonly` **size**: `number`

The total size of the `Blob` in bytes.

**`Since`**

v15.7.0, v14.18.0

#### Defined in

packages/medusa-js/node_modules/@types/node/buffer.d.ts:142

___

### type

• `Readonly` **type**: `string`

The content-type of the `Blob`.

**`Since`**

v15.7.0, v14.18.0

#### Defined in

packages/medusa-js/node_modules/@types/node/buffer.d.ts:147

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

Returns a promise that fulfills with an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing a copy of
the `Blob` data.

#### Returns

`Promise`<`ArrayBuffer`\>

**`Since`**

v15.7.0, v14.18.0

#### Defined in

packages/medusa-js/node_modules/@types/node/buffer.d.ts:162

___

### slice

▸ **slice**(`start?`, `end?`, `type?`): [`Blob`](internal-8.Blob.md)

Creates and returns a new `Blob` containing a subset of this `Blob` objects
data. The original `Blob` is not altered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start?` | `number` | The starting index. |
| `end?` | `number` | The ending index. |
| `type?` | `string` | The content-type for the new `Blob` |

#### Returns

[`Blob`](internal-8.Blob.md)

**`Since`**

v15.7.0, v14.18.0

#### Defined in

packages/medusa-js/node_modules/@types/node/buffer.d.ts:171

___

### stream

▸ **stream**(): [`ReadableStream`](../modules/internal-8.md#readablestream)<`any`\>

Returns a new `ReadableStream` that allows the content of the `Blob` to be read.

#### Returns

[`ReadableStream`](../modules/internal-8.md#readablestream)<`any`\>

**`Since`**

v16.7.0

#### Defined in

packages/medusa-js/node_modules/@types/node/buffer.d.ts:182

___

### text

▸ **text**(): `Promise`<`string`\>

Returns a promise that fulfills with the contents of the `Blob` decoded as a
UTF-8 string.

#### Returns

`Promise`<`string`\>

**`Since`**

v15.7.0, v14.18.0

#### Defined in

packages/medusa-js/node_modules/@types/node/buffer.d.ts:177
