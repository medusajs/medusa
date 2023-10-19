---
displayed_sidebar: jsClientSidebar
---

# Interface: OnReadOpts

[internal](../modules/internal-8.md).OnReadOpts

## Properties

### buffer

• **buffer**: `Uint8Array` \| () => `Uint8Array`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:33

## Methods

### callback

▸ **callback**(`bytesWritten`, `buf`): `boolean`

This function is called for every chunk of incoming data.
Two arguments are passed to it: the number of bytes written to buffer and a reference to buffer.
Return false from this function to implicitly pause() the socket.

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytesWritten` | `number` |
| `buf` | `Uint8Array` |

#### Returns

`boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/net.d.ts:39
