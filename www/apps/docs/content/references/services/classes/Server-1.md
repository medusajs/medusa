# Server

This class is used to create a TCP or `IPC` server.

**Since**

v0.1.90

## Hierarchy

- [`EventEmitter`](EventEmitter.md)

  ↳ **`Server`**

  ↳↳ [`Server`](Server.md)

## Constructors

### constructor

**new Server**(`connectionListener?`)

#### Parameters

| Name |
| :------ |
| `connectionListener?` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Overrides

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:507

**new Server**(`options?`, `connectionListener?`)

#### Parameters

| Name |
| :------ |
| `options?` | [`ServerOpts`](../interfaces/ServerOpts.md) |
| `connectionListener?` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Overrides

EventEmitter.constructor

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:508

## Properties

### connections

 **connections**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:626

___

### listening

 **listening**: `boolean`

Indicates whether or not the server is listening for connections.

**Since**

v5.7.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:631

___

### maxConnections

 **maxConnections**: `number`

Set this property to reject connections when the server's connection count gets
high.

It is not recommended to use this option once a socket has been sent to a child
with `child_process.fork()`.

**Since**

v0.2.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:625

___

### captureRejectionSymbol

 `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](Socket.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

**Since**

v13.4.0, v12.16.0

#### Inherited from

[EventEmitter](EventEmitter.md).[captureRejectionSymbol](EventEmitter.md#capturerejectionsymbol)

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

[EventEmitter](EventEmitter.md).[captureRejections](EventEmitter.md#capturerejections)

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

[EventEmitter](EventEmitter.md).[defaultMaxListeners](EventEmitter.md#defaultmaxlisteners)

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

[EventEmitter](EventEmitter.md).[errorMonitor](EventEmitter.md#errormonitor)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:395

## Methods

### [asyncDispose]

**[asyncDispose]**(): `Promise`<`void`\>

Calls [()](Server.md#close) and returns a promise that fulfills when the server has closed.

#### Returns

`Promise`<`void`\>

-`Promise`: 

**Since**

v20.5.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:680

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

[EventEmitter](EventEmitter.md).[[captureRejectionSymbol]](EventEmitter.md#[capturerejectionsymbol])

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:112

___

### addListener

**addListener**(`event`, `listener`): [`Server`](Server-1.md)

events.EventEmitter
  1. close
  2. connection
  3. error
  4. listening
  5. drop

#### Parameters

| Name |
| :------ |
| `event` | `string` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

[EventEmitter](EventEmitter.md).[addListener](EventEmitter.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:640

**addListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.addListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:641

**addListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connection"`` |
| `listener` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.addListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:642

**addListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.addListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:643

**addListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"listening"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.addListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:644

**addListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drop"`` |
| `listener` | (`data?`: [`DropArgument`](../interfaces/DropArgument.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.addListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:645

___

### address

**address**(): ``null`` \| `string` \| [`AddressInfo`](../interfaces/AddressInfo.md)

Returns the bound `address`, the address `family` name, and `port` of the server
as reported by the operating system if listening on an IP socket
(useful to find which port was assigned when getting an OS-assigned address):`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

For a server listening on a pipe or Unix domain socket, the name is returned
as a string.

```js
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.
server.listen(() => {
  console.log('opened server on', server.address());
});
```

`server.address()` returns `null` before the `'listening'` event has been
emitted or after calling `server.close()`.

#### Returns

``null`` \| `string` \| [`AddressInfo`](../interfaces/AddressInfo.md)

-```null`` \| string \| AddressInfo`: (optional) 

**Since**

v0.1.90

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:596

___

### close

**close**(`callback?`): [`Server`](Server-1.md)

Stops the server from accepting new connections and keeps existing
connections. This function is asynchronous, the server is finally closed
when all connections are ended and the server emits a `'close'` event.
The optional `callback` will be called once the `'close'` event occurs. Unlike
that event, it will be called with an `Error` as its only argument if the server
was not open when it was closed.

#### Parameters

| Name | Description |
| :------ | :------ |
| `callback?` | (`err?`: `Error`) => `void` | Called when the server is closed. |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.1.90

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:569

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

