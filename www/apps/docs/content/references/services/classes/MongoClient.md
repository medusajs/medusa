# MongoClient

The **MongoClient** class is a class that allows for making Connections to MongoDB.

**Remarks**

The programmatically provided options take precedence over the URI options.

**Example**

```ts
import { MongoClient } from "mongodb"

// Enable command monitoring for debugging
const client = new MongoClient("mongodb://localhost:27017", {
  monitorCommands: true,
})

client.on("commandStarted", (started) => console.log(started))
client.db().collection("pets")
await client.insertOne({ name: "spot", kind: "dog" })
```

## Hierarchy

- [`TypedEventEmitter`](TypedEventEmitter.md)<[`MongoClientEvents`](../index.md#mongoclientevents)\>

  ↳ **`MongoClient`**

## Constructors

### constructor

**new MongoClient**(`url`, `options?`)

#### Parameters

| Name |
| :------ |
| `url` | `string` |
| `options?` | [`MongoClientOptions`](../interfaces/MongoClientOptions.md) |

#### Overrides

[TypedEventEmitter](TypedEventEmitter.md).[constructor](TypedEventEmitter.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3561

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

### autoEncrypter

`get` **autoEncrypter**(): `undefined` \| [`AutoEncrypter`](../interfaces/AutoEncrypter.md)

#### Returns

`undefined` \| [`AutoEncrypter`](../interfaces/AutoEncrypter.md)

-`undefined \| AutoEncrypter`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3564

___

### bsonOptions

`get` **bsonOptions**(): [`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

#### Returns

[`BSONSerializeOptions`](../interfaces/BSONSerializeOptions.md)

-`BSONSerializeOptions`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3568

___

### options

`get` **options**(): [`Readonly`](../index.md#readonly)<[`MongoOptions`](../interfaces/MongoOptions.md)\>

#### Returns

[`Readonly`](../index.md#readonly)<[`MongoOptions`](../interfaces/MongoOptions.md)\>

-`Readonly`: 
	-`MongoOptions`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3562

___

### readConcern

`get` **readConcern**(): `undefined` \| [`ReadConcern`](ReadConcern.md)

#### Returns

`undefined` \| [`ReadConcern`](ReadConcern.md)

-`undefined \| ReadConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3565

___

### readPreference

`get` **readPreference**(): [`ReadPreference`](ReadPreference.md)

#### Returns

[`ReadPreference`](ReadPreference.md)

-`ReadPreference`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3567

___

### serverApi

`get` **serverApi**(): [`Readonly`](../index.md#readonly)<`undefined` \| [`ServerApi`](../interfaces/ServerApi.md)\>

#### Returns

[`Readonly`](../index.md#readonly)<`undefined` \| [`ServerApi`](../interfaces/ServerApi.md)\>

-`Readonly`: 
	-`undefined \| ServerApi`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3563

___

### writeConcern

`get` **writeConcern**(): `undefined` \| [`WriteConcern`](WriteConcern.md)

#### Returns

`undefined` \| [`WriteConcern`](WriteConcern.md)

-`undefined \| WriteConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3566

## Methods

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

### addListener

**addListener**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

Alias for `emitter.on(eventName, listener)`.

| Name | Type |
| :------ | :------ |
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event` | `EventKey` |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[addListener](TypedEventEmitter.md#addlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5085

**addListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[addListener](TypedEventEmitter.md#addlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5086

**addListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[addListener](TypedEventEmitter.md#addlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5087

___

### close

**close**(`force?`): `Promise`<`void`\>

Close the client and its underlying connections

#### Parameters

| Name | Description |
| :------ | :------ |
| `force?` | `boolean` | Force close, emitting no events |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3580

___

### connect

**connect**(): `Promise`<[`MongoClient`](MongoClient.md)\>

Connect to MongoDB using a url

#### Returns

`Promise`<[`MongoClient`](MongoClient.md)\>

-`Promise`: 
	-`MongoClient`: 

**See**

docs.mongodb.org/manual/reference/connection-string/

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3574

___

### db

**db**(`dbName?`, `options?`): [`Db`](Db.md)

Create a new Db instance sharing the current socket connections.

#### Parameters

| Name | Description |
| :------ | :------ |
| `dbName?` | `string` | The name of the database we want to use. If not provided, use database name from connection string. |
| `options?` | [`DbOptions`](../interfaces/DbOptions.md) | Optional settings for Db construction |

#### Returns

[`Db`](Db.md)

-`Db`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3587

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event` | `symbol` \| `EventKey` |
| `...args` | [`Parameters`](../index.md#parameters)<[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`]\> |

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

### getMaxListeners

**getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](MongoClient.md#defaultmaxlisteners).

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

### listenerCount

**listenerCount**<`EventKey`\>(`type`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

| Name | Type |
| :------ | :------ |
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

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

**listeners**<`EventKey`\>(`event`): [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`][]

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` \| `EventKey` |

#### Returns

[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`][]

-`[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`][]`: 
	-`[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`]`: (optional) 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[listeners](TypedEventEmitter.md#listeners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5101

___

### off

**off**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

Alias for `emitter.removeListener()`.

| Name | Type |
| :------ | :------ |
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event` | `EventKey` |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v10.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[off](TypedEventEmitter.md#off)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5097

**off**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[off](TypedEventEmitter.md#off)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5098

**off**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[off](TypedEventEmitter.md#off)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5099

___

### on

**on**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] | The callback function |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v0.1.101

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5088

**on**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5089

**on**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[on](TypedEventEmitter.md#on)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5090

___

### once

**once**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] | The callback function |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v0.3.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5091

**once**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5092

**once**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[once](TypedEventEmitter.md#once)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5093

___

### prependListener

**prependListener**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] | The callback function |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v6.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependListener](TypedEventEmitter.md#prependlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5105

**prependListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependListener](TypedEventEmitter.md#prependlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5106

**prependListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependListener](TypedEventEmitter.md#prependlistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5107

___

### prependOnceListener

**prependOnceListener**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `EventKey` | The name of the event. |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] | The callback function |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v6.0.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependOnceListener](TypedEventEmitter.md#prependoncelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5108

**prependOnceListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependOnceListener](TypedEventEmitter.md#prependoncelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5109

**prependOnceListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[prependOnceListener](TypedEventEmitter.md#prependoncelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5110

___

### rawListeners

**rawListeners**<`EventKey`\>(`event`): [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`][]

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` \| `EventKey` |

#### Returns

[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`][]

-`[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`][]`: 
	-`[`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`]`: (optional) 

**Since**

v9.4.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[rawListeners](TypedEventEmitter.md#rawlisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5102

___

### removeAllListeners

**removeAllListeners**<`EventKey`\>(`event?`): [`MongoClient`](MongoClient.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

| Name | Type |
| :------ | :------ |
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event?` | `string` \| `symbol` \| `EventKey` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeAllListeners](TypedEventEmitter.md#removealllisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5100

___

### removeListener

**removeListener**<`EventKey`\>(`event`, `listener`): [`MongoClient`](MongoClient.md)

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
| `EventKey` | ``"error"`` \| ``"open"`` \| ``"close"`` \| ``"timeout"`` \| ``"commandStarted"`` \| ``"commandSucceeded"`` \| ``"commandFailed"`` \| ``"serverHeartbeatStarted"`` \| ``"serverHeartbeatSucceeded"`` \| ``"serverHeartbeatFailed"`` \| ``"connectionPoolCreated"`` \| ``"connectionPoolReady"`` \| ``"connectionPoolClosed"`` \| ``"connectionPoolCleared"`` \| ``"connectionCreated"`` \| ``"connectionReady"`` \| ``"connectionClosed"`` \| ``"connectionCheckOutStarted"`` \| ``"connectionCheckOutFailed"`` \| ``"connectionCheckedOut"`` \| ``"connectionCheckedIn"`` \| ``"serverOpening"`` \| ``"serverClosed"`` \| ``"serverDescriptionChanged"`` \| ``"topologyOpening"`` \| ``"topologyClosed"`` \| ``"topologyDescriptionChanged"`` |

#### Parameters

| Name |
| :------ |
| `event` | `EventKey` |
| `listener` | [`MongoClientEvents`](../index.md#mongoclientevents)[`EventKey`] |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v0.1.26

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeListener](TypedEventEmitter.md#removelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5094

**removeListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | [`CommonEvents`](../index.md#commonevents) |
| `listener` | (`eventName`: `string` \| `symbol`, `listener`: [`GenericListener`](../index.md#genericlistener)) => `void` |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeListener](TypedEventEmitter.md#removelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5095

**removeListener**(`event`, `listener`): [`MongoClient`](MongoClient.md)

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | [`GenericListener`](../index.md#genericlistener) |

#### Returns

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[removeListener](TypedEventEmitter.md#removelistener)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5096

___

### setMaxListeners

**setMaxListeners**(`n`): [`MongoClient`](MongoClient.md)

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

[`MongoClient`](MongoClient.md)

-`MongoClient`: 

**Since**

v0.3.5

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[setMaxListeners](TypedEventEmitter.md#setmaxlisteners)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5113

___

### startSession

**startSession**(`options?`): [`ClientSession`](ClientSession.md)

Starts a new session on the server

#### Parameters

| Name |
| :------ |
| `options?` | [`ClientSessionOptions`](../interfaces/ClientSessionOptions.md) |

#### Returns

[`ClientSession`](ClientSession.md)

-`ClientSession`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3598

___

### watch

**watch**<`TSchema`, `TChange`\>(`pipeline?`, `options?`): [`ChangeStream`](ChangeStream.md)<`TSchema`, `TChange`\>

Create a new Change Stream, watching for new changes (insertions, updates,
replacements, deletions, and invalidations) in this cluster. Will ignore all
changes to system collections, as well as the local, admin, and config databases.

| Name | Type | Description |
| :------ | :------ | :------ |
| `TSchema` | [`Document`](../interfaces/Document.md) | Type of the data being detected by the change stream |
| `TChange` | [`Document`](../interfaces/Document.md) | Type of the whole change stream document emitted |

#### Parameters

| Name | Description |
| :------ | :------ |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] | An array of [pipeline stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/\|aggregation) through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents. |
| `options?` | [`ChangeStreamOptions`](../interfaces/ChangeStreamOptions.md) | Optional settings for the command |

#### Returns

[`ChangeStream`](ChangeStream.md)<`TSchema`, `TChange`\>

-`ChangeStream`: 

**Remarks**

watch() accepts two generic arguments for distinct use cases:
- The first is to provide the schema that may be defined for all the data within the current cluster
- The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3625

___

### withSession

**withSession**(`callback`): `Promise`<`void`\>

Runs a given operation with an implicitly created session. The lifetime of the session
will be handled without the need for user interaction.

NOTE: presently the operation MUST return a Promise (either explicit or implicitly as an async function)

#### Parameters

| Name | Description |
| :------ | :------ |
| `callback` | [`WithSessionCallback`](../index.md#withsessioncallback) | An callback to execute with an implicitly created session |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3608

**withSession**(`options`, `callback`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `options` | [`ClientSessionOptions`](../interfaces/ClientSessionOptions.md) |
| `callback` | [`WithSessionCallback`](../index.md#withsessioncallback) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3609

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

### connect

`Static` **connect**(`url`, `options?`): `Promise`<[`MongoClient`](MongoClient.md)\>

Connect to MongoDB using a url

#### Parameters

| Name |
| :------ |
| `url` | `string` |
| `options?` | [`MongoClientOptions`](../interfaces/MongoClientOptions.md) |

#### Returns

`Promise`<[`MongoClient`](MongoClient.md)\>

-`Promise`: 
	-`MongoClient`: 

**Remarks**

The programmatically provided options take precedence over the URI options.

**See**

https://www.mongodb.com/docs/manual/reference/connection-string/

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3596

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
| `emitter` | [`EventEmitter`](../interfaces/EventEmitter-1.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md) |

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
| `...eventTargets` | ([`EventEmitter`](../interfaces/EventEmitter-1.md) \| [`_DOMEventTarget`](../interfaces/DOMEventTarget.md))[] |

#### Returns

`void`

-`void`: (optional) 

**Since**

v15.4.0

#### Inherited from

[TypedEventEmitter](TypedEventEmitter.md).[setMaxListeners](TypedEventEmitter.md#setmaxlisteners-1)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:352
