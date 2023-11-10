# internal

## Namespaces

- [finished](../internal/modules/internal.finished.md)
- [pipeline](../internal/modules/internal.pipeline.md)

## Classes

- [PassThrough](../internal/classes/internal.PassThrough.md)
- [Transform](../internal/classes/internal.Transform.md)

## Interfaces

- [FinishedOptions](../internal/interfaces/internal.FinishedOptions.md)
- [Pipe](../internal/interfaces/internal.Pipe.md)
- [PipelineOptions](../internal/interfaces/internal.PipelineOptions.md)
- [StreamOptions](../internal/interfaces/internal.StreamOptions.md)
- [TransformOptions](../internal/interfaces/internal.TransformOptions.md)

## Type Aliases

- [PipelineCallback](../internal/types/internal.PipelineCallback.md)
- [PipelineDestination](../internal/types/internal.PipelineDestination.md)
- [PipelineDestinationIterableFunction](../internal/types/internal.PipelineDestinationIterableFunction.md)
- [PipelineDestinationPromiseFunction](../internal/types/internal.PipelineDestinationPromiseFunction.md)
- [PipelinePromise](../internal/types/internal.PipelinePromise.md)
- [PipelineSource](../internal/types/internal.PipelineSource.md)
- [PipelineSourceFunction](../internal/types/internal.PipelineSourceFunction.md)
- [PipelineTransform](../internal/types/internal.PipelineTransform.md)
- [PipelineTransformSource](../internal/types/internal.PipelineTransformSource.md)
- [TransformCallback](../internal/types/internal.TransformCallback.md)

## References

### Duplex

Re-exports [Duplex](../classes/Duplex.md)

___

### DuplexOptions

Re-exports [DuplexOptions](../interfaces/DuplexOptions.md)

___

### Readable

Re-exports [Readable](../classes/Readable.md)

___

### ReadableOptions

Re-exports [ReadableOptions](../interfaces/ReadableOptions.md)

___

### Stream

Re-exports [Stream](../classes/Stream.md)

___

### Writable

Re-exports [Writable](../classes/Writable.md)

___

### WritableOptions

Re-exports [WritableOptions](../interfaces/WritableOptions.md)

## Variables

### consumers

 `Const` **consumers**: typeof [`"node:stream/consumers"`](node_stream_consumers_.md)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1694

___

### promises

 `Const` **promises**: typeof [`"node:stream/promises"`](node_stream_promises_.md)

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1693

## Functions

### addAbortSignal

**addAbortSignal**<`T`\>(`signal`, `stream`): `T`

A stream to attach a signal to.

Attaches an AbortSignal to a readable or writeable stream. This lets code
control stream destruction using an `AbortController`.

Calling `abort` on the `AbortController` corresponding to the passed`AbortSignal` will behave the same way as calling `.destroy(new AbortError())`on the stream, and `controller.error(new
AbortError())` for webstreams.

```js
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Later, abort the operation closing the stream
controller.abort();
```

Or using an `AbortSignal` with a readable stream as an async iterable:

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // set a timeout
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // The operation was cancelled
    } else {
      throw e;
    }
  }
})();
```

Or using an `AbortSignal` with a ReadableStream:

```js
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // The operation was cancelled
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

