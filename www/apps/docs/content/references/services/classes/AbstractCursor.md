# AbstractCursor

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `object` |
| `CursorEvents` | [`AbstractCursorEvents`](../types/AbstractCursorEvents.md) |

## Hierarchy

- [`TypedEventEmitter`](TypedEventEmitter.md)<`CursorEvents`\>

  ↳ **`AbstractCursor`**

  ↳↳ [`FindCursor`](FindCursor.md)

  ↳↳ [`AggregationCursor`](AggregationCursor.md)

  ↳↳ [`ListIndexesCursor`](ListIndexesCursor.md)

  ↳↳ [`ListCollectionsCursor`](ListCollectionsCursor.md)

## Constructors

### constructor

**new AbstractCursor**<`TSchema`, `CursorEvents`\>(`options?`)

| Name | Type |
| :------ | :------ |
| `TSchema` | `object` |
| `CursorEvents` | [`AbstractCursorEvents`](../types/AbstractCursorEvents.md) |

#### Parameters

| Name |
| :------ |
| `options?` | [`EventEmitterOptions`](../interfaces/EventEmitterOptions.md) |

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[constructor](TypedEventEmitter.md#constructor)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:110

## Properties

### captureRejectionSymbol

 `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](Socket.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

**Since**

v13.4.0, v12.16.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[captureRejectionSymbol](TypedEventEmitter.md#capturerejectionsymbol)

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

[TypedEventEmitter](TypedEventEmitter.md).[captureRejections](TypedEventEmitter.md#capturerejections)

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

[TypedEventEmitter](TypedEventEmitter.md).[defaultMaxListeners](TypedEventEmitter.md#defaultmaxlisteners)

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

[TypedEventEmitter](TypedEventEmitter.md).[errorMonitor](TypedEventEmitter.md#errormonitor)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:395

## Accessors

### closed

`get` **closed**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:25

___

### id

`get` **id**(): `undefined` \| [`Long`](Long.md)

#### Returns

`undefined` \| [`Long`](Long.md)

-`undefined \| Long`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:21

___

### killed

`get` **killed**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:26

___

### loadBalanced

`get` **loadBalanced**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:27

___

### namespace

`get` **namespace**(): [`MongoDBNamespace`](MongoDBNamespace.md)

#### Returns

[`MongoDBNamespace`](MongoDBNamespace.md)

-`MongoDBNamespace`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:22

___

### readConcern

`get` **readConcern**(): `undefined` \| [`ReadConcern`](ReadConcern.md)

#### Returns

`undefined` \| [`ReadConcern`](ReadConcern.md)

-`undefined \| ReadConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:24

___

### readPreference

`get` **readPreference**(): [`ReadPreference`](ReadPreference.md)

#### Returns

[`ReadPreference`](ReadPreference.md)

-`ReadPreference`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:23

## Methods

### [asyncIterator]

**[asyncIterator]**(): [`AsyncGenerator`](../interfaces/AsyncGenerator.md)<`TSchema`, `void`, `void`\>

#### Returns

[`AsyncGenerator`](../interfaces/AsyncGenerator.md)<`TSchema`, `void`, `void`\>

-`AsyncGenerator`: 
	-`void`: (optional) 
	-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:32

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

[TypedEventEmitter](TypedEventEmitter.md).[[captureRejectionSymbol]](TypedEventEmitter.md#[capturerejectionsymbol])

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:112

___

### addCursorFlag

**addCursorFlag**(`flag`, `value`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Add a cursor flag to the cursor

#### Parameters

| Name | Description |
| :------ | :------ |
| `flag` | ``"tailable"`` \| ``"oplogReplay"`` \| ``"noCursorTimeout"`` \| ``"awaitData"`` \| ``"exhaust"`` \| ``"partial"`` | The flag to set, must be one of following ['tailable', 'oplogReplay', 'noCursorTimeout', 'awaitData', 'partial' -. |
| `value` | `boolean` | The flag boolean value. |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:63

___

### addListener

**addListener**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Alias for `emitter.on(eventName, listener)`.

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event` | `EventKey` |
| `listener` | `CursorEvents`[`EventKey`] |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[addListener](TypedEventEmitter.md#addlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5085

**addListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[addListener](TypedEventEmitter.md#addlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5086

**addListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[addListener](TypedEventEmitter.md#addlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5087

___

### batchSize

**batchSize**(`value`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Set the batch size for the cursor.

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `number` | The number of documents to return per batch. See [command documentation](https://www.mongodb.com/docs/manual/reference/command/find/\|find). |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:130

___

### bufferedCount

**bufferedCount**(): `number`

Returns current buffered documents length

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:29

___

### clone

`Abstract` **clone**(): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, [`AbstractCursorEvents`](../types/AbstractCursorEvents.md)\>

Returns a new uninitialized copy of this cursor, with options matching those that have been set on the current instance

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, [`AbstractCursorEvents`](../types/AbstractCursorEvents.md)\>

-`AbstractCursor`: 
	-`AbstractCursorEvents`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:140

___

### close

**close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:49

___

### emit

**emit**<`EventKey`\>(`event`, `...args`): `boolean`

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

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event` | `symbol` \| `EventKey` |
| `...args` | [`Parameters`](../types/Parameters.md)<`CursorEvents`[`EventKey`]\> |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[emit](TypedEventEmitter.md#emit)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5103

___

### eventNames

**eventNames**(): `string`[]

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

`string`[]

-`string[]`: 
	-`string`: (optional) 

**Since**

v6.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[eventNames](TypedEventEmitter.md#eventnames)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5111

___

### forEach

**forEach**(`iterator`): `Promise`<`void`\>

Iterates over all the documents for this cursor using the iterator, callback pattern.

If the iterator returns `false`, iteration will stop.

#### Parameters

| Name | Description |
| :------ | :------ |
| `iterator` | (`doc`: `TSchema`) => `boolean` \| `void` | The iteration callback. |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:48

___

### getMaxListeners

**getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](AbstractCursor.md#defaultmaxlisteners).

#### Returns

`number`

-`number`: (optional) 

**Since**

v1.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[getMaxListeners](TypedEventEmitter.md#getmaxlisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5112

___

### hasNext

**hasNext**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:34

___

### listenerCount

**listenerCount**<`EventKey`\>(`type`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `type` | `string` \| `symbol` \| `EventKey` | The name of the event being listened for |

#### Returns

`number`

-`number`: (optional) 

**Since**

v3.2.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[listenerCount](TypedEventEmitter.md#listenercount)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5104

___

### listeners

**listeners**<`EventKey`\>(`event`): `CursorEvents`[`EventKey`][]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` \| `EventKey` |

#### Returns

`CursorEvents`[`EventKey`][]

-``CursorEvents`[`EventKey`][]`: 
	-``CursorEvents`[`EventKey`]`: (optional) 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[listeners](TypedEventEmitter.md#listeners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5101

___

### map

**map**<`T`\>(`transform`): [`AbstractCursor`](AbstractCursor.md)<`T`, [`AbstractCursorEvents`](../types/AbstractCursorEvents.md)\>

Map all documents using the provided function
If there is a transform set on the cursor, that will be called first and the result passed to
this function's transform.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

**Example**

```typescript
const cursor: FindCursor<Document> = coll.find();
const mappedCursor: FindCursor<number> = cursor.map(doc => Object.keys(doc).length);
const keyCounts: number[] = await mappedCursor.toArray(); // cursor.toArray() still returns Document[]
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `transform` | (`doc`: `TSchema`) => `T` | The mapping transformation method. |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`T`, [`AbstractCursorEvents`](../types/AbstractCursorEvents.md)\>

-`AbstractCursor`: 
	-`AbstractCursorEvents`: 

**Remarks**

**Note** Cursors use `null` internally to indicate that there are no more documents in the cursor. Providing a mapping
function that maps values to `null` will result in the cursor closing itself before it has finished iterating
all documents.  This will **not** result in a memory leak, just surprising behavior.  For example:

```typescript
const cursor = collection.find({});
cursor.map(() => null);

const documents = await cursor.toArray();
// documents is always [], regardless of how many documents are in the collection.
```

Other falsey values are allowed:

```typescript
const cursor = collection.find({});
cursor.map(() => '');

const documents = await cursor.toArray();
// documents is now an array of empty strings
```

**Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
it **does not** return a new instance of a cursor. This means when calling map,
you should always assign the result to a new variable in order to get a correctly typed cursor variable.
Take note of the following example:

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:106

___

### maxTimeMS

**maxTimeMS**(`value`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `number` | Number of milliseconds to wait before aborting the query. |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:124

___

### next

**next**(): `Promise`<``null`` \| `TSchema`\>

Get the next available document from the cursor, returns null if no more documents are available.

#### Returns

`Promise`<``null`` \| `TSchema`\>

-`Promise`: 
	-```null`` \| TSchema`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:36

___

### off

**off**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Alias for `emitter.removeListener()`.

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event` | `EventKey` |
| `listener` | `CursorEvents`[`EventKey`] |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v10.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[off](TypedEventEmitter.md#off)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5097

**off**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[off](TypedEventEmitter.md#off)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5098

**off**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[off](TypedEventEmitter.md#off)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5099

___

### on

**on**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

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

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | `CursorEvents`[`EventKey`] | The callback function |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v0.1.101

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5088

**on**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5089

**on**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5090

___

### once

**once**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

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

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | `CursorEvents`[`EventKey`] | The callback function |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v0.3.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5091

**once**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5092

**once**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5093

___

### prependListener

**prependListener**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

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

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | `CursorEvents`[`EventKey`] | The callback function |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v6.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependListener](TypedEventEmitter.md#prependlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5105

**prependListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependListener](TypedEventEmitter.md#prependlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5106

**prependListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependListener](TypedEventEmitter.md#prependlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5107

___

### prependOnceListener

**prependOnceListener**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | `CursorEvents`[`EventKey`] | The callback function |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v6.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependOnceListener](TypedEventEmitter.md#prependoncelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5108

**prependOnceListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependOnceListener](TypedEventEmitter.md#prependoncelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5109

**prependOnceListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependOnceListener](TypedEventEmitter.md#prependoncelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5110

___

### rawListeners

**rawListeners**<`EventKey`\>(`event`): `CursorEvents`[`EventKey`][]

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

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` \| `EventKey` |

#### Returns

`CursorEvents`[`EventKey`][]

-``CursorEvents`[`EventKey`][]`: 
	-``CursorEvents`[`EventKey`]`: (optional) 

**Since**

v9.4.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[rawListeners](TypedEventEmitter.md#rawlisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5102

___

### readBufferedDocuments

**readBufferedDocuments**(`number?`): `TSchema`[]

Returns current buffered documents

#### Parameters

| Name |
| :------ |
| `number?` | `number` |

#### Returns

`TSchema`[]

-`TSchema[]`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:31

___

### removeAllListeners

**removeAllListeners**<`EventKey`\>(`event?`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event?` | `string` \| `symbol` \| `EventKey` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeAllListeners](TypedEventEmitter.md#removealllisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5100

___

### removeListener

**removeListener**<`EventKey`\>(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

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

| Name | Type |
| :------ | :------ |
| `EventKey` | `string` \| `number` \| `symbol` |

#### Parameters

| Name |
| :------ |
| `event` | `EventKey` |
| `listener` | `CursorEvents`[`EventKey`] |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeListener](TypedEventEmitter.md#removelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5094

**removeListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../types/CommonEvents.md) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../types/GenericListener.md)) => `void` |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeListener](TypedEventEmitter.md#removelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5095

**removeListener**(`event`, `listener`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../types/GenericListener.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeListener](TypedEventEmitter.md#removelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5096

___

### rewind

**rewind**(): `void`

Rewind this cursor to its uninitialized state. Any options that are present on the cursor will
remain in effect. Iterating this cursor will cause new queries to be sent to the server, even
if the resultant data has already been retrieved by this cursor.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:136

___

### setMaxListeners

**setMaxListeners**(`n`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

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

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

**Since**

v0.3.5

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[setMaxListeners](TypedEventEmitter.md#setmaxlisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5113

___

### stream

**stream**(`options?`): [`Readable`](Readable.md) & [`AsyncIterable`](../interfaces/AsyncIterable.md)<`TSchema`\>

#### Parameters

| Name |
| :------ |
| `options?` | [`CursorStreamOptions`](../interfaces/CursorStreamOptions.md) |

#### Returns

[`Readable`](Readable.md) & [`AsyncIterable`](../interfaces/AsyncIterable.md)<`TSchema`\>

-`[`Readable`](Readable.md) & [`AsyncIterable`](../interfaces/AsyncIterable.md)<`TSchema`\>`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:33

___

### toArray

**toArray**(): `Promise`<`TSchema`[]\>

Returns an array of documents. The caller is responsible for making sure that there
is enough memory to store the results. Note that the array only contains partial
results when this cursor had been previously accessed. In that case,
cursor.rewind() can be used to reset the cursor.

#### Returns

`Promise`<`TSchema`[]\>

-`Promise`: 
	-`TSchema[]`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:56

___

### tryNext

**tryNext**(): `Promise`<``null`` \| `TSchema`\>

Try to get the next available document from the cursor or `null` if an empty batch is returned

#### Returns

`Promise`<``null`` \| `TSchema`\>

-`Promise`: 
	-```null`` \| TSchema`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:40

___

### withReadConcern

**withReadConcern**(`readConcern`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Set the ReadPreference for the cursor.

#### Parameters

| Name |
| :------ |
| `readConcern` | [`ReadConcernLike`](../types/ReadConcernLike.md) |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:118

___

### withReadPreference

**withReadPreference**(`readPreference`): [`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

Set the ReadPreference for the cursor.

#### Parameters

| Name | Description |
| :------ | :------ |
| `readPreference` | [`ReadPreferenceLike`](../types/ReadPreferenceLike.md) | The new read preference for the cursor. |

#### Returns

[`AbstractCursor`](AbstractCursor.md)<`TSchema`, `CursorEvents`\>

-`AbstractCursor`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:112

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

[TypedEventEmitter](TypedEventEmitter.md).[addAbortListener](TypedEventEmitter.md#addabortlistener)

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
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-2.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md) |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

-`Function[]`: 

**Since**

v15.2.0, v14.17.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[getEventListeners](TypedEventEmitter.md#geteventlisteners)

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
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-2.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md) |

#### Returns

`number`

-`number`: (optional) 

**Since**

v19.9.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[getMaxListeners](TypedEventEmitter.md#getmaxlisteners-1)

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
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-2.md) | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

-`number`: (optional) 

**Since**

v0.9.12

**Deprecated**

Since v3.2.0 - Use `listenerCount` instead.

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[listenerCount](TypedEventEmitter.md#listenercount-1)

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
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-2.md) |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | [`StaticEventEmitterOptions`](../interfaces/StaticEventEmitterOptions.md) |

#### Returns

[`AsyncIterableIterator`](../interfaces/AsyncIterableIterator.md)<`any`\>

-`AsyncIterableIterator`: that iterates `eventName` events emitted by the `emitter`
	-`any`: (optional) 

**Since**

v13.6.0, v12.16.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on-1)

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

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once-1)

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

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once-1)

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
| `...eventTargets` | ([`EventEmitter`](../interfaces/EventEmitter-2.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md))[] |

#### Returns

`void`

-`void`: (optional) 

**Since**

v15.4.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[setMaxListeners](TypedEventEmitter.md#setmaxlisteners-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:352

## Events

### CLOSE

 `Static` `Readonly` **CLOSE**: ``"close"``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:20
