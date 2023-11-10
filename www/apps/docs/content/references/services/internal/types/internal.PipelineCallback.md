# PipelineCallback

[internal](../../modules/internal.md).PipelineCallback

 **PipelineCallback**<`S`\>: `S` extends [`PipelineDestinationPromiseFunction`](internal.PipelineDestinationPromiseFunction.md)<`any`, infer P\> ? (`err`: [`ErrnoException`](../../interfaces/ErrnoException.md) \| ``null``, `value`: `P`) => `void` : (`err`: [`ErrnoException`](../../interfaces/ErrnoException.md) \| ``null``) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | [`PipelineDestination`](internal.PipelineDestination.md)<`any`, `any`\> |

#### Defined in

docs-util/node_modules/@types/node/stream.d.ts:1465
