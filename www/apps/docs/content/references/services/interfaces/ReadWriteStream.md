# ReadWriteStream

## Hierarchy

- [`ReadableStream`](ReadableStream.md)

- [`WritableStream`](WritableStream.md)

  ↳ **`ReadWriteStream`**

## Properties

### readable

 **readable**: `boolean`

#### Inherited from

[ReadableStream](ReadableStream.md).[readable](ReadableStream.md#readable)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:230

___

### writable

 **writable**: `boolean`

#### Inherited from

[WritableStream](WritableStream.md).[writable](WritableStream.md#writable)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:244

## Methods

### [asyncIterator]

**[asyncIterator]**(): [`AsyncIterableIterator`](AsyncIterableIterator.md)<`string` \| [`Buffer`](../index.md#buffer)\>

#### Returns

[`AsyncIterableIterator`](AsyncIterableIterator.md)<`string` \| [`Buffer`](../index.md#buffer)\>

-`AsyncIterableIterator`: 
	-`string \| Buffer`: (optional) 

#### Inherited from

[ReadableStream](ReadableStream.md).[[asyncIterator]](ReadableStream.md#[asynciterator])

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:240

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

[WritableStream](WritableStream.md).[[captureRejectionSymbol]](WritableStream.md#[capturerejectionsymbol])

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:505

___

### addListener

**addListener**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

Alias for `emitter.on(eventName, listener)`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v0.1.26

#### Inherited from

[WritableStream](WritableStream.md).[addListener](WritableStream.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:510

___

### emit

**emit**(`eventName`, `...args`): `boolean`

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
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v0.1.26

#### Inherited from

[WritableStream](WritableStream.md).[emit](WritableStream.md#emit)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:772

___

### end

**end**(`cb?`): [`ReadWriteStream`](ReadWriteStream.md)

#### Parameters

| Name |
| :------ |
| `cb?` | () => `void` |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[WritableStream](WritableStream.md).[end](WritableStream.md#end)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:247

**end**(`data`, `cb?`): [`ReadWriteStream`](ReadWriteStream.md)

#### Parameters

| Name |
| :------ |
| `data` | `string` \| `Uint8Array` |
| `cb?` | () => `void` |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[WritableStream](WritableStream.md).[end](WritableStream.md#end)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:248

**end**(`str`, `encoding?`, `cb?`): [`ReadWriteStream`](ReadWriteStream.md)

#### Parameters

| Name |
| :------ |
| `str` | `string` |
| `encoding?` | [`BufferEncoding`](../types/BufferEncoding.md) |
| `cb?` | () => `void` |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[WritableStream](WritableStream.md).[end](WritableStream.md#end)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:249

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

[WritableStream](WritableStream.md).[eventNames](WritableStream.md#eventnames)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:835

___

### getMaxListeners

**getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to defaultMaxListeners.

#### Returns

`number`

-`number`: (optional) 

**Since**

v1.0.0

#### Inherited from

[WritableStream](WritableStream.md).[getMaxListeners](WritableStream.md#getmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:687

___

### isPaused

**isPaused**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ReadableStream](ReadableStream.md).[isPaused](ReadableStream.md#ispaused)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:235

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

[WritableStream](WritableStream.md).[listenerCount](WritableStream.md#listenercount)

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

[WritableStream](WritableStream.md).[listeners](WritableStream.md#listeners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:700

___

### off

**off**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v10.0.0

#### Inherited from

[WritableStream](WritableStream.md).[off](WritableStream.md#off)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:660

___

### on

**on**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v0.1.101

#### Inherited from

[WritableStream](WritableStream.md).[on](WritableStream.md#on)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:542

___

### once

**once**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v0.3.0

#### Inherited from

[WritableStream](WritableStream.md).[once](WritableStream.md#once)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:572

___

### pause

**pause**(): [`ReadWriteStream`](ReadWriteStream.md)

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[ReadableStream](ReadableStream.md).[pause](ReadableStream.md#pause)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:233

___

### pipe

**pipe**<`T`\>(`destination`, `options?`): `T`

| Name | Type |
| :------ | :------ |
| `T` | [`WritableStream`](WritableStream.md) |

#### Parameters

| Name |
| :------ |
| `destination` | `T` |
| `options?` | `object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Inherited from

[ReadableStream](ReadableStream.md).[pipe](ReadableStream.md#pipe)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:236

___

### prependListener

**prependListener**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v6.0.0

#### Inherited from

[WritableStream](WritableStream.md).[prependListener](WritableStream.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:799

___

### prependOnceListener

**prependOnceListener**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v6.0.0

#### Inherited from

[WritableStream](WritableStream.md).[prependOnceListener](WritableStream.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:815

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

[WritableStream](WritableStream.md).[rawListeners](WritableStream.md#rawlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:731

___

### read

**read**(`size?`): `string` \| [`Buffer`](../index.md#buffer)

#### Parameters

| Name |
| :------ |
| `size?` | `number` |

#### Returns

`string` \| [`Buffer`](../index.md#buffer)

-`string \| Buffer`: (optional) 

#### Inherited from

[ReadableStream](ReadableStream.md).[read](ReadableStream.md#read)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:231

___

### removeAllListeners

**removeAllListeners**(`event?`): [`ReadWriteStream`](ReadWriteStream.md)

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

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v0.1.26

#### Inherited from

[WritableStream](WritableStream.md).[removeAllListeners](WritableStream.md#removealllisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:671

___

### removeListener

**removeListener**(`eventName`, `listener`): [`ReadWriteStream`](ReadWriteStream.md)

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

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v0.1.26

#### Inherited from

[WritableStream](WritableStream.md).[removeListener](WritableStream.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:655

___

### resume

**resume**(): [`ReadWriteStream`](ReadWriteStream.md)

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[ReadableStream](ReadableStream.md).[resume](ReadableStream.md#resume)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:234

___

### setEncoding

**setEncoding**(`encoding`): [`ReadWriteStream`](ReadWriteStream.md)

#### Parameters

| Name |
| :------ |
| `encoding` | [`BufferEncoding`](../types/BufferEncoding.md) |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[ReadableStream](ReadableStream.md).[setEncoding](ReadableStream.md#setencoding)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:232

___

### setMaxListeners

**setMaxListeners**(`n`): [`ReadWriteStream`](ReadWriteStream.md)

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

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

**Since**

v0.3.5

#### Inherited from

[WritableStream](WritableStream.md).[setMaxListeners](WritableStream.md#setmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:681

___

### unpipe

**unpipe**(`destination?`): [`ReadWriteStream`](ReadWriteStream.md)

#### Parameters

| Name |
| :------ |
| `destination?` | [`WritableStream`](WritableStream.md) |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[ReadableStream](ReadableStream.md).[unpipe](ReadableStream.md#unpipe)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:237

___

### unshift

**unshift**(`chunk`, `encoding?`): `void`

#### Parameters

| Name |
| :------ |
| `chunk` | `string` \| `Uint8Array` |
| `encoding?` | [`BufferEncoding`](../types/BufferEncoding.md) |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[ReadableStream](ReadableStream.md).[unshift](ReadableStream.md#unshift)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:238

___

### wrap

**wrap**(`oldStream`): [`ReadWriteStream`](ReadWriteStream.md)

#### Parameters

| Name |
| :------ |
| `oldStream` | [`ReadableStream`](ReadableStream.md) |

#### Returns

[`ReadWriteStream`](ReadWriteStream.md)

-`ReadWriteStream`: 

#### Inherited from

[ReadableStream](ReadableStream.md).[wrap](ReadableStream.md#wrap)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:239

___

### write

**write**(`buffer`, `cb?`): `boolean`

#### Parameters

| Name |
| :------ |
| `buffer` | `string` \| `Uint8Array` |
| `cb?` | (`err?`: ``null`` \| `Error`) => `void` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[WritableStream](WritableStream.md).[write](WritableStream.md#write)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:245

**write**(`str`, `encoding?`, `cb?`): `boolean`

#### Parameters

| Name |
| :------ |
| `str` | `string` |
| `encoding?` | [`BufferEncoding`](../types/BufferEncoding.md) |
| `cb?` | (`err?`: ``null`` \| `Error`) => `void` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[WritableStream](WritableStream.md).[write](WritableStream.md#write)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:246
