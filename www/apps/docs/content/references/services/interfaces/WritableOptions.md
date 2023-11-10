# WritableOptions

## Hierarchy

- [`StreamOptions`](../index.md#streamoptions)<[`Writable`](../classes/Writable.md)\>

  ↳ **`WritableOptions`**

  ↳↳ [`DuplexOptions`](DuplexOptions.md)

## Properties

### autoDestroy

 `Optional` **autoDestroy**: `boolean`

#### Inherited from

[StreamOptions](../index.md#streamoptions).[autoDestroy](../index.md#autodestroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:952

___

### decodeStrings

 `Optional` **decodeStrings**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:979

___

### defaultEncoding

 `Optional` **defaultEncoding**: [`BufferEncoding`](../index.md#bufferencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:980

___

### emitClose

 `Optional` **emitClose**: `boolean`

#### Inherited from

[StreamOptions](../index.md#streamoptions).[emitClose](../index.md#emitclose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:947

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
| `this` | [`Writable`](../classes/Writable.md) |
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
| `this` | [`Writable`](../classes/Writable.md) |
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
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) |
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
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../index.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:987
