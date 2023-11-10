# FindOptionsSelect

 **FindOptionsSelect**<`Entity`\>: { [P in keyof Entity]?: P extends "toString" ? unknown : FindOptionsSelectProperty<NonNullable<Entity[P]\\>\\> }

Select find options.

#### Type parameters

| Name |
| :------ |
| `Entity` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsSelect.d.ts:10
