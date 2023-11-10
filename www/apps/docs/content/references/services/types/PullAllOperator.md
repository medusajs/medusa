# PullAllOperator

 **PullAllOperator**<`TSchema`\>: { readonly [key in KeysOfAType<TSchema, ReadonlyArray<any\\>\\>]?: TSchema[key] } & [`NotAcceptedFields`](NotAcceptedFields.md)<`TSchema`, `ReadonlyArray`<`any`\>\> & { `[key: string]`: `ReadonlyArray`<`any`\>;  }

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4385
