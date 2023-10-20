---
displayed_sidebar: jsClientSidebar
---

# Class: Duplex

[internal](../modules/internal-8.md).Duplex

Duplex streams are streams that implement both the `Readable` and `Writable` interfaces.

Examples of `Duplex` streams include:

* `TCP sockets`
* `zlib streams`
* `crypto streams`

**`Since`**

v0.9.4

## Hierarchy

- [`ReadableBase`](internal-8.ReadableBase.md)

  ↳ **`Duplex`**

  ↳↳ [`Transform`](internal-8.Transform.md)

## Implements

- [`WritableBase`](internal-8.WritableBase.md)

## Properties

### allowHalfOpen

• **allowHalfOpen**: `boolean`

If `false` then the stream will automatically end the writable side when the
readable side ends. Set initially by the `allowHalfOpen` constructor option,
which defaults to `true`.

This can be changed manually to change the half-open behavior of an existing`Duplex` stream instance, but must be changed before the `'end'` event is
emitted.

**`Since`**

v0.9.4

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:881

___

### closed

• `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**`Since`**

v18.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[closed](internal-8.WritableBase.md#closed)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[closed](internal-8.ReadableBase.md#closed)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:870

___

### destroyed

• **destroyed**: `boolean`

Is `true` after `readable.destroy()` has been called.

**`Since`**

v8.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[destroyed](internal-8.WritableBase.md#destroyed)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[destroyed](internal-8.ReadableBase.md#destroyed)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:101

___

### errored

• `Readonly` **errored**: ``null`` \| [`Error`](../modules/internal-8.md#error)

Returns error if the stream has been destroyed with an error.

**`Since`**

v18.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[errored](internal-8.WritableBase.md#errored)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[errored](internal-8.ReadableBase.md#errored)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:871

___

### readable

• **readable**: `boolean`

Is `true` if it is safe to call `readable.read()`, which means
the stream has not been destroyed or emitted `'error'` or `'end'`.

**`Since`**

v11.4.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readable](internal-8.ReadableBase.md#readable)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:57

___

### readableAborted

• `Readonly` **readableAborted**: `boolean`

Returns whether the stream was destroyed or errored before emitting `'end'`.

**`Since`**

v16.8.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableAborted](internal-8.ReadableBase.md#readableaborted)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:51

___

### readableDidRead

• `Readonly` **readableDidRead**: `boolean`

Returns whether `'data'` has been emitted.

**`Since`**

v16.7.0, v14.18.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableDidRead](internal-8.ReadableBase.md#readabledidread)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:63

___

### readableEncoding

• `Readonly` **readableEncoding**: ``null`` \| [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

Getter for the property `encoding` of a given `Readable` stream. The `encoding`property can be set using the `readable.setEncoding()` method.

**`Since`**

v12.7.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableEncoding](internal-8.ReadableBase.md#readableencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:68

___

### readableEnded

• `Readonly` **readableEnded**: `boolean`

Becomes `true` when `'end'` event is emitted.

**`Since`**

v12.9.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableEnded](internal-8.ReadableBase.md#readableended)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:73

___

### readableFlowing

• `Readonly` **readableFlowing**: ``null`` \| `boolean`

This property reflects the current state of a `Readable` stream as described
in the `Three states` section.

**`Since`**

v9.4.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableFlowing](internal-8.ReadableBase.md#readableflowing)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:79

___

### readableHighWaterMark

• `Readonly` **readableHighWaterMark**: `number`

Returns the value of `highWaterMark` passed when creating this `Readable`.

**`Since`**

v9.3.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableHighWaterMark](internal-8.ReadableBase.md#readablehighwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:84

___

### readableLength

• `Readonly` **readableLength**: `number`

This property contains the number of bytes (or objects) in the queue
ready to be read. The value provides introspection data regarding
the status of the `highWaterMark`.

**`Since`**

v9.4.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableLength](internal-8.ReadableBase.md#readablelength)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:91

___

### readableObjectMode

• `Readonly` **readableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Readable` stream.

**`Since`**

