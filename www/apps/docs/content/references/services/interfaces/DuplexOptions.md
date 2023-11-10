# DuplexOptions

## Hierarchy

- [`ReadableOptions`](ReadableOptions.md)

- [`WritableOptions`](WritableOptions.md)

  ↳ **`DuplexOptions`**

  ↳↳ [`TransformOptions`](../index.md#transformoptions)

## Properties

### allowHalfOpen

 `Optional` **allowHalfOpen**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1018

___

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Inherited from

[WritableOptions](WritableOptions.md).[autoDestroy](WritableOptions.md#autodestroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### decodeStrings

 `Optional` **decodeStrings**: `boolean`

#### Inherited from

[WritableOptions](WritableOptions.md).[decodeStrings](WritableOptions.md#decodestrings)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:979

___

### defaultEncoding

 `Optional` **defaultEncoding**: [`BufferEncoding`](../index.md#bufferencoding)

#### Inherited from

[WritableOptions](WritableOptions.md).[defaultEncoding](WritableOptions.md#defaultencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:980

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Inherited from

[WritableOptions](WritableOptions.md).[emitClose](WritableOptions.md#emitclose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

___

### encoding

 `Optional` **encoding**: [`BufferEncoding`](../index.md#bufferencoding)

#### Inherited from

[ReadableOptions](ReadableOptions.md).[encoding](ReadableOptions.md#encoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:955

___

### highWaterMark

 `Optional` **highWaterMark**: `number`

#### Inherited from

[WritableOptions](WritableOptions.md).[highWaterMark](WritableOptions.md#highwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:948

___

### objectMode

 `Optional` **objectMode**: `boolean`

#### Inherited from

[WritableOptions](WritableOptions.md).[objectMode](WritableOptions.md#objectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:949

___

### readableHighWaterMark

 `Optional` **readableHighWaterMark**: `number`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1021

___

### readableObjectMode

 `Optional` **readableObjectMode**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1019

___

### signal

 `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[WritableOptions](WritableOptions.md).[signal](WritableOptions.md#signal)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:456

___

### writableCorked

 `Optional` **writableCorked**: `number`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1023

___

### writableHighWaterMark

 `Optional` **writableHighWaterMark**: `number`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1022

___

### writableObjectMode

 `Optional` **writableObjectMode**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1020

## Methods

### construct

`Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Duplex`](../classes/Duplex.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[WritableOptions](WritableOptions.md).[construct](WritableOptions.md#construct)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1024

___

### destroy

`Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Duplex`](../classes/Duplex.md) |
| `error` | ``null`` \| `Error` |
| `callback` | (`error`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[WritableOptions](WritableOptions.md).[destroy](WritableOptions.md#destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1036

___

### final

`Optional` **final**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Duplex`](../classes/Duplex.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[WritableOptions](WritableOptions.md).[final](WritableOptions.md#final)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1035

___

### read

`Optional` **read**(`this`, `size`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Duplex`](../classes/Duplex.md) |
| `size` | `number` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[ReadableOptions](ReadableOptions.md).[read](ReadableOptions.md#read)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1025

___

### write

`Optional` **write**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Duplex`](../classes/Duplex.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[WritableOptions](WritableOptions.md).[write](WritableOptions.md#write)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1026

___

### writev

`Optional` **writev**(`this`, `chunks`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Duplex`](../classes/Duplex.md) |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../index.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[WritableOptions](WritableOptions.md).[writev](WritableOptions.md#writev)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1027
