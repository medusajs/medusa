---
displayed_sidebar: jsClientSidebar
---

# Interface: MedusaRequest

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).MedusaRequest

## Hierarchy

- `Request`

  ↳ **`MedusaRequest`**

## Properties

### aborted

• **aborted**: `boolean`

The `message.aborted` property will be `true` if the request has
been aborted.

**`Since`**

v10.1.0

**`Deprecated`**

Since v17.0.0,v16.12.0 - Check `message.destroyed` from <a href="stream.html#class-streamreadable" class="type">stream.Readable</a>.

#### Inherited from

Request.aborted

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1014

___

### allowedProperties

• **allowedProperties**: `string`[]

#### Inherited from

Request.allowedProperties

#### Defined in

packages/medusa/dist/types/global.d.ts:19

___

### closed

• `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**`Since`**

v18.0.0

#### Inherited from

Request.closed

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:106

___

### complete

• **complete**: `boolean`

The `message.complete` property will be `true` if a complete HTTP message has
been received and successfully parsed.

This property is particularly useful as a means of determining if a client or
server fully transmitted a message before a connection was terminated:

```js
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
```

**`Since`**

v0.3.0

#### Inherited from

Request.complete

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1049

___

### connection

• **connection**: [`Socket`](../classes/internal-8.Socket.md)

Alias for `message.socket`.

**`Since`**

v0.1.90

**`Deprecated`**

Since v16.0.0 - Use `socket`.

#### Inherited from

Request.connection

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1055

___

### destroyed

• **destroyed**: `boolean`

Is `true` after `readable.destroy()` has been called.

**`Since`**

v8.0.0

#### Inherited from

Request.destroyed

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:101

___

### errored

• `Readonly` **errored**: ``null`` \| [`Error`](../modules/internal-8.md#error)

Returns error if the stream has been destroyed with an error.

**`Since`**

v18.0.0

#### Inherited from

Request.errored

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:111

___

### errors

• **errors**: `string`[]

#### Inherited from

Request.errors

#### Defined in

packages/medusa/dist/types/global.d.ts:21

___

### filterableFields

• **filterableFields**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

Request.filterableFields

#### Defined in

packages/medusa/dist/types/global.d.ts:18

___

### headers

• **headers**: [`IncomingHttpHeaders`](internal-8.IncomingHttpHeaders.md)

The request/response headers object.

Key-value pairs of header names and values. Header names are lower-cased.

```js
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*' }
console.log(request.headers);
```

Duplicates in raw headers are handled in the following ways, depending on the
header name:

* Duplicates of `age`, `authorization`, `content-length`, `content-type`,`etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`,`last-modified`, `location`,
`max-forwards`, `proxy-authorization`, `referer`,`retry-after`, `server`, or `user-agent` are discarded.
To allow duplicate values of the headers listed above to be joined,
use the option `joinDuplicateHeaders` in request and createServer. See RFC 9110 Section 5.3 for more
information.
* `set-cookie` is always an array. Duplicates are added to the array.
* For duplicate `cookie` headers, the values are joined together with `; `.
* For all other headers, the values are joined together with `, `.

**`Since`**

v0.1.5

#### Inherited from

Request.headers

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1095

___

### headersDistinct

• **headersDistinct**: [`Dict`](internal-8.Dict.md)<`string`[]\>

Similar to `message.headers`, but there is no join logic and the values are
always arrays of strings, even for headers received just once.

```js
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*'] }
console.log(request.headersDistinct);
```

**`Since`**

v18.3.0, v16.17.0

#### Inherited from

Request.headersDistinct

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1110

___

### httpVersion

• **httpVersion**: `string`

In case of server request, the HTTP version sent by the client. In the case of
client response, the HTTP version of the connected-to server.
Probably either `'1.1'` or `'1.0'`.

Also `message.httpVersionMajor` is the first integer and`message.httpVersionMinor` is the second.

**`Since`**

v0.1.1

#### Inherited from

Request.httpVersion

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1023

___

### httpVersionMajor

• **httpVersionMajor**: `number`

#### Inherited from

Request.httpVersionMajor

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1024

___

### httpVersionMinor

• **httpVersionMinor**: `number`

#### Inherited from

Request.httpVersionMinor

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1025

___

### includes

• `Optional` **includes**: [`Record`](../modules/internal.md#record)<`string`, `boolean`\>

#### Inherited from

Request.includes

#### Defined in

packages/medusa/dist/types/global.d.ts:20

___

### listConfig

• **listConfig**: [`FindConfig`](internal-8.internal.FindConfig.md)<`unknown`\>

#### Inherited from

Request.listConfig

#### Defined in

packages/medusa/dist/types/global.d.ts:16

___

### rawHeaders

• **rawHeaders**: `string`[]

The raw request/response headers list exactly as they were received.

The keys and values are in the same list. It is _not_ a
list of tuples. So, the even-numbered offsets are key values, and the
odd-numbered offsets are the associated values.

Header names are not lowercased, and duplicates are not merged.

```js
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*' ]
console.log(request.rawHeaders);
```

**`Since`**

v0.11.6

#### Inherited from

Request.rawHeaders

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1135

___

### rawTrailers

• **rawTrailers**: `string`[]

The raw request/response trailer keys and values exactly as they were
received. Only populated at the `'end'` event.

**`Since`**

v0.11.6

#### Inherited from

Request.rawTrailers

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1153

___

### readable

• **readable**: `boolean`

Is `true` if it is safe to call `readable.read()`, which means
the stream has not been destroyed or emitted `'error'` or `'end'`.

**`Since`**

v11.4.0

#### Inherited from

Request.readable

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:57

___

### readableAborted

• `Readonly` **readableAborted**: `boolean`

Returns whether the stream was destroyed or errored before emitting `'end'`.

**`Since`**

v16.8.0

#### Inherited from

Request.readableAborted

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:51

___

### readableDidRead

• `Readonly` **readableDidRead**: `boolean`

Returns whether `'data'` has been emitted.

**`Since`**

v16.7.0, v14.18.0

#### Inherited from

Request.readableDidRead

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:63

___

### readableEncoding

• `Readonly` **readableEncoding**: ``null`` \| [`BufferEncoding`](../modules/internal-8.md#bufferencoding)

Getter for the property `encoding` of a given `Readable` stream. The `encoding`property can be set using the `readable.setEncoding()` method.

**`Since`**

v12.7.0

#### Inherited from

Request.readableEncoding

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:68

___

### readableEnded

• `Readonly` **readableEnded**: `boolean`

Becomes `true` when `'end'` event is emitted.

**`Since`**

v12.9.0

#### Inherited from

Request.readableEnded

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

Request.readableFlowing

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:79

___

### readableHighWaterMark

• `Readonly` **readableHighWaterMark**: `number`

Returns the value of `highWaterMark` passed when creating this `Readable`.

**`Since`**

v9.3.0

#### Inherited from

Request.readableHighWaterMark

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

Request.readableLength

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:91

___

### readableObjectMode

• `Readonly` **readableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Readable` stream.

