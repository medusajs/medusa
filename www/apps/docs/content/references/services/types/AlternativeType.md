# AlternativeType

 **AlternativeType**<`T`\>: `T` extends `ReadonlyArray`<infer U\> ? `T` \| [`RegExpOrString`](RegExpOrString.md)<`U`\> : [`RegExpOrString`](RegExpOrString.md)<`T`\>

It is possible to search using alternative types in mongodb e.g.
string types can be searched using a regex in mongo
array types can be searched using their element type

#### Type parameters

| Name |
| :------ |
| `T` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:401
