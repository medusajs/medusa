---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableWritablePair<R, W\>

[internal](../modules/internal-10.md).ReadableWritablePair

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |
| `W` | `any` |

## Properties

### readable

• **readable**: [`ReadableStream`](../modules/internal-10.md#readablestream)<`R`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1652

___

### writable

• **writable**: [`WritableStream`](../modules/internal-10.md#writablestream)<`W`\>

Provides a convenient, chainable way of piping this readable stream through a transform stream (or any other { writable, readable } pair). It simply pipes the stream into the writable side of the supplied pair, and returns the readable side for further use.

Piping a stream will lock it for the duration of the pipe, preventing any other consumer from acquiring a reader.

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1658
