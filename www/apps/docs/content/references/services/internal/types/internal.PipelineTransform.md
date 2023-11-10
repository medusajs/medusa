# PipelineTransform

[internal](../../modules/internal.md).PipelineTransform

 **PipelineTransform**<`S`, `U`\>: [`ReadWriteStream`](../../interfaces/ReadWriteStream.md) \| (`source`: `S` extends (...`args`: `any`[]) => [`Iterable`](../../interfaces/Iterable.md)<infer ST\> \| [`AsyncIterable`](../../interfaces/AsyncIterable.md)<infer ST\> ? [`AsyncIterable`](../../interfaces/AsyncIterable.md)<`ST`\> : `S`) => [`AsyncIterable`](../../interfaces/AsyncIterable.md)<`U`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | [`PipelineTransformSource`](internal.PipelineTransformSource.md)<`any`\> |
| `U` | `object` |

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1450
