# PullOperator

 **PullOperator**<`TSchema`\>: { readonly [key in KeysOfAType<TSchema, ReadonlyArray<any\\>\\>]?: Partial<Flatten<TSchema[key]\\>\\> \| FilterOperations<Flatten<TSchema[key]\\>\\> } & [`NotAcceptedFields`](NotAcceptedFields.md)<`TSchema`, `ReadonlyArray`<`any`\>\> & { `[key: string]`: [`FilterOperators`](../interfaces/FilterOperators.md)<`any`\> \| `any`;  }

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4391
