---
displayed_sidebar: jsClientSidebar
---

# Interface: TransformOptions

[internal](../modules/internal-8.md).TransformOptions

## Hierarchy

- [`DuplexOptions`](internal-8.DuplexOptions.md)

  ↳ **`TransformOptions`**

## Properties

### allowHalfOpen

• `Optional` **allowHalfOpen**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[allowHalfOpen](internal-8.DuplexOptions.md#allowhalfopen)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:831

___

### autoDestroy

• `Optional` **autoDestroy**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[autoDestroy](internal-8.DuplexOptions.md#autodestroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:776

___

### decodeStrings

• `Optional` **decodeStrings**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[decodeStrings](internal-8.DuplexOptions.md#decodestrings)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:800

___

### defaultEncoding

• `Optional` **defaultEncoding**: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[defaultEncoding](internal-8.DuplexOptions.md#defaultencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:801

___

### emitClose

• `Optional` **emitClose**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[emitClose](internal-8.DuplexOptions.md#emitclose)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:771

___

### encoding

• `Optional` **encoding**: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[encoding](internal-8.DuplexOptions.md#encoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:779

___

### highWaterMark

• `Optional` **highWaterMark**: `number`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[highWaterMark](internal-8.DuplexOptions.md#highwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:772

___

### objectMode

• `Optional` **objectMode**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[objectMode](internal-8.DuplexOptions.md#objectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:773

___

### readableHighWaterMark

• `Optional` **readableHighWaterMark**: `number`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[readableHighWaterMark](internal-8.DuplexOptions.md#readablehighwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:834

___

### readableObjectMode

• `Optional` **readableObjectMode**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[readableObjectMode](internal-8.DuplexOptions.md#readableobjectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:832

___

### signal

• `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[signal](internal-8.DuplexOptions.md#signal)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:380

___

### writableCorked

• `Optional` **writableCorked**: `number`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[writableCorked](internal-8.DuplexOptions.md#writablecorked)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:836

___

### writableHighWaterMark

• `Optional` **writableHighWaterMark**: `number`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[writableHighWaterMark](internal-8.DuplexOptions.md#writablehighwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:835

___

### writableObjectMode

• `Optional` **writableObjectMode**: `boolean`

#### Inherited from

[DuplexOptions](internal-8.DuplexOptions.md).[writableObjectMode](internal-8.DuplexOptions.md#writableobjectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:833

## Methods

### construct

▸ `Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[DuplexOptions](internal-8.DuplexOptions.md).[construct](internal-8.DuplexOptions.md#construct)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1046

___

### destroy

▸ `Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[DuplexOptions](internal-8.DuplexOptions.md).[destroy](internal-8.DuplexOptions.md#destroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1058

___

### final

▸ `Optional` **final**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[DuplexOptions](internal-8.DuplexOptions.md).[final](internal-8.DuplexOptions.md#final)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1057

___

### flush

▸ `Optional` **flush**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `callback` | [`TransformCallback`](../modules/internal-8.md#transformcallback) |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1060

___

### read

▸ `Optional` **read**(`this`, `size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `size` | `number` |

#### Returns

`void`

#### Overrides

[DuplexOptions](internal-8.DuplexOptions.md).[read](internal-8.DuplexOptions.md#read)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1047

___

### transform

▸ `Optional` **transform**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `callback` | [`TransformCallback`](../modules/internal-8.md#transformcallback) |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1059

___

### write

▸ `Optional` **write**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[DuplexOptions](internal-8.DuplexOptions.md).[write](internal-8.DuplexOptions.md#write)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1048

___

### writev

▸ `Optional` **writev**(`this`, `chunks`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Transform`](../classes/internal-8.Transform.md) |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[DuplexOptions](internal-8.DuplexOptions.md).[writev](internal-8.DuplexOptions.md#writev)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1049
