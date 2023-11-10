# TcpSocketConnectOpts

## Hierarchy

- [`ConnectOpts`](ConnectOpts.md)

  ↳ **`TcpSocketConnectOpts`**

  ↳↳ [`TcpNetConnectOpts`](TcpNetConnectOpts.md)

## Properties

### autoSelectFamily

 `Optional` **autoSelectFamily**: `boolean`

**Since**

v18.13.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:67

___

### autoSelectFamilyAttemptTimeout

 `Optional` **autoSelectFamilyAttemptTimeout**: `number`

**Since**

v18.13.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:71

___

### family

 `Optional` **family**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:59

___

### hints

 `Optional` **hints**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:58

___

### host

 `Optional` **host**: `string`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:55

___

### keepAlive

 `Optional` **keepAlive**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:62

___

### keepAliveInitialDelay

 `Optional` **keepAliveInitialDelay**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:63

___

### localAddress

 `Optional` **localAddress**: `string`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:56

___

### localPort

 `Optional` **localPort**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:57

___

### lookup

 `Optional` **lookup**: [`LookupFunction`](../types/LookupFunction.md)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:60

___

### noDelay

 `Optional` **noDelay**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:61

___

### onread

 `Optional` **onread**: [`OnReadOpts`](OnReadOpts.md)

If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket.
Note: this will cause the streaming functionality to not provide any data, however events like 'error', 'end', and 'close' will
still be emitted as normal and methods like pause() and resume() will also behave as expected.

#### Inherited from

[ConnectOpts](ConnectOpts.md).[onread](ConnectOpts.md#onread)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:51

___

### port

 **port**: `number`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:54
