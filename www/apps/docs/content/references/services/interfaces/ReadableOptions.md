# ReadableOptions

## Hierarchy

- [`StreamOptions`](../index.md#streamoptions)<[`Readable`](../classes/Readable.md)\>

  ↳ **`ReadableOptions`**

  ↳↳ [`DuplexOptions`](DuplexOptions.md)

## Properties

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Inherited from

[StreamOptions](../index.md#streamoptions).[autoDestroy](../index.md#autodestroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Inherited from

[StreamOptions](../index.md#streamoptions).[emitClose](../index.md#emitclose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

___

### encoding

 `Optional` **encoding**: [`BufferEncoding`](../index.md#bufferencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:955

___

### highWaterMark

 `Optional` **highWaterMark**: `number`

#### Inherited from

[StreamOptions](../index.md#streamoptions).[highWaterMark](../index.md#highwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:948

___

### objectMode

 `Optional` **objectMode**: `boolean`

#### Inherited from

[StreamOptions](../index.md#streamoptions).[objectMode](../index.md#objectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:949

___

### signal

 `Optional` **signal**: `AbortSignal`

When provided the corresponding `AbortController` can be used to cancel an asynchronous action.

#### Inherited from

[StreamOptions](../index.md#streamoptions).[signal](../index.md#signal)

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

[StreamOptions](../index.md#streamoptions).[construct](../index.md#construct)

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

[StreamOptions](../index.md#streamoptions).[destroy](../index.md#destroy)

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
