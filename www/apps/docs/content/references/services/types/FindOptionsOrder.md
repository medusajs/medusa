# FindOptionsOrder

 **FindOptionsOrder**<`Entity`\>: { [P in keyof Entity]?: P extends "toString" ? unknown : FindOptionsOrderProperty<NonNullable<Entity[P]\\>\\> }

Order by find options.

#### Type parameters

| Name |
| :------ |
| `Entity` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsOrder.d.ts:10
