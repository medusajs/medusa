---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadWriteStream

[internal](../modules/internal-8.md).ReadWriteStream

## Hierarchy

- [`ReadableStream`](internal-8.ReadableStream.md)

- [`WritableStream`](internal-8.WritableStream.md)

  ↳ **`ReadWriteStream`**

## Properties

### readable

• **readable**: `boolean`

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[readable](internal-8.ReadableStream.md#readable)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:210

___

### writable

• **writable**: `boolean`

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[writable](internal-8.WritableStream.md#writable)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:224

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`string` \| [`Buffer`](../modules/internal-8.md#buffer)\>

#### Returns

[`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`string` \| [`Buffer`](../modules/internal-8.md#buffer)\>

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[[asyncIterator]](internal-8.ReadableStream.md#[asynciterator])

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:220

___

### addListener

▸ **addListener**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

Alias for `emitter.on(eventName, listener)`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v0.1.26

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[addListener](internal-8.WritableStream.md#addlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:390

___

### emit

▸ **emit**(`eventName`, `...args`): `boolean`

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
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

**`Since`**

v0.1.26

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[emit](internal-8.WritableStream.md#emit)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:652

___

### end

▸ **end**(`cb?`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | () => `void` |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[end](internal-8.WritableStream.md#end)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:227

▸ **end**(`data`, `cb?`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Uint8Array` |
| `cb?` | () => `void` |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[end](internal-8.WritableStream.md#end)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:228

▸ **end**(`str`, `encoding?`, `cb?`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `cb?` | () => `void` |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[end](internal-8.WritableStream.md#end)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:229

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

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[eventNames](internal-8.WritableStream.md#eventnames)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:715

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to defaultMaxListeners.

#### Returns

`number`

**`Since`**

v1.0.0

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[getMaxListeners](internal-8.WritableStream.md#getmaxlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:567

___

### isPaused

▸ **isPaused**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[isPaused](internal-8.ReadableStream.md#ispaused)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:215

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

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[listenerCount](internal-8.WritableStream.md#listenercount)

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

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[listeners](internal-8.WritableStream.md#listeners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:580

___

### off

▸ **off**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v10.0.0

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[off](internal-8.WritableStream.md#off)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:540

___

### on

▸ **on**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v0.1.101

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[on](internal-8.WritableStream.md#on)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:422

___

### once

▸ **once**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v0.3.0

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[once](internal-8.WritableStream.md#once)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:452

___

### pause

▸ **pause**(): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[pause](internal-8.ReadableStream.md#pause)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:213

___

### pipe

▸ **pipe**<`T`\>(`destination`, `options?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`WritableStream`](internal-8.WritableStream.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | `T` |
| `options?` | `Object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[pipe](internal-8.ReadableStream.md#pipe)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:216

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v6.0.0

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[prependListener](internal-8.WritableStream.md#prependlistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:679

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v6.0.0

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[prependOnceListener](internal-8.WritableStream.md#prependoncelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:695

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

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[rawListeners](internal-8.WritableStream.md#rawlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:611

___

### read

▸ **read**(`size?`): `string` \| [`Buffer`](../modules/internal-8.md#buffer)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Returns

`string` \| [`Buffer`](../modules/internal-8.md#buffer)

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[read](internal-8.ReadableStream.md#read)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:211

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v0.1.26

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[removeAllListeners](internal-8.WritableStream.md#removealllisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:551

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v0.1.26

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[removeListener](internal-8.WritableStream.md#removelistener)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:535

___

### resume

▸ **resume**(): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[resume](internal-8.ReadableStream.md#resume)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:214

___

### setEncoding

▸ **setEncoding**(`encoding`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[setEncoding](internal-8.ReadableStream.md#setencoding)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:212

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

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

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

**`Since`**

v0.3.5

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[setMaxListeners](internal-8.WritableStream.md#setmaxlisteners)

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:561

___

### unpipe

▸ **unpipe**(`destination?`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination?` | [`WritableStream`](internal-8.WritableStream.md) |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[unpipe](internal-8.ReadableStream.md#unpipe)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:217

___

### unshift

▸ **unshift**(`chunk`, `encoding?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `string` \| `Uint8Array` |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |

#### Returns

`void`

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[unshift](internal-8.ReadableStream.md#unshift)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:218

___

### wrap

▸ **wrap**(`oldStream`): [`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldStream` | [`ReadableStream`](internal-8.ReadableStream.md) |

#### Returns

[`ReadWriteStream`](internal-8.ReadWriteStream.md)

#### Inherited from

[ReadableStream](internal-8.ReadableStream.md).[wrap](internal-8.ReadableStream.md#wrap)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:219

___

### write

▸ **write**(`buffer`, `cb?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buffer` | `string` \| `Uint8Array` |
| `cb?` | (`err?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`boolean`

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[write](internal-8.WritableStream.md#write)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:225

▸ **write**(`str`, `encoding?`, `cb?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `encoding?` | [`BufferEncoding`](../modules/internal-8.md#bufferencoding) |
| `cb?` | (`err?`: ``null`` \| [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

`boolean`

#### Inherited from

[WritableStream](internal-8.WritableStream.md).[write](internal-8.WritableStream.md#write)

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:226
