---
displayed_sidebar: jsClientSidebar
---

# Interface: TcpSocketConnectOpts

[internal](../modules/internal-8.md).TcpSocketConnectOpts

## Hierarchy

- [`ConnectOpts`](internal-8.ConnectOpts.md)

  ↳ **`TcpSocketConnectOpts`**

## Properties

### autoSelectFamily

• `Optional` **autoSelectFamily**: `boolean`

**`Since`**

v18.13.0

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:63

___

### autoSelectFamilyAttemptTimeout

• `Optional` **autoSelectFamilyAttemptTimeout**: `number`

**`Since`**

v18.13.0

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:67

___

### family

• `Optional` **family**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:55

___

### hints

• `Optional` **hints**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:54

___

### host

• `Optional` **host**: `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:51

___

### keepAlive

• `Optional` **keepAlive**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:58

___

### keepAliveInitialDelay

• `Optional` **keepAliveInitialDelay**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:59

___

### localAddress

• `Optional` **localAddress**: `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:52

___

### localPort

• `Optional` **localPort**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:53

___

### lookup

• `Optional` **lookup**: [`LookupFunction`](../modules/internal-8.md#lookupfunction)

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:56

___

### noDelay

• `Optional` **noDelay**: `boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:57

___

### onread

• `Optional` **onread**: [`OnReadOpts`](internal-8.OnReadOpts.md)

If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket.
Note: this will cause the streaming functionality to not provide any data, however events like 'error', 'end', and 'close' will
still be emitted as normal and methods like pause() and resume() will also behave as expected.

#### Inherited from

[ConnectOpts](internal-8.ConnectOpts.md).[onread](internal-8.ConnectOpts.md#onread)

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:47

___

### port

• **port**: `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:50
