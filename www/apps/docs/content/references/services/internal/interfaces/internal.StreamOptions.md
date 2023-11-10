# StreamOptions

[internal](../../modules/internal.md).StreamOptions

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`Stream`](../../classes/Stream.md) |

## Hierarchy

- [`Abortable`](../../EventEmitter/interfaces/EventEmitter.Abortable.md)

  ↳ **`StreamOptions`**

  ↳↳ [`ReadableOptions`](../../interfaces/ReadableOptions.md)

  ↳↳ [`WritableOptions`](../../interfaces/WritableOptions.md)

## Properties

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

___

### highWaterMark

 `Optional` **highWaterMark**: `number`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:948

___

### objectMode

 `Optional` **objectMode**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:949

___

### signal

 `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[Abortable](../../EventEmitter/interfaces/EventEmitter.Abortable.md).[signal](../../EventEmitter/interfaces/EventEmitter.Abortable.md#signal)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:456

## Methods

### construct

`Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | `T` |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:950

___

### destroy

`Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | `T` |
| `error` | ``null`` \| `Error` |
| `callback` | (`error`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:951
