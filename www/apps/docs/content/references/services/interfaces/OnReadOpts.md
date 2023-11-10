# OnReadOpts

## Properties

### buffer

 **buffer**: `Uint8Array` \| () => `Uint8Array`

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:37

## Methods

### callback

**callback**(`bytesWritten`, `buf`): `boolean`

This function is called for every chunk of incoming data.
Two arguments are passed to it: the number of bytes written to buffer and a reference to buffer.
Return false from this function to implicitly pause() the socket.

#### Parameters

| Name |
| :------ |
| `bytesWritten` | `number` |
| `buf` | `Uint8Array` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:43
