# IpcNetConnectOpts

## Hierarchy

- [`IpcSocketConnectOpts`](IpcSocketConnectOpts.md)

- [`SocketConstructorOpts`](SocketConstructorOpts.md)

  ↳ **`IpcNetConnectOpts`**

## Properties

### allowHalfOpen

 `Optional` **allowHalfOpen**: `boolean`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[allowHalfOpen](SocketConstructorOpts.md#allowhalfopen)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:31

___

### fd

 `Optional` **fd**: `number`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[fd](SocketConstructorOpts.md#fd)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:30

___

### onread

 `Optional` **onread**: [`OnReadOpts`](OnReadOpts.md)

If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket.
Note: this will cause the streaming functionality to not provide any data, however events like 'error', 'end', and 'close' will
still be emitted as normal and methods like pause() and resume() will also behave as expected.

#### Inherited from

[IpcSocketConnectOpts](IpcSocketConnectOpts.md).[onread](IpcSocketConnectOpts.md#onread)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:51

___

### path

 **path**: `string`

#### Inherited from

[IpcSocketConnectOpts](IpcSocketConnectOpts.md).[path](IpcSocketConnectOpts.md#path)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:74

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

docs-util/node_modules/@types/node/net.d.ts:744

___

### writable

 `Optional` **writable**: `boolean`

#### Inherited from

[SocketConstructorOpts](SocketConstructorOpts.md).[writable](SocketConstructorOpts.md#writable)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:33
