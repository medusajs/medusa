---
displayed_sidebar: jsClientSidebar
---

# Class: ReadableBase

[internal](../modules/internal-8.md).ReadableBase

The `EventEmitter` class is defined and exposed by the `node:events` module:

```js
import { EventEmitter } from 'node:events';
```

All `EventEmitter`s emit the event `'newListener'` when new listeners are
added and `'removeListener'` when existing listeners are removed.

It supports the following option:

**`Since`**

v0.1.26

## Hierarchy

- [`Stream`](internal-8.Stream.md)

  ↳ **`ReadableBase`**

  ↳↳ [`Duplex`](internal-8.Duplex.md)

  ↳↳ [`Readable`](internal-8.Readable.md)

## Implements

- [`ReadableStream`](../interfaces/internal-8.ReadableStream.md)

## Properties

### closed

• `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**`Since`**

v18.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:106

___

### destroyed

• **destroyed**: `boolean`

Is `true` after `readable.destroy()` has been called.

**`Since`**

v8.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:101

___

### errored

• `Readonly` **errored**: ``null`` \| [`Error`](../modules/internal-8.md#error)

Returns error if the stream has been destroyed with an error.

**`Since`**

v18.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:111

___

### readable

• **readable**: `boolean`

Is `true` if it is safe to call `readable.read()`, which means
the stream has not been destroyed or emitted `'error'` or `'end'`.

**`Since`**

v11.4.0

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[readable](../interfaces/internal-8.ReadableStream.md#readable)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:57

___

### readableAborted

• `Readonly` **readableAborted**: `boolean`

Returns whether the stream was destroyed or errored before emitting `'end'`.

**`Since`**

v16.8.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:51

___

### readableDidRead

• `Readonly` **readableDidRead**: `boolean`

Returns whether `'data'` has been emitted.

**`Since`**

v16.7.0, v14.18.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:63

___

### readableEncoding

• `Readonly` **readableEncoding**: ``null`` \| [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

Getter for the property `encoding` of a given `Readable` stream. The `encoding`property can be set using the `readable.setEncoding()` method.

**`Since`**

v12.7.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:68

___

### readableEnded

• `Readonly` **readableEnded**: `boolean`

Becomes `true` when `'end'` event is emitted.

**`Since`**

v12.9.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:73

___

### readableFlowing

• `Readonly` **readableFlowing**: ``null`` \| `boolean`

This property reflects the current state of a `Readable` stream as described
in the `Three states` section.

**`Since`**

v9.4.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:79

___

### readableHighWaterMark

• `Readonly` **readableHighWaterMark**: `number`

Returns the value of `highWaterMark` passed when creating this `Readable`.

**`Since`**

v9.3.0

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

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:91

___

### readableObjectMode

• `Readonly` **readableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Readable` stream.

**`Since`**

