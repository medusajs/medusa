# SetFields

 **SetFields**<`TSchema`\>: { readonly [key in KeysOfAType<TSchema, ReadonlyArray<any\\> \| undefined\\>]?: OptionalId<Flatten<TSchema[key]\\>\\> \| AddToSetOperators<OptionalId<Flatten<TSchema[key]\\>\\>[]\\> } & [`NotAcceptedFields`](NotAcceptedFields.md)<`TSchema`, `ReadonlyArray`<`any`\> \| `undefined`\> & { `[key: string]`: [`AddToSetOperators`](AddToSetOperators.md)<`any`\> \| `any`;  }

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4840
