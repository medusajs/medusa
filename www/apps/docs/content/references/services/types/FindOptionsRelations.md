# FindOptionsRelations

 **FindOptionsRelations**<`Entity`\>: { [P in keyof Entity]?: P extends "toString" ? unknown : FindOptionsRelationsProperty<NonNullable<Entity[P]\\>\\> }

Relations find options.

#### Type parameters

| Name |
| :------ |
| `Entity` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsRelations.d.ts:10
