# TransformOptions

[internal](../../modules/internal.md).TransformOptions

## Hierarchy

- [`DuplexOptions`](../../interfaces/DuplexOptions.md)

  ↳ **`TransformOptions`**

## Properties

### allowHalfOpen

 `Optional` **allowHalfOpen**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[allowHalfOpen](../../interfaces/DuplexOptions.md#allowhalfopen)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1018

___

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[autoDestroy](../../interfaces/DuplexOptions.md#autodestroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### decodeStrings

 `Optional` **decodeStrings**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[decodeStrings](../../interfaces/DuplexOptions.md#decodestrings)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:979

___

### defaultEncoding

 `Optional` **defaultEncoding**: [`BufferEncoding`](../../types/BufferEncoding.md)

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[defaultEncoding](../../interfaces/DuplexOptions.md#defaultencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:980

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[emitClose](../../interfaces/DuplexOptions.md#emitclose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

___

### encoding

 `Optional` **encoding**: [`BufferEncoding`](../../types/BufferEncoding.md)

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[encoding](../../interfaces/DuplexOptions.md#encoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:955

___

### highWaterMark

 `Optional` **highWaterMark**: `number`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[highWaterMark](../../interfaces/DuplexOptions.md#highwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:948

___

### objectMode

 `Optional` **objectMode**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[objectMode](../../interfaces/DuplexOptions.md#objectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:949

___

### readableHighWaterMark

 `Optional` **readableHighWaterMark**: `number`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[readableHighWaterMark](../../interfaces/DuplexOptions.md#readablehighwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1021

___

### readableObjectMode

 `Optional` **readableObjectMode**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[readableObjectMode](../../interfaces/DuplexOptions.md#readableobjectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1019

___

### signal

 `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[signal](../../interfaces/DuplexOptions.md#signal)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:456

___

### writableCorked

 `Optional` **writableCorked**: `number`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[writableCorked](../../interfaces/DuplexOptions.md#writablecorked)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1023

___

### writableHighWaterMark

 `Optional` **writableHighWaterMark**: `number`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[writableHighWaterMark](../../interfaces/DuplexOptions.md#writablehighwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1022

___

### writableObjectMode

 `Optional` **writableObjectMode**: `boolean`

#### Inherited from

[DuplexOptions](../../interfaces/DuplexOptions.md).[writableObjectMode](../../interfaces/DuplexOptions.md#writableobjectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1020

## Methods

### construct

`Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[DuplexOptions](../../interfaces/DuplexOptions.md).[construct](../../interfaces/DuplexOptions.md#construct)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1247

___

### destroy

`Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `error` | ``null`` \| `Error` |
| `callback` | (`error`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[DuplexOptions](../../interfaces/DuplexOptions.md).[destroy](../../interfaces/DuplexOptions.md#destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1264

___

### final

`Optional` **final**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[DuplexOptions](../../interfaces/DuplexOptions.md).[final](../../interfaces/DuplexOptions.md#final)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1263

___

### flush

`Optional` **flush**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `callback` | [`TransformCallback`](../types/internal.TransformCallback.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1266

___

### read

`Optional` **read**(`this`, `size`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `size` | `number` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[DuplexOptions](../../interfaces/DuplexOptions.md).[read](../../interfaces/DuplexOptions.md#read)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1248

___

### transform

`Optional` **transform**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../../types/BufferEncoding.md) |
| `callback` | [`TransformCallback`](../types/internal.TransformCallback.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1265

___

### write

`Optional` **write**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../../types/BufferEncoding.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[DuplexOptions](../../interfaces/DuplexOptions.md).[write](../../interfaces/DuplexOptions.md#write)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1249

___

### writev

`Optional` **writev**(`this`, `chunks`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Transform`](../classes/internal.Transform.md) |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../../types/BufferEncoding.md)  }[] |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Overrides

[DuplexOptions](../../interfaces/DuplexOptions.md).[writev](../../interfaces/DuplexOptions.md#writev)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1255
