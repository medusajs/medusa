# Blob

A [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) encapsulates immutable, raw data that can be safely shared across
multiple worker threads.

**Since**

v15.7.0, v14.18.0

## Constructors

### constructor

**new Blob**(`sources`, `options?`)

Creates a new `Blob` object containing a concatenation of the given sources.

{ArrayBuffer}, {TypedArray}, {DataView}, and {Buffer} sources are copied into
the 'Blob' and can therefore be safely modified after the 'Blob' is created.

String sources are also copied into the `Blob`.

#### Parameters

| Name |
| :------ |
| `sources` | ([`Blob`](Blob.md) \| [`BinaryLike`](../index.md#binarylike))[] |
| `options?` | [`BlobOptions`](../interfaces/BlobOptions.md) |

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:165

## Properties

### size

 `Readonly` **size**: `number`

The total size of the `Blob` in bytes.

**Since**

v15.7.0, v14.18.0

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:151

___

### type

 `Readonly` **type**: `string`

The content-type of the `Blob`.

**Since**

v15.7.0, v14.18.0

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:156

## Methods

### arrayBuffer

**arrayBuffer**(): `Promise`<`ArrayBuffer`\>

Returns a promise that fulfills with an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing a copy of
the `Blob` data.

#### Returns

`Promise`<`ArrayBuffer`\>

-`Promise`: 

**Since**

v15.7.0, v14.18.0

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:171

___

### slice

**slice**(`start?`, `end?`, `type?`): [`Blob`](Blob.md)

Creates and returns a new `Blob` containing a subset of this `Blob` objects
data. The original `Blob` is not altered.

#### Parameters

| Name | Description |
| :------ | :------ |
| `start?` | `number` | The starting index. |
| `end?` | `number` | The ending index. |
| `type?` | `string` | The content-type for the new `Blob` |

#### Returns

[`Blob`](Blob.md)

-`Blob`: 

**Since**

v15.7.0, v14.18.0

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:180

___

### stream

**stream**(): [`ReadableStream`](../index.md#readablestream)<`any`\>

Returns a new `ReadableStream` that allows the content of the `Blob` to be read.

#### Returns

[`ReadableStream`](../index.md#readablestream)<`any`\>

-`ReadableStream`: 
	-`any`: (optional) 

**Since**

v16.7.0

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:191

___

### text

**text**(): `Promise`<`string`\>

Returns a promise that fulfills with the contents of the `Blob` decoded as a
UTF-8 string.

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

**Since**

v15.7.0, v14.18.0

#### Defined in

docs-util/node_modules/@types/node/buffer.d.ts:186
