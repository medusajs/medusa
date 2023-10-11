---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableWritablePair<R, W\>

[internal](../modules/internal-8.md).ReadableWritablePair

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |
| `W` | `any` |

## Properties

### readable

• **readable**: [`ReadableStream`](../modules/internal-8.md#readablestream)<`R`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:5

___

### writable

• **writable**: [`WritableStream`](../modules/internal-8.md#writablestream)<`W`\>

Provides a convenient, chainable way of piping this readable stream
through a transform stream (or any other { writable, readable }
pair). It simply pipes the stream into the writable side of the
supplied pair, and returns the readable side for further use.

Piping a stream will lock it for the duration of the pipe, preventing
any other consumer from acquiring a reader.

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:15
