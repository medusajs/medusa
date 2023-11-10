# TcpNetConnectOpts

## Hierarchy

- [`TcpSocketConnectOpts`](TcpSocketConnectOpts.md)

- [`SocketConstructorOpts`](SocketConstructorOpts.md)

  ↳ **`TcpNetConnectOpts`**

## Properties

### allowHalfOpen

 `Optional` **allowHalfOpen**: `boolean`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[allowHalfOpen](SocketConstructorOpts.md#allowhalfopen)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:31

___

### autoSelectFamily

 `Optional` **autoSelectFamily**: `boolean`

**Since**

v18.13.0

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[autoSelectFamily](TcpSocketConnectOpts.md#autoselectfamily)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:67

___

### autoSelectFamilyAttemptTimeout

 `Optional` **autoSelectFamilyAttemptTimeout**: `number`

**Since**

v18.13.0

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[autoSelectFamilyAttemptTimeout](TcpSocketConnectOpts.md#autoselectfamilyattempttimeout)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:71

___

### family

 `Optional` **family**: `number`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[family](TcpSocketConnectOpts.md#family)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:59

___

### fd

 `Optional` **fd**: `number`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[fd](SocketConstructorOpts.md#fd)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:30

___

### hints

 `Optional` **hints**: `number`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[hints](TcpSocketConnectOpts.md#hints)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:58

___

### host

 `Optional` **host**: `string`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[host](TcpSocketConnectOpts.md#host)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:55

___

### keepAlive

 `Optional` **keepAlive**: `boolean`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[keepAlive](TcpSocketConnectOpts.md#keepalive)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:62

___

### keepAliveInitialDelay

 `Optional` **keepAliveInitialDelay**: `number`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[keepAliveInitialDelay](TcpSocketConnectOpts.md#keepaliveinitialdelay)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:63

___

### localAddress

 `Optional` **localAddress**: `string`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[localAddress](TcpSocketConnectOpts.md#localaddress)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:56

___

### localPort

 `Optional` **localPort**: `number`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[localPort](TcpSocketConnectOpts.md#localport)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:57

___

### lookup

 `Optional` **lookup**: [`LookupFunction`](../index.md#lookupfunction)

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[lookup](TcpSocketConnectOpts.md#lookup)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:60

___

### noDelay

 `Optional` **noDelay**: `boolean`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[noDelay](TcpSocketConnectOpts.md#nodelay)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:61

___

### onread

 `Optional` **onread**: [`OnReadOpts`](OnReadOpts.md)

If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket.
Note: this will cause the streaming functionality to not provide any data, however events like 'error', 'end', and 'close' will
still be emitted as normal and methods like pause() and resume() will also behave as expected.

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[onread](TcpSocketConnectOpts.md#onread)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:51

___

### port

 **port**: `number`

#### Inherited from

[TcpSocketConnectOpts](TcpSocketConnectOpts.md).[port](TcpSocketConnectOpts.md#port)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:54

___

### readable

 `Optional` **readable**: `boolean`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[readable](SocketConstructorOpts.md#readable)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:32

___

### signal

 `Optional` **signal**: `AbortSignal`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[signal](SocketConstructorOpts.md#signal)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:34

___

### timeout

 `Optional` **timeout**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:741

___

### writable

 `Optional` **writable**: `boolean`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[writable](SocketConstructorOpts.md#writable)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:33