[EventEmitter](EventEmitter.md).[emit](EventEmitter.md#emit)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:646

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

EventEmitter.emit

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:647

**emit**(`event`, `socket`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"connection"`` |
| `socket` | [`Socket`](Socket.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

EventEmitter.emit

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:648

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

EventEmitter.emit

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:649

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"listening"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

EventEmitter.emit

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:650

**emit**(`event`, `data?`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"drop"`` |
| `data?` | [`DropArgument`](../interfaces/DropArgument.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Overrides

EventEmitter.emit

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:651

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

[EventEmitter](EventEmitter.md).[eventNames](EventEmitter.md#eventnames)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:835

___

### getConnections

**getConnections**(`cb`): `void`

Asynchronously get the number of concurrent connections on the server. Works
when sockets were sent to forks.

Callback should take two arguments `err` and `count`.

#### Parameters

| Name |
| :------ |
| `cb` | (`error`: ``null`` \| `Error`, `count`: `number`) => `void` |

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.9.7

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:604

___

### getMaxListeners

**getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](Server-1.md#defaultmaxlisteners).

#### Returns

`number`

-`number`: (optional) 

**Since**

v1.0.0

#### Inherited from

[EventEmitter](EventEmitter.md).[getMaxListeners](EventEmitter.md#getmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:687

___

### listen

**listen**(`port?`, `hostname?`, `backlog?`, `listeningListener?`): [`Server`](Server-1.md)

Start a server listening for connections. A `net.Server` can be a TCP or
an `IPC` server depending on what it listens to.

Possible signatures:

* `server.listen(handle[, backlog][, callback])`
* `server.listen(options[, callback])`
* `server.listen(path[, backlog][, callback])` for `IPC` servers
* `server.listen([port[, host[, backlog]]][, callback])` for TCP servers

This function is asynchronous. When the server starts listening, the `'listening'` event will be emitted. The last parameter `callback`will be added as a listener for the `'listening'`
event.

All `listen()` methods can take a `backlog` parameter to specify the maximum
length of the queue of pending connections. The actual length will be determined
by the OS through sysctl settings such as `tcp_max_syn_backlog` and `somaxconn`on Linux. The default value of this parameter is 511 (not 512).

All [Socket](Socket.md) are set to `SO_REUSEADDR` (see [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7.html) for
details).

The `server.listen()` method can be called again if and only if there was an
error during the first `server.listen()` call or `server.close()` has been
called. Otherwise, an `ERR_SERVER_ALREADY_LISTEN` error will be thrown.

One of the most common errors raised when listening is `EADDRINUSE`.
This happens when another server is already listening on the requested`port`/`path`/`handle`. One way to handle this would be to retry
after a certain amount of time:

```js
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### Parameters

| Name |
| :------ |
| `port?` | `number` |
| `hostname?` | `string` |
| `backlog?` | `number` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:550

**listen**(`port?`, `hostname?`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `port?` | `number` |
| `hostname?` | `string` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:551

**listen**(`port?`, `backlog?`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `port?` | `number` |
| `backlog?` | `number` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:552

**listen**(`port?`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `port?` | `number` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:553

**listen**(`path`, `backlog?`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `backlog?` | `number` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:554

**listen**(`path`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:555

**listen**(`options`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `options` | [`ListenOptions`](../interfaces/ListenOptions.md) |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:556

**listen**(`handle`, `backlog?`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `handle` | `any` |
| `backlog?` | `number` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:557

**listen**(`handle`, `listeningListener?`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `handle` | `any` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:558

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

[EventEmitter](EventEmitter.md).[listenerCount](EventEmitter.md#listenercount)

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

[EventEmitter](EventEmitter.md).[listeners](EventEmitter.md#listeners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:700

___

### off

**off**(`eventName`, `listener`): [`Server`](Server-1.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

**Since**

v10.0.0

#### Inherited from

[EventEmitter](EventEmitter.md).[off](EventEmitter.md#off)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:660

___

### on

**on**(`event`, `listener`): [`Server`](Server-1.md)

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

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.1.101

#### Overrides

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:652

**on**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.on

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:653

**on**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connection"`` |
| `listener` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.on

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:654

**on**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.on

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:655

**on**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"listening"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.on

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:656

**on**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drop"`` |
| `listener` | (`data?`: [`DropArgument`](../interfaces/DropArgument.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.on

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:657

___

### once

**once**(`event`, `listener`): [`Server`](Server-1.md)

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

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.3.0

#### Overrides

[EventEmitter](EventEmitter.md).[once](EventEmitter.md#once)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:658

**once**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.once

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:659

**once**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connection"`` |
| `listener` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.once

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:660

**once**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.once

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:661

**once**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"listening"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.once

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:662

**once**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drop"`` |
| `listener` | (`data?`: [`DropArgument`](../interfaces/DropArgument.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.once

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:663

___

### prependListener

**prependListener**(`event`, `listener`): [`Server`](Server-1.md)

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

[`Server`](Server-1.md)

-`Server`: 

**Since**

v6.0.0

#### Overrides

[EventEmitter](EventEmitter.md).[prependListener](EventEmitter.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:664

**prependListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:665

**prependListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connection"`` |
| `listener` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:666

**prependListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:667

**prependListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"listening"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:668

**prependListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drop"`` |
| `listener` | (`data?`: [`DropArgument`](../interfaces/DropArgument.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:669

___

### prependOnceListener

**prependOnceListener**(`event`, `listener`): [`Server`](Server-1.md)

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

[`Server`](Server-1.md)

-`Server`: 

**Since**

v6.0.0

#### Overrides

[EventEmitter](EventEmitter.md).[prependOnceListener](EventEmitter.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:670

**prependOnceListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependOnceListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:671

**prependOnceListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"connection"`` |
| `listener` | (`socket`: [`Socket`](Socket.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependOnceListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:672

**prependOnceListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependOnceListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:673

**prependOnceListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"listening"`` |
| `listener` | () => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependOnceListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:674

**prependOnceListener**(`event`, `listener`): [`Server`](Server-1.md)

#### Parameters

| Name |
| :------ |
| `event` | ``"drop"`` |
| `listener` | (`data?`: [`DropArgument`](../interfaces/DropArgument.md)) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

#### Overrides

EventEmitter.prependOnceListener

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:675

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

[EventEmitter](EventEmitter.md).[rawListeners](EventEmitter.md#rawlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:731

___

### ref

**ref**(): [`Server`](Server-1.md)

Opposite of `unref()`, calling `ref()` on a previously `unref`ed server will _not_ let the program exit if it's the only server left (the default behavior).
If the server is `ref`ed calling `ref()` again will have no effect.

#### Returns

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.9.1

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:610

___

### removeAllListeners

**removeAllListeners**(`event?`): [`Server`](Server-1.md)

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

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](EventEmitter.md).[removeAllListeners](EventEmitter.md#removealllisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:671

___

### removeListener

**removeListener**(`eventName`, `listener`): [`Server`](Server-1.md)

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
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](EventEmitter.md).[removeListener](EventEmitter.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:655

___

### setMaxListeners

**setMaxListeners**(`n`): [`Server`](Server-1.md)

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

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.3.5

#### Inherited from

[EventEmitter](EventEmitter.md).[setMaxListeners](EventEmitter.md#setmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:681

___

### unref

**unref**(): [`Server`](Server-1.md)

Calling `unref()` on a server will allow the program to exit if this is the only
active server in the event system. If the server is already `unref`ed calling`unref()` again will have no effect.

#### Returns

[`Server`](Server-1.md)

-`Server`: 

**Since**

v0.9.1

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:616

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

[EventEmitter](EventEmitter.md).[addAbortListener](EventEmitter.md#addabortlistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:387

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

[EventEmitter](EventEmitter.md).[getEventListeners](EventEmitter.md#geteventlisteners)

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

[EventEmitter](EventEmitter.md).[getMaxListeners](EventEmitter.md#getmaxlisteners-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:337

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

[EventEmitter](EventEmitter.md).[listenerCount](EventEmitter.md#listenercount-1)

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

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on-1)

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

[EventEmitter](EventEmitter.md).[once](EventEmitter.md#once-1)

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

[EventEmitter](EventEmitter.md).[once](EventEmitter.md#once-1)

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

[EventEmitter](EventEmitter.md).[setMaxListeners](EventEmitter.md#setmaxlisteners-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:352
