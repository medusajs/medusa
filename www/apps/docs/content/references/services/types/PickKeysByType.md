# PickKeysByType

 **PickKeysByType**<`T`, `U`\>: `string` & keyof { [P in keyof T as T[P] extends U ? P : never]: T[P] }

Pick only the keys that match the Type `U`

#### Type parameters

| Name |
| :------ |
| `T` | `object` |
| `U` | `object` |

#### Defined in

node_modules/typeorm/common/PickKeysByType.d.ts:4
