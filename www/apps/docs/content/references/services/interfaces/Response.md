# Response

This object is created internally by an HTTP server, not by the user. It is
passed as the second parameter to the `'request'` event.

**Since**

v0.1.17

## Type parameters

| Name | Type |
| :------ | :------ |
| `ResBody` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |
| `StatusCode` | `number` |

## Hierarchy

- [`ServerResponse`](../classes/ServerResponse.md)

- [`Response`](Response-1.md)

  ↳ **`Response`**

## Properties

### app

 **app**: [`Application`](Application.md)<Record<`string`, `any`\>\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1046

___

### charset

 **charset**: `string`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1035

___

### chunkedEncoding

 **chunkedEncoding**: `boolean`

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[chunkedEncoding](../classes/ServerResponse.md#chunkedencoding)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:547

___

### closed

 `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**Since**

v18.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[closed](../classes/ServerResponse.md#closed)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:704

___

### connection

 `Readonly` **connection**: ``null`` \| [`Socket`](../classes/Socket.md)

Alias of `outgoingMessage.socket`.

**Since**

v0.3.0

**Deprecated**

Since v15.12.0,v14.17.1 - Use `socket` instead.

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[connection](../classes/ServerResponse.md#connection)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:565

___

### destroyed

 **destroyed**: `boolean`

Is `true` after `writable.destroy()` has been called.

**Since**

v8.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[destroyed](../classes/ServerResponse.md#destroyed)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:699

___

### errored

 `Readonly` **errored**: ``null`` \| `Error`

Returns error if the stream has been destroyed with an error.

**Since**

v18.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[errored](../classes/ServerResponse.md#errored)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:709

___

### finished

 **finished**: `boolean`

**Deprecated**

Use `writableEnded` instead.

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[finished](../classes/ServerResponse.md#finished)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:554

___

### headersSent

 **headersSent**: `boolean`

Read-only. `true` if the headers were sent, otherwise `false`.

**Since**

v0.9.3

#### Overrides

[ServerResponse](../classes/ServerResponse.md).[headersSent](../classes/ServerResponse.md#headerssent)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:941

___

### json

 **json**: [`Send`](../index.md#send)<`ResBody`, [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>\>

Send JSON response.

Examples:

    res.json(null);
    res.json({ user: 'tj' });
    res.status(500).json('oh noes!');
    res.status(404).json('I dont have that');

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:744

___

### jsonp

 **jsonp**: [`Send`](../index.md#send)<`ResBody`, [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>\>

Send JSON response with JSONP callback support.

Examples:

    res.jsonp(null);
    res.jsonp({ user: 'tj' });
    res.status(500).jsonp('oh noes!');
    res.status(404).jsonp('I dont have that');

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:756

___

### locals

 **locals**: `LocalsObj` & [`Locals`](Locals.md)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1033

___

### req

 **req**: [`Request`](Request-1.md)<[`ParamsDictionary`](ParamsDictionary.md), `any`, `any`, [`ParsedQs`](ParsedQs.md), Record<`string`, `any`\>\>

After middleware.init executed, Response will contain req property
See: express/lib/middleware/init.js

#### Overrides

[ServerResponse](../classes/ServerResponse.md).[req](../classes/ServerResponse.md#req)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1063

___

### send

 **send**: [`Send`](../index.md#send)<`ResBody`, [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>\>

Send a response.

Examples:

    res.send(new Buffer('wahoo'));
    res.send({ some: 'json' });
    res.send('<p>some html</p>');
    res.status(404).send('Sorry, cant find that');

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:732

___

### sendDate

 **sendDate**: `boolean`

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[sendDate](../classes/ServerResponse.md#senddate)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:550

___

### shouldKeepAlive

 **shouldKeepAlive**: `boolean`

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[shouldKeepAlive](../classes/ServerResponse.md#shouldkeepalive)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:548

___

### socket

 `Readonly` **socket**: ``null`` \| [`Socket`](../classes/Socket.md)

Reference to the underlying socket. Usually, users will not want to access
this property.

After calling `outgoingMessage.end()`, this property will be nulled.

**Since**

v0.3.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[socket](../classes/ServerResponse.md#socket)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:573

___

### statusCode

 **statusCode**: `number`

When using implicit headers (not calling `response.writeHead()` explicitly),
this property controls the status code that will be sent to the client when
the headers get flushed.

```js
response.statusCode = 404;
```

After response header was sent to the client, this property indicates the
status code which was sent out.

**Since**

v0.4.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[statusCode](../classes/ServerResponse.md#statuscode)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:716

___

### statusMessage

 **statusMessage**: `string`

When using implicit headers (not calling `response.writeHead()` explicitly),
this property controls the status message that will be sent to the client when
the headers get flushed. If this is left as `undefined` then the standard
message for the status code will be used.

```js
response.statusMessage = 'Not found';
```

After response header was sent to the client, this property indicates the
status message which was sent out.

**Since**

v0.11.8

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[statusMessage](../classes/ServerResponse.md#statusmessage)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:731

___

### strictContentLength

 **strictContentLength**: `boolean`

If set to `true`, Node.js will check whether the `Content-Length`header value and the size of the body, in bytes, are equal.
Mismatching the `Content-Length` header value will result
in an `Error` being thrown, identified by `code:``'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`.

**Since**

v18.10.0, v16.18.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[strictContentLength](../classes/ServerResponse.md#strictcontentlength)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:738

___

### useChunkedEncodingByDefault

 **useChunkedEncodingByDefault**: `boolean`

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[useChunkedEncodingByDefault](../classes/ServerResponse.md#usechunkedencodingbydefault)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:549

___

### writable

 `Readonly` **writable**: `boolean`

Is `true` if it is safe to call `writable.write()`, which means
the stream has not been destroyed, errored, or ended.

**Since**

v11.4.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writable](../classes/ServerResponse.md#writable)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:660

___

### writableCorked

 `Readonly` **writableCorked**: `number`

Number of times `writable.uncork()` needs to be
called in order to fully uncork the stream.

**Since**

v13.2.0, v12.16.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableCorked](../classes/ServerResponse.md#writablecorked)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:694

___

### writableEnded

 `Readonly` **writableEnded**: `boolean`

Is `true` after `writable.end()` has been called. This property
does not indicate whether the data has been flushed, for this use `writable.writableFinished` instead.

**Since**

v12.9.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableEnded](../classes/ServerResponse.md#writableended)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:666

___

### writableFinished

 `Readonly` **writableFinished**: `boolean`

Is set to `true` immediately before the `'finish'` event is emitted.

**Since**

v12.6.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableFinished](../classes/ServerResponse.md#writablefinished)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:671

___

### writableHighWaterMark

 `Readonly` **writableHighWaterMark**: `number`

Return the value of `highWaterMark` passed when creating this `Writable`.

**Since**

v9.3.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableHighWaterMark](../classes/ServerResponse.md#writablehighwatermark)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:676

___

### writableLength

 `Readonly` **writableLength**: `number`

This property contains the number of bytes (or objects) in the queue
ready to be written. The value provides introspection data regarding
the status of the `highWaterMark`.

**Since**

v9.4.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableLength](../classes/ServerResponse.md#writablelength)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:683

___

### writableNeedDrain

 `Readonly` **writableNeedDrain**: `boolean`

Is `true` if the stream's buffer has been full and stream will emit `'drain'`.

**Since**

v15.2.0, v14.17.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableNeedDrain](../classes/ServerResponse.md#writableneeddrain)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:714

___

### writableObjectMode

 `Readonly` **writableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Writable` stream.

**Since**

v12.3.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writableObjectMode](../classes/ServerResponse.md#writableobjectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:688

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

[ServerResponse](../classes/ServerResponse.md).[[captureRejectionSymbol]](../classes/ServerResponse.md#[capturerejectionsymbol])

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

[ServerResponse](../classes/ServerResponse.md).[_construct](../classes/ServerResponse.md#_construct)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:724

___

### \_destroy

**_destroy**(`error`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `error` | ``null`` \| `Error` |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[_destroy](../classes/ServerResponse.md#_destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:725

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

[ServerResponse](../classes/ServerResponse.md).[_final](../classes/ServerResponse.md#_final)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:726

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

[ServerResponse](../classes/ServerResponse.md).[_write](../classes/ServerResponse.md#_write)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:716

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

[ServerResponse](../classes/ServerResponse.md).[_writev](../classes/ServerResponse.md#_writev)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:717

___

### addListener

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Event emitter
The defined events on documents including:
1. close
2. drain
3. error
4. finish
5. pipe
6. unpipe

#### Parameters

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:892

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:893

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:894

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:895

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:896

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:897

**addListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addListener](../classes/ServerResponse.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:898

___

### addTrailers

**addTrailers**(`headers`): `void`

Adds HTTP trailers (headers but at the end of the message) to the message.

Trailers will **only** be emitted if the message is chunked encoded. If not,
the trailers will be silently discarded.

HTTP requires the `Trailer` header to be sent to emit trailers,
with a list of header field names in its value, e.g.

```js
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```

Attempting to set a header field name or value that contains invalid characters
will result in a `TypeError` being thrown.

#### Parameters

| Name |
| :------ |
| `headers` | [`OutgoingHttpHeaders`](OutgoingHttpHeaders.md) \| readonly [`string`, `string`][] |

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.3.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[addTrailers](../classes/ServerResponse.md#addtrailers)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:682

___

### append

**append**(`field`, `value?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Appends the specified value to the HTTP response header field.
If the header is not already set, it creates the header with the specified value.
The value parameter can be a string or an array.

Note: calling res.set() after res.append() will reset the previously-set header value.

#### Parameters

| Name |
| :------ |
| `field` | `string` |
| `value?` | `string` \| `string`[] |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

4.11.0

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1057

___

### appendHeader

**appendHeader**(`name`, `value`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Append a single header value for the header object.

If the value is an array, this is equivalent of calling this method multiple
times.

If there were no previous value for the header, this is equivalent of calling `outgoingMessage.setHeader(name, value)`.

Depending of the value of `options.uniqueHeaders` when the client request or the
server were created, this will end up in the header being sent multiple times or
a single time with values joined using `; `.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | Header name |
| `value` | `string` \| readonly `string`[] | Header value |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v18.3.0, v16.17.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[appendHeader](../classes/ServerResponse.md#appendheader)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:605

___

### assignSocket

**assignSocket**(`socket`): `void`

#### Parameters

| Name |
| :------ |
| `socket` | [`Socket`](../classes/Socket.md) |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[assignSocket](../classes/ServerResponse.md#assignsocket)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:740

___

### attachment

**attachment**(`filename?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set _Content-Disposition_ header to _attachment_ with optional `filename`.

#### Parameters

| Name |
| :------ |
| `filename?` | `string` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:920

___

### clearCookie

**clearCookie**(`name`, `options?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Clear cookie `name`.

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `options?` | [`CookieOptions`](CookieOptions.md) |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:947

___

### compose

**compose**<`T`\>(`stream`, `options?`): `T`

| Name | Type |
| :------ | :------ |
| `T` | [`ReadableStream`](ReadableStream.md) |

#### Parameters

| Name |
| :------ |
| `stream` | [`ComposeFnParam`](../index.md#composefnparam) \| `T` \| [`Iterable`](Iterable.md)<`T`\> \| [`AsyncIterable`](AsyncIterable.md)<`T`\> |
| `options?` | `object` |
| `options.signal` | `AbortSignal` |

#### Returns

`T`

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[compose](../classes/ServerResponse.md#compose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:35

___

### contentType

**contentType**(`type`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set _Content-Type_ response header with `type` through `mime.lookup()`
when it does not contain "/", or set the Content-Type to `type` otherwise.

Examples:

    res.type('.html');
    res.type('html');
    res.type('json');
    res.type('application/json');
    res.type('png');

#### Parameters

| Name |
| :------ |
| `type` | `string` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:847

___

### cookie

**cookie**(`name`, `val`, `options`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set cookie `name` to `val`, with the given `options`.

Options:

   - `maxAge`   max-age in milliseconds, converted to `expires`
   - `signed`   sign the cookie
   - `path`     defaults to "/"

Examples:

   // "Remember Me" for 15 minutes
   res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

   // save as above
   res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `val` | `string` |
| `options` | [`CookieOptions`](CookieOptions.md) |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:966

**cookie**(`name`, `val`, `options`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `val` | `any` |
| `options` | [`CookieOptions`](CookieOptions.md) |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:967

**cookie**(`name`, `val`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `val` | `any` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:968

___

### cork

**cork**(): `void`

The `writable.cork()` method forces all written data to be buffered in memory.
The buffered data will be flushed when either the [uncork](Response.md#uncork) or [end](Response.md#end) methods are called.

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

[ServerResponse](../classes/ServerResponse.md).[cork](../classes/ServerResponse.md#cork)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:830

___

### destroy

**destroy**(`error?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Destroy the stream. Optionally emit an `'error'` event, and emit a `'close'`event (unless `emitClose` is set to `false`). After this call, the writable
stream has ended and subsequent calls to `write()` or `end()` will result in
an `ERR_STREAM_DESTROYED` error.
This is a destructive and immediate way to destroy a stream. Previous calls to`write()` may not have drained, and may trigger an `ERR_STREAM_DESTROYED` error.
Use `end()` instead of destroy if data should flush before close, or wait for
the `'drain'` event before destroying the stream.

Once `destroy()` has been called any further calls will be a no-op and no
further errors except from `_destroy()` may be emitted as `'error'`.

Implementors should not override this method,
but instead implement `writable._destroy()`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `error?` | `Error` | Optional, an error to emit with `'error'` event. |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v8.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[destroy](../classes/ServerResponse.md#destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:881

___

### detachSocket

**detachSocket**(`socket`): `void`

#### Parameters

| Name |
| :------ |
| `socket` | [`Socket`](../classes/Socket.md) |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[detachSocket](../classes/ServerResponse.md#detachsocket)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:741

___

### download

**download**(`path`, `fn?`): `void`

Transfer the file at the given `path` as an attachment.

Optionally providing an alternate attachment `filename`,
and optional callback `fn(err)`. The callback is invoked
when the data transfer is complete, or when an error has
ocurred. Be sure to check `res.headersSent` if you plan to respond.

The optional options argument passes through to the underlying
res.sendFile() call, and takes the exact same parameters.

This method uses `res.sendfile()`.

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `fn?` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:831

**download**(`path`, `filename`, `fn?`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `filename` | `string` |
| `fn?` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:832

**download**(`path`, `filename`, `options`, `fn?`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `filename` | `string` |
| `options` | [`DownloadOptions`](DownloadOptions.md) |
| `fn?` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:833

___

### emit

**emit**(`event`): `boolean`

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
| `event` | ``"close"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v0.1.26

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:899

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:900

**emit**(`event`, `err`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `err` | `Error` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:901

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:902

**emit**(`event`, `src`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `src` | [`Readable`](../classes/Readable.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:903

**emit**(`event`, `src`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `src` | [`Readable`](../classes/Readable.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:904

**emit**(`event`, `...args`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[emit](../classes/ServerResponse.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:905

___

### end

**end**(`cb?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Calling the `writable.end()` method signals that no more data will be written
to the `Writable`. The optional `chunk` and `encoding` arguments allow one
final additional chunk of data to be written immediately before closing the
stream.

Calling the [write](Response.md#write) method after calling [end](Response.md#end) will raise an error.

```js
// Write 'hello, ' and then end with 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Writing more now is not allowed!
```

#### Parameters

| Name |
| :------ |
| `cb?` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.9.4

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[end](../classes/ServerResponse.md#end)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:813

**end**(`chunk`, `cb?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `chunk` | `any` |
| `cb?` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[end](../classes/ServerResponse.md#end)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:814

**end**(`chunk`, `encoding`, `cb?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) |
| `cb?` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[end](../classes/ServerResponse.md#end)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:815

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

[ServerResponse](../classes/ServerResponse.md).[eventNames](../classes/ServerResponse.md#eventnames)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:835

___

### flushHeaders

**flushHeaders**(): `void`

Flushes the message headers.

For efficiency reason, Node.js normally buffers the message headers
until `outgoingMessage.end()` is called or the first chunk of message data
is written. It then tries to pack the headers and data into a single TCP
packet.

It is usually desired (it saves a TCP round-trip), but not when the first
data is not sent until possibly much later. `outgoingMessage.flushHeaders()`bypasses the optimization and kickstarts the message.

#### Returns

`void`

-`void`: (optional) 

**Since**

v1.6.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[flushHeaders](../classes/ServerResponse.md#flushheaders)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:695

___

### format

**format**(`obj`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Respond to the Acceptable formats using an `obj`
of mime-type callbacks.

This method uses `req.accepted`, an array of
acceptable types ordered by their quality values.
When "Accept" is not present the _first_ callback
is invoked, otherwise the first match is used. When
no match is performed the server responds with
406 "Not Acceptable".

Content-Type is set for you, however if you choose
you may alter this within the callback using `res.type()`
or `res.set('Content-Type', ...)`.

   res.format({
     'text/plain': function(){
       res.send('hey');
     },

     'text/html': function(){
       res.send('<p>hey</p>');
     },

     'appliation/json': function(){
       res.send({ message: 'hey' });
     }
   });

In addition to canonicalized MIME types you may
also use extnames mapped to these types:

   res.format({
     text: function(){
       res.send('hey');
     },

     html: function(){
       res.send('<p>hey</p>');
     },

     json: function(){
       res.send({ message: 'hey' });
     }
   });

By default Express passes an `Error`
with a `.status` of 406 to `next(err)`
if a match is not made. If you provide
a `.default` callback it will be invoked
instead.

#### Parameters

| Name |
| :------ |
| `obj` | `any` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:915

___

### get

**get**(`field`): `undefined` \| `string`

Get value for header `field`.

#### Parameters

| Name |
| :------ |
| `field` | `string` |

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:944

___

### getHeader

**getHeader**(`name`): `undefined` \| `string` \| `number` \| `string`[]

Gets the value of the HTTP header with the given name. If that header is not
set, the returned value will be `undefined`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | Name of header |

#### Returns

`undefined` \| `string` \| `number` \| `string`[]

-`undefined \| string \| number \| string[]`: (optional) 

**Since**

v0.4.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[getHeader](../classes/ServerResponse.md#getheader)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:612

___

### getHeaderNames

**getHeaderNames**(): `string`[]

Returns an array containing the unique names of the current outgoing headers.
All names are lowercase.

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

**Since**

v7.7.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[getHeaderNames](../classes/ServerResponse.md#getheadernames)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:640

___

### getHeaders

**getHeaders**(): [`OutgoingHttpHeaders`](OutgoingHttpHeaders.md)

Returns a shallow copy of the current outgoing headers. Since a shallow
copy is used, array values may be mutated without additional calls to
various header-related HTTP module methods. The keys of the returned
object are the header names and the values are the respective header
values. All header names are lowercase.

The object returned by the `outgoingMessage.getHeaders()` method does
not prototypically inherit from the JavaScript `Object`. This means that
typical `Object` methods such as `obj.toString()`, `obj.hasOwnProperty()`,
and others are not defined and will not work.

```js
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```

#### Returns

[`OutgoingHttpHeaders`](OutgoingHttpHeaders.md)

-`OutgoingHttpHeaders`: 

**Since**

v7.7.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[getHeaders](../classes/ServerResponse.md#getheaders)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:634

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

[ServerResponse](../classes/ServerResponse.md).[getMaxListeners](../classes/ServerResponse.md#getmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:687

___

### hasHeader

**hasHeader**(`name`): `boolean`

Returns `true` if the header identified by `name` is currently set in the
outgoing headers. The header name is case-insensitive.

```js
const hasContentType = outgoingMessage.hasHeader('content-type');
```

#### Parameters

| Name |
| :------ |
| `name` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v7.7.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[hasHeader](../classes/ServerResponse.md#hasheader)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:650

___

### header

**header**(`field`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `field` | `any` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:937

**header**(`field`, `value?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `field` | `string` |
| `value?` | `string` \| `string`[] |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:938

___

### links

**links**(`links`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set Link header field with the given `links`.

Examples:

   res.links({
     next: 'http://api.example.com/users?page=2',
     last: 'http://api.example.com/users?page=5'
   });

#### Parameters

| Name |
| :------ |
| `links` | `any` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:720

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

[ServerResponse](../classes/ServerResponse.md).[listenerCount](../classes/ServerResponse.md#listenercount)

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

[ServerResponse](../classes/ServerResponse.md).[listeners](../classes/ServerResponse.md#listeners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:700

___

### location

**location**(`url`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set the location header to `url`.

The given `url` can also be the name of a mapped url, for
example by default express supports "back" which redirects
to the _Referrer_ or _Referer_ headers or "/".

Examples:

   res.location('/foo/bar').;
   res.location('http://example.com');
   res.location('../login'); // /blog/post/1 -> /blog/login

Mounting:

  When an application is mounted and `res.location()`
  is given a path that does _not_ lead with "/" it becomes
  relative to the mount-point. For example if the application
  is mounted at "/blog", the following would become "/blog/login".

     res.location('login');

  While the leading slash would result in a location of "/login":

     res.location('/login');

#### Parameters

| Name |
| :------ |
| `url` | `string` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:996

___

### off

**off**(`eventName`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Alias for `emitter.removeListener()`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v10.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[off](../classes/ServerResponse.md#off)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:660

___

### on

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.1.101

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:906

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:907

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:908

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:909

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:910

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:911

**on**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[on](../classes/ServerResponse.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:912

___

### once

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.3.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:913

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:914

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:915

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:916

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:917

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:918

**once**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[once](../classes/ServerResponse.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:919

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

[ServerResponse](../classes/ServerResponse.md).[pipe](../classes/ServerResponse.md#pipe)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:29

___

### prependListener

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v6.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:920

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:921

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:922

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:923

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:924

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:925

**prependListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependListener](../classes/ServerResponse.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:926

___

### prependOnceListener

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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
| `event` | ``"close"`` | The name of the event. |
| `listener` | () => `void` | The callback function |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v6.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:927

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:928

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:929

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:930

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:931

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:932

**prependOnceListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[prependOnceListener](../classes/ServerResponse.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:933

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

[ServerResponse](../classes/ServerResponse.md).[rawListeners](../classes/ServerResponse.md#rawlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:731

___

### redirect

**redirect**(`url`): `void`

Redirect to the given `url` with optional response `status`
defaulting to 302.

The resulting `url` is determined by `res.location()`, so
it will play nicely with mounted apps, relative paths,
`"back"` etc.

Examples:

   res.redirect('back');
   res.redirect('/foo/bar');
   res.redirect('http://example.com');
   res.redirect(301, 'http://example.com');
   res.redirect('http://example.com', 301);
   res.redirect('../login'); // /blog/post/1 -> /blog/login

#### Parameters

| Name |
| :------ |
| `url` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1015

**redirect**(`status`, `url`): `void`

#### Parameters

| Name |
| :------ |
| `status` | `number` |
| `url` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1016

**redirect**(`url`, `status`): `void`

#### Parameters

| Name |
| :------ |
| `url` | `string` |
| `status` | `number` |

#### Returns

`void`

-`void`: (optional) 

**Deprecated**

use res.redirect(status, url) instead

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1018

___

### removeAllListeners

**removeAllListeners**(`event?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.1.26

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeAllListeners](../classes/ServerResponse.md#removealllisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:671

___

### removeHeader

**removeHeader**(`name`): `void`

Removes a header that is queued for implicit sending.

```js
outgoingMessage.removeHeader('Content-Encoding');
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | Header name |

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.4.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeHeader](../classes/ServerResponse.md#removeheader)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:660

___

### removeListener

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.1.26

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:934

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"drain"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:935

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:936

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:937

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:938

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"unpipe"`` |
| `listener` | (`src`: [`Readable`](../classes/Readable.md)) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:939

**removeListener**(`event`, `listener`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[removeListener](../classes/ServerResponse.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:940

___

### render

**render**(`view`, `options?`, `callback?`): `void`

Render `view` with the given `options` and optional callback `fn`.
When a callback function is given a response will _not_ be made
automatically, otherwise a response of _200_ and _text/html_ is given.

Options:

 - `cache`     boolean hinting to the engine it should cache
 - `filename`  filename of the view being rendered

#### Parameters

| Name |
| :------ |
| `view` | `string` |
| `options?` | `object` |
| `callback?` | (`err`: `Error`, `html`: `string`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1030

**render**(`view`, `callback?`): `void`

#### Parameters

| Name |
| :------ |
| `view` | `string` |
| `callback?` | (`err`: `Error`, `html`: `string`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1031

___

### sendFile

**sendFile**(`path`, `fn?`): `void`

Transfer the file at the given `path`.

Automatically sets the _Content-Type_ response header field.
The callback `fn(err)` is invoked when the transfer is complete
or when an error occurs. Be sure to check `res.headersSent`
if you wish to attempt responding, as the header and some data
may have already been transferred.

Options:

  - `maxAge`   defaulting to 0 (can be string converted by `ms`)
  - `root`     root directory for relative filenames
  - `headers`  object of headers to serve with file
  - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them

Other options are passed along to `send`.

Examples:

 The following example illustrates how `res.sendFile()` may
 be used as an alternative for the `static()` middleware for
 dynamic situations. The code backing `res.sendFile()` is actually
 the same code, so HTTP cache support etc is identical.

    app.get('/user/:uid/photos/:file', function(req, res){
      var uid = req.params.uid
        , file = req.params.file;

      req.user.mayViewFilesFrom(uid, function(yes){
        if (yes) {
          res.sendFile('/uploads/' + uid + '/' + file);
        } else {
          res.send(403, 'Sorry! you cant see that.');
        }
      });
    });

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `fn?` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

**Api**

public

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:798

**sendFile**(`path`, `options`, `fn?`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `options` | [`SendFileOptions`](SendFileOptions.md) |
| `fn?` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:799

___

### sendStatus

**sendStatus**(`code`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set the response HTTP status code to `statusCode` and send its string representation as the response body.

#### Parameters

| Name |
| :------ |
| `code` | `StatusCode` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Link**

http://expressjs.com/4x/api.html#res.sendStatus

Examples:

   res.sendStatus(200); // equivalent to res.status(200).send('OK')
   res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
   res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
   res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:708

___

### sendfile

**sendfile**(`path`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |

#### Returns

`void`

-`void`: (optional) 

**Deprecated**

Use sendFile instead.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:804

**sendfile**(`path`, `options`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `options` | [`SendFileOptions`](SendFileOptions.md) |

#### Returns

`void`

-`void`: (optional) 

**Deprecated**

Use sendFile instead.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:808

**sendfile**(`path`, `fn`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `fn` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

**Deprecated**

Use sendFile instead.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:812

**sendfile**(`path`, `options`, `fn`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `options` | [`SendFileOptions`](SendFileOptions.md) |
| `fn` | [`Errback`](../index.md#errback) |

#### Returns

`void`

-`void`: (optional) 

**Deprecated**

Use sendFile instead.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:816

___

### set

**set**(`field`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set header `field` to `val`, or pass
an object of header fields.

Examples:

   res.set('Foo', ['bar', 'baz']);
   res.set('Accept', 'application/json');
   res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });

Aliased as `res.header()`.

#### Parameters

| Name |
| :------ |
| `field` | `any` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:934

**set**(`field`, `value?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `field` | `string` |
| `value?` | `string` \| `string`[] |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:935

___

### setDefaultEncoding

**setDefaultEncoding**(`encoding`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

The `writable.setDefaultEncoding()` method sets the default `encoding` for a `Writable` stream.

#### Parameters

| Name | Description |
| :------ | :------ |
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) | The new default encoding |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.11.15

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[setDefaultEncoding](../classes/ServerResponse.md#setdefaultencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:790

___

### setHeader

**setHeader**(`name`, `value`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Sets a single header value. If the header already exists in the to-be-sent
headers, its value will be replaced. Use an array of strings to send multiple
headers with the same name.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | Header name |
| `value` | `string` \| `number` \| readonly `string`[] | Header value |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.4.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[setHeader](../classes/ServerResponse.md#setheader)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:589

___

### setMaxListeners

**setMaxListeners**(`n`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

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

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.3.5

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[setMaxListeners](../classes/ServerResponse.md#setmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:681

___

### setTimeout

**setTimeout**(`msecs`, `callback?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Once a socket is associated with the message and is connected,`socket.setTimeout()` will be called with `msecs` as the first parameter.

#### Parameters

| Name | Description |
| :------ | :------ |
| `msecs` | `number` |
| `callback?` | () => `void` | Optional function to be called when a timeout occurs. Same as binding to the `timeout` event. |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.9.12

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[setTimeout](../classes/ServerResponse.md#settimeout)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:580

___

### status

**status**(`code`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set status `code`.

#### Parameters

| Name |
| :------ |
| `code` | `StatusCode` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:695

___

### type

**type**(`type`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Set _Content-Type_ response header with `type` through `mime.lookup()`
when it does not contain "/", or set the Content-Type to `type` otherwise.

Examples:

    res.type('.html');
    res.type('html');
    res.type('json');
    res.type('application/json');
    res.type('png');

#### Parameters

| Name |
| :------ |
| `type` | `string` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:861

___

### uncork

**uncork**(): `void`

The `writable.uncork()` method flushes all data buffered since [cork](Response.md#cork) was called.

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

[ServerResponse](../classes/ServerResponse.md).[uncork](../classes/ServerResponse.md#uncork)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:864

___

### vary

**vary**(`field`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Adds the field to the Vary response header, if it is not there already.
Examples:

    res.vary('User-Agent').render('docs');

#### Parameters

| Name |
| :------ |
| `field` | `string` |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1044

___

### write

**write**(`chunk`, `callback?`): `boolean`

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
recommended to encapsulate the logic into a `Readable` and use [pipe](Request.md#pipe). However, if calling `write()` is preferred, it is
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

| Name | Description |
| :------ | :------ |
| `chunk` | `any` | Optional data to write. For streams not operating in object mode, `chunk` must be a string, `Buffer` or `Uint8Array`. For object mode streams, `chunk` may be any JavaScript value other than `null`. |
| `callback?` | (`error`: `undefined` \| ``null`` \| `Error`) => `void` | Callback for when this chunk of data is flushed. |

#### Returns

`boolean`

-`boolean`: (optional) `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

**Since**

v0.9.4

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[write](../classes/ServerResponse.md#write)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:783

**write**(`chunk`, `encoding`, `callback?`): `boolean`

#### Parameters

| Name |
| :------ |
| `chunk` | `any` |
| `encoding` | [`BufferEncoding`](../index.md#bufferencoding) |
| `callback?` | (`error`: `undefined` \| ``null`` \| `Error`) => `void` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[write](../classes/ServerResponse.md#write)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:784

___

### writeContinue

**writeContinue**(`callback?`): `void`

Sends an HTTP/1.1 100 Continue message to the client, indicating that
the request body should be sent. See the `'checkContinue'` event on`Server`.

#### Parameters

| Name |
| :------ |
| `callback?` | () => `void` |

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.3.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writeContinue](../classes/ServerResponse.md#writecontinue)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:747

___

### writeEarlyHints

**writeEarlyHints**(`hints`, `callback?`): `void`

Sends an HTTP/1.1 103 Early Hints message to the client with a Link header,
indicating that the user agent can preload/preconnect the linked resources.
The `hints` is an object containing the values of headers to be sent with
early hints message. The optional `callback` argument will be called when
the response message has been written.

**Example**

```js
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `hints` | Record<`string`, `string` \| `string`[]\> | An object containing the values of headers |
| `callback?` | () => `void` | Will be called when the response message has been written |

#### Returns

`void`

-`void`: (optional) 

**Since**

v18.11.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writeEarlyHints](../classes/ServerResponse.md#writeearlyhints)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:781

___

### writeHead

**writeHead**(`statusCode`, `statusMessage?`, `headers?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

Sends a response header to the request. The status code is a 3-digit HTTP
status code, like `404`. The last argument, `headers`, are the response headers.
Optionally one can give a human-readable `statusMessage` as the second
argument.

`headers` may be an `Array` where the keys and values are in the same list.
It is _not_ a list of tuples. So, the even-numbered offsets are key values,
and the odd-numbered offsets are the associated values. The array is in the same
format as `request.rawHeaders`.

Returns a reference to the `ServerResponse`, so that calls can be chained.

```js
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```

This method must only be called once on a message and it must
be called before `response.end()` is called.

If `response.write()` or `response.end()` are called before calling
this, the implicit/mutable headers will be calculated and call this function.

When headers have been set with `response.setHeader()`, they will be merged
with any headers passed to `response.writeHead()`, with the headers passed
to `response.writeHead()` given precedence.

If this method is called and `response.setHeader()` has not been called,
it will directly write the supplied header values onto the network channel
without caching internally, and the `response.getHeader()` on the header
will not yield the expected result. If progressive population of headers is
desired with potential future retrieval and modification, use `response.setHeader()` instead.

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

`Content-Length` is read in bytes, not characters. Use `Buffer.byteLength()` to determine the length of the body in bytes. Node.js
will check whether `Content-Length` and the length of the body which has
been transmitted are equal or not.

Attempting to set a header field name or value that contains invalid characters
will result in a \[`Error`\]\[\] being thrown.

#### Parameters

| Name |
| :------ |
| `statusCode` | `number` |
| `statusMessage?` | `string` |
| `headers?` | [`OutgoingHttpHeaders`](OutgoingHttpHeaders.md) \| [`OutgoingHttpHeader`](../index.md#outgoinghttpheader)[] |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

**Since**

v0.1.30

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writeHead](../classes/ServerResponse.md#writehead)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:839

**writeHead**(`statusCode`, `headers?`): [`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

#### Parameters

| Name |
| :------ |
| `statusCode` | `number` |
| `headers?` | [`OutgoingHttpHeaders`](OutgoingHttpHeaders.md) \| [`OutgoingHttpHeader`](../index.md#outgoinghttpheader)[] |

#### Returns

[`Response`](Response.md)<`ResBody`, `LocalsObj`, `StatusCode`\>

-`Response`: 

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writeHead](../classes/ServerResponse.md#writehead)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:844

___

### writeProcessing

**writeProcessing**(): `void`

Sends a HTTP/1.1 102 Processing message to the client, indicating that
the request body should be sent.

#### Returns

`void`

-`void`: (optional) 

**Since**

v10.0.0

#### Inherited from

[ServerResponse](../classes/ServerResponse.md).[writeProcessing](../classes/ServerResponse.md#writeprocessing)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:850
