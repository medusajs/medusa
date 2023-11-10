# EnhancedOmit

 **EnhancedOmit**<`TRecordOrUnion`, `KeyUnion`\>: `string` extends keyof `TRecordOrUnion` ? `TRecordOrUnion` : `TRecordOrUnion` extends `any` ? [`Pick`](Pick.md)<`TRecordOrUnion`, [`Exclude`](Exclude.md)<keyof `TRecordOrUnion`, `KeyUnion`\>\> : `never`

TypeScript Omit (Exclude to be specific) does not work for objects with an "any" indexed type, and breaks discriminated unions

#### Type parameters

| Name |
| :------ |
| `TRecordOrUnion` | `object` |
| `KeyUnion` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2619
