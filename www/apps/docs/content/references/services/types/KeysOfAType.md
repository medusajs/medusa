# KeysOfAType

 **KeysOfAType**<`TSchema`, `Type`\>: { [key in keyof TSchema]: NonNullable<TSchema[key]\\> extends Type ? key : never }[keyof `TSchema`]

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |
| `Type` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3333