| Name | Type |
| :------ | :------ |
| `T` | [`Stream`](../classes/Stream.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `signal` | `AbortSignal` | A signal representing possible cancellation |
| `stream` | `T` | a stream to attach a signal to |

#### Returns

`T`

**Since**

v15.4.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1368

___

### finished

**finished**(`stream`, `options`, `callback`): () => `void`

A readable and/or writable stream/webstream.

A function to get notified when a stream is no longer readable, writable
or has experienced an error or a premature close event.

```js
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // Drain the stream.
```

Especially useful in error handling scenarios where a stream is destroyed
prematurely (like an aborted HTTP request), and will not emit `'end'`or `'finish'`.

The `finished` API provides `promise version`.

`stream.finished()` leaves dangling event listeners (in particular`'error'`, `'end'`, `'finish'` and `'close'`) after `callback` has been
invoked. The reason for this is so that unexpected `'error'` events (due to
incorrect stream implementations) do not cause unexpected crashes.
If this is unwanted behavior then the returned cleanup function needs to be
invoked in the callback:

```js
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/ReadableStream.md) \| [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) | A readable and/or writable stream. |
| `options` | [`FinishedOptions`](../internal/interfaces/internal.FinishedOptions.md) |
| `callback` | (`err?`: ``null`` \| [`ErrnoException`](../interfaces/ErrnoException.md)) => `void` | A callback function that takes an optional error argument. |

#### Returns

`fn`

-`() => `void``: (optional) A cleanup function which removes all registered listeners.

(): `void`

##### Returns

`void`

-`void`: (optional) 

**Since**

v10.0.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1433

**finished**(`stream`, `callback`): () => `void`

#### Parameters

| Name |
| :------ |
| `stream` | [`ReadableStream`](../interfaces/ReadableStream.md) \| [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) |
| `callback` | (`err?`: ``null`` \| [`ErrnoException`](../interfaces/ErrnoException.md)) => `void` |

#### Returns

`fn`

-`() => `void``: (optional) 

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1438

___

### getDefaultHighWaterMark

**getDefaultHighWaterMark**(`objectMode`): `number`

Returns the default highWaterMark used by streams.
Defaults to `16384` (16 KiB), or `16` for `objectMode`.

#### Parameters

| Name |
| :------ |
| `objectMode` | `boolean` |

#### Returns

`number`

-`number`: (optional) 

**Since**

v19.9.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1375

___

### isErrored

**isErrored**(`stream`): `boolean`

Returns whether the stream has encountered an error.

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`Writable`](../classes/Writable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) \| [`WritableStream`](../interfaces/WritableStream.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v17.3.0, v16.14.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1686

___

### isReadable

**isReadable**(`stream`): `boolean`

Returns whether the stream is readable.

#### Parameters

| Name |
| :------ |
| `stream` | [`Readable`](../classes/Readable.md) \| [`ReadableStream`](../interfaces/ReadableStream.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v17.4.0, v16.14.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1692

___

### pipeline

**pipeline**<`A`, `B`\>(`source`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

A module method to pipe between streams and generators forwarding errors and
properly cleaning up and provide a callback when the pipeline is complete.

```js
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.

// A pipeline to gzip a potentially huge tar file efficiently:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  },
);
```

The `pipeline` API provides a `promise version`.

`stream.pipeline()` will call `stream.destroy(err)` on all streams except:

* `Readable` streams which have emitted `'end'` or `'close'`.
* `Writable` streams which have emitted `'finish'` or `'close'`.

`stream.pipeline()` leaves dangling event listeners on the streams
after the `callback` has been invoked. In the case of reuse of streams after
failure, this can cause event listener leaks and swallowed errors. If the last
stream is readable, dangling event listeners will be removed so that the last
stream can be consumed later.

`stream.pipeline()` closes all the streams when an error is raised.
The `IncomingRequest` usage with `pipeline` could lead to an unexpected behavior
once it would destroy the socket without sending the expected response.
See the example below:

```js
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // No such file
      // this message can't be sent once `pipeline` already destroyed the socket
      return res.end('error!!!');
    }
  });
});
```

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name | Description |
| :------ | :------ |
| `source` | `A` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](../internal/types/internal.PipelineCallback.md)<`B`\> | Called when the pipeline is fully done. |

#### Returns

`B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

-``B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)`: (optional) 

**Since**

v10.0.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1539

**pipeline**<`A`, `T1`, `B`\>(`source`, `transform1`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](../internal/types/internal.PipelineCallback.md)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

-``B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1544

**pipeline**<`A`, `T1`, `T2`, `B`\>(`source`, `transform1`, `transform2`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](../internal/types/internal.PipelineCallback.md)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

-``B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1554

**pipeline**<`A`, `T1`, `T2`, `T3`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `T3` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T2`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](../internal/types/internal.PipelineCallback.md)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

