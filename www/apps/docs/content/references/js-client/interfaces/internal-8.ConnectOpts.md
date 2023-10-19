---
displayed_sidebar: jsClientSidebar
---

# Interface: ConnectOpts

[internal](../modules/internal-8.md).ConnectOpts

## Hierarchy

- **`ConnectOpts`**

  ↳ [`TcpSocketConnectOpts`](internal-8.TcpSocketConnectOpts.md)

  ↳ [`IpcSocketConnectOpts`](internal-8.IpcSocketConnectOpts.md)

## Properties

### onread

• `Optional` **onread**: [`OnReadOpts`](internal-8.OnReadOpts.md)

If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket.
Note: this will cause the streaming functionality to not provide any data, however events like 'error', 'end', and 'close' will
still be emitted as normal and methods like pause() and resume() will also behave as expected.

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:47
