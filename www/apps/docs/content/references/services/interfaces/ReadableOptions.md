# ReadableOptions

## Hierarchy

- [`StreamOptions`](../internal/interfaces/internal.StreamOptions.md)<[`Readable`](../classes/Readable.md)\>

  ↳ **`ReadableOptions`**

  ↳↳ [`DuplexOptions`](DuplexOptions.md)

## Properties

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[autoDestroy](../internal/interfaces/internal.StreamOptions.md#autodestroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[emitClose](../internal/interfaces/internal.StreamOptions.md#emitclose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

___

### encoding

 `Optional` **encoding**: [`BufferEncoding`](../types/BufferEncoding.md)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:955

___

### highWaterMark

 `Optional` **highWaterMark**: `number`

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[highWaterMark](../internal/interfaces/internal.StreamOptions.md#highwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:948

___

### objectMode

 `Optional` **objectMode**: `boolean`

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[objectMode](../internal/interfaces/internal.StreamOptions.md#objectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:949

___

### signal

 `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[signal](../internal/interfaces/internal.StreamOptions.md#signal)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:456

## Methods

### construct

`Optional` **construct**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Readable`](../classes/Readable.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[construct](../internal/interfaces/internal.StreamOptions.md#construct)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:950

___

### destroy

`Optional` **destroy**(`this`, `error`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Readable`](../classes/Readable.md) |
| `error` | ``null`` \| `Error` |
| `callback` | (`error`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[destroy](../internal/interfaces/internal.StreamOptions.md#destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:951

___

### read

`Optional` **read**(`this`, `size`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Readable`](../classes/Readable.md) |
| `size` | `number` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:956
