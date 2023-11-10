# PipelineDestination

[internal](../../modules/internal.md).PipelineDestination

 **PipelineDestination**<`S`, `P`\>: `S` extends [`PipelineTransformSource`](internal.PipelineTransformSource.md)<infer ST\> ? [`WritableStream`](../../interfaces/WritableStream.md) \| [`PipelineDestinationIterableFunction`](internal.PipelineDestinationIterableFunction.md)<`ST`\> \| [`PipelineDestinationPromiseFunction`](internal.PipelineDestinationPromiseFunction.md)<`ST`, `P`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | [`PipelineTransformSource`](internal.PipelineTransformSource.md)<`any`\> |
| `P` | `object` |

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1459
