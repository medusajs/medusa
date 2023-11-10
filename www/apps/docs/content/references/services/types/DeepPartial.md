# DeepPartial

 **DeepPartial**<`T`\>: `T` \| `T` extends infer U[] ? [`DeepPartial`](DeepPartial.md)<`U`\>[] : `T` extends `Map`<infer K, infer V\> ? `Map`<[`DeepPartial`](DeepPartial.md)<`K`\>, [`DeepPartial`](DeepPartial.md)<`V`\>\> : `T` extends `Set`<infer M\> ? `Set`<[`DeepPartial`](DeepPartial.md)<`M`\>\> : `T` extends `object` ? { [K in keyof T]?: DeepPartial<T[K]\\> } : `T`

Same as Partial<T> but goes deeper and makes Partial<T> all its properties and sub-properties.

#### Type parameters

| Name |
| :------ |
| `T` | `object` |

#### Defined in

node_modules/typeorm/common/DeepPartial.d.ts:4
