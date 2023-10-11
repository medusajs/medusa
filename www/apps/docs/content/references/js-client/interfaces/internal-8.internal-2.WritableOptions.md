---
displayed_sidebar: jsClientSidebar
---

# Interface: WritableOptions

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal-2.md).WritableOptions

## Hierarchy

- [`StreamOptions`](internal-8.internal-2.StreamOptions.md)<[`Writable`](../classes/internal-8.internal-2.Writable.md)\>

  ↳ **`WritableOptions`**

  ↳↳ [`DuplexOptions`](internal-8.DuplexOptions.md)

## Properties

### autoDestroy

• `Optional` **autoDestroy**: `boolean`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[autoDestroy](internal-8.internal-2.StreamOptions.md#autodestroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:776

___

### decodeStrings

• `Optional` **decodeStrings**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:800

___

### defaultEncoding

• `Optional` **defaultEncoding**: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:801

___

### emitClose

• `Optional` **emitClose**: `boolean`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[emitClose](internal-8.internal-2.StreamOptions.md#emitclose)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:771

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
| `this` | [`Writable`](../classes/internal-8.internal-2.Writable.md) |
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
| `this` | [`Writable`](../classes/internal-8.internal-2.Writable.md) |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Inherited from

[StreamOptions](internal-8.internal-2.StreamOptions.md).[destroy](internal-8.internal-2.StreamOptions.md#destroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:775

___

### final

▸ `Optional` **final**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Writable`](../classes/internal-8.internal-2.Writable.md) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:811

___

### write

▸ `Optional` **write**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Writable`](../classes/internal-8.internal-2.Writable.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:802

___

### writev

▸ `Optional` **writev**(`this`, `chunks`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Writable`](../classes/internal-8.internal-2.Writable.md) |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:803
