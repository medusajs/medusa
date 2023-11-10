# ServerOptions

## Type parameters

| Name | Type |
| :------ | :------ |
| `Request` | typeof [`IncomingMessage`](../classes/IncomingMessage.md) |
| `Response` | typeof [`ServerResponse`](../classes/ServerResponse.md) |

## Properties

### IncomingMessage

 `Optional` **IncomingMessage**: `Request`

Specifies the `IncomingMessage` class to be used. Useful for extending the original `IncomingMessage`.

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:237

___

### ServerResponse

 `Optional` **ServerResponse**: `Response`

Specifies the `ServerResponse` class to be used. Useful for extending the original `ServerResponse`.

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:241

___

### connectionsCheckingInterval

 `Optional` **connectionsCheckingInterval**: `number`

Sets the interval value in milliseconds to check for request and headers timeout in incomplete requests.

**Default**

```ts
30000
```

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:267

___

### highWaterMark

 `Optional` **highWaterMark**: `number`

Optionally overrides all `socket`s' `readableHighWaterMark` and `writableHighWaterMark`.
This affects `highWaterMark` property of both `IncomingMessage` and `ServerResponse`.
Default:

**See**

stream.getDefaultHighWaterMark().

**Since**

v20.1.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:274

___

### insecureHTTPParser

 `Optional` **insecureHTTPParser**: `boolean`

Use an insecure HTTP parser that accepts invalid HTTP headers when `true`.
Using the insecure parser should be avoided.
See --insecure-http-parser for more information.

**Default**

```ts
false
```

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:281

___

### joinDuplicateHeaders

 `Optional` **joinDuplicateHeaders**: `boolean`

It joins the field line values of multiple headers in a request with `, ` instead of discarding the duplicates.

**Default**

```ts
false
```

**Since**

v18.14.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:254

___

### keepAlive

 `Optional` **keepAlive**: `boolean`

If set to `true`, it enables keep-alive functionality on the socket immediately after a new incoming connection is received,
similarly on what is done in `socket.setKeepAlive([enable][, initialDelay])`.

**Default**

```ts
false
```

**Since**

v16.5.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:302

___

### keepAliveInitialDelay

 `Optional` **keepAliveInitialDelay**: `number`

If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket.

**Default**

```ts
0
```

**Since**

v16.5.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:308

___

### keepAliveTimeout

 `Optional` **keepAliveTimeout**: `number`

The number of milliseconds of inactivity a server needs to wait for additional incoming data,
after it has finished writing the last response, before a socket will be destroyed.

**See**

Server.keepAliveTimeout for more information.

**Default**

```ts
5000
```

**Since**

v18.0.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:262

___

### maxHeaderSize

 `Optional` **maxHeaderSize**: `number`

Optionally overrides the value of
`--max-http-header-size` for requests received by this server, i.e.
the maximum length of request headers in bytes.

**Default**

```ts
16384
```

**Since**

v13.3.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:289

___

### noDelay

 `Optional` **noDelay**: `boolean`

If set to `true`, it disables the use of Nagle's algorithm immediately after a new incoming connection is received.

**Default**

```ts
true
```

**Since**

v16.5.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:295

___

### requestTimeout

 `Optional` **requestTimeout**: `number`

Sets the timeout value in milliseconds for receiving the entire request from the client.

**See**

Server.requestTimeout for more information.

**Default**

```ts
300000
```

**Since**

v18.0.0

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:248

___

### uniqueHeaders

 `Optional` **uniqueHeaders**: (`string` \| `string`[])[]

A list of response headers that should be sent only once.
If the header's value is an array, the items will be joined using `; `.

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:313
