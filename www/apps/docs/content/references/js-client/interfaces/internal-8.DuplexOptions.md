---
displayed_sidebar: jsClientSidebar
---

# Interface: DuplexOptions

[internal](../modules/internal-8.md).DuplexOptions

## Hierarchy

- [`ReadableOptions`](internal-8.internal-2.ReadableOptions.md)

- [`WritableOptions`](internal-8.internal-2.WritableOptions.md)

  ↳ **`DuplexOptions`**

  ↳↳ [`TransformOptions`](internal-8.TransformOptions.md)

## Properties

### allowHalfOpen

• `Optional` **allowHalfOpen**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:831

___

### autoDestroy

• `Optional` **autoDestroy**: `boolean`

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[autoDestroy](internal-8.internal-2.WritableOptions.md#autodestroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:776

___

### decodeStrings

• `Optional` **decodeStrings**: `boolean`

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[decodeStrings](internal-8.internal-2.WritableOptions.md#decodestrings)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:800

___

### defaultEncoding

• `Optional` **defaultEncoding**: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[defaultEncoding](internal-8.internal-2.WritableOptions.md#defaultencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:801

___

### emitClose

• `Optional` **emitClose**: `boolean`

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[emitClose](internal-8.internal-2.WritableOptions.md#emitclose)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:771

___

### encoding

• `Optional` **encoding**: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

#### Inherited from

[ReadableOptions](internal-8.internal-2.ReadableOptions.md).[encoding](internal-8.internal-2.ReadableOptions.md#encoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:779

___

### highWaterMark

• `Optional` **highWaterMark**: `number`

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[highWaterMark](internal-8.internal-2.WritableOptions.md#highwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:772

___

### objectMode

• `Optional` **objectMode**: `boolean`

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[objectMode](internal-8.internal-2.WritableOptions.md#objectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:773

___

### readableHighWaterMark

• `Optional` **readableHighWaterMark**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:834

___

### readableObjectMode

• `Optional` **readableObjectMode**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:832

___

### signal

• `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[WritableOptions](internal-8.internal-2.WritableOptions.md).[signal](internal-8.internal-2.WritableOptions.md#signal)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:380

___

### writableCorked

• `Optional` **writableCorked**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:836

___

### writableHighWaterMark

• `Optional` **writableHighWaterMark**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:835

___

### writableObjectMode

• `Optional` **writableObjectMode**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:833

## Methods

### construct

▸ `Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Duplex`](../classes/internal-8.Duplex.md) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[WritableOptions](internal-8.internal-2.WritableOptions.md).[construct](internal-8.internal-2.WritableOptions.md#construct)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:837

___

### destroy

▸ `Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Duplex`](../classes/internal-8.Duplex.md) |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[WritableOptions](internal-8.internal-2.WritableOptions.md).[destroy](internal-8.internal-2.WritableOptions.md#destroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:849

___

### final

▸ `Optional` **final**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Duplex`](../classes/internal-8.Duplex.md) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[WritableOptions](internal-8.internal-2.WritableOptions.md).[final](internal-8.internal-2.WritableOptions.md#final)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:848

___

### read

▸ `Optional` **read**(`this`, `size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Duplex`](../classes/internal-8.Duplex.md) |
| `size` | `number` |

#### Returns

`void`

#### Overrides

[ReadableOptions](internal-8.internal-2.ReadableOptions.md).[read](internal-8.internal-2.ReadableOptions.md#read)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:838

___

### write

▸ `Optional` **write**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Duplex`](../classes/internal-8.Duplex.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[WritableOptions](internal-8.internal-2.WritableOptions.md).[write](internal-8.internal-2.WritableOptions.md#write)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:839

___

### writev

▸ `Optional` **writev**(`this`, `chunks`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Duplex`](../classes/internal-8.Duplex.md) |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Overrides

[WritableOptions](internal-8.internal-2.WritableOptions.md).[writev](internal-8.internal-2.WritableOptions.md#writev)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:840
