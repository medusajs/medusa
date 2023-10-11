---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableOptions

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal-2.md).ReadableOptions

## Hierarchy

- [`StreamOptions`](internal-8.internal-2.StreamOptions.md)<[`Readable`](../classes/internal-8.Readable.md)\>

  ↳ **`ReadableOptions`**

  ↳↳ [`DuplexOptions`](internal-8.DuplexOptions.md)

## Properties

### autoDestroy

• `Optional` **autoDestroy**: `boolean`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[autoDestroy](internal-8.internal-2.StreamOptions.md#autodestroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:776

___

### emitClose

• `Optional` **emitClose**: `boolean`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[emitClose](internal-8.internal-2.StreamOptions.md#emitclose)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:771

___

### encoding

• `Optional` **encoding**: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:779

___

### highWaterMark

• `Optional` **highWaterMark**: `number`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[highWaterMark](internal-8.internal-2.StreamOptions.md#highwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:772

___

### objectMode

• `Optional` **objectMode**: `boolean`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[objectMode](internal-8.internal-2.StreamOptions.md#objectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:773

___

### signal

• `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[signal](internal-8.internal-2.StreamOptions.md#signal)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:380

## Methods

### construct

▸ `Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Readable`](../classes/internal-8.Readable.md) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[construct](internal-8.internal-2.StreamOptions.md#construct)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:774

___

### destroy

▸ `Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Readable`](../classes/internal-8.Readable.md) |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[destroy](internal-8.internal-2.StreamOptions.md#destroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:775

___

### read

▸ `Optional` **read**(`this`, `size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Readable`](../classes/internal-8.Readable.md) |
| `size` | `number` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:780
