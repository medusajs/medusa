# PushOperator

 **PushOperator**<`TSchema`\>: { readonly [key in KeysOfAType<TSchema, ReadonlyArray<any\\>\\>]?: Flatten<TSchema[key]\\> \| ArrayOperator<Flatten<TSchema[key]\\>[]\\> } & [`NotAcceptedFields`](NotAcceptedFields.md)<`TSchema`, `ReadonlyArray`<`any`\>\> & { `[key: string]`: [`ArrayOperator`](ArrayOperator.md)<`any`\> \| `any`;  }

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4397
