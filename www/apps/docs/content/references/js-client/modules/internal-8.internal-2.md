---
displayed_sidebar: jsClientSidebar
---

# Namespace: internal

[internal](internal-8.md).internal

## Namespaces

- [finished](internal-8.internal-2.finished.md)
- [pipeline](internal-8.internal-2.pipeline.md)

## Classes

- [Writable](../classes/internal-8.internal-2.Writable.md)

## Interfaces

- [FinishedOptions](../interfaces/internal-8.internal-2.FinishedOptions.md)
- [Pipe](../interfaces/internal-8.internal-2.Pipe.md)
- [PipelineOptions](../interfaces/internal-8.internal-2.PipelineOptions.md)
- [ReadableOptions](../interfaces/internal-8.internal-2.ReadableOptions.md)
- [StreamOptions](../interfaces/internal-8.internal-2.StreamOptions.md)
- [WritableOptions](../interfaces/internal-8.internal-2.WritableOptions.md)

## References

### Duplex

Re-exports [Duplex](../classes/internal-8.Duplex.md)

___

### DuplexOptions

Re-exports [DuplexOptions](../interfaces/internal-8.DuplexOptions.md)

___

### PassThrough

Re-exports [PassThrough](../classes/internal-8.PassThrough.md)

___

### Readable

Re-exports [Readable](../classes/internal-8.Readable.md)

___

### Stream

Re-exports [Stream](../classes/internal-8.Stream.md)

___

### Transform

Re-exports [Transform](../classes/internal-8.Transform.md)

___

### TransformCallback

