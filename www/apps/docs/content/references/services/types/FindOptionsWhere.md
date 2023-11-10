# FindOptionsWhere

 **FindOptionsWhere**<`Entity`\>: { [P in keyof Entity]?: P extends "toString" ? unknown : FindOptionsWhereProperty<NonNullable<Entity[P]\\>\\> }

Used for find operations.

#### Type parameters

| Name |
| :------ |
| `Entity` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsWhere.d.ts:16
