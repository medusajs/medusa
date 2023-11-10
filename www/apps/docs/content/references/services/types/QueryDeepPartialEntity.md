# \_QueryDeepPartialEntity

 **\_QueryDeepPartialEntity**<`T`\>: { [P in keyof T]?: (T[P] extends (infer U)[] ? \_QueryDeepPartialEntity<U\\>[] : T[P] extends ReadonlyArray<infer U\\> ? ReadonlyArray<\_QueryDeepPartialEntity<U\\>\\> : \_QueryDeepPartialEntity<T[P]\\>) \| Function }

#### Type parameters

| Name |
| :------ |
| `T` | `object` |

#### Defined in

node_modules/typeorm/query-builder/QueryPartialEntity.d.ts:12