v12.3.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[readableObjectMode](internal-8.ReadableBase.md#readableobjectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:96

___

### writable

• `Readonly` **writable**: `boolean`

Is `true` if it is safe to call `writable.write()`, which means
the stream has not been destroyed, errored, or ended.

**`Since`**

v11.4.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writable](internal-8.WritableBase.md#writable)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:862

___

### writableCorked

• `Readonly` **writableCorked**: `number`

Number of times `writable.uncork()` needs to be
called in order to fully uncork the stream.

**`Since`**

v13.2.0, v12.16.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableCorked](internal-8.WritableBase.md#writablecorked)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:868

___

### writableEnded

• `Readonly` **writableEnded**: `boolean`

Is `true` after `writable.end()` has been called. This property
does not indicate whether the data has been flushed, for this use `writable.writableFinished` instead.

**`Since`**

v12.9.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableEnded](internal-8.WritableBase.md#writableended)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:863

___

### writableFinished

• `Readonly` **writableFinished**: `boolean`

Is set to `true` immediately before the `'finish'` event is emitted.

**`Since`**

v12.6.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableFinished](internal-8.WritableBase.md#writablefinished)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:864

___

### writableHighWaterMark

• `Readonly` **writableHighWaterMark**: `number`

Return the value of `highWaterMark` passed when creating this `Writable`.

**`Since`**

v9.3.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableHighWaterMark](internal-8.WritableBase.md#writablehighwatermark)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:865

___

### writableLength

• `Readonly` **writableLength**: `number`

This property contains the number of bytes (or objects) in the queue
ready to be written. The value provides introspection data regarding
the status of the `highWaterMark`.

**`Since`**

v9.4.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableLength](internal-8.WritableBase.md#writablelength)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:866

___

### writableNeedDrain

• `Readonly` **writableNeedDrain**: `boolean`

Is `true` if the stream's buffer has been full and stream will emit `'drain'`.

**`Since`**

v15.2.0, v14.17.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableNeedDrain](internal-8.WritableBase.md#writableneeddrain)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:869

___

### writableObjectMode

• `Readonly` **writableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Writable` stream.

**`Since`**

v12.3.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[writableObjectMode](internal-8.WritableBase.md#writableobjectmode)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:867

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](internal-8.PassThrough.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

**`Since`**

v13.4.0, v12.16.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[captureRejectionSymbol](internal-8.WritableBase.md#capturerejectionsymbol)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[captureRejectionSymbol](internal-8.ReadableBase.md#capturerejectionsymbol)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:326

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Change the default `captureRejections` option on all new `EventEmitter` objects.

**`Since`**

v13.4.0, v12.16.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[captureRejections](internal-8.WritableBase.md#capturerejections)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[captureRejections](internal-8.ReadableBase.md#capturerejections)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:333

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

By default, a maximum of `10` listeners can be registered for any single
event. This limit can be changed for individual `EventEmitter` instances
using the `emitter.setMaxListeners(n)` method. To change the default
for _all_`EventEmitter` instances, the `events.defaultMaxListeners`property can be used. If this value is not a positive number, a `RangeError`is thrown.

Take caution when setting the `events.defaultMaxListeners` because the
change affects _all_`EventEmitter` instances, including those created before
the change is made. However, calling `emitter.setMaxListeners(n)` still has
precedence over `events.defaultMaxListeners`.

This is not a hard limit. The `EventEmitter` instance will allow
more listeners to be added but will output a trace warning to stderr indicating
that a "possible EventEmitter memory leak" has been detected. For any single`EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()`methods can be used to
temporarily avoid this warning:

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

The `--trace-warnings` command-line flag can be used to display the
stack trace for such warnings.

The emitted warning can be inspected with `process.on('warning')` and will
have the additional `emitter`, `type`, and `count` properties, referring to
the event emitter instance, the event's name and the number of attached
listeners, respectively.
Its `name` property is set to `'MaxListenersExceededWarning'`.

**`Since`**

v0.11.2

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[defaultMaxListeners](internal-8.WritableBase.md#defaultmaxlisteners)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[defaultMaxListeners](internal-8.ReadableBase.md#defaultmaxlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:370

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](internal-8.PassThrough.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`events. Listeners installed using this symbol are called before the regular`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an`'error'` event is emitted. Therefore, the process will still crash if no
regular `'error'` listener is installed.

**`Since`**

v13.6.0, v12.17.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[errorMonitor](internal-8.WritableBase.md#errormonitor)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[errorMonitor](internal-8.ReadableBase.md#errormonitor)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:319

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncIterableIterator`](../interfaces/internal-8.AsyncIterableIterator.md)<`any`\>

#### Returns

