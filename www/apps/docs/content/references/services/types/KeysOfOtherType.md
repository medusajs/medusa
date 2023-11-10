# KeysOfOtherType

 **KeysOfOtherType**<`TSchema`, `Type`\>: { [key in keyof TSchema]: NonNullable<TSchema[key]\\> extends Type ? never : key }[keyof `TSchema`]

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |
| `Type` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3337
