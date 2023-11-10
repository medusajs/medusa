# Socket

This class is an abstraction of a TCP socket or a streaming `IPC` endpoint
(uses named pipes on Windows, and Unix domain sockets otherwise). It is also
an `EventEmitter`.

A `net.Socket` can be created by the user and used directly to interact with
a server. For example, it is returned by createConnection,
so the user can use it to talk to the server.

It can also be created by Node.js and passed to the user when a connection
is received. For example, it is passed to the listeners of a `'connection'` event emitted on a [Server](Server-1.md), so the user can use
it to interact with the client.

**Since**

v0.3.4

## Hierarchy

- [`Duplex`](Duplex.md)

  ↳ **`Socket`**

  ↳↳ [`TLSSocket`](TLSSocket.md)

## Constructors

### constructor

**new Socket**(`options?`)

#### Parameters

| Name |
| :------ |
| `options?` | [`SocketConstructorOpts`](../interfaces/SocketConstructorOpts.md) |

#### Overrides

[Duplex](Duplex.md).[constructor](Duplex.md#constructor)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:93

## Properties

### allowHalfOpen

 **allowHalfOpen**: `boolean`

If `false` then the stream will automatically end the writable side when the
readable side ends. Set initially by the `allowHalfOpen` constructor option,
which defaults to `true`.

This can be changed manually to change the half-open behavior of an existing`Duplex` stream instance, but must be changed before the `'end'` event is
emitted.

**Since**

v0.9.4

#### Inherited from

[Duplex](Duplex.md).[allowHalfOpen](Duplex.md#allowhalfopen)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1068

___

### autoSelectFamilyAttemptedAddresses

 `Readonly` **autoSelectFamilyAttemptedAddresses**: `string`[]

This property is only present if the family autoselection algorithm is enabled in `socket.connect(options)`
and it is an array of the addresses that have been attempted.

Each address is a string in the form of `$IP:$PORT`.
If the connection was successful, then the last address is the one that the socket is currently connected to.

**Since**

v19.4.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:251

___

### bufferSize

 `Readonly` **bufferSize**: `number`

This property shows the number of characters buffered for writing. The buffer
may contain strings whose length after encoding is not yet known. So this number
is only an approximation of the number of bytes in the buffer.

`net.Socket` has the property that `socket.write()` always works. This is to
help users get up and running quickly. The computer cannot always keep up
with the amount of data that is written to a socket. The network connection
simply might be too slow. Node.js will internally queue up the data written to a
socket and send it out over the wire when it is possible.

The consequence of this internal buffering is that memory may grow.
Users who experience large or growing `bufferSize` should attempt to
"throttle" the data flows in their program with `socket.pause()` and `socket.resume()`.

**Since**

v0.3.8

**Deprecated**

Since v14.6.0 - Use `writableLength` instead.

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:269

___

### bytesRead

 `Readonly` **bytesRead**: `number`

The amount of received bytes.

**Since**

v0.5.3

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:274

___

### bytesWritten

 `Readonly` **bytesWritten**: `number`

The amount of bytes sent.

**Since**

v0.5.3

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:279

___

### closed

 `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**Since**

v18.0.0

#### Inherited from

[Duplex](Duplex.md).[closed](Duplex.md#closed)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1057

___

### connecting

 `Readonly` **connecting**: `boolean`

If `true`,`socket.connect(options[, connectListener])` was
called and has not yet finished. It will stay `true` until the socket becomes
connected, then it is set to `false` and the `'connect'` event is emitted. Note
that the `socket.connect(options[, connectListener])` callback is a listener for the `'connect'` event.

**Since**

v6.1.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:287

___

### destroyed

 `Readonly` **destroyed**: `boolean`

See `writable.destroyed` for further details.

#### Overrides

[Duplex](Duplex.md).[destroyed](Duplex.md#destroyed)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:297

___

### errored

 `Readonly` **errored**: ``null`` \| `Error`

Returns error if the stream has been destroyed with an error.

**Since**

v18.0.0

#### Inherited from

[Duplex](Duplex.md).[errored](Duplex.md#errored)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1058

___

### localAddress

 `Optional` `Readonly` **localAddress**: `string`

The string representation of the local IP address the remote client is
connecting on. For example, in a server listening on `'0.0.0.0'`, if a client
connects on `'192.168.1.1'`, the value of `socket.localAddress` would be`'192.168.1.1'`.

**Since**

v0.9.6

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:304

___

### localFamily

 `Optional` `Readonly` **localFamily**: `string`

The string representation of the local IP family. `'IPv4'` or `'IPv6'`.

**Since**

v18.8.0, v16.18.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:314

___

### localPort

 `Optional` `Readonly` **localPort**: `number`

The numeric representation of the local port. For example, `80` or `21`.

**Since**

v0.9.6

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:309

___

### pending

 `Readonly` **pending**: `boolean`

This is `true` if the socket is not connected yet, either because `.connect()`has not yet been called or because it is still in the process of connecting
(see `socket.connecting`).

**Since**

v11.2.0, v10.16.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:293

___

### readable

 **readable**: `boolean`

Is `true` if it is safe to call `readable.read()`, which means
the stream has not been destroyed or emitted `'error'` or `'end'`.

**Since**

v11.4.0

#### Inherited from

[Duplex](Duplex.md).[readable](Duplex.md#readable)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:70

___

### readableAborted

 `Readonly` **readableAborted**: `boolean`

Returns whether the stream was destroyed or errored before emitting `'end'`.

**Since**

v16.8.0

#### Inherited from

[Duplex](Duplex.md).[readableAborted](Duplex.md#readableaborted)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:64

___

### readableDidRead

 `Readonly` **readableDidRead**: `boolean`

Returns whether `'data'` has been emitted.

**Since**

v16.7.0, v14.18.0

#### Inherited from

[Duplex](Duplex.md).[readableDidRead](Duplex.md#readabledidread)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:76

___

### readableEncoding

 `Readonly` **readableEncoding**: ``null`` \| [`BufferEncoding`](../index.md#bufferencoding)

Getter for the property `encoding` of a given `Readable` stream. The `encoding`property can be set using the `readable.setEncoding()` method.

**Since**

v12.7.0

#### Inherited from

[Duplex](Duplex.md).[readableEncoding](Duplex.md#readableencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:81

___

### readableEnded

 `Readonly` **readableEnded**: `boolean`

Becomes `true` when `'end'` event is emitted.

**Since**

v12.9.0

#### Inherited from

[Duplex](Duplex.md).[readableEnded](Duplex.md#readableended)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:86

___

### readableFlowing

 `Readonly` **readableFlowing**: ``null`` \| `boolean`

This property reflects the current state of a `Readable` stream as described
in the `Three states` section.

**Since**

v9.4.0

#### Inherited from

[Duplex](Duplex.md).[readableFlowing](Duplex.md#readableflowing)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:92

___

### readableHighWaterMark

 `Readonly` **readableHighWaterMark**: `number`

Returns the value of `highWaterMark` passed when creating this `Readable`.

**Since**

v9.3.0

#### Inherited from

[Duplex](Duplex.md).[readableHighWaterMark](Duplex.md#readablehighwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:97

___

### readableLength

 `Readonly` **readableLength**: `number`

This property contains the number of bytes (or objects) in the queue
ready to be read. The value provides introspection data regarding
the status of the `highWaterMark`.

**Since**

v9.4.0

#### Inherited from

[Duplex](Duplex.md).[readableLength](Duplex.md#readablelength)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:104

___

### readableObjectMode

 `Readonly` **readableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Readable` stream.

**Since**

v12.3.0

#### Inherited from

[Duplex](Duplex.md).[readableObjectMode](Duplex.md#readableobjectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:109

___

### readyState

 `Readonly` **readyState**: [`SocketReadyState`](../index.md#socketreadystate)

This property represents the state of the connection as a string.

* If the stream is connecting `socket.readyState` is `opening`.
* If the stream is readable and writable, it is `open`.
* If the stream is readable and not writable, it is `readOnly`.
* If the stream is not readable and writable, it is `writeOnly`.

**Since**

v0.5.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:324

___

### remoteAddress

 `Optional` `Readonly` **remoteAddress**: `string`

The string representation of the remote IP address. For example,`'74.125.127.100'` or `'2001:4860:a005::68'`. Value may be `undefined` if
the socket is destroyed (for example, if the client disconnected).

**Since**

v0.5.10

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:330

___

### remoteFamily

 `Optional` `Readonly` **remoteFamily**: `string`

The string representation of the remote IP family. `'IPv4'` or `'IPv6'`. Value may be `undefined` if
the socket is destroyed (for example, if the client disconnected).

**Since**

v0.11.14

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:336

___

### remotePort

 `Optional` `Readonly` **remotePort**: `number`

The numeric representation of the remote port. For example, `80` or `21`. Value may be `undefined` if
the socket is destroyed (for example, if the client disconnected).

**Since**

v0.5.10

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:342

___

### timeout

 `Optional` `Readonly` **timeout**: `number`

The socket timeout in milliseconds as set by `socket.setTimeout()`.
It is `undefined` if a timeout has not been set.

**Since**

v10.7.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:348

___

### writable

 `Readonly` **writable**: `boolean`

Is `true` if it is safe to call `writable.write()`, which means
the stream has not been destroyed, errored, or ended.

**Since**

v11.4.0

#### Inherited from

[Duplex](Duplex.md).[writable](Duplex.md#writable)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1049

___

### writableCorked

 `Readonly` **writableCorked**: `number`

Number of times `writable.uncork()` needs to be
called in order to fully uncork the stream.

**Since**

v13.2.0, v12.16.0

#### Inherited from

[Duplex](Duplex.md).[writableCorked](Duplex.md#writablecorked)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1055

___

### writableEnded

 `Readonly` **writableEnded**: `boolean`

Is `true` after `writable.end()` has been called. This property
does not indicate whether the data has been flushed, for this use `writable.writableFinished` instead.

**Since**

v12.9.0

#### Inherited from

[Duplex](Duplex.md).[writableEnded](Duplex.md#writableended)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1050

___

### writableFinished

 `Readonly` **writableFinished**: `boolean`

Is set to `true` immediately before the `'finish'` event is emitted.

**Since**

v12.6.0

#### Inherited from

[Duplex](Duplex.md).[writableFinished](Duplex.md#writablefinished)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1051

___

### writableHighWaterMark

 `Readonly` **writableHighWaterMark**: `number`

Return the value of `highWaterMark` passed when creating this `Writable`.

**Since**

v9.3.0

#### Inherited from

[Duplex](Duplex.md).[writableHighWaterMark](Duplex.md#writablehighwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1052

___

### writableLength

 `Readonly` **writableLength**: `number`

This property contains the number of bytes (or objects) in the queue
ready to be written. The value provides introspection data regarding
the status of the `highWaterMark`.

**Since**

v9.4.0

#### Inherited from

[Duplex](Duplex.md).[writableLength](Duplex.md#writablelength)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1053

___

### writableNeedDrain

 `Readonly` **writableNeedDrain**: `boolean`

Is `true` if the stream's buffer has been full and stream will emit `'drain'`.

**Since**

v15.2.0, v14.17.0

#### Inherited from

[Duplex](Duplex.md).[writableNeedDrain](Duplex.md#writableneeddrain)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1056

___

### writableObjectMode

 `Readonly` **writableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Writable` stream.

**Since**

v12.3.0

#### Inherited from

[Duplex](Duplex.md).[writableObjectMode](Duplex.md#writableobjectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1054

___

### captureRejectionSymbol

 `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](Socket.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

**Since**

v13.4.0, v12.16.0

#### Inherited from

[Duplex](Duplex.md).[captureRejectionSymbol](Duplex.md#capturerejectionsymbol)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:402

___

### captureRejections

 `Static` **captureRejections**: `boolean`

Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Change the default `captureRejections` option on all new `EventEmitter` objects.

**Since**

v13.4.0, v12.16.0

#### Inherited from

[Duplex](Duplex.md).[captureRejections](Duplex.md#capturerejections)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:409

___

### defaultMaxListeners

 `Static` **defaultMaxListeners**: `number`

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

**Since**

v0.11.2

#### Inherited from

[Duplex](Duplex.md).[defaultMaxListeners](Duplex.md#defaultmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:446

___

### errorMonitor

 `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](Socket.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`events. Listeners installed using this symbol are called before the regular`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an`'error'` event is emitted. Therefore, the process will still crash if no
regular `'error'` listener is installed.

**Since**

v13.6.0, v12.17.0

#### Inherited from

[Duplex](Duplex.md).[errorMonitor](Duplex.md#errormonitor)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:395

## Methods

### [asyncDispose]

**[asyncDispose]**(): `Promise`<`void`\>

Calls `readable.destroy()` with an `AbortError` and returns a promise that fulfills when the stream is finished.

#### Returns

`Promise`<`void`\>

-`Promise`: 

**Since**

v20.4.0

#### Inherited from

[Duplex](Duplex.md).[[asyncDispose]](Duplex.md#[asyncdispose])

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:651

___

### [asyncIterator]

**[asyncIterator]**(): [`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

#### Returns

[`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

-`AsyncIterableIterator`: 
	-`any`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[[asyncIterator]](Duplex.md#[asynciterator])

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:646

___

### [captureRejectionSymbol]

`Optional` **[captureRejectionSymbol]**(`error`, `event`, `...args`): `void`

#### Parameters

| Name |
| :------ |
| `error` | `Error` |
| `event` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[[captureRejectionSymbol]](Duplex.md#[capturerejectionsymbol])

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:112

___

### \_construct

`Optional` **_construct**(`callback`): `void`

#### Parameters

| Name |
| :------ |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[_construct](Duplex.md#_construct)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:126

___

### \_destroy

**_destroy**(`error`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `error` | ``null`` \| `Error` |
| `callback` | (`error`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[_destroy](Duplex.md#_destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1111

___

### \_final

**_final**(`callback`): `void`

#### Parameters

| Name |
| :------ |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[_final](Duplex.md#_final)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1112

___

### \_read

**_read**(`size`): `void`

#### Parameters

| Name |
| :------ |
| `size` | `number` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[_read](Duplex.md#_read)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:127

___

### \_write

**_write**(`chunk`, `encoding`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[_write](Duplex.md#_write)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1103

___

### \_writev

`Optional` **_writev**(`chunks`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `chunks` | { `chunk`: `any` ; `encoding`: [`BufferEncoding`](../index.md#bufferencoding)  }[] |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[_writev](Duplex.md#_writev)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1104

___

### addListener

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

events.EventEmitter
  1. close
  2. connect
  3. data
  4. drain
  5. end
  6. error
  7. lookup
  8. ready
  9. timeout

#### Parameters

| Name |
| :------ |
| `event` | `string` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:374

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | (`hadError`: `boolean`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:375

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connect"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:376

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`data`: [`Buffer`](../index.md#buffer)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:377

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:378

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:379

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:380

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"lookup"`` |
| `listener` | (`err`: `Error`, `address`: `string`, `family`: `string` \| `number`, `host`: `string`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:381

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"ready"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:385

**addListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"timeout"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[addListener](Duplex.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:386

___

### address

**address**(): {} \| [`AddressInfo`](../interfaces/AddressInfo.md)

Returns the bound `address`, the address `family` name and `port` of the
socket as reported by the operating system:`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`

#### Returns

{} \| [`AddressInfo`](../interfaces/AddressInfo.md)

-`{} \| AddressInfo`: (optional) 

**Since**

v0.1.90

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:228

___

### asIndexedPairs

**asIndexedPairs**(`options?`): [`Readable`](Readable.md)

This method returns a new stream with chunks of the underlying stream paired with a counter
in the form `[index, chunk]`. The first index value is `0` and it increases by 1 for each chunk produced.

#### Parameters

| Name |
| :------ |
| `options?` | [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\> |

#### Returns

[`Readable`](Readable.md)

-`Readable`: a stream of indexed pairs.

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[asIndexedPairs](Duplex.md#asindexedpairs)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:541

___

### compose

**compose**<`T`\>(`stream`, `options?`): `T`

| Name | Type |
| :------ | :------ |
| `T` | [`ReadableStream`](../interfaces/ReadableStream.md) |

#### Parameters

| Name |
| :------ |
| `stream` | [`ComposeFnParam`](../index.md#composefnparam) \| `T` \| [`Iterable`](../interfaces/Iterable.md)<`T`\> \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`T`\> |
| `options?` | `object` |
| `options.signal` | `AbortSignal` |

#### Returns

`T`

#### Inherited from

[Duplex](Duplex.md).[compose](Duplex.md#compose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:35

___

### connect

**connect**(`options`, `connectionListener?`): [`Socket`](Socket.md)

Initiate a connection on a given socket.

Possible signatures:

* `socket.connect(options[, connectListener])`
* `socket.connect(path[, connectListener])` for `IPC` connections.
* `socket.connect(port[, host][, connectListener])` for TCP connections.
* Returns: `net.Socket` The socket itself.

This function is asynchronous. When the connection is established, the `'connect'` event will be emitted. If there is a problem connecting,
instead of a `'connect'` event, an `'error'` event will be emitted with
the error passed to the `'error'` listener.
The last parameter `connectListener`, if supplied, will be added as a listener
for the `'connect'` event **once**.

This function should only be used for reconnecting a socket after`'close'` has been emitted or otherwise it may lead to undefined
behavior.

#### Parameters

| Name |
| :------ |
| `options` | [`SocketConnectOpts`](../index.md#socketconnectopts) |
| `connectionListener?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:136

**connect**(`port`, `host`, `connectionListener?`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `port` | `number` |
| `host` | `string` |
| `connectionListener?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:137

**connect**(`port`, `connectionListener?`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `port` | `number` |
| `connectionListener?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:138

**connect**(`path`, `connectionListener?`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `connectionListener?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:139

___

### cork

**cork**(): `void`

The `writable.cork()` method forces all written data to be buffered in memory.
The buffered data will be flushed when either the [uncork](../interfaces/Response.md#uncork) or [end](../interfaces/Response.md#end) methods are called.

The primary intent of `writable.cork()` is to accommodate a situation in which
several small chunks are written to the stream in rapid succession. Instead of
immediately forwarding them to the underlying destination, `writable.cork()`buffers all the chunks until `writable.uncork()` is called, which will pass them
all to `writable._writev()`, if present. This prevents a head-of-line blocking
situation where data is being buffered while waiting for the first small chunk
to be processed. However, use of `writable.cork()` without implementing`writable._writev()` may have an adverse effect on throughput.

See also: `writable.uncork()`, `writable._writev()`.

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.11.2

#### Inherited from

[Duplex](Duplex.md).[cork](Duplex.md#cork)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1119

___

### destroy

**destroy**(`error?`): [`Socket`](Socket.md)

Destroy the stream. Optionally emit an `'error'` event, and emit a `'close'`event (unless `emitClose` is set to `false`). After this call, the readable
stream will release any internal resources and subsequent calls to `push()`will be ignored.

Once `destroy()` has been called any further calls will be a no-op and no
further errors except from `_destroy()` may be emitted as `'error'`.

Implementors should not override this method, but instead implement `readable._destroy()`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `error?` | `Error` | Error which will be passed as payload in `'error'` event |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v8.0.0

#### Inherited from

[Duplex](Duplex.md).[destroy](Duplex.md#destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:578

___

### destroySoon

**destroySoon**(): `void`

Destroys the socket after all data is written. If the `finish` event was already emitted the socket is destroyed immediately.
If the socket is still writable it implicitly calls `socket.end()`.

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.3.4

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:99

___

### drop

**drop**(`limit`, `options?`): [`Readable`](Readable.md)

This method returns a new stream with the first *limit* chunks dropped from the start.

#### Parameters

| Name | Description |
| :------ | :------ |
| `limit` | `number` | the number of chunks to drop from the readable. |
| `options?` | [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\> |

#### Returns

[`Readable`](Readable.md)

-`Readable`: a stream with *limit* chunks dropped from the start.

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[drop](Duplex.md#drop)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:527

___

### emit

**emit**(`event`, `...args`): `boolean`

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

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v0.1.26

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:387

**emit**(`event`, `hadError`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `hadError` | `boolean` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:388

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"connect"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:389

**emit**(`event`, `data`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `data` | [`Buffer`](../index.md#buffer) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:390

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:391

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:392

**emit**(`event`, `err`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `err` | `Error` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:393

**emit**(`event`, `err`, `address`, `family`, `host`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"lookup"`` |
| `err` | `Error` |
| `address` | `string` |
| `family` | `string` \| `number` |
| `host` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:394

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"ready"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:395

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"timeout"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[emit](Duplex.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:396

___

### end

**end**(`callback?`): [`Socket`](Socket.md)

Half-closes the socket. i.e., it sends a FIN packet. It is possible the
server will still send some data.

See `writable.end()` for further details.

#### Parameters

| Name | Description |
| :------ | :------ |
| `callback?` | () => `void` | Optional callback for when the socket is finished. |

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.1.90

#### Overrides

[Duplex](Duplex.md).[end](Duplex.md#end)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:359

**end**(`buffer`, `callback?`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `buffer` | `string` \| `Uint8Array` |
| `callback?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[end](Duplex.md#end)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:360

**end**(`str`, `encoding?`, `callback?`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `str` | `string` \| `Uint8Array` |
| `encoding?` | [`BufferEncoding`](../index.md#bufferencoding) |
| `callback?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[end](Duplex.md#end)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:361

___

### eventNames

**eventNames**(): (`string` \| `symbol`)[]

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

-`(string \| symbol)[]`: 
	-`string \| symbol`: (optional) 

**Since**

v6.0.0

#### Inherited from

[Duplex](Duplex.md).[eventNames](Duplex.md#eventnames)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:835

___

### every

**every**(`fn`, `options?`): `Promise`<`boolean`\>

This method is similar to `Array.prototype.every` and calls *fn* on each chunk in the stream
to check if all awaited return values are truthy value for *fn*. Once an *fn* call on a chunk
`await`ed return value is falsy, the stream is destroyed and the promise is fulfilled with `false`.
If all of the *fn* calls on the chunks return a truthy value, the promise is fulfilled with `true`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: a promise evaluating to `true` if *fn* returned a truthy value for every one of the chunks.
	-`boolean`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[every](Duplex.md#every)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:506

___

### filter

**filter**(`fn`, `options?`): [`Readable`](Readable.md)

This method allows filtering the stream. For each chunk in the stream the *fn* function will be called
and if it returns a truthy value, the chunk will be passed to the result stream.
If the *fn* function returns a promise - that promise will be `await`ed.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> | a function to filter chunks from the stream. Async or not. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

[`Readable`](Readable.md)

-`Readable`: a stream filtered with the predicate *fn*.

**Since**

v17.4.0, v16.14.0

#### Inherited from

[Duplex](Duplex.md).[filter](Duplex.md#filter)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:434

___

### find

**find**<`T`\>(`fn`, `options?`): `Promise`<`undefined` \| `T`\>

This method is similar to `Array.prototype.find` and calls *fn* on each chunk in the stream
to find a chunk with a truthy value for *fn*. Once an *fn* call's awaited return value is truthy,
the stream is destroyed and the promise is fulfilled with value for which *fn* returned a truthy value.
If all of the *fn* calls on the chunks return a falsy value, the promise is fulfilled with `undefined`.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => data is T | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

`Promise`<`undefined` \| `T`\>

-`Promise`: a promise evaluating to the first chunk for which *fn* evaluated with a truthy value,
or `undefined` if no element was found.
	-`undefined \| T`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[find](Duplex.md#find)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:489

**find**(`fn`, `options?`): `Promise`<`any`\>

#### Parameters

| Name |
| :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[find](Duplex.md#find)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:493

___

### flatMap

**flatMap**(`fn`, `options?`): [`Readable`](Readable.md)

This method returns a new stream by applying the given callback to each chunk of the stream
and then flattening the result.

It is possible to return a stream or another iterable or async iterable from *fn* and the result streams
will be merged (flattened) into the returned stream.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `any` | a function to map over every chunk in the stream. May be async. May be a stream or generator. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

[`Readable`](Readable.md)

-`Readable`: a stream flat-mapped with the function *fn*.

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[flatMap](Duplex.md#flatmap)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:520

___

### forEach

**forEach**(`fn`, `options?`): `Promise`<`void`\>

This method allows iterating a stream. For each chunk in the stream the *fn* function will be called.
If the *fn* function returns a promise - that promise will be `await`ed.

This method is different from `for await...of` loops in that it can optionally process chunks concurrently.
In addition, a `forEach` iteration can only be stopped by having passed a `signal` option
and aborting the related AbortController while `for await...of` can be stopped with `break` or `return`.
In either case the stream will be destroyed.

This method is different from listening to the `'data'` event in that it uses the `readable` event
in the underlying machinary and can limit the number of concurrent *fn* calls.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `void` \| `Promise`<`void`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: a promise for when the stream has finished.

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[forEach](Duplex.md#foreach)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:453

___

### getMaxListeners

**getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](Socket.md#defaultmaxlisteners).

#### Returns

`number`

-`number`: (optional) 

**Since**

v1.0.0

#### Inherited from

[Duplex](Duplex.md).[getMaxListeners](Duplex.md#getmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:687

___

### isPaused

**isPaused**(): `boolean`

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

-`boolean`: (optional) 

**Since**

v0.11.14

#### Inherited from

[Duplex](Duplex.md).[isPaused](Duplex.md#ispaused)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:287

___

### iterator

**iterator**(`options?`): [`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

The iterator created by this method gives users the option to cancel the destruction
of the stream if the `for await...of` loop is exited by `return`, `break`, or `throw`,
or if the iterator should destroy the stream if the stream emitted an error during iteration.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | `object` |
| `options.destroyOnReturn?` | `boolean` | When set to `false`, calling `return` on the async iterator, or exiting a `for await...of` iteration using a `break`, `return`, or `throw` will not destroy the stream. **Default: `true`**. |

#### Returns

[`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

-`AsyncIterableIterator`: 
	-`any`: (optional) 

**Since**

v16.3.0

#### Inherited from

[Duplex](Duplex.md).[iterator](Duplex.md#iterator)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:417

___

### listenerCount

**listenerCount**(`eventName`, `listener?`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | `Function` | The event handler function |

#### Returns

`number`

-`number`: (optional) 

**Since**

v3.2.0

#### Inherited from

[Duplex](Duplex.md).[listenerCount](Duplex.md#listenercount)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:781

___

### listeners

**listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

-`Function[]`: 

**Since**

v0.1.26

#### Inherited from

[Duplex](Duplex.md).[listeners](Duplex.md#listeners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:700

___

### map

**map**(`fn`, `options?`): [`Readable`](Readable.md)

This method allows mapping over the stream. The *fn* function will be called for every chunk in the stream.
If the *fn* function returns a promise - that promise will be `await`ed before being passed to the result stream.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `any` | a function to map over every chunk in the stream. Async or not. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

[`Readable`](Readable.md)

-`Readable`: a stream mapped with the function *fn*.

**Since**

v17.4.0, v16.14.0

#### Inherited from

[Duplex](Duplex.md).[map](Duplex.md#map)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:425

___

### off

**off**(`eventName`, `listener`): [`Socket`](Socket.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v10.0.0

#### Inherited from

[Duplex](Duplex.md).[off](Duplex.md#off)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:660

___

### on

**on**(`event`, `listener`): [`Socket`](Socket.md)

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

| Name | Description |
| :------ | :------ |
| `event` | `string` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.1.101

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:397

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | (`hadError`: `boolean`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:398

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connect"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:399

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`data`: [`Buffer`](../index.md#buffer)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:400

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:401

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:402

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:403

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"lookup"`` |
| `listener` | (`err`: `Error`, `address`: `string`, `family`: `string` \| `number`, `host`: `string`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:404

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"ready"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:408

**on**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"timeout"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[on](Duplex.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:409

___

### once

**once**(`event`, `listener`): [`Socket`](Socket.md)

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

| Name | Description |
| :------ | :------ |
| `event` | `string` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.3.0

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:410

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | (`hadError`: `boolean`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:411

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connect"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:412

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`data`: [`Buffer`](../index.md#buffer)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:413

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:414

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:415

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:416

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"lookup"`` |
| `listener` | (`err`: `Error`, `address`: `string`, `family`: `string` \| `number`, `host`: `string`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:417

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"ready"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:421

**once**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"timeout"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[once](Duplex.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:422

___

### pause

**pause**(): [`Socket`](Socket.md)

Pauses the reading of data. That is, `'data'` events will not be emitted.
Useful to throttle back an upload.

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

#### Overrides

[Duplex](Duplex.md).[pause](Duplex.md#pause)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:151

___

### pipe

**pipe**<`T`\>(`destination`, `options?`): `T`

| Name | Type |
| :------ | :------ |
| `T` | [`WritableStream`](../interfaces/WritableStream.md) |

#### Parameters

| Name |
| :------ |
| `destination` | `T` |
| `options?` | `object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Inherited from

[Duplex](Duplex.md).[pipe](Duplex.md#pipe)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:29

___

### prependListener

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

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

| Name | Description |
| :------ | :------ |
| `event` | `string` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v6.0.0

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:423

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | (`hadError`: `boolean`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:424

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connect"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:425

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`data`: [`Buffer`](../index.md#buffer)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:426

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:427

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:428

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:429

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"lookup"`` |
| `listener` | (`err`: `Error`, `address`: `string`, `family`: `string` \| `number`, `host`: `string`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:430

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"ready"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:434

**prependListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"timeout"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependListener](Duplex.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:435

___

### prependOnceListener

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `string` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v6.0.0

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:436

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | (`hadError`: `boolean`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:437

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connect"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:438

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`data`: [`Buffer`](../index.md#buffer)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:439

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:440

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:441

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:442

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"lookup"`` |
| `listener` | (`err`: `Error`, `address`: `string`, `family`: `string` \| `number`, `host`: `string`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:443

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"ready"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:447

**prependOnceListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"timeout"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Overrides

[Duplex](Duplex.md).[prependOnceListener](Duplex.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:448

___

### push

**push**(`chunk`, `encoding?`): `boolean`

#### Parameters

| Name |
| :------ |
| `chunk` | `any` |
| `encoding?` | [`BufferEncoding`](../index.md#bufferencoding) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[push](Duplex.md#push)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:407

___

### rawListeners

**rawListeners**(`eventName`): `Function`[]

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

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

-`Function[]`: 

**Since**

v9.4.0

#### Inherited from

[Duplex](Duplex.md).[rawListeners](Duplex.md#rawlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:731

___

### read

**read**(`size?`): `any`

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

Calling [read](../interfaces/Request.md#read) after the `'end'` event has
been emitted will return `null`. No runtime error will be raised.

#### Parameters

| Name | Description |
| :------ | :------ |
| `size?` | `number` | Optional argument to specify how much data to read. |

#### Returns

`any`

-`any`: (optional) 

**Since**

v0.9.4

#### Inherited from

[Duplex](Duplex.md).[read](Duplex.md#read)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:204

___

### reduce

**reduce**<`T`\>(`fn`, `initial?`, `options?`): `Promise`<`T`\>

This method calls *fn* on each chunk of the stream in order, passing it the result from the calculation
on the previous element. It returns a promise for the final value of the reduction.

If no *initial* value is supplied the first chunk of the stream is used as the initial value.
If the stream is empty, the promise is rejected with a `TypeError` with the `ERR_INVALID_ARGS` code property.

The reducer function iterates the stream element-by-element which means that there is no *concurrency* parameter
or parallelism. To perform a reduce concurrently, you can extract the async function to `readable.map` method.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`previous`: `any`, `data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `T` | a reducer function to call over every chunk in the stream. Async or not. |
| `initial?` | `undefined` | the initial value to use in the reduction. |
| `options?` | [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\> |

#### Returns

`Promise`<`T`\>

-`Promise`: a promise for the final value of the reduction.

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[reduce](Duplex.md#reduce)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:556

**reduce**<`T`\>(`fn`, `initial`, `options?`): `Promise`<`T`\>

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `fn` | (`previous`: `T`, `data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `T` |
| `initial` | `T` |
| `options?` | [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\> |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[Duplex](Duplex.md).[reduce](Duplex.md#reduce)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:561

___

### ref

**ref**(): [`Socket`](Socket.md)

Opposite of `unref()`, calling `ref()` on a previously `unref`ed socket will _not_ let the program exit if it's the only socket left (the default behavior).
If the socket is `ref`ed calling `ref` again will have no effect.

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.9.1

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:242

___

### removeAllListeners

**removeAllListeners**(`event?`): [`Socket`](Socket.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name |
| :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.1.26

#### Inherited from

[Duplex](Duplex.md).[removeAllListeners](Duplex.md#removealllisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:671

___

### removeListener

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

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

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.1.26

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1232

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1233

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1234

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1235

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1236

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1237

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1238

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](Readable.md)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1239

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1240

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1241

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](Readable.md)) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1242

**removeListener**(`event`, `listener`): [`Socket`](Socket.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

#### Inherited from

[Duplex](Duplex.md).[removeListener](Duplex.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1243

___

### resetAndDestroy

**resetAndDestroy**(): [`Socket`](Socket.md)

Close the TCP connection by sending an RST packet and destroy the stream.
If this TCP socket is in connecting status, it will send an RST packet and destroy this TCP socket once it is connected.
Otherwise, it will call `socket.destroy` with an `ERR_SOCKET_CLOSED` Error.
If this is not a TCP socket (for example, a pipe), calling this method will immediately throw an `ERR_INVALID_HANDLE_TYPE` Error.

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v18.3.0, v16.17.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:159

___

### resume

**resume**(): [`Socket`](Socket.md)

Resumes reading after a call to `socket.pause()`.

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

#### Overrides

[Duplex](Duplex.md).[resume](Duplex.md#resume)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:164

___

### setDefaultEncoding

**setDefaultEncoding**(`encoding`): [`Socket`](Socket.md)

The `writable.setDefaultEncoding()` method sets the default `encoding` for a `Writable` stream.

#### Parameters

| Name | Description |
| :------ | :------ |
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) | The new default encoding |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.11.15

#### Inherited from

[Duplex](Duplex.md).[setDefaultEncoding](Duplex.md#setdefaultencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1115

___

### setEncoding

**setEncoding**(`encoding?`): [`Socket`](Socket.md)

Set the encoding for the socket as a `Readable Stream`. See `readable.setEncoding()` for more information.

#### Parameters

| Name |
| :------ |
| `encoding?` | [`BufferEncoding`](../index.md#bufferencoding) |

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.1.90

#### Overrides

[Duplex](Duplex.md).[setEncoding](Duplex.md#setencoding)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:145

___

### setKeepAlive

**setKeepAlive**(`enable?`, `initialDelay?`): [`Socket`](Socket.md)

Enable/disable keep-alive functionality, and optionally set the initial
delay before the first keepalive probe is sent on an idle socket.

Set `initialDelay` (in milliseconds) to set the delay between the last
data packet received and the first keepalive probe. Setting `0` for`initialDelay` will leave the value unchanged from the default
(or previous) setting.

Enabling the keep-alive functionality will set the following socket options:

* `SO_KEEPALIVE=1`
* `TCP_KEEPIDLE=initialDelay`
* `TCP_KEEPCNT=10`
* `TCP_KEEPINTVL=1`

#### Parameters

| Name |
| :------ |
| `enable?` | `boolean` |
| `initialDelay?` | `number` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.1.92

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:222

___

### setMaxListeners

**setMaxListeners**(`n`): [`Socket`](Socket.md)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name |
| :------ |
| `n` | `number` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.3.5

#### Inherited from

[Duplex](Duplex.md).[setMaxListeners](Duplex.md#setmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:681

___

### setNoDelay

**setNoDelay**(`noDelay?`): [`Socket`](Socket.md)

Enable/disable the use of Nagle's algorithm.

When a TCP connection is created, it will have Nagle's algorithm enabled.

Nagle's algorithm delays data before it is sent via the network. It attempts
to optimize throughput at the expense of latency.

Passing `true` for `noDelay` or not passing an argument will disable Nagle's
algorithm for the socket. Passing `false` for `noDelay` will enable Nagle's
algorithm.

#### Parameters

| Name |
| :------ |
| `noDelay?` | `boolean` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.1.90

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:202

___

### setTimeout

**setTimeout**(`timeout`, `callback?`): [`Socket`](Socket.md)

Sets the socket to timeout after `timeout` milliseconds of inactivity on
the socket. By default `net.Socket` do not have a timeout.

When an idle timeout is triggered the socket will receive a `'timeout'` event but the connection will not be severed. The user must manually call `socket.end()` or `socket.destroy()` to
end the connection.

```js
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```

If `timeout` is 0, then the existing idle timeout is disabled.

The optional `callback` parameter will be added as a one-time listener for the `'timeout'` event.

#### Parameters

| Name |
| :------ |
| `timeout` | `number` |
| `callback?` | () => `void` |

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.1.90

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:186

___

### some

**some**(`fn`, `options?`): `Promise`<`boolean`\>

This method is similar to `Array.prototype.some` and calls *fn* on each chunk in the stream
until the awaited return value is `true` (or any truthy value). Once an *fn* call on a chunk
`await`ed return value is truthy, the stream is destroyed and the promise is fulfilled with `true`.
If none of the *fn* calls on the chunks return a truthy value, the promise is fulfilled with `false`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](../interfaces/ArrayOptions.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: a promise evaluating to `true` if *fn* returned a truthy value for at least one of the chunks.
	-`boolean`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[some](Duplex.md#some)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:475

___

### take

**take**(`limit`, `options?`): [`Readable`](Readable.md)

This method returns a new stream with the first *limit* chunks.

#### Parameters

| Name | Description |
| :------ | :------ |
| `limit` | `number` | the number of chunks to take from the readable. |
| `options?` | [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\> |

#### Returns

[`Readable`](Readable.md)

-`Readable`: a stream with *limit* chunks taken.

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[take](Duplex.md#take)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:534

___

### toArray

**toArray**(`options?`): `Promise`<`any`[]\>

This method allows easily obtaining the contents of a stream.

As this method reads the entire stream into memory, it negates the benefits of streams. It's intended
for interoperability and convenience, not as the primary way to consume streams.

#### Parameters

| Name |
| :------ |
| `options?` | [`Pick`](../index.md#pick)<[`ArrayOptions`](../interfaces/ArrayOptions.md), ``"signal"``\> |

#### Returns

`Promise`<`any`[]\>

-`Promise`: a promise containing an array with the contents of the stream.
	-`any[]`: 
		-`any`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Duplex](Duplex.md).[toArray](Duplex.md#toarray)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:465

___

### uncork

**uncork**(): `void`

The `writable.uncork()` method flushes all data buffered since [cork](../interfaces/Response.md#cork) was called.

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

-`void`: (optional) 

**Since**

v0.11.2

#### Inherited from

[Duplex](Duplex.md).[uncork](Duplex.md#uncork)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1120

___

### unpipe

**unpipe**(`destination?`): [`Socket`](Socket.md)

The `readable.unpipe()` method detaches a `Writable` stream previously attached
using the [pipe](../interfaces/Request.md#pipe) method.

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

| Name | Description |
| :------ | :------ |
| `destination?` | [`WritableStream`](../interfaces/WritableStream.md) | Optional specific stream to unpipe |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.9.4

#### Inherited from

[Duplex](Duplex.md).[unpipe](Duplex.md#unpipe)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:314

___

### unref

**unref**(): [`Socket`](Socket.md)

Calling `unref()` on a socket will allow the program to exit if this is the only
active socket in the event system. If the socket is already `unref`ed calling`unref()` again will have no effect.

#### Returns

[`Socket`](Socket.md)

-`Socket`: The socket itself.

**Since**

v0.9.1

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:235

___

### unshift

**unshift**(`chunk`, `encoding?`): `void`

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

Unlike [push](../interfaces/Request.md#push), `stream.unshift(chunk)` will not
end the reading process by resetting the internal reading state of the stream.
This can cause unexpected results if `readable.unshift()` is called during a
read (i.e. from within a [_read](../interfaces/Request.md#_read) implementation on a
custom stream). Following the call to `readable.unshift()` with an immediate [push](../interfaces/Request.md#push) will reset the reading state appropriately,
however it is best to simply avoid calling `readable.unshift()` while in the
process of performing a read.

#### Parameters

| Name | Description |
| :------ | :------ |
| `chunk` | `any` | Chunk of data to unshift onto the read queue. For streams not operating in object mode, `chunk` must be a string, `Buffer`, `Uint8Array`, or `null`. For object mode streams, `chunk` may be any JavaScript value. |
| `encoding?` | [`BufferEncoding`](../index.md#bufferencoding) | Encoding of string chunks. Must be a valid `Buffer` encoding, such as `'utf8'` or `'ascii'`. |

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.9.11

#### Inherited from

[Duplex](Duplex.md).[unshift](Duplex.md#unshift)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:380

___

### wrap

**wrap**(`stream`): [`Socket`](Socket.md)

Prior to Node.js 0.10, streams did not implement the entire `node:stream`module API as it is currently defined. (See `Compatibility` for more
information.)

When using an older Node.js library that emits `'data'` events and has a [pause](../interfaces/Request.md#pause) method that is advisory only, the`readable.wrap()` method can be used to create a `Readable`
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

| Name | Description |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/ReadableStream.md) | An "old style" readable stream |

#### Returns

[`Socket`](Socket.md)

-`Socket`: 

**Since**

v0.9.4

#### Inherited from

[Duplex](Duplex.md).[wrap](Duplex.md#wrap)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:406

___

### write

**write**(`buffer`, `cb?`): `boolean`

Sends data on the socket. The second parameter specifies the encoding in the
case of a string. It defaults to UTF8 encoding.

Returns `true` if the entire data was flushed successfully to the kernel
buffer. Returns `false` if all or part of the data was queued in user memory.`'drain'` will be emitted when the buffer is again free.

The optional `callback` parameter will be executed when the data is finally
written out, which may not be immediately.

See `Writable` stream `write()` method for more
information.

#### Parameters

| Name |
| :------ |
| `buffer` | `string` \| `Uint8Array` |
| `cb?` | (`err?`: `Error`) => `void` |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v0.1.90

#### Overrides

[Duplex](Duplex.md).[write](Duplex.md#write)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:115

**write**(`str`, `encoding?`, `cb?`): `boolean`

#### Parameters

| Name |
| :------ |
| `str` | `string` \| `Uint8Array` |
| `encoding?` | [`BufferEncoding`](../index.md#bufferencoding) |
| `cb?` | (`err?`: `Error`) => `void` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

[Duplex](Duplex.md).[write](Duplex.md#write)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:116

___

### addAbortListener

`Static` **addAbortListener**(`signal`, `resource`): `Disposable`

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call `e.stopImmediatePropagation()`. Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```js
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

#### Parameters

| Name |
| :------ |
| `signal` | `AbortSignal` |
| `resource` | (`event`: `Event`) => `void` |

#### Returns

`Disposable`

**Since**

v20.5.0

#### Inherited from

[Duplex](Duplex.md).[addAbortListener](Duplex.md#addabortlistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:387

___

### from

`Static` **from**(`src`): [`Duplex`](Duplex.md)

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

| Name |
| :------ |
| `src` | `string` \| `Object` \| `Promise`<`any`\> \| `ArrayBuffer` \| [`Stream`](Stream.md) \| [`Iterable`](../interfaces/Iterable.md)<`any`\> \| [`AsyncIterable`](../interfaces/AsyncIterable.md)<`any`\> \| [`Blob`](Blob.md) \| [`AsyncGeneratorFunction`](../interfaces/AsyncGeneratorFunction.md) |

#### Returns

[`Duplex`](Duplex.md)

-`Duplex`: 

**Since**

v16.8.0

#### Inherited from

[Duplex](Duplex.md).[from](Duplex.md#from)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1091

___

### fromWeb

`Static` **fromWeb**(`duplexStream`, `options?`): [`Duplex`](Duplex.md)

A utility method for creating a `Duplex` from a web `ReadableStream` and `WritableStream`.

#### Parameters

| Name |
| :------ |
| `duplexStream` | `object` |
| `duplexStream.readable` | [`ReadableStream`](../index.md#readablestream)<`any`\> |
| `duplexStream.writable` | [`WritableStream`](../index.md#writablestream)<`any`\> |
| `options?` | [`Pick`](../index.md#pick)<[`DuplexOptions`](../interfaces/DuplexOptions.md), ``"signal"`` \| ``"encoding"`` \| ``"allowHalfOpen"`` \| ``"decodeStrings"`` \| ``"highWaterMark"`` \| ``"objectMode"``\> |

#### Returns

[`Duplex`](Duplex.md)

-`Duplex`: 

**Since**

v17.0.0

#### Inherited from

[Duplex](Duplex.md).[fromWeb](Duplex.md#fromweb)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1135

___

### getEventListeners

`Static` **getEventListeners**(`emitter`, `name`): `Function`[]

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

| Name |
| :------ |
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-1.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md) |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

-`Function[]`: 

**Since**

v15.2.0, v14.17.0

#### Inherited from

[Duplex](Duplex.md).[getEventListeners](Duplex.md#geteventlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:308

___

### getMaxListeners

`Static` **getMaxListeners**(`emitter`): `number`

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```js
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

#### Parameters

| Name |
| :------ |
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-1.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md) |

#### Returns

`number`

-`number`: (optional) 

**Since**

v19.9.0

#### Inherited from

[Duplex](Duplex.md).[getMaxListeners](Duplex.md#getmaxlisteners-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:337

___

### isDisturbed

`Static` **isDisturbed**(`stream`): `boolean`

Returns whether the stream has been read from or cancelled.

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v16.8.0

#### Inherited from

[Duplex](Duplex.md).[isDisturbed](Duplex.md#isdisturbed)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:58

___

### listenerCount

`Static` **listenerCount**(`emitter`, `eventName`): `number`

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

| Name | Description |
| :------ | :------ |
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-1.md) | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

-`number`: (optional) 

**Since**

v0.9.12

**Deprecated**

Since v3.2.0 - Use `listenerCount` instead.

#### Inherited from

[Duplex](Duplex.md).[listenerCount](Duplex.md#listenercount-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:280

___

### on

`Static` **on**(`emitter`, `eventName`, `options?`): [`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

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

| Name | Description |
| :------ | :------ |
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-1.md) |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/StaticEventEmitterOptions.md) |

#### Returns

[`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

-`AsyncIterableIterator`: that iterates `eventName` events emitted by the `emitter`
	-`any`: (optional) 

**Since**

v13.6.0, v12.16.0

#### Inherited from

[Duplex](Duplex.md).[on](Duplex.md#on-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:258

___

### once

`Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

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

| Name |
| :------ |
| `emitter` | [`_NodeEventTarget`](../interfaces/NodeEventTarget.md) |
| `eventName` | `string` \| `symbol` |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/StaticEventEmitterOptions.md) |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

**Since**

v11.13.0, v10.16.0

#### Inherited from

[Duplex](Duplex.md).[once](Duplex.md#once-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:193

`Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

#### Parameters

| Name |
| :------ |
| `emitter` | [`_DOMEventTarget`](../interfaces/DOMEventTarget.md) |
| `eventName` | `string` |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/StaticEventEmitterOptions.md) |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Inherited from

[Duplex](Duplex.md).[once](Duplex.md#once-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:198

___

### setMaxListeners

`Static` **setMaxListeners**(`n?`, `...eventTargets`): `void`

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `n?` | `number` | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| `...eventTargets` | ([`EventEmitter`](../interfaces/EventEmitter-1.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md))[] |

#### Returns

`void`

-`void`: (optional) 

**Since**

v15.4.0

#### Inherited from

[Duplex](Duplex.md).[setMaxListeners](Duplex.md#setmaxlisteners-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:352

___

### toWeb

`Static` **toWeb**(`streamDuplex`): { `readable`: [`ReadableStream`](../index.md#readablestream)<`any`\> ; `writable`: [`WritableStream`](../index.md#writablestream)<`any`\>  }

A utility method for creating a web `ReadableStream` and `WritableStream` from a `Duplex`.

#### Parameters

| Name |
| :------ |
| `streamDuplex` | [`Duplex`](Duplex.md) |

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `readable` | [`ReadableStream`](../index.md#readablestream)<`any`\> |
| `writable` | [`WritableStream`](../index.md#writablestream)<`any`\> |

**Since**

v17.0.0

#### Inherited from

[Duplex](Duplex.md).[toWeb](Duplex.md#toweb)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1126
