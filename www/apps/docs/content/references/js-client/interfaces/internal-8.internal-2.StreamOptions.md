---
displayed_sidebar: jsClientSidebar
---

# Interface: StreamOptions<T\>

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal-2.md).StreamOptions

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Stream`](../classes/internal-8.Stream.md) |

## Hierarchy

- [`Abortable`](internal-8.EventEmitter.Abortable.md)

  ↳ **`StreamOptions`**

  ↳↳ [`ReadableOptions`](internal-8.internal-2.ReadableOptions.md)

  ↳↳ [`WritableOptions`](internal-8.internal-2.WritableOptions.md)

## Properties

### autoDestroy

• `Optional` **autoDestroy**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:776

___

### emitClose

• `Optional` **emitClose**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:771

___

### highWaterMark

• `Optional` **highWaterMark**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:772

___

### objectMode

• `Optional` **objectMode**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:773

___

### signal

• `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[Abortable](internal-8.EventEmitter.Abortable.md).[signal](internal-8.EventEmitter.Abortable.md#signal)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:380

## Methods

### construct

▸ `Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `T` |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:774

___

### destroy

▸ `Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `T` |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:775