v12.3.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:96

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](internal-8.PassThrough.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

**`Since`**

v13.4.0, v12.16.0

#### Inherited from

[Stream](internal-8.Stream.md).[captureRejectionSymbol](internal-8.Stream.md#capturerejectionsymbol)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:326

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Change the default `captureRejections` option on all new `EventEmitter` objects.

**`Since`**

v13.4.0, v12.16.0

#### Inherited from

[Stream](internal-8.Stream.md).[captureRejections](internal-8.Stream.md#capturerejections)

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

#### Inherited from

[Stream](internal-8.Stream.md).[defaultMaxListeners](internal-8.Stream.md#defaultmaxlisteners)

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

#### Inherited from

[Stream](internal-8.Stream.md).[errorMonitor](internal-8.Stream.md#errormonitor)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:319

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncIterableIterator`](../interfaces/internal-8.AsyncIterableIterator.md)<`any`\>

#### Returns

[`AsyncIterableIterator`](../interfaces/internal-8.AsyncIterableIterator.md)<`any`\>

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[[asyncIterator]](../interfaces/internal-8.ReadableStream.md#[asynciterator])

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

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:113

___

### \_destroy

▸ **_destroy**(`error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | ``null`` \| [`Error`](../modules/internal-8.md#error) |
| `callback` | (`error?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:395

___

### \_read

▸ **_read**(`size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:114

___

### addListener

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

Event emitter
The defined events on documents including:
1. close
2. data
3. end
4. error
5. pause
6. readable
7. resume

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[addListener](../interfaces/internal-8.ReadableStream.md#addlistener)

#### Overrides

[Stream](internal-8.Stream.md).[addListener](internal-8.Stream.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:419

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:420

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:421

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:422

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:423

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:424

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:425

▸ **addListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.addListener

#### Overrides

Stream.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:426

___

### destroy

▸ **destroy**(`error?`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v8.0.0

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

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[emit](../interfaces/internal-8.ReadableStream.md#emit)

#### Overrides

[Stream](internal-8.Stream.md).[emit](internal-8.Stream.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:427

▸ **emit**(`event`, `chunk`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `chunk` | `any` |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:428

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:429

▸ **emit**(`event`, `err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `err` | [`Error`](../modules/internal-8.md#error) |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:430

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:431

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:432

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:433

▸ **emit**(`event`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Implementation of

NodeJS.ReadableStream.emit

#### Overrides

Stream.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:434

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

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[eventNames](../interfaces/internal-8.ReadableStream.md#eventnames)

#### Inherited from

[Stream](internal-8.Stream.md).[eventNames](internal-8.Stream.md#eventnames)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:715

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](internal-8.ReadableBase.md#defaultmaxlisteners).

#### Returns

`number`

**`Since`**

v1.0.0

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[getMaxListeners](../interfaces/internal-8.ReadableStream.md#getmaxlisteners)

#### Inherited from

[Stream](internal-8.Stream.md).[getMaxListeners](internal-8.Stream.md#getmaxlisteners)

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

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[isPaused](../interfaces/internal-8.ReadableStream.md#ispaused)

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

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[listenerCount](../interfaces/internal-8.ReadableStream.md#listenercount)

#### Inherited from

[Stream](internal-8.Stream.md).[listenerCount](internal-8.Stream.md#listenercount)

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

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[listeners](../interfaces/internal-8.ReadableStream.md#listeners)

#### Inherited from

[Stream](internal-8.Stream.md).[listeners](internal-8.Stream.md#listeners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:580

___

### off

▸ **off**(`eventName`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v10.0.0

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[off](../interfaces/internal-8.ReadableStream.md#off)

#### Inherited from

[Stream](internal-8.Stream.md).[off](internal-8.Stream.md#off)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:540

___

### on

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.1.101

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[on](../interfaces/internal-8.ReadableStream.md#on)

#### Overrides

[Stream](internal-8.Stream.md).[on](internal-8.Stream.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:435

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:436

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:437

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:438

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:439

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:440

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:441

▸ **on**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.on

#### Overrides

Stream.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:442

___

### once

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.3.0

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[once](../interfaces/internal-8.ReadableStream.md#once)

#### Overrides

[Stream](internal-8.Stream.md).[once](internal-8.Stream.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:443

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:444

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:445

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:446

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:447

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:448

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:449

▸ **once**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.once

#### Overrides

Stream.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:450

___

### pause

▸ **pause**(): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.9.4

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[pause](../interfaces/internal-8.ReadableStream.md#pause)

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

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[pipe](../interfaces/internal-8.ReadableStream.md#pipe)

#### Inherited from

[Stream](internal-8.Stream.md).[pipe](internal-8.Stream.md#pipe)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:26

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v6.0.0

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[prependListener](../interfaces/internal-8.ReadableStream.md#prependlistener)

#### Overrides

[Stream](internal-8.Stream.md).[prependListener](internal-8.Stream.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:451

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:452

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:453

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:454

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:455

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:456

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:457

▸ **prependListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependListener

#### Overrides

Stream.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:458

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v6.0.0

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[prependOnceListener](../interfaces/internal-8.ReadableStream.md#prependoncelistener)

#### Overrides

[Stream](internal-8.Stream.md).[prependOnceListener](internal-8.Stream.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:459

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:460

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:461

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:462

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:463

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:464

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:465

▸ **prependOnceListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.prependOnceListener

#### Overrides

Stream.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:466

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

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[rawListeners](../interfaces/internal-8.ReadableStream.md#rawlisteners)

#### Inherited from

[Stream](internal-8.Stream.md).[rawListeners](internal-8.Stream.md#rawlisteners)

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

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[read](../interfaces/internal-8.ReadableStream.md#read)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:191

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.1.26

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[removeAllListeners](../interfaces/internal-8.ReadableStream.md#removealllisteners)

#### Inherited from

[Stream](internal-8.Stream.md).[removeAllListeners](internal-8.Stream.md#removealllisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:551

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.1.26

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[removeListener](../interfaces/internal-8.ReadableStream.md#removelistener)

#### Overrides

[Stream](internal-8.Stream.md).[removeListener](internal-8.Stream.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:467

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:468

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:469

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:470

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:471

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:472

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:473

▸ **removeListener**(`event`, `listener`): [`ReadableBase`](internal-8.ReadableBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadableBase`](internal-8.ReadableBase.md)

#### Implementation of

NodeJS.ReadableStream.removeListener

#### Overrides

Stream.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:474

___

### resume

▸ **resume**(): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.9.4

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[resume](../interfaces/internal-8.ReadableStream.md#resume)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:257

___

### setEncoding

▸ **setEncoding**(`encoding`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.9.4

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[setEncoding](../interfaces/internal-8.ReadableStream.md#setencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:216

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.3.5

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[setMaxListeners](../interfaces/internal-8.ReadableStream.md#setmaxlisteners)

#### Inherited from

[Stream](internal-8.Stream.md).[setMaxListeners](internal-8.Stream.md#setmaxlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:561

___

### unpipe

▸ **unpipe**(`destination?`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.9.4

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[unpipe](../interfaces/internal-8.ReadableStream.md#unpipe)

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

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[unshift](../interfaces/internal-8.ReadableStream.md#unshift)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:367

___

### wrap

▸ **wrap**(`stream`): [`ReadableBase`](internal-8.ReadableBase.md)

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

[`ReadableBase`](internal-8.ReadableBase.md)

**`Since`**

v0.9.4

#### Implementation of

[ReadableStream](../interfaces/internal-8.ReadableStream.md).[wrap](../interfaces/internal-8.ReadableStream.md#wrap)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:393

___

### from

▸ `Static` **from**(`iterable`, `options?`): [`Readable`](internal-8.Readable.md)

A utility method for creating Readable Streams out of iterators.

#### Parameters

| Name | Type |
| :------ | :------ |
| `iterable` | [`Iterable`](../interfaces/internal-8.Iterable.md)<`any`\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`any`\> |
| `options?` | [`ReadableOptions`](../interfaces/internal-8.internal-2.ReadableOptions.md) |

#### Returns

[`Readable`](internal-8.Readable.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:40

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

[Stream](internal-8.Stream.md).[getEventListeners](internal-8.Stream.md#geteventlisteners)

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

[Stream](internal-8.Stream.md).[listenerCount](internal-8.Stream.md#listenercount-1)

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

[Stream](internal-8.Stream.md).[on](internal-8.Stream.md#on-1)

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

[Stream](internal-8.Stream.md).[once](internal-8.Stream.md#once-1)

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

[Stream](internal-8.Stream.md).[once](internal-8.Stream.md#once-1)

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

[Stream](internal-8.Stream.md).[setMaxListeners](internal-8.Stream.md#setmaxlisteners-1)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:311
