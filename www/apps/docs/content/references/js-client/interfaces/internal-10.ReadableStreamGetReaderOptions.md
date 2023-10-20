---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableStreamGetReaderOptions

[internal](../modules/internal-10.md).ReadableStreamGetReaderOptions

## Properties

### mode

• `Optional` **mode**: ``"byob"``

Creates a ReadableStreamBYOBReader and locks the stream to the new reader.

This call behaves the same way as the no-argument variant, except that it only works on readable byte streams, i.e. streams which were constructed specifically with the ability to handle "bring your own buffer" reading. The returned BYOB reader provides the ability to directly read individual chunks from the stream via its read() method, into developer-supplied buffers, allowing more precise control over allocation.

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1638