Re-exports [TransformCallback](internal-8.md#transformcallback)

___

### TransformOptions

Re-exports [TransformOptions](../interfaces/internal-8.TransformOptions.md)

## Type Aliases

### PipelineCallback

Ƭ **PipelineCallback**<`S`\>: `S` extends [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, infer P\> ? (`err`: [`ErrnoException`](../interfaces/internal-8.ErrnoException.md) \| ``null``, `value`: `P`) => `void` : (`err`: [`ErrnoException`](../interfaces/internal-8.ErrnoException.md) \| ``null``) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`PipelineDestination`](internal-8.internal-2.md#pipelinedestination)<`any`, `any`\> |

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1243

___

### PipelineDestination

Ƭ **PipelineDestination**<`S`, `P`\>: `S` extends [`PipelineTransformSource`](internal-8.internal-2.md#pipelinetransformsource)<infer ST\> ? [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`ST`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`ST`, `P`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`PipelineTransformSource`](internal-8.internal-2.md#pipelinetransformsource)<`any`\> |
| `P` | `P` |

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1240

___

### PipelineDestinationIterableFunction

Ƭ **PipelineDestinationIterableFunction**<`T`\>: (`source`: [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\>) => [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`any`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`source`): [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\> |

##### Returns

[`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`any`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1238

___

### PipelineDestinationPromiseFunction

Ƭ **PipelineDestinationPromiseFunction**<`T`, `P`\>: (`source`: [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\>) => `Promise`<`P`\>

#### Type parameters

| Name |
| :------ |
| `T` |
| `P` |

#### Type declaration

▸ (`source`): `Promise`<`P`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\> |

##### Returns

`Promise`<`P`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1239

___

### PipelinePromise

Ƭ **PipelinePromise**<`S`\>: `S` extends [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, infer P\> ? `Promise`<`P`\> : `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`PipelineDestination`](internal-8.internal-2.md#pipelinedestination)<`any`, `any`\> |

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1246

___

### PipelineSource

Ƭ **PipelineSource**<`T`\>: [`Iterable`](../interfaces/internal-8.Iterable.md)<`T`\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\> \| [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`PipelineSourceFunction`](internal-8.internal-2.md#pipelinesourcefunction)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1233

___

### PipelineSourceFunction

Ƭ **PipelineSourceFunction**<`T`\>: () => [`Iterable`](../interfaces/internal-8.Iterable.md)<`T`\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (): [`Iterable`](../interfaces/internal-8.Iterable.md)<`T`\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\>

##### Returns

[`Iterable`](../interfaces/internal-8.Iterable.md)<`T`\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`T`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1232

___

### PipelineTransform

Ƭ **PipelineTransform**<`S`, `U`\>: [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) \| (`source`: `S` extends (...`args`: `any`[]) => [`Iterable`](../interfaces/internal-8.Iterable.md)<infer ST\> \| [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<infer ST\> ? [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`ST`\> : `S`) => [`AsyncIterable`](../interfaces/internal-8.AsyncIterable.md)<`U`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`PipelineTransformSource`](internal-8.internal-2.md#pipelinetransformsource)<`any`\> |
| `U` | `U` |

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1234

___

### PipelineTransformSource

Ƭ **PipelineTransformSource**<`T`\>: [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`T`\> \| [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`any`, `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1237

## Variables

### consumers

• `Const` **consumers**: typeof [`internal`](internal-8.internal-4.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1414

___

### promises

• `Const` **promises**: typeof [`internal`](internal-8.internal-3.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1413

## Functions

### addAbortSignal

▸ **addAbortSignal**<`T`\>(`signal`, `stream`): `T`

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Stream`](../classes/internal-8.Stream.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signal` | `AbortSignal` | A signal representing possible cancellation |
| `stream` | `T` | a stream to attach a signal to |

#### Returns

`T`

**`Since`**

v15.4.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1162

___

### finished

▸ **finished**(`stream`, `options`, `callback`): () => `void`

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) | A readable and/or writable stream. |
| `options` | [`FinishedOptions`](../interfaces/internal-8.internal-2.FinishedOptions.md) | - |
| `callback` | (`err?`: ``null`` \| [`ErrnoException`](../interfaces/internal-8.ErrnoException.md)) => `void` | A callback function that takes an optional error argument. |

#### Returns

`fn`

A cleanup function which removes all registered listeners.

▸ (): `void`

##### Returns

`void`

**`Since`**

v10.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1227

▸ **finished**(`stream`, `callback`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) |
| `callback` | (`err?`: ``null`` \| [`ErrnoException`](../interfaces/internal-8.ErrnoException.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1228

___

### getDefaultHighWaterMark

▸ **getDefaultHighWaterMark**(`objectMode`): `number`

Returns the default highWaterMark used by streams.
Defaults to `16384` (16 KiB), or `16` for `objectMode`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectMode` | `boolean` |

#### Returns

`number`

**`Since`**

v19.9.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1169

___

### isErrored

▸ **isErrored**(`stream`): `boolean`

Returns whether the stream has encountered an error.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`Readable`](../classes/internal-8.Readable.md) \| [`Writable`](../classes/internal-8.internal-2.Writable.md) |

#### Returns

`boolean`

**`Since`**

v17.3.0, v16.14.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1406

___

### isReadable

▸ **isReadable**(`stream`): `boolean`

Returns whether the stream is readable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`Readable`](../classes/internal-8.Readable.md) |

#### Returns

`boolean`

**`Since`**

v17.4.0, v16.14.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1412

___

### pipeline

▸ **pipeline**<`A`, `B`\>(`source`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `A` | - |
| `destination` | `B` | - |
| `callback?` | [`PipelineCallback`](internal-8.internal-2.md#pipelinecallback)<`B`\> | Called when the pipeline is fully done. |

#### Returns

`B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

**`Since`**

v10.0.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1316

▸ **pipeline**<`A`, `T1`, `B`\>(`source`, `transform1`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](internal-8.internal-2.md#pipelinecallback)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1321

▸ **pipeline**<`A`, `T1`, `T2`, `B`\>(`source`, `transform1`, `transform2`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `T2` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T1`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](internal-8.internal-2.md#pipelinecallback)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1327

▸ **pipeline**<`A`, `T1`, `T2`, `T3`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `T2` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T1`, `any`\> |
| `T3` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T2`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](internal-8.internal-2.md#pipelinecallback)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1334

▸ **pipeline**<`A`, `T1`, `T2`, `T3`, `T4`, `B`\>(`source`, `transform1`, `transform2`, `transform3`, `transform4`, `destination`, `callback?`): `B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`PipelineSource`](internal-8.internal-2.md#pipelinesource)<`any`\> |
| `T1` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`A`, `any`\> |
| `T2` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T1`, `any`\> |
| `T3` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T2`, `any`\> |
| `T4` | extends [`PipelineTransform`](internal-8.internal-2.md#pipelinetransform)<`T3`, `any`\> |
| `B` | extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`string` \| [`Buffer`](internal-8.md#buffer)\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`string` \| [`Buffer`](internal-8.md#buffer), `any`\> \| [`PipelineDestinationIterableFunction`](internal-8.internal-2.md#pipelinedestinationiterablefunction)<`any`\> \| [`PipelineDestinationPromiseFunction`](internal-8.internal-2.md#pipelinedestinationpromisefunction)<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `A` |
| `transform1` | `T1` |
| `transform2` | `T2` |
| `transform3` | `T3` |
| `transform4` | `T4` |
| `destination` | `B` |
| `callback?` | [`PipelineCallback`](internal-8.internal-2.md#pipelinecallback)<`B`\> |

#### Returns

`B` extends [`WritableStream`](../interfaces/internal-8.WritableStream.md) ? `B` : [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1341

▸ **pipeline**(`streams`, `callback?`): [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `streams` | readonly ([`ReadableStream`](../interfaces/internal-8.ReadableStream.md) \| [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md))[] |
| `callback?` | (`err`: ``null`` \| [`ErrnoException`](../interfaces/internal-8.ErrnoException.md)) => `void` |

#### Returns

[`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1349

▸ **pipeline**(`stream1`, `stream2`, `...streams`): [`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream1` | [`ReadableStream`](../interfaces/internal-8.ReadableStream.md) |
| `stream2` | [`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) |
| `...streams` | ([`WritableStream`](../interfaces/internal-8.WritableStream.md) \| [`ReadWriteStream`](../interfaces/internal-8.ReadWriteStream.md) \| (`err`: ``null`` \| [`ErrnoException`](../interfaces/internal-8.ErrnoException.md)) => `void`)[] |

#### Returns

[`WritableStream`](../interfaces/internal-8.WritableStream.md)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1353

___

### setDefaultHighWaterMark

▸ **setDefaultHighWaterMark**(`objectMode`, `value`): `void`

Sets the default highWaterMark used by streams.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectMode` | `boolean` |  |
| `value` | `number` | highWaterMark value |

#### Returns

`void`

**`Since`**

v19.9.0

#### Defined in

packages/medusa-js/node_modules/@types/node/stream.d.ts:1176