-``B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1566

**pipeline**<`A`, `T1`, `T2`, `T3`, `T4`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `transform4`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

| Name | Type |
| :------ | :------ |
| `A` | [`PipelineSource`](../internal/types/internal.PipelineSource.md)<`any`\> |
| `T1` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`A`, `any`\> |
| `T2` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T1`, `any`\> |
| `T3` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T2`, `any`\> |
| `T4` | [`PipelineTransform`](../internal/types/internal.PipelineTransform.md)<`T3`, `any`\> |
| `B` | [`WritableStream`](../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`string` \| [`Buffer`](../index.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`string` \| [`Buffer`](../index.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](../internal/types/internal.PipelineDestinationIterableFunction.md)<`any`\> \| [`PipelineDestinationPromiseFunction`](../internal/types/internal.PipelineDestinationPromiseFunction.md)<`any`, `any`\> |

#### Parameters

| Name |
| :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `transform4` | `T4` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](../internal/types/internal.PipelineCallback.md)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)

-``B` extends [`WritableStream`](../interfaces/WritableStream.md) ? `B` : [`WritableStream`](../interfaces/WritableStream.md)`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1580

**pipeline**(`streams`, `callback?`): [`WritableStream`](../interfaces/WritableStream.md)

#### Parameters

| Name |
| :------ |
| `streams` | readonly ([`ReadableStream`](../interfaces/ReadableStream.md) \| [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md))[] |
| `callback?` | (`err`: ``null`` \| [`ErrnoException`](../interfaces/ErrnoException.md)) => `void` |

#### Returns

[`WritableStream`](../interfaces/WritableStream.md)

-`writable`: 
-`[captureRejectionSymbol]`: (optional) 
-`addListener`: 
-`emit`: 
-`end`: 
-`eventNames`: 
-`getMaxListeners`: 
-`listenerCount`: 
-`listeners`: 
-`off`: 
-`on`: 
-`once`: 
-`prependListener`: 
-`prependOnceListener`: 
-`rawListeners`: 
-`removeAllListeners`: 
-`removeListener`: 
-`setMaxListeners`: 
-`write`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1596

**pipeline**(`stream1`, `stream2`, `...streams`): [`WritableStream`](../interfaces/WritableStream.md)

#### Parameters

| Name |
| :------ |
| `stream1` | [`ReadableStream`](../interfaces/ReadableStream.md) |
| `stream2` | [`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) |
| `...streams` | ([`WritableStream`](../interfaces/WritableStream.md) \| [`ReadWriteStream`](../interfaces/ReadWriteStream.md) \| (`err`: ``null`` \| [`ErrnoException`](../interfaces/ErrnoException.md)) => `void`)[] |

#### Returns

[`WritableStream`](../interfaces/WritableStream.md)

-`writable`: 
-`[captureRejectionSymbol]`: (optional) 
-`addListener`: 
-`emit`: 
-`end`: 
-`eventNames`: 
-`getMaxListeners`: 
-`listenerCount`: 
-`listeners`: 
-`off`: 
-`on`: 
-`once`: 
-`prependListener`: 
-`prependOnceListener`: 
-`rawListeners`: 
-`removeAllListeners`: 
-`removeListener`: 
-`setMaxListeners`: 
-`write`: 

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1600

___

### setDefaultHighWaterMark

**setDefaultHighWaterMark**(`objectMode`, `value`): `void`

Sets the default highWaterMark used by streams.

#### Parameters

| Name | Description |
| :------ | :------ |
| `objectMode` | `boolean` |
| `value` | `number` | highWaterMark value |

#### Returns

`void`

-`void`: (optional) 

**Since**

v19.9.0

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1382
