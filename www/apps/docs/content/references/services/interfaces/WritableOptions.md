# WritableOptions

## Hierarchy

- [`StreamOptions`](../internal/interfaces/internal.StreamOptions.md)<[`Writable`](../classes/Writable.md)\>

  ↳ **`WritableOptions`**

  ↳↳ [`DuplexOptions`](DuplexOptions.md)

## Properties

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[autoDestroy](../internal/interfaces/internal.StreamOptions.md#autodestroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### decodeStrings

 `Optional` **decodeStrings**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:979

___

### defaultEncoding

 `Optional` **defaultEncoding**: [`BufferEncoding`](../types/BufferEncoding.md)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:980

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Inherited from

[StreamOptions](../internal/interfaces/internal.StreamOptions.md).[emitClose](../internal/interfaces/internal.StreamOptions.md#emitclose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

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
| `this` | [`Writable`](../classes/Writable.md) |
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
| `this` | [`Writable`](../classes/Writable.md) |
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

### final

`Optional` **final**(`this`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Writable`](../classes/Writable.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:995

___

### write

`Optional` **write**(`this`, `chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Writable`](../classes/Writable.md) |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../types/BufferEncoding.md) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:981

___

### writev

`Optional` **writev**(`this`, `chunks`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `this` | [`Writable`](../classes/Writable.md) |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../types/BufferEncoding.md)  }[] |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:987
