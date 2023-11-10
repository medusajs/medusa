# Filter

 **Filter**<`TSchema`\>: { [P in keyof WithId<TSchema\\>]?: Condition<WithId<TSchema\\>[P]\\> } & [`RootFilterOperators`](../interfaces/RootFilterOperators.md)<[`WithId`](WithId.md)<`TSchema`\>\>

A MongoDB filter can be some portion of the schema or a set of operators

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2670
