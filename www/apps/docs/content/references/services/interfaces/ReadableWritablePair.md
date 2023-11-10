# ReadableWritablePair

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `object` |
| `W` | `object` |

## Properties

### readable

 **readable**: [`ReadableStream`](../index.md#readablestream)<`R`\>

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:5

___

### writable

 **writable**: [`WritableStream`](../index.md#writablestream)<`W`\>

Provides a convenient, chainable way of piping this readable stream
through a transform stream (or any other { writable, readable }
pair). It simply pipes the stream into the writable side of the
supplied pair, and returns the readable side for further use.

Piping a stream will lock it for the duration of the pipe, preventing
any other consumer from acquiring a reader.

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:15
