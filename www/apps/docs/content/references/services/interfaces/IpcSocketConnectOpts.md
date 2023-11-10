# IpcSocketConnectOpts

## Hierarchy

- [`ConnectOpts`](ConnectOpts.md)

  ↳ **`IpcSocketConnectOpts`**

  ↳↳ [`IpcNetConnectOpts`](IpcNetConnectOpts.md)

## Properties

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

### path

 **path**: `string`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:74
