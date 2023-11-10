# FindOptionsOrderProperty

 **FindOptionsOrderProperty**<`Property`\>: `Property` extends `Promise`<infer I\> ? [`FindOptionsOrderProperty`](FindOptionsOrderProperty.md)<[`NonNullable`](NonNullable.md)<`I`\>\> : `Property` extends infer I[] ? [`FindOptionsOrderProperty`](FindOptionsOrderProperty.md)<[`NonNullable`](NonNullable.md)<`I`\>\> : `Property` extends `Function` ? `never` : `Property` extends `string` ? [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : `Property` extends `number` ? [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : `Property` extends `boolean` ? [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : `Property` extends [`Buffer`](../index.md#buffer) ? [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : `Property` extends `Date` ? [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : `Property` extends [`ObjectId`](../classes/ObjectId.md) ? [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : `Property` extends `object` ? [`FindOptionsOrder`](FindOptionsOrder.md)<`Property`\> \| [`FindOptionsOrderValue`](FindOptionsOrderValue.md) : [`FindOptionsOrderValue`](FindOptionsOrderValue.md)

A single property handler for FindOptionsOrder.

#### Type parameters

| Name |
| :------ |
| `Property` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsOrder.d.ts:6
