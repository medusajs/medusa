# Request

**See**

https://expressjs.com/en/api.html#req.params

**Example**

```ts
app.get('/user/:id', (req, res) => res.send(req.params.id)); // implicitly `ParamsDictionary`
    app.get<ParamsArray>(/user/(.*)/, (req, res) => res.send(req.params[0]));
    app.get<ParamsArray>('/user/*', (req, res) => res.send(req.params[0]));
```

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `P` | `object` | For most requests, this should be `ParamsDictionary`, but if you're using this in a route handler for a route that uses a `RegExp` or a wildcard `string` path (e.g. `'/user/*'`), then `req.params` will be an array, in which case you should use `ParamsArray` instead. |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `Locals` | Record<`string`, `any`\> |

## Hierarchy

- [`Request`](Request-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

  ↳ **`Request`**

## Properties

### aborted

 **aborted**: `boolean`

The `message.aborted` property will be `true` if the request has
been aborted.

**Since**

v10.1.0

**Deprecated**

Since v17.0.0,v16.12.0 - Check `message.destroyed` from <a href="stream.html#class-streamreadable" class="type">stream.Readable</a>.

#### Inherited from

[Request](Request-1.md).[aborted](Request-1.md#aborted)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1142

___

### accepted

 **accepted**: [`MediaType`](MediaType.md)[]

Return an array of Accepted media types
ordered from highest quality to lowest.

#### Inherited from

[Request](Request-1.md).[accepted](Request-1.md#accepted)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:514

___

### allowedProperties

 **allowedProperties**: `string`[]

#### Inherited from

[Request](Request-1.md).[allowedProperties](Request-1.md#allowedproperties)

#### Defined in

[packages/medusa/src/types/global.ts:18](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L18)

___

### app

 **app**: [`Application`](Application.md)<Record<`string`, `any`\>\>

#### Inherited from

[Request](Request-1.md).[app](Request-1.md#app)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:657

___

### baseUrl

 **baseUrl**: `string`

#### Inherited from

[Request](Request-1.md).[baseUrl](Request-1.md#baseurl)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:655

___

### body

 **body**: `ReqBody`

#### Inherited from

[Request](Request-1.md).[body](Request-1.md#body)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:636

___

### closed

 `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**Since**

v18.0.0

#### Inherited from

[Request](Request-1.md).[closed](Request-1.md#closed)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:119

___

### complete

 **complete**: `boolean`

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

**Since**

v0.3.0

#### Inherited from

[Request](Request-1.md).[complete](Request-1.md#complete)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1177

___

### connection

 **connection**: [`Socket`](../classes/Socket.md)

Alias for `message.socket`.

**Since**

v0.1.90

**Deprecated**

Since v16.0.0 - Use `socket`.

#### Inherited from

[Request](Request-1.md).[connection](Request-1.md#connection)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1183

___

### cookies

 **cookies**: `any`

#### Inherited from

[Request](Request-1.md).[cookies](Request-1.md#cookies)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:639

___

### destroyed

 **destroyed**: `boolean`

Is `true` after `readable.destroy()` has been called.

**Since**

v8.0.0

#### Inherited from

[Request](Request-1.md).[destroyed](Request-1.md#destroyed)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:114

___

### errored

 `Readonly` **errored**: ``null`` \| `Error`

Returns error if the stream has been destroyed with an error.

**Since**

v18.0.0

#### Inherited from

[Request](Request-1.md).[errored](Request-1.md#errored)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:124

___

### errors

 **errors**: `string`[]

#### Inherited from

[Request](Request-1.md).[errors](Request-1.md#errors)

#### Defined in

[packages/medusa/src/types/global.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L20)

___

### file

 `Optional` **file**: [`File`](File.md)

`Multer.File` object populated by `single()` middleware.

#### Inherited from

[Request](Request-1.md).[file](Request-1.md#file)

#### Defined in

node_modules/@types/multer/index.d.ts:52

___

### files

 `Optional` **files**: { `[fieldname: string]`: [`File`](File.md)[];  } \| [`File`](File.md)[]

Array or dictionary of `Multer.File` object populated by `array()`,
`fields()`, and `any()` middleware.

#### Inherited from

[Request](Request-1.md).[files](Request-1.md#files)

#### Defined in

node_modules/@types/multer/index.d.ts:57

___

### filterableFields

 **filterableFields**: Record<`string`, `unknown`\>

#### Inherited from

[Request](Request-1.md).[filterableFields](Request-1.md#filterablefields)

#### Defined in

[packages/medusa/src/types/global.ts:17](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L17)

___

### fresh

 **fresh**: `boolean`

Check if the request is fresh, aka
Last-Modified and/or the ETag
still match.

#### Inherited from

[Request](Request-1.md).[fresh](Request-1.md#fresh)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:621

___

### headers

 **headers**: [`IncomingHttpHeaders`](IncomingHttpHeaders.md)

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

**Since**

v0.1.5

#### Inherited from

[Request](Request-1.md).[headers](Request-1.md#headers)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1223

___

### headersDistinct

 **headersDistinct**: [`Dict`](Dict.md)<`string`[]\>

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

**Since**

v18.3.0, v16.17.0

#### Inherited from

[Request](Request-1.md).[headersDistinct](Request-1.md#headersdistinct)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1238

___

### host

 **host**: `string`

**Deprecated**

Use hostname instead.

#### Inherited from

[Request](Request-1.md).[host](Request-1.md#host)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:614

___

### hostname

 **hostname**: `string`

Parse the "Host" header field hostname.

#### Inherited from

[Request](Request-1.md).[hostname](Request-1.md#hostname)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:609

___

### httpVersion

 **httpVersion**: `string`

In case of server request, the HTTP version sent by the client. In the case of
client response, the HTTP version of the connected-to server.
Probably either `'1.1'` or `'1.0'`.

Also `message.httpVersionMajor` is the first integer and`message.httpVersionMinor` is the second.

**Since**

v0.1.1

#### Inherited from

[Request](Request-1.md).[httpVersion](Request-1.md#httpversion)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1151

___

### httpVersionMajor

 **httpVersionMajor**: `number`

#### Inherited from

[Request](Request-1.md).[httpVersionMajor](Request-1.md#httpversionmajor)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1152

___

### httpVersionMinor

 **httpVersionMinor**: `number`

#### Inherited from

[Request](Request-1.md).[httpVersionMinor](Request-1.md#httpversionminor)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1153

___

### includes

 `Optional` **includes**: Record<`string`, `boolean`\>

#### Inherited from

[Request](Request-1.md).[includes](Request-1.md#includes)

#### Defined in

[packages/medusa/src/types/global.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L19)

___

### ip

 **ip**: `string`

Return the remote address, or when
"trust proxy" is `true` return
the upstream addr.

#### Inherited from

[Request](Request-1.md).[ip](Request-1.md#ip)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:576

___

### ips

 **ips**: `string`[]

When "trust proxy" is `true`, parse
the "X-Forwarded-For" ip address list.

For example if the value were "client, proxy1, proxy2"
you would receive the array `["client", "proxy1", "proxy2"]`
where "proxy2" is the furthest down-stream.

#### Inherited from

[Request](Request-1.md).[ips](Request-1.md#ips)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:586

___

### listConfig

 **listConfig**: [`FindConfig`](FindConfig.md)<`unknown`\>

#### Inherited from

[Request](Request-1.md).[listConfig](Request-1.md#listconfig)

#### Defined in

[packages/medusa/src/types/global.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L15)

___

### method

 **method**: `string`

**Only valid for request obtained from [Server](../classes/Server.md).**

The request method as a string. Read only. Examples: `'GET'`, `'DELETE'`.

**Since**

v0.1.1

#### Inherited from

[Request](Request-1.md).[method](Request-1.md#method)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:641

___

### next

 `Optional` **next**: [`NextFunction`](NextFunction.md)

#### Inherited from

[Request](Request-1.md).[next](Request-1.md#next)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:664

___

### originalUrl

 **originalUrl**: `string`

#### Inherited from

[Request](Request-1.md).[originalUrl](Request-1.md#originalurl)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:651

___

### params

 **params**: `P`

#### Inherited from

[Request](Request-1.md).[params](Request-1.md#params)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:643

___

### path

 **path**: `string`

Short-hand for `url.parse(req.url).pathname`.

#### Inherited from

[Request](Request-1.md).[path](Request-1.md#path)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:604

___

### protocol

 **protocol**: `string`

Return the protocol string "http" or "https"
when requested with TLS. When the "trust proxy"
setting is enabled the "X-Forwarded-Proto" header
field will be trusted. If you're running behind
a reverse proxy that supplies https for you this
may be enabled.

#### Inherited from

[Request](Request-1.md).[protocol](Request-1.md#protocol)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:562

___

### query

 **query**: `ReqQuery`

#### Inherited from

[Request](Request-1.md).[query](Request-1.md#query)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:645

___

### rawHeaders

 **rawHeaders**: `string`[]

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

**Since**

v0.11.6

#### Inherited from

[Request](Request-1.md).[rawHeaders](Request-1.md#rawheaders)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1263

___

### rawTrailers

 **rawTrailers**: `string`[]

The raw request/response trailer keys and values exactly as they were
received. Only populated at the `'end'` event.

**Since**

v0.11.6

#### Inherited from

[Request](Request-1.md).[rawTrailers](Request-1.md#rawtrailers)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1281

___

### readable

 **readable**: `boolean`

Is `true` if it is safe to call `readable.read()`, which means
the stream has not been destroyed or emitted `'error'` or `'end'`.

**Since**

v11.4.0

#### Inherited from

[Request](Request-1.md).[readable](Request-1.md#readable)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:70

___

### readableAborted

 `Readonly` **readableAborted**: `boolean`

Returns whether the stream was destroyed or errored before emitting `'end'`.

**Since**

v16.8.0

#### Inherited from

[Request](Request-1.md).[readableAborted](Request-1.md#readableaborted)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:64

___

### readableDidRead

 `Readonly` **readableDidRead**: `boolean`

Returns whether `'data'` has been emitted.

**Since**

v16.7.0, v14.18.0

#### Inherited from

[Request](Request-1.md).[readableDidRead](Request-1.md#readabledidread)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:76

___

### readableEncoding

 `Readonly` **readableEncoding**: ``null`` \| [`BufferEncoding`](../types/BufferEncoding.md)

Getter for the property `encoding` of a given `Readable` stream. The `encoding`property can be set using the `readable.setEncoding()` method.

**Since**

v12.7.0

#### Inherited from

[Request](Request-1.md).[readableEncoding](Request-1.md#readableencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:81

___

### readableEnded

 `Readonly` **readableEnded**: `boolean`

Becomes `true` when `'end'` event is emitted.

**Since**

v12.9.0

#### Inherited from

[Request](Request-1.md).[readableEnded](Request-1.md#readableended)

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

[Request](Request-1.md).[readableFlowing](Request-1.md#readableflowing)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:92

___

### readableHighWaterMark

 `Readonly` **readableHighWaterMark**: `number`

Returns the value of `highWaterMark` passed when creating this `Readable`.

**Since**

v9.3.0

#### Inherited from

[Request](Request-1.md).[readableHighWaterMark](Request-1.md#readablehighwatermark)

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

[Request](Request-1.md).[readableLength](Request-1.md#readablelength)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:104

___

### readableObjectMode

 `Readonly` **readableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Readable` stream.

**Since**

v12.3.0

#### Inherited from

[Request](Request-1.md).[readableObjectMode](Request-1.md#readableobjectmode)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:109

___

### res

 `Optional` **res**: [`Response`](Response.md)<`ResBody`, `Locals`, `number`\>

After middleware.init executed, Request will contain res and next properties
See: express/lib/middleware/init.js

#### Inherited from

[Request](Request-1.md).[res](Request-1.md#res)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:663

___

### retrieveConfig

 **retrieveConfig**: [`FindConfig`](FindConfig.md)<`unknown`\>

#### Inherited from

[Request](Request-1.md).[retrieveConfig](Request-1.md#retrieveconfig)

#### Defined in

[packages/medusa/src/types/global.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L16)

___

### route

 **route**: `any`

#### Inherited from

[Request](Request-1.md).[route](Request-1.md#route)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:647

___

### scope

 **scope**: [`MedusaContainer`](../types/MedusaContainer.md)

#### Inherited from

[Request](Request-1.md).[scope](Request-1.md#scope)

#### Defined in

[packages/medusa/src/types/global.ts:12](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L12)

___

### secure

 **secure**: `boolean`

Short-hand for:

   req.protocol == 'https'

#### Inherited from

[Request](Request-1.md).[secure](Request-1.md#secure)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:569

___

### signedCookies

 **signedCookies**: `any`

#### Inherited from

[Request](Request-1.md).[signedCookies](Request-1.md#signedcookies)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:649

___

### socket

 **socket**: [`Socket`](../classes/Socket.md)

The `net.Socket` object associated with the connection.

With HTTPS support, use `request.socket.getPeerCertificate()` to obtain the
client's authentication details.

This property is guaranteed to be an instance of the `net.Socket` class,
a subclass of `stream.Duplex`, unless the user specified a socket
type other than `net.Socket` or internally nulled.

**Since**

v0.3.0

#### Inherited from

[Request](Request-1.md).[socket](Request-1.md#socket)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1195

___

### stale

 **stale**: `boolean`

Check if the request is stale, aka
"Last-Modified" and / or the "ETag" for the
resource has changed.

#### Inherited from

[Request](Request-1.md).[stale](Request-1.md#stale)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:628

___

### statusCode

 `Optional` **statusCode**: `number`

**Only valid for response obtained from ClientRequest.**

The 3-digit HTTP response status code. E.G. `404`.

**Since**

v0.1.1

#### Inherited from

[Request](Request-1.md).[statusCode](Request-1.md#statuscode)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1340

___

### statusMessage

 `Optional` **statusMessage**: `string`

**Only valid for response obtained from ClientRequest.**

The HTTP response status message (reason phrase). E.G. `OK` or `Internal Server Error`.

**Since**

v0.11.10

#### Inherited from

[Request](Request-1.md).[statusMessage](Request-1.md#statusmessage)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1347

___

### subdomains

 **subdomains**: `string`[]

Return subdomains as an array.

Subdomains are the dot-separated parts of the host before the main domain of
the app. By default, the domain of the app is assumed to be the last two
parts of the host. This can be changed by setting "subdomain offset".

For example, if the domain is "tobi.ferrets.example.com":
If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
If "subdomain offset" is 3, req.subdomains is `["tobi"]`.

#### Inherited from

[Request](Request-1.md).[subdomains](Request-1.md#subdomains)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:599

___

### trailers

 **trailers**: [`Dict`](Dict.md)<`string`\>

The request/response trailers object. Only populated at the `'end'` event.

**Since**

v0.3.0

#### Inherited from

[Request](Request-1.md).[trailers](Request-1.md#trailers)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1268

___

### trailersDistinct

 **trailersDistinct**: [`Dict`](Dict.md)<`string`[]\>

Similar to `message.trailers`, but there is no join logic and the values are
always arrays of strings, even for headers received just once.
Only populated at the `'end'` event.

**Since**

v18.3.0, v16.17.0

#### Inherited from

[Request](Request-1.md).[trailersDistinct](Request-1.md#trailersdistinct)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1275

___

### url

 **url**: `string`

**Only valid for request obtained from [Server](../classes/Server.md).**

Request URL string. This contains only the URL that is present in the actual
HTTP request. Take the following request:

```http
GET /status?name=ryan HTTP/1.1
Accept: text/plain
```

To parse the URL into its parts:

```js
new URL(request.url, `http://${request.headers.host}`);
```

When `request.url` is `'/status?name=ryan'` and `request.headers.host` is`'localhost:3000'`:

```console
$ node
> new URL(request.url, `http://${request.headers.host}`)
URL {
  href: 'http://localhost:3000/status?name=ryan',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```

**Since**

v0.1.90

#### Inherited from

[Request](Request-1.md).[url](Request-1.md#url)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:653

___

### user

 `Optional` **user**: `Object`

#### Inherited from

[Request](Request-1.md).[user](Request-1.md#user)

#### Defined in

[packages/medusa/src/types/global.ts:11](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L11)

___

### validatedBody

 **validatedBody**: `unknown`

#### Inherited from

[Request](Request-1.md).[validatedBody](Request-1.md#validatedbody)

#### Defined in

[packages/medusa/src/types/global.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L14)

___

### validatedQuery

 **validatedQuery**: [`RequestQueryFields`](RequestQueryFields.md) & Record<`string`, `unknown`\>

#### Inherited from

[Request](Request-1.md).[validatedQuery](Request-1.md#validatedquery)

#### Defined in

[packages/medusa/src/types/global.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L13)

___

### xhr

 **xhr**: `boolean`

Check if the request was an _XMLHttpRequest_.

#### Inherited from

[Request](Request-1.md).[xhr](Request-1.md#xhr)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:633

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

[Request](Request-1.md).[[asyncDispose]](Request-1.md#[asyncdispose])

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:651

___

### [asyncIterator]

**[asyncIterator]**(): [`AsyncIterableIterator`](AsyncIterableIterator.md)<`any`\>

#### Returns

[`AsyncIterableIterator`](AsyncIterableIterator.md)<`any`\>

-`AsyncIterableIterator`: 
	-`any`: (optional) 

#### Inherited from

[Request](Request-1.md).[[asyncIterator]](Request-1.md#[asynciterator])

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

[Request](Request-1.md).[[captureRejectionSymbol]](Request-1.md#[capturerejectionsymbol])

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

[Request](Request-1.md).[_construct](Request-1.md#_construct)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:126

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

[Request](Request-1.md).[_destroy](Request-1.md#_destroy)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:566

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

[Request](Request-1.md).[_read](Request-1.md#_read)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:127

___

### accepts

**accepts**(): `string`[]

Check if the given `type(s)` is acceptable, returning
the best match when true, otherwise `undefined`, in which
case you should respond with 406 "Not Acceptable".

The `type` value may be a single mime type string
such as "application/json", the extension name
such as "json", a comma-delimted list such as "json, html, text/plain",
or an array `["json", "html", "text/plain"]`. When a list
or array is given the _best_ match, if any is returned.

Examples:

    // Accept: text/html
    req.accepts('html');
    // => "html"

    // Accept: text/*, application/json
    req.accepts('html');
    // => "html"
    req.accepts('text/html');
    // => "text/html"
    req.accepts('json, text');
    // => "json"
    req.accepts('application/json');
    // => "application/json"

    // Accept: text/*, application/json
    req.accepts('image/png');
    req.accepts('png');
    // => undefined

    // Accept: text/*;q=.5, application/json
    req.accepts(['html', 'json']);
    req.accepts('html, json');
    // => "json"

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Inherited from

[Request](Request-1.md).[accepts](Request-1.md#accepts)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:454

**accepts**(`type`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `type` | `string` |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[accepts](Request-1.md#accepts)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:455

**accepts**(`type`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `type` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[accepts](Request-1.md#accepts)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:456

**accepts**(`...type`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `...type` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[accepts](Request-1.md#accepts)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:457

___

### acceptsCharsets

**acceptsCharsets**(): `string`[]

Returns the first accepted charset of the specified character sets,
based on the request's Accept-Charset HTTP header field.
If none of the specified charsets is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsCharsets](Request-1.md#acceptscharsets)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:466

**acceptsCharsets**(`charset`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `charset` | `string` |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsCharsets](Request-1.md#acceptscharsets)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:467

**acceptsCharsets**(`charset`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `charset` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsCharsets](Request-1.md#acceptscharsets)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:468

**acceptsCharsets**(`...charset`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `...charset` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsCharsets](Request-1.md#acceptscharsets)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:469

___

### acceptsEncodings

**acceptsEncodings**(): `string`[]

Returns the first accepted encoding of the specified encodings,
based on the request's Accept-Encoding HTTP header field.
If none of the specified encodings is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsEncodings](Request-1.md#acceptsencodings)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:478

**acceptsEncodings**(`encoding`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `encoding` | `string` |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsEncodings](Request-1.md#acceptsencodings)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:479

**acceptsEncodings**(`encoding`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `encoding` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsEncodings](Request-1.md#acceptsencodings)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:480

**acceptsEncodings**(`...encoding`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `...encoding` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsEncodings](Request-1.md#acceptsencodings)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:481

___

### acceptsLanguages

**acceptsLanguages**(): `string`[]

Returns the first accepted language of the specified languages,
based on the request's Accept-Language HTTP header field.
If none of the specified languages is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsLanguages](Request-1.md#acceptslanguages)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:490

**acceptsLanguages**(`lang`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `lang` | `string` |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsLanguages](Request-1.md#acceptslanguages)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:491

**acceptsLanguages**(`lang`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `lang` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsLanguages](Request-1.md#acceptslanguages)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:492

**acceptsLanguages**(`...lang`): `string` \| ``false``

#### Parameters

| Name |
| :------ |
| `...lang` | `string`[] |

#### Returns

`string` \| ``false``

-`string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[acceptsLanguages](Request-1.md#acceptslanguages)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:493

___

### addListener

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

| Name |
| :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:590

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:591

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:592

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:593

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:594

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:595

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:596

**addListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[addListener](Request-1.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:597

___

### asIndexedPairs

**asIndexedPairs**(`options?`): [`Readable`](../classes/Readable.md)

This method returns a new stream with chunks of the underlying stream paired with a counter
in the form `[index, chunk]`. The first index value is `0` and it increases by 1 for each chunk produced.

#### Parameters

| Name |
| :------ |
| `options?` | [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\> |

#### Returns

[`Readable`](../classes/Readable.md)

-`Readable`: a stream of indexed pairs.

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[asIndexedPairs](Request-1.md#asindexedpairs)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:541

___

### compose

**compose**<`T`\>(`stream`, `options?`): `T`

| Name | Type |
| :------ | :------ |
| `T` | [`ReadableStream`](ReadableStream.md) |

#### Parameters

| Name |
| :------ |
| `stream` | [`ComposeFnParam`](../types/ComposeFnParam.md) \| `T` \| [`Iterable`](Iterable.md)<`T`\> \| [`AsyncIterable`](AsyncIterable.md)<`T`\> |
| `options?` | `object` |
| `options.signal` | `AbortSignal` |

#### Returns

`T`

#### Inherited from

[Request](Request-1.md).[compose](Request-1.md#compose)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:35

___

### destroy

**destroy**(`error?`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

Calls `destroy()` on the socket that received the `IncomingMessage`. If `error`is provided, an `'error'` event is emitted on the socket and `error` is passed
as an argument to any listeners on the event.

#### Parameters

| Name |
| :------ |
| `error?` | `Error` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.3.0

#### Inherited from

[Request](Request-1.md).[destroy](Request-1.md#destroy)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1353

___

### drop

**drop**(`limit`, `options?`): [`Readable`](../classes/Readable.md)

This method returns a new stream with the first *limit* chunks dropped from the start.

#### Parameters

| Name | Description |
| :------ | :------ |
| `limit` | `number` | the number of chunks to drop from the readable. |
| `options?` | [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\> |

#### Returns

[`Readable`](../classes/Readable.md)

-`Readable`: a stream with *limit* chunks dropped from the start.

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[drop](Request-1.md#drop)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:527

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

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:598

**emit**(`event`, `chunk`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `chunk` | `any` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:599

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:600

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

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:601

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:602

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:603

**emit**(`event`): `boolean`

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:604

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

[Request](Request-1.md).[emit](Request-1.md#emit)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:605

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

[Request](Request-1.md).[eventNames](Request-1.md#eventnames)

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
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: a promise evaluating to `true` if *fn* returned a truthy value for every one of the chunks.
	-`boolean`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[every](Request-1.md#every)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:506

___

### filter

**filter**(`fn`, `options?`): [`Readable`](../classes/Readable.md)

This method allows filtering the stream. For each chunk in the stream the *fn* function will be called
and if it returns a truthy value, the chunk will be passed to the result stream.
If the *fn* function returns a promise - that promise will be `await`ed.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> | a function to filter chunks from the stream. Async or not. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

[`Readable`](../classes/Readable.md)

-`Readable`: a stream filtered with the predicate *fn*.

**Since**

v17.4.0, v16.14.0

#### Inherited from

[Request](Request-1.md).[filter](Request-1.md#filter)

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
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => data is T | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

`Promise`<`undefined` \| `T`\>

-`Promise`: a promise evaluating to the first chunk for which *fn* evaluated with a truthy value,
or `undefined` if no element was found.
	-`undefined \| T`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[find](Request-1.md#find)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:489

**find**(`fn`, `options?`): `Promise`<`any`\>

#### Parameters

| Name |
| :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Inherited from

[Request](Request-1.md).[find](Request-1.md#find)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:493

___

### flatMap

**flatMap**(`fn`, `options?`): [`Readable`](../classes/Readable.md)

This method returns a new stream by applying the given callback to each chunk of the stream
and then flattening the result.

It is possible to return a stream or another iterable or async iterable from *fn* and the result streams
will be merged (flattened) into the returned stream.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `any` | a function to map over every chunk in the stream. May be async. May be a stream or generator. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

[`Readable`](../classes/Readable.md)

-`Readable`: a stream flat-mapped with the function *fn*.

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[flatMap](Request-1.md#flatmap)

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
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `void` \| `Promise`<`void`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: a promise for when the stream has finished.

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[forEach](Request-1.md#foreach)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:453

___

### get

**get**(`name`): `undefined` \| `string`[]

Return request header.

The `Referrer` header field is special-cased,
both `Referrer` and `Referer` are interchangeable.

Examples:

    req.get('Content-Type');
    // => "text/plain"

    req.get('content-type');
    // => "text/plain"

    req.get('Something');
    // => undefined

Aliased as `req.header()`.

#### Parameters

| Name |
| :------ |
| `name` | ``"set-cookie"`` |

#### Returns

`undefined` \| `string`[]

-`undefined \| string[]`: (optional) 

#### Inherited from

[Request](Request-1.md).[get](Request-1.md#get)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:411

**get**(`name`): `undefined` \| `string`

#### Parameters

| Name |
| :------ |
| `name` | `string` |

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Inherited from

[Request](Request-1.md).[get](Request-1.md#get)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:412

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

[Request](Request-1.md).[getMaxListeners](Request-1.md#getmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:687

___

### header

**header**(`name`): `undefined` \| `string`[]

#### Parameters

| Name |
| :------ |
| `name` | ``"set-cookie"`` |

#### Returns

`undefined` \| `string`[]

-`undefined \| string[]`: (optional) 

#### Inherited from

[Request](Request-1.md).[header](Request-1.md#header)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:414

**header**(`name`): `undefined` \| `string`

#### Parameters

| Name |
| :------ |
| `name` | `string` |

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Inherited from

[Request](Request-1.md).[header](Request-1.md#header)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:415

___

### is

**is**(`type`): ``null`` \| `string` \| ``false``

Check if the incoming request contains the "Content-Type"
header field, and it contains the give mime `type`.

Examples:

     // With Content-Type: text/html; charset=utf-8
     req.is('html');
     req.is('text/html');
     req.is('text/*');
     // => true

     // When Content-Type is application/json
     req.is('json');
     req.is('application/json');
     req.is('application/*');
     // => true

     req.is('html');
     // => false

#### Parameters

| Name |
| :------ |
| `type` | `string` \| `string`[] |

#### Returns

``null`` \| `string` \| ``false``

-```null`` \| string \| ``false```: (optional) 

#### Inherited from

[Request](Request-1.md).[is](Request-1.md#is)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:552

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

[Request](Request-1.md).[isPaused](Request-1.md#ispaused)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:287

___

### iterator

**iterator**(`options?`): [`AsyncIterableIterator`](AsyncIterableIterator.md)<`any`\>

The iterator created by this method gives users the option to cancel the destruction
of the stream if the `for await...of` loop is exited by `return`, `break`, or `throw`,
or if the iterator should destroy the stream if the stream emitted an error during iteration.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | `object` |
| `options.destroyOnReturn?` | `boolean` | When set to `false`, calling `return` on the async iterator, or exiting a `for await...of` iteration using a `break`, `return`, or `throw` will not destroy the stream. **Default: `true`**. |

#### Returns

[`AsyncIterableIterator`](AsyncIterableIterator.md)<`any`\>

-`AsyncIterableIterator`: 
	-`any`: (optional) 

**Since**

v16.3.0

#### Inherited from

[Request](Request-1.md).[iterator](Request-1.md#iterator)

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

[Request](Request-1.md).[listenerCount](Request-1.md#listenercount)

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

[Request](Request-1.md).[listeners](Request-1.md#listeners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:700

___

### map

**map**(`fn`, `options?`): [`Readable`](../classes/Readable.md)

This method allows mapping over the stream. The *fn* function will be called for every chunk in the stream.
If the *fn* function returns a promise - that promise will be `await`ed before being passed to the result stream.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `any` | a function to map over every chunk in the stream. Async or not. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

[`Readable`](../classes/Readable.md)

-`Readable`: a stream mapped with the function *fn*.

**Since**

v17.4.0, v16.14.0

#### Inherited from

[Request](Request-1.md).[map](Request-1.md#map)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:425

___

### off

**off**(`eventName`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

Alias for `emitter.removeListener()`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v10.0.0

#### Inherited from

[Request](Request-1.md).[off](Request-1.md#off)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:660

___

### on

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.1.101

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:606

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:607

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:608

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:609

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:610

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:611

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:612

**on**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[on](Request-1.md#on)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:613

___

### once

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.3.0

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:614

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:615

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:616

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:617

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:618

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:619

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:620

**once**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[once](Request-1.md#once)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:621

___

### param

**param**(`name`, `defaultValue?`): `string`

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `defaultValue?` | `any` |

#### Returns

`string`

-`string`: (optional) 

**Deprecated**

since 4.11 Use either req.params, req.body or req.query, as applicable.

Return the value of param `name` when present or `defaultValue`.

 - Checks route placeholders, ex: _/user/:id_
 - Checks body params, ex: id=12, {"id":12}
 - Checks query string params, ex: ?id=12

To utilize request bodies, `req.body`
should be an object. This can be done by using
the `connect.bodyParser()` middleware.

#### Inherited from

[Request](Request-1.md).[param](Request-1.md#param)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:529

___

### pause

**pause**(): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.9.4

#### Inherited from

[Request](Request-1.md).[pause](Request-1.md#pause)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:251

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

[Request](Request-1.md).[pipe](Request-1.md#pipe)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:29

___

### prependListener

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v6.0.0

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:622

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:623

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:624

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:625

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:626

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:627

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:628

**prependListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependListener](Request-1.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:629

___

### prependOnceListener

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v6.0.0

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:630

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:631

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:632

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:633

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:634

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:635

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:636

**prependOnceListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[prependOnceListener](Request-1.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:637

___

### push

**push**(`chunk`, `encoding?`): `boolean`

#### Parameters

| Name |
| :------ |
| `chunk` | `any` |
| `encoding?` | [`BufferEncoding`](../types/BufferEncoding.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Request](Request-1.md).[push](Request-1.md#push)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:407

___

### range

**range**(`size`, `options?`): `undefined` \| [`Ranges`](Ranges.md) \| [`Result`](../types/Result.md)

Parse Range header field, capping to the given `size`.

Unspecified ranges such as "0-" require knowledge of your resource length. In
the case of a byte range this is of course the total number of bytes.
If the Range header field is not given `undefined` is returned.
If the Range header field is given, return value is a result of range-parser.
See more ./types/range-parser/index.d.ts

NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
should respond with 4 users when available, not 3.

#### Parameters

| Name |
| :------ |
| `size` | `number` |
| `options?` | [`Options`](Options.md) |

#### Returns

`undefined` \| [`Ranges`](Ranges.md) \| [`Result`](../types/Result.md)

-`undefined \| Ranges \| Result`: (optional) 

#### Inherited from

[Request](Request-1.md).[range](Request-1.md#range)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:508

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

[Request](Request-1.md).[rawListeners](Request-1.md#rawlisteners)

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

Calling [read](Request.md#read) after the `'end'` event has
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

[Request](Request-1.md).[read](Request-1.md#read)

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
| `fn` | (`previous`: `any`, `data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `T` | a reducer function to call over every chunk in the stream. Async or not. |
| `initial?` | `undefined` | the initial value to use in the reduction. |
| `options?` | [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\> |

#### Returns

`Promise`<`T`\>

-`Promise`: a promise for the final value of the reduction.

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[reduce](Request-1.md#reduce)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:556

**reduce**<`T`\>(`fn`, `initial`, `options?`): `Promise`<`T`\>

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `fn` | (`previous`: `T`, `data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `T` |
| `initial` | `T` |
| `options?` | [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\> |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[Request](Request-1.md).[reduce](Request-1.md#reduce)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:561

___

### removeAllListeners

**removeAllListeners**(`event?`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.1.26

#### Inherited from

[Request](Request-1.md).[removeAllListeners](Request-1.md#removealllisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:671

___

### removeListener

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.1.26

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:638

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:639

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:640

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:641

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:642

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:643

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:644

**removeListener**(`event`, `listener`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

#### Parameters

| Name |
| :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

#### Inherited from

[Request](Request-1.md).[removeListener](Request-1.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:645

___

### resume

**resume**(): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.9.4

#### Inherited from

[Request](Request-1.md).[resume](Request-1.md#resume)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:270

___

### setEncoding

**setEncoding**(`encoding`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

| Name | Description |
| :------ | :------ |
| `encoding` | [`BufferEncoding`](../types/BufferEncoding.md) | The encoding to use. |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.9.4

#### Inherited from

[Request](Request-1.md).[setEncoding](Request-1.md#setencoding)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:229

___

### setMaxListeners

**setMaxListeners**(`n`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

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

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.3.5

#### Inherited from

[Request](Request-1.md).[setMaxListeners](Request-1.md#setmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:681

___

### setTimeout

**setTimeout**(`msecs`, `callback?`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

Calls `message.socket.setTimeout(msecs, callback)`.

#### Parameters

| Name |
| :------ |
| `msecs` | `number` |
| `callback?` | () => `void` |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.5.9

#### Inherited from

[Request](Request-1.md).[setTimeout](Request-1.md#settimeout)

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:1286

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
| `fn` | (`data`: `any`, `options?`: [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\>) => `boolean` \| `Promise`<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | [`ArrayOptions`](ArrayOptions.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: a promise evaluating to `true` if *fn* returned a truthy value for at least one of the chunks.
	-`boolean`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[some](Request-1.md#some)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:475

___

### take

**take**(`limit`, `options?`): [`Readable`](../classes/Readable.md)

This method returns a new stream with the first *limit* chunks.

#### Parameters

| Name | Description |
| :------ | :------ |
| `limit` | `number` | the number of chunks to take from the readable. |
| `options?` | [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\> |

#### Returns

[`Readable`](../classes/Readable.md)

-`Readable`: a stream with *limit* chunks taken.

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[take](Request-1.md#take)

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
| `options?` | [`Pick`](../types/Pick.md)<[`ArrayOptions`](ArrayOptions.md), ``"signal"``\> |

#### Returns

`Promise`<`any`[]\>

-`Promise`: a promise containing an array with the contents of the stream.
	-`any[]`: 
		-`any`: (optional) 

**Since**

v17.5.0

#### Inherited from

[Request](Request-1.md).[toArray](Request-1.md#toarray)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:465

___

### unpipe

**unpipe**(`destination?`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

The `readable.unpipe()` method detaches a `Writable` stream previously attached
using the [pipe](Request.md#pipe) method.

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
| `destination?` | [`WritableStream`](WritableStream.md) | Optional specific stream to unpipe |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.9.4

#### Inherited from

[Request](Request-1.md).[unpipe](Request-1.md#unpipe)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:314

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

Unlike [push](Request.md#push), `stream.unshift(chunk)` will not
end the reading process by resetting the internal reading state of the stream.
This can cause unexpected results if `readable.unshift()` is called during a
read (i.e. from within a [_read](Request.md#_read) implementation on a
custom stream). Following the call to `readable.unshift()` with an immediate [push](Request.md#push) will reset the reading state appropriately,
however it is best to simply avoid calling `readable.unshift()` while in the
process of performing a read.

#### Parameters

| Name | Description |
| :------ | :------ |
| `chunk` | `any` | Chunk of data to unshift onto the read queue. For streams not operating in object mode, `chunk` must be a string, `Buffer`, `Uint8Array`, or `null`. For object mode streams, `chunk` may be any JavaScript value. |
| `encoding?` | [`BufferEncoding`](../types/BufferEncoding.md) | Encoding of string chunks. Must be a valid `Buffer` encoding, such as `'utf8'` or `'ascii'`. |

#### Returns

`void`

-`void`: (optional) 

**Since**

v0.9.11

#### Inherited from

[Request](Request-1.md).[unshift](Request-1.md#unshift)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:380

___

### wrap

**wrap**(`stream`): [`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

Prior to Node.js 0.10, streams did not implement the entire `node:stream`module API as it is currently defined. (See `Compatibility` for more
information.)

When using an older Node.js library that emits `'data'` events and has a [pause](Request.md#pause) method that is advisory only, the`readable.wrap()` method can be used to create a `Readable`
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
| `stream` | [`ReadableStream`](ReadableStream.md) | An "old style" readable stream |

#### Returns

[`Request`](Request.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

-`Request`: 
	-`Locals`: 

**Since**

v0.9.4

#### Inherited from

[Request](Request-1.md).[wrap](Request-1.md#wrap)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:406
