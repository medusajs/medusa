# FilterOperations

 **FilterOperations**<`T`\>: `T` extends Record<`string`, `any`\> ? { [key in keyof T]?: FilterOperators<T[key]\\> } : [`FilterOperators`](../interfaces/FilterOperators.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2674
