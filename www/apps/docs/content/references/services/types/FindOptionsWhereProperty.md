# FindOptionsWhereProperty

 **FindOptionsWhereProperty**<`PropertyToBeNarrowed`, `Property`\>: `PropertyToBeNarrowed` extends `Promise`<infer I\> ? [`FindOptionsWhereProperty`](FindOptionsWhereProperty.md)<[`NonNullable`](NonNullable.md)<`I`\>\> : `PropertyToBeNarrowed` extends infer I[] ? [`FindOptionsWhereProperty`](FindOptionsWhereProperty.md)<[`NonNullable`](NonNullable.md)<`I`\>\> : `PropertyToBeNarrowed` extends `Function` ? `never` : `PropertyToBeNarrowed` extends [`Buffer`](../index.md#buffer) ? `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\> : `PropertyToBeNarrowed` extends `Date` ? `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\> : `PropertyToBeNarrowed` extends [`ObjectId`](../classes/ObjectId.md) ? `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\> : `PropertyToBeNarrowed` extends `string` ? `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\> : `PropertyToBeNarrowed` extends `number` ? `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\> : `PropertyToBeNarrowed` extends `boolean` ? `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\> : `PropertyToBeNarrowed` extends `object` ? [`FindOptionsWhere`](FindOptionsWhere.md)<`Property`\> \| [`FindOptionsWhere`](FindOptionsWhere.md)<`Property`\>[] \| [`EqualOperator`](../classes/EqualOperator.md)<`Property`\> \| [`FindOperator`](../classes/FindOperator.md)<`any`\> \| `boolean` : `Property` \| [`FindOperator`](../classes/FindOperator.md)<`Property`\>

A single property handler for FindOptionsWhere.

The reason why we have both "PropertyToBeNarrowed" and "Property" is that Union is narrowed down when extends is used.
It means the result of FindOptionsWhereProperty<1 | 2> doesn't include FindOperator<1 | 2> but FindOperator<1> | FindOperator<2>.
So we keep the original Union as Original and pass it to the FindOperator too. Original remains Union as extends is not used for it.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PropertyToBeNarrowed` | `object` |
| `Property` | `object` |

#### Defined in

node_modules/typeorm/find-options/FindOptionsWhere.d.ts:12
