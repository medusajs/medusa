---
displayed_sidebar: jsClientSidebar
---

# Interface: IpcSocketConnectOpts

[internal](../modules/internal-8.md).IpcSocketConnectOpts

## Hierarchy

- [`ConnectOpts`](internal-8.ConnectOpts.md)

  ↳ **`IpcSocketConnectOpts`**

## Properties

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

### path

• **path**: `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:70
