# FindOptionsRelationsProperty

 **FindOptionsRelationsProperty**<`Property`\>: `Property` extends `Promise`<infer I\> ? [`FindOptionsRelationsProperty`](FindOptionsRelationsProperty.md)<[`NonNullable`](NonNullable.md)<`I`\>\> \| `boolean` : `Property` extends infer I[] ? [`FindOptionsRelationsProperty`](FindOptionsRelationsProperty.md)<[`NonNullable`](NonNullable.md)<`I`\>\> \| `boolean` : `Property` extends `string` ? `never` : `Property` extends `number` ? `never` : `Property` extends `boolean` ? `never` : `Property` extends `Function` ? `never` : `Property` extends [`Buffer`](../index.md#buffer) ? `never` : `Property` extends `Date` ? `never` : `Property` extends [`ObjectId`](../classes/ObjectId.md) ? `never` : `Property` extends `object` ? [`FindOptionsRelations`](FindOptionsRelations.md)<`Property`\> \| `boolean` : `boolean`

A single property handler for FindOptionsRelations.

#### Type parameters

| Name |
| :------ |
| `Property` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsRelations.d.ts:6