**`Since`**

v12.3.0

#### Inherited from

Request.readableObjectMode

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:96

___

### retrieveConfig

• **retrieveConfig**: [`FindConfig`](internal-8.internal.FindConfig.md)<`unknown`\>

#### Inherited from

Request.retrieveConfig

#### Defined in

packages/medusa/dist/types/global.d.ts:17

___

### scope

• **scope**: [`MedusaContainer`](../modules/internal-8.md#medusacontainer-1)

#### Overrides

Request.scope

#### Defined in

packages/medusa/dist/types/routing.d.ts:9

___

### socket

• **socket**: [`Socket`](../classes/internal-8.Socket.md)

The `net.Socket` object associated with the connection.

With HTTPS support, use `request.socket.getPeerCertificate()` to obtain the
client's authentication details.

This property is guaranteed to be an instance of the `net.Socket` class,
a subclass of `stream.Duplex`, unless the user specified a socket
type other than `net.Socket` or internally nulled.

**`Since`**

v0.3.0

#### Inherited from

Request.socket

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1067

___

### statusCode

• `Optional` **statusCode**: `number`

**Only valid for response obtained from ClientRequest.**

The 3-digit HTTP response status code. E.G. `404`.

**`Since`**

v0.1.1

#### Inherited from

Request.statusCode

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1212

___

### statusMessage

• `Optional` **statusMessage**: `string`

**Only valid for response obtained from ClientRequest.**

The HTTP response status message (reason phrase). E.G. `OK` or `Internal Server Error`.

**`Since`**

v0.11.10

#### Inherited from

Request.statusMessage

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1219

___

### trailers

• **trailers**: [`Dict`](internal-8.Dict.md)<`string`\>

The request/response trailers object. Only populated at the `'end'` event.

**`Since`**

v0.3.0

#### Inherited from

Request.trailers

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1140

___

### trailersDistinct

• **trailersDistinct**: [`Dict`](internal-8.Dict.md)<`string`[]\>

Similar to `message.trailers`, but there is no join logic and the values are
always arrays of strings, even for headers received just once.
Only populated at the `'end'` event.

**`Since`**

v18.3.0, v16.17.0

#### Inherited from

Request.trailersDistinct

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1147

___

### user

• `Optional` **user**: `Object`

#### Overrides

Request.user

#### Defined in

packages/medusa/dist/types/routing.d.ts:5

___

### validatedBody

• **validatedBody**: `unknown`

#### Inherited from

Request.validatedBody

#### Defined in

packages/medusa/dist/types/global.d.ts:15

___

### validatedQuery

• **validatedQuery**: [`RequestQueryFields`](../modules/internal-8.internal.md#requestqueryfields) & [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

Request.validatedQuery

#### Defined in

packages/medusa/dist/types/global.d.ts:14

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): [`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`any`\>

#### Returns

[`AsyncIterableIterator`](internal-8.AsyncIterableIterator.md)<`any`\>

#### Inherited from

Request.[asyncIterator]

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

#### Inherited from

Request.\_construct

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

#### Inherited from

Request.\_destroy

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

#### Inherited from

Request.\_read

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:114

___

### addListener

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

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

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:419

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:420

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:421

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:422

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:423

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:424

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:425

▸ **addListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.addListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:426

___

### destroy

▸ **destroy**(`error?`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

Calls `destroy()` on the socket that received the `IncomingMessage`. If `error`is provided, an `'error'` event is emitted on the socket and `error` is passed
as an argument to any listeners on the event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | [`Error`](../modules/internal-8.md#error) |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.3.0

#### Inherited from

Request.destroy

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1225

___

### emit

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

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

#### Inherited from

Request.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:428

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

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

#### Inherited from

Request.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:430

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:431

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:432

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

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

#### Inherited from

Request.emit

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

#### Inherited from

Request.eventNames

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

Request.getMaxListeners

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

Request.isPaused

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

#### Inherited from

Request.listenerCount

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

Request.listeners

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:580

___

### off

▸ **off**(`eventName`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

Alias for `emitter.removeListener()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v10.0.0

#### Inherited from

Request.off

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:540

___

### on

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:435

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:436

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:437

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:438

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:439

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:440

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:441

▸ **on**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.on

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:442

___

### once

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:443

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:444

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:445

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:446

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:447

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:448

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:449

▸ **once**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.once

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:450

___

### pause

▸ **pause**(): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

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

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.9.4

#### Inherited from

Request.pause

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:238

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

Request.pipe

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:26

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:451

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:452

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:453

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:454

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:455

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:456

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:457

▸ **prependListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:458

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:459

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:460

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:461

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:462

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:463

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:464

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:465

▸ **prependOnceListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.prependOnceListener

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

#### Inherited from

Request.push

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

#### Inherited from

Request.rawListeners

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

Calling [read](internal-8.internal.MedusaRequest.md#read) after the `'end'` event has
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

Request.read

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:191

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

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

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.1.26

#### Inherited from

Request.removeAllListeners

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:551

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:467

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:468

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:469

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: [`Error`](../modules/internal-8.md#error)) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:470

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:471

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:472

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:473

▸ **removeListener**(`event`, `listener`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

#### Inherited from

Request.removeListener

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:474

___

### resume

▸ **resume**(): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

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

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.9.4

#### Inherited from

Request.resume

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:257

___

### setEncoding

▸ **setEncoding**(`encoding`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

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

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.9.4

#### Inherited from

Request.setEncoding

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:216

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

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

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.3.5

#### Inherited from

Request.setMaxListeners

#### Defined in

packages/medusa-js/node_modules/@types/node/events.d.ts:561

___

### setTimeout

▸ **setTimeout**(`msecs`, `callback?`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

Calls `message.socket.setTimeout(msecs, callback)`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msecs` | `number` |
| `callback?` | () => `void` |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.5.9

#### Inherited from

Request.setTimeout

#### Defined in

packages/medusa-js/node_modules/@types/node/http.d.ts:1158

___

### unpipe

▸ **unpipe**(`destination?`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

The `readable.unpipe()` method detaches a `Writable` stream previously attached
using the [pipe](internal-8.internal.MedusaRequest.md#pipe) method.

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
| `destination?` | [`WritableStream`](internal-8.WritableStream.md) | Optional specific stream to unpipe |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.9.4

#### Inherited from

Request.unpipe

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

Unlike [push](internal-8.internal.MedusaRequest.md#push), `stream.unshift(chunk)` will not
end the reading process by resetting the internal reading state of the stream.
This can cause unexpected results if `readable.unshift()` is called during a
read (i.e. from within a [_read](internal-8.internal.MedusaRequest.md#_read) implementation on a
custom stream). Following the call to `readable.unshift()` with an immediate [push](internal-8.internal.MedusaRequest.md#push) will reset the reading state appropriately,
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

Request.unshift

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:367

___

### wrap

▸ **wrap**(`stream`): [`MedusaRequest`](internal-8.internal.MedusaRequest.md)

Prior to Node.js 0.10, streams did not implement the entire `node:stream`module API as it is currently defined. (See `Compatibility` for more
information.)

When using an older Node.js library that emits `'data'` events and has a [pause](internal-8.internal.MedusaRequest.md#pause) method that is advisory only, the`readable.wrap()` method can be used to create a `Readable`
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
| `stream` | [`ReadableStream`](internal-8.ReadableStream.md) | An "old style" readable stream |

#### Returns

[`MedusaRequest`](internal-8.internal.MedusaRequest.md)

**`Since`**

v0.9.4

#### Inherited from

Request.wrap

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:393