[`AsyncIterableIterator`](../interfaces/internal-8.AsyncIterableIterator.md)<`any`\>

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[[asyncIterator]](internal-8.ReadableBase.md#[asynciterator])

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:475

___

### \_construct

▸ `Optional` **_construct**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[_construct](internal-8.WritableBase.md#_construct)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[_construct](internal-8.ReadableBase.md#_construct)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:113

___

### \_destroy

▸ **_destroy**(`error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[_destroy](internal-8.WritableBase.md#_destroy)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[_destroy](internal-8.ReadableBase.md#_destroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:913

___

### \_final

▸ **_final**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[_final](internal-8.WritableBase.md#_final)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:914

___

### \_read

▸ **_read**(`size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`void`

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[_read](internal-8.ReadableBase.md#_read)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:114

___

### \_write

▸ **_write**(`chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[_write](internal-8.WritableBase.md#_write)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:905

___

### \_writev

▸ `Optional` **_writev**(`chunks`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../modules/internal-8.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[_writev](internal-8.WritableBase.md#_writev)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:906

___

### addListener

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

Event emitter
The defined events on documents including:
1.  close
2.  data
3.  drain
4.  end
5.  error
6.  finish
7.  pause
8.  pipe
9.  readable
10. resume
11. unpipe

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:959

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:960

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:961

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:962

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:963

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:964

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[addListener](internal-8.WritableBase.md#addlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:965

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.addListener

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[addListener](internal-8.ReadableBase.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:966

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.addListener

#### Overrides

ReadableBase.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:967

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.addListener

#### Overrides

ReadableBase.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:968

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.addListener

#### Overrides

ReadableBase.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:969

▸ **addListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.addListener

#### Overrides

ReadableBase.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:970

___

### cork

▸ **cork**(): `void`

The `writable.cork()` method forces all written data to be buffered in memory.
The buffered data will be flushed when either the [uncork](internal-8.internal-2.Writable.md#uncork) or [end](internal-8.internal-2.Writable.md#end) methods are called.

The primary intent of `writable.cork()` is to accommodate a situation in which
several small chunks are written to the stream in rapid succession. Instead of
immediately forwarding them to the underlying destination, `writable.cork()`buffers all the chunks until `writable.uncork()` is called, which will pass them
all to `writable._writev()`, if present. This prevents a head-of-line blocking
situation where data is being buffered while waiting for the first small chunk
to be processed. However, use of `writable.cork()` without implementing`writable._writev()` may have an adverse effect on throughput.

See also: `writable.uncork()`, `writable._writev()`.

#### Returns

`void`

**`Since`**

v0.11.2

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[cork](internal-8.WritableBase.md#cork)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:921

___

### destroy

▸ **destroy**(`error?`): [`Duplex`](internal-8.Duplex.md)

Destroy the stream. Optionally emit an `'error'` event, and emit a `'close'`event (unless `emitClose` is set to `false`). After this call, the readable
stream will release any internal resources and subsequent calls to `push()`will be ignored.

Once `destroy()` has been called any further calls will be a no-op and no
further errors except from `_destroy()` may be emitted as `'error'`.

Implementors should not override this method, but instead implement `readable._destroy()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error?` | [`Error`](../modules/internal-8.md#error) | Error which will be passed as payload in `'error'` event |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v8.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[destroy](internal-8.WritableBase.md#destroy)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[destroy](internal-8.ReadableBase.md#destroy)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:407

___

### emit

▸ **emit**(`event`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |

#### Returns

`boolean`

**`Since`**

v0.1.26

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:971

▸ **emit**(`event`, `chunk`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `chunk` | `any` |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:972

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:973

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:974

▸ **emit**(`event`, `err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `err` | [`Error`](../modules/internal-8.md#error) |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:975

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:976

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[emit](internal-8.WritableBase.md#emit)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:977

▸ **emit**(`event`, `src`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `src` | [`Readable`](internal-8.Readable.md) |

#### Returns

`boolean`

#### Implementation of

WritableBase.emit

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[emit](internal-8.ReadableBase.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:978

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |

#### Returns

`boolean`

#### Implementation of

WritableBase.emit

#### Overrides

ReadableBase.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:979

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |

#### Returns

`boolean`

#### Implementation of

WritableBase.emit

#### Overrides

ReadableBase.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:980

▸ **emit**(`event`, `src`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `src` | [`Readable`](internal-8.Readable.md) |

#### Returns

`boolean`

#### Implementation of

WritableBase.emit

#### Overrides

ReadableBase.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:981

▸ **emit**(`event`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Implementation of

WritableBase.emit

#### Overrides

ReadableBase.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:982

___

### end

▸ **end**(`cb?`): [`Duplex`](internal-8.Duplex.md)

Calling the `writable.end()` method signals that no more data will be written
to the `Writable`. The optional `chunk` and `encoding` arguments allow one
final additional chunk of data to be written immediately before closing the
stream.

Calling the [write](internal-8.internal-2.Writable.md#write) method after calling [end](internal-8.internal-2.Writable.md#end) will raise an error.

```js
// Write 'hello, ' and then end with 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Writing more now is not allowed!
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.9.4

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[end](internal-8.WritableBase.md#end)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:918

▸ **end**(`chunk`, `cb?`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `cb?` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[end](internal-8.WritableBase.md#end)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:919

▸ **end**(`chunk`, `encoding?`, `cb?`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `cb?` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[end](internal-8.WritableBase.md#end)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:920

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

**`Since`**

v6.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[eventNames](internal-8.WritableBase.md#eventnames)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[eventNames](internal-8.ReadableBase.md#eventnames)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:715

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](internal-8.Duplex.md#defaultmaxlisteners).

#### Returns

`number`

**`Since`**

v1.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[getMaxListeners](internal-8.WritableBase.md#getmaxlisteners)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[getMaxListeners](internal-8.ReadableBase.md#getmaxlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:567

___

### isPaused

▸ **isPaused**(): `boolean`

The `readable.isPaused()` method returns the current operating state of the`Readable`. This is used primarily by the mechanism that underlies the`readable.pipe()` method. In most
typical cases, there will be no reason to
use this method directly.

```js
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

#### Returns

`boolean`

**`Since`**

v0.11.14

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[isPaused](internal-8.ReadableBase.md#ispaused)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:274

___

### listenerCount

▸ **listenerCount**(`eventName`, `listener?`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | `Function` | The event handler function |

#### Returns

`number`

**`Since`**

v3.2.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[listenerCount](internal-8.WritableBase.md#listenercount)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[listenerCount](internal-8.ReadableBase.md#listenercount)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:661

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v0.1.26

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[listeners](internal-8.WritableBase.md#listeners)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[listeners](internal-8.ReadableBase.md#listeners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:580

___

### off

▸ **off**(`eventName`, `listener`): [`Duplex`](internal-8.Duplex.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v10.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[off](internal-8.WritableBase.md#off)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[off](internal-8.ReadableBase.md#off)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:540

___

### on

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.1.101

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:983

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:984

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:985

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:986

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:987

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:988

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[on](internal-8.WritableBase.md#on)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:989

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.on

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:990

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.on

#### Overrides

ReadableBase.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:991

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.on

#### Overrides

ReadableBase.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:992

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.on

#### Overrides

ReadableBase.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:993

▸ **on**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.on

#### Overrides

ReadableBase.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:994

___

### once

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.3.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:995

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:996

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:997

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:998

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:999

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1000

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[once](internal-8.WritableBase.md#once)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1001

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.once

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1002

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.once

#### Overrides

ReadableBase.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1003

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.once

#### Overrides

ReadableBase.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1004

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.once

#### Overrides

ReadableBase.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1005

▸ **once**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.once

#### Overrides

ReadableBase.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1006

___

### pause

▸ **pause**(): [`Duplex`](internal-8.Duplex.md)

The `readable.pause()` method will cause a stream in flowing mode to stop
emitting `'data'` events, switching out of flowing mode. Any data that
becomes available will remain in the internal buffer.

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```

The `readable.pause()` method has no effect if there is a `'readable'`event listener.

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.9.4

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[pause](internal-8.ReadableBase.md#pause)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:238

___

### pipe

▸ **pipe**<`T`\>(`destination`, `options?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | `T` |
| `options?` | `Object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[pipe](internal-8.WritableBase.md#pipe)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[pipe](internal-8.ReadableBase.md#pipe)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:26

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v6.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1007

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1008

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1009

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1010

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1011

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1012

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependListener](internal-8.WritableBase.md#prependlistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1013

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependListener

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependListener](internal-8.ReadableBase.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1014

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependListener

#### Overrides

ReadableBase.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1015

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependListener

#### Overrides

ReadableBase.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1016

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependListener

#### Overrides

ReadableBase.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1017

▸ **prependListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependListener

#### Overrides

ReadableBase.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1018

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v6.0.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1019

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1020

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1021

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1022

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1023

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1024

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[prependOnceListener](internal-8.WritableBase.md#prependoncelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1025

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependOnceListener

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[prependOnceListener](internal-8.ReadableBase.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1026

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependOnceListener

#### Overrides

ReadableBase.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1027

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependOnceListener

#### Overrides

ReadableBase.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1028

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependOnceListener

#### Overrides

ReadableBase.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1029

▸ **prependOnceListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.prependOnceListener

#### Overrides

ReadableBase.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1030

___

### push

▸ **push**(`chunk`, `encoding?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |

#### Returns

`boolean`

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[push](internal-8.ReadableBase.md#push)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:394

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v9.4.0

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[rawListeners](internal-8.WritableBase.md#rawlisteners)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[rawListeners](internal-8.ReadableBase.md#rawlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:611

___

### read

▸ **read**(`size?`): `any`

The `readable.read()` method reads data out of the internal buffer and
returns it. If no data is available to be read, `null` is returned. By default,
the data is returned as a `Buffer` object unless an encoding has been
specified using the `readable.setEncoding()` method or the stream is operating
in object mode.

The optional `size` argument specifies a specific number of bytes to read. If`size` bytes are not available to be read, `null` will be returned _unless_the stream has ended, in which
case all of the data remaining in the internal
buffer will be returned.

If the `size` argument is not specified, all of the data contained in the
internal buffer will be returned.

The `size` argument must be less than or equal to 1 GiB.

The `readable.read()` method should only be called on `Readable` streams
operating in paused mode. In flowing mode, `readable.read()` is called
automatically until the internal buffer is fully drained.

```js
const readable = getReadableStreamSomehow();

// 'readable' may be triggered multiple times as data is buffered in
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // Use a loop to make sure we read all currently available data
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 'end' will be triggered once when there is no more data available
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```

Each call to `readable.read()` returns a chunk of data, or `null`. The chunks
are not concatenated. A `while` loop is necessary to consume all data
currently in the buffer. When reading a large file `.read()` may return `null`,
having consumed all buffered content so far, but there is still more data to
come not yet buffered. In this case a new `'readable'` event will be emitted
when there is more data in the buffer. Finally the `'end'` event will be
emitted when there is no more data to come.

Therefore to read a file's whole contents from a `readable`, it is necessary
to collect chunks across multiple `'readable'` events:

```js
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```

A `Readable` stream in object mode will always return a single item from
a call to `readable.read(size)`, regardless of the value of the`size` argument.

If the `readable.read()` method returns a chunk of data, a `'data'` event will
also be emitted.

Calling [read](internal-8.PassThrough.md#read) after the `'end'` event has
been emitted will return `null`. No runtime error will be raised.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size?` | `number` | Optional argument to specify how much data to read. |

#### Returns

`any`

**`Since`**

v0.9.4

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[read](internal-8.ReadableBase.md#read)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:191

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`Duplex`](internal-8.Duplex.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.1.26

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeAllListeners](internal-8.WritableBase.md#removealllisteners)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[removeAllListeners](internal-8.ReadableBase.md#removealllisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:551

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and _before_ the last listener finishes execution
will not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.1.26

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1031

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1032

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1033

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1034

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1035

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1036

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[removeListener](internal-8.WritableBase.md#removelistener)

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1037

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.removeListener

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[removeListener](internal-8.ReadableBase.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1038

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.removeListener

#### Overrides

ReadableBase.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1039

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.removeListener

#### Overrides

ReadableBase.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1040

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](internal-8.Readable.md)) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.removeListener

#### Overrides

ReadableBase.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1041

▸ **removeListener**(`event`, `listener`): [`Duplex`](internal-8.Duplex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

#### Implementation of

WritableBase.removeListener

#### Overrides

ReadableBase.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1042

___

### resume

▸ **resume**(): [`Duplex`](internal-8.Duplex.md)

The `readable.resume()` method causes an explicitly paused `Readable` stream to
resume emitting `'data'` events, switching the stream into flowing mode.

The `readable.resume()` method can be used to fully consume the data from a
stream without actually processing any of that data:

```js
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Reached the end, but did not read anything.');
  });
```

The `readable.resume()` method has no effect if there is a `'readable'`event listener.

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.9.4

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[resume](internal-8.ReadableBase.md#resume)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:257

___

### setDefaultEncoding

▸ **setDefaultEncoding**(`encoding`): [`Duplex`](internal-8.Duplex.md)

The `writable.setDefaultEncoding()` method sets the default `encoding` for a `Writable` stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) | The new default encoding |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.11.15

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[setDefaultEncoding](internal-8.WritableBase.md#setdefaultencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:917

___

### setEncoding

▸ **setEncoding**(`encoding`): [`Duplex`](internal-8.Duplex.md)

The `readable.setEncoding()` method sets the character encoding for
data read from the `Readable` stream.

By default, no encoding is assigned and stream data will be returned as`Buffer` objects. Setting an encoding causes the stream data
to be returned as strings of the specified encoding rather than as `Buffer`objects. For instance, calling `readable.setEncoding('utf8')` will cause the
output data to be interpreted as UTF-8 data, and passed as strings. Calling`readable.setEncoding('hex')` will cause the data to be encoded in hexadecimal
string format.

The `Readable` stream will properly handle multi-byte characters delivered
through the stream that would otherwise become improperly decoded if simply
pulled from the stream as `Buffer` objects.

```js
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Got %d characters of string data:', chunk.length);
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) | The encoding to use. |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.9.4

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[setEncoding](internal-8.ReadableBase.md#setencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:216

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`Duplex`](internal-8.Duplex.md)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.3.5

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[setMaxListeners](internal-8.WritableBase.md#setmaxlisteners)

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[setMaxListeners](internal-8.ReadableBase.md#setmaxlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:561

___

### uncork

▸ **uncork**(): `void`

The `writable.uncork()` method flushes all data buffered since [cork](internal-8.internal-2.Writable.md#cork) was called.

When using `writable.cork()` and `writable.uncork()` to manage the buffering
of writes to a stream, defer calls to `writable.uncork()` using`process.nextTick()`. Doing so allows batching of all`writable.write()` calls that occur within a given Node.js event
loop phase.

```js
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```

If the `writable.cork()` method is called multiple times on a stream, the
same number of calls to `writable.uncork()` must be called to flush the buffered
data.

```js
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // The data will not be flushed until uncork() is called a second time.
  stream.uncork();
});
```

See also: `writable.cork()`.

#### Returns

`void`

**`Since`**

v0.11.2

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[uncork](internal-8.WritableBase.md#uncork)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:922

___

### unpipe

▸ **unpipe**(`destination?`): [`Duplex`](internal-8.Duplex.md)

The `readable.unpipe()` method detaches a `Writable` stream previously attached
using the [pipe](internal-8.PassThrough.md#pipe) method.

If the `destination` is not specified, then _all_ pipes are detached.

If the `destination` is specified, but no pipe is set up for it, then
the method does nothing.

```js
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt',
// but only for the first second.
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destination?` | [`WritableStream`](../interfaces/internal-8.WritableStream.md) | Optional specific stream to unpipe |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.9.4

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[unpipe](internal-8.ReadableBase.md#unpipe)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:301

___

### unshift

▸ **unshift**(`chunk`, `encoding?`): `void`

Passing `chunk` as `null` signals the end of the stream (EOF) and behaves the
same as `readable.push(null)`, after which no more data can be written. The EOF
signal is put at the end of the buffer and any buffered data will still be
flushed.

The `readable.unshift()` method pushes a chunk of data back into the internal
buffer. This is useful in certain situations where a stream is being consumed by
code that needs to "un-consume" some amount of data that it has optimistically
pulled out of the source, so that the data can be passed on to some other party.

The `stream.unshift(chunk)` method cannot be called after the `'end'` event
has been emitted or a runtime error will be thrown.

Developers using `stream.unshift()` often should consider switching to
use of a `Transform` stream instead. See the `API for stream implementers` section for more information.

```js
// Pull off a header delimited by \n\n.
// Use unshift() if we get too much.
// Call the callback with (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Found the header boundary.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Remove the 'readable' listener before unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Now the body of the message can be read from the stream.
        callback(null, header, stream);
        return;
      }
      // Still reading the header.
      header += str;
    }
  }
}
```

Unlike [push](internal-8.PassThrough.md#push), `stream.unshift(chunk)` will not
end the reading process by resetting the internal reading state of the stream.
This can cause unexpected results if `readable.unshift()` is called during a
read (i.e. from within a [_read](internal-8.PassThrough.md#_read) implementation on a
custom stream). Following the call to `readable.unshift()` with an immediate [push](internal-8.PassThrough.md#push) will reset the reading state appropriately,
however it is best to simply avoid calling `readable.unshift()` while in the
process of performing a read.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `any` | Chunk of data to unshift onto the read queue. For streams not operating in object mode, `chunk` must be a string, `Buffer`, `Uint8Array`, or `null`. For object mode streams, `chunk` may be any JavaScript value. |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) | Encoding of string chunks. Must be a valid `Buffer` encoding, such as `'utf8'` or `'ascii'`. |

#### Returns

`void`

**`Since`**

v0.9.11

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[unshift](internal-8.ReadableBase.md#unshift)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:367

___

### wrap

▸ **wrap**(`stream`): [`Duplex`](internal-8.Duplex.md)

Prior to Node.js 0.10, streams did not implement the entire `node:stream`module API as it is currently defined. (See `Compatibility` for more
information.)

When using an older Node.js library that emits `'data'` events and has a [pause](internal-8.PassThrough.md#pause) method that is advisory only, the`readable.wrap()` method can be used to create a `Readable`
stream that uses
the old stream as its data source.

It will rarely be necessary to use `readable.wrap()` but the method has been
provided as a convenience for interacting with older Node.js applications and
libraries.

```js
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) | An "old style" readable stream |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v0.9.4

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[wrap](internal-8.ReadableBase.md#wrap)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:393

___

### write

▸ **write**(`chunk`, `encoding?`, `cb?`): `boolean`

The `writable.write()` method writes some data to the stream, and calls the
supplied `callback` once the data has been fully handled. If an error
occurs, the `callback` will be called with the error as its
first argument. The `callback` is called asynchronously and before `'error'` is
emitted.

The return value is `true` if the internal buffer is less than the`highWaterMark` configured when the stream was created after admitting `chunk`.
If `false` is returned, further attempts to write data to the stream should
stop until the `'drain'` event is emitted.

While a stream is not draining, calls to `write()` will buffer `chunk`, and
return false. Once all currently buffered chunks are drained (accepted for
delivery by the operating system), the `'drain'` event will be emitted.
Once `write()` returns false, do not write more chunks
until the `'drain'` event is emitted. While calling `write()` on a stream that
is not draining is allowed, Node.js will buffer all written chunks until
maximum memory usage occurs, at which point it will abort unconditionally.
Even before it aborts, high memory usage will cause poor garbage collector
performance and high RSS (which is not typically released back to the system,
even after the memory is no longer required). Since TCP sockets may never
drain if the remote peer does not read the data, writing a socket that is
not draining may lead to a remotely exploitable vulnerability.

Writing data while the stream is not draining is particularly
problematic for a `Transform`, because the `Transform` streams are paused
by default until they are piped or a `'data'` or `'readable'` event handler
is added.

If the data to be written can be generated or fetched on demand, it is
recommended to encapsulate the logic into a `Readable` and use [pipe](internal-8.PassThrough.md#pipe). However, if calling `write()` is preferred, it is
possible to respect backpressure and avoid memory issues using the `'drain'` event:

```js
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Wait for cb to be called before doing any other write.
write('hello', () => {
  console.log('Write completed, do more writes now.');
});
```

A `Writable` stream in object mode will always ignore the `encoding` argument.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `any` | Optional data to write. For streams not operating in object mode, `chunk` must be a string, `Buffer` or `Uint8Array`. For object mode streams, `chunk` may be any JavaScript value other than `null`. |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) | Callback for when this chunk of data is flushed. |
| `cb?` | (`error`: `undefined` \| ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` | - |

#### Returns

`boolean`

`false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

**`Since`**

v0.9.4

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[write](internal-8.WritableBase.md#write)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:915

▸ **write**(`chunk`, `cb?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `cb?` | (`error`: `undefined` \| ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`boolean`

#### Implementation of

[WritableBase](internal-8.WritableBase.md).[write](internal-8.WritableBase.md#write)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:916

___

### from

▸ `Static` **from**(`src`): [`Duplex`](internal-8.Duplex.md)

A utility method for creating duplex streams.

- `Stream` converts writable stream into writable `Duplex` and readable stream
  to `Duplex`.
- `Blob` converts into readable `Duplex`.
- `string` converts into readable `Duplex`.
- `ArrayBuffer` converts into readable `Duplex`.
- `AsyncIterable` converts into a readable `Duplex`. Cannot yield `null`.
- `AsyncGeneratorFunction` converts into a readable/writable transform
  `Duplex`. Must take a source `AsyncIterable` as first parameter. Cannot yield
  `null`.
- `AsyncFunction` converts into a writable `Duplex`. Must return
  either `null` or `undefined`
- `Object ({ writable, readable })` converts `readable` and
  `writable` into `Stream` and then combines them into `Duplex` where the
  `Duplex` will write to the `writable` and read from the `readable`.
- `Promise` converts into readable `Duplex`. Value `null` is ignored.

#### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `string` \| [`Object`](../modules/internal-8.md#object) \| `Promise`<`any`\> \| `ArrayBuffer` \| [`Stream`](internal-8.Stream.md) \| [`Blob`](internal-8.Blob.md) \| [`Iterable`](../interfaces/internal-8.Iterable.md)<`any`\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`any`\> \| [`AsyncGeneratorFunction`](../interfaces/internal-8.AsyncGeneratorFunction.md) |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v16.8.0

#### Overrides

[ReadableBase](internal-8.ReadableBase.md).[from](internal-8.ReadableBase.md#from)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:904

___

### fromWeb

▸ `Static` **fromWeb**(`duplexStream`, `options?`): [`Duplex`](internal-8.Duplex.md)

A utility method for creating a `Duplex` from a web `ReadableStream` and `WritableStream`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `duplexStream` | `Object` |
| `duplexStream.readable` | [`ReadableStream`](../modules/internal-8.md#readablestream)<`any`\> |
| `duplexStream.writable` | [`WritableStream`](../modules/internal-8.md#writablestream)<`any`\> |
| `options?` | [`Pick`](../modules/internal-1.md#pick)<[`DuplexOptions`](../interfaces/internal-8.DuplexOptions.md), ``"signal"`` \| ``"allowHalfOpen"`` \| ``"decodeStrings"`` \| ``"encoding"`` \| ``"highWaterMark"`` \| ``"objectMode"``\> |

#### Returns

[`Duplex`](internal-8.Duplex.md)

**`Since`**

v17.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:937

___

### getEventListeners

▸ `Static` **getEventListeners**(`emitter`, `name`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | [`EventEmitter`](../interfaces/internal-8.EventEmitter-2.md) \| [`_DOMEventTarget`](../interfaces/internal-8._DOMEventTarget.md) |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v15.2.0, v14.17.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[getEventListeners](internal-8.ReadableBase.md#geteventlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:296

___

### isDisturbed

▸ `Static` **isDisturbed**(`stream`): `boolean`

Returns whether the stream has been read from or cancelled.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`Readable`](internal-8.Readable.md) |

#### Returns

`boolean`

**`Since`**

v16.8.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[isDisturbed](internal-8.ReadableBase.md#isdisturbed)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:45

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `eventName`): `number`

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | [`EventEmitter`](../interfaces/internal-8.EventEmitter-2.md) | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

**`Since`**

v0.9.12

**`Deprecated`**

Since v3.2.0 - Use `listenerCount` instead.

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[listenerCount](internal-8.ReadableBase.md#listenercount-1)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:268

___

### on

▸ `Static` **on**(`emitter`, `eventName`, `options?`): [`AsyncIterableIterator`](../interfaces/internal-8.AsyncIterableIterator.md)<`any`\>

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | [`EventEmitter`](../interfaces/internal-8.EventEmitter-2.md) | - |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/internal-8.StaticEventEmitterOptions.md) | - |

#### Returns

[`AsyncIterableIterator`](../interfaces/internal-8.AsyncIterableIterator.md)<`any`\>

that iterates `eventName` events emitted by the `emitter`

**`Since`**

v13.6.0, v12.16.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[on](internal-8.ReadableBase.md#on-1)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:250

___

### once

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | [`_NodeEventTarget`](../interfaces/internal-8._NodeEventTarget.md) |
| `eventName` | `string` \| `symbol` |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/internal-8.StaticEventEmitterOptions.md) |

#### Returns

`Promise`<`any`[]\>

**`Since`**

v11.13.0, v10.16.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once-1)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:189

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | [`_DOMEventTarget`](../interfaces/internal-8._DOMEventTarget.md) |
| `eventName` | `string` |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/internal-8.StaticEventEmitterOptions.md) |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[once](internal-8.ReadableBase.md#once-1)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:190

___

### setMaxListeners

▸ `Static` **setMaxListeners**(`n?`, `...eventTargets`): `void`

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n?` | `number` | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| `...eventTargets` | ([`EventEmitter`](../interfaces/internal-8.EventEmitter-2.md) \| [`_DOMEventTarget`](../interfaces/internal-8._DOMEventTarget.md))[] | - |

#### Returns

`void`

**`Since`**

v15.4.0

#### Inherited from

[ReadableBase](internal-8.ReadableBase.md).[setMaxListeners](internal-8.ReadableBase.md#setmaxlisteners-1)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:311

___

### toWeb

▸ `Static` **toWeb**(`streamDuplex`): `Object`

A utility method for creating a web `ReadableStream` and `WritableStream` from a `Duplex`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `streamDuplex` | [`Duplex`](internal-8.Duplex.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `readable` | [`ReadableStream`](../modules/internal-8.md#readablestream)<`any`\> |
| `writable` | [`WritableStream`](../modules/internal-8.md#writablestream)<`any`\> |

**`Since`**

v17.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:928
