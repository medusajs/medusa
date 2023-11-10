# FindOptionsSelectProperty

 **FindOptionsSelectProperty**<`Property`\>: `Property` extends `Promise`<infer I\> ? [`FindOptionsSelectProperty`](FindOptionsSelectProperty.md)<`I`\> \| `boolean` : `Property` extends infer I[] ? [`FindOptionsSelectProperty`](FindOptionsSelectProperty.md)<`I`\> \| `boolean` : `Property` extends `string` ? `boolean` : `Property` extends `number` ? `boolean` : `Property` extends `boolean` ? `boolean` : `Property` extends `Function` ? `never` : `Property` extends [`Buffer`](../index.md#buffer) ? `boolean` : `Property` extends `Date` ? `boolean` : `Property` extends [`ObjectId`](../classes/ObjectId.md) ? `boolean` : `Property` extends `object` ? [`FindOptionsSelect`](FindOptionsSelect.md)<`Property`\> : `boolean`

A single property handler for FindOptionsSelect.

#### Type parameters

| Name |
| :------ |
| `Property` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsSelect.d.ts:6
