# InjectorFunction

 **InjectorFunction**: <T\>(`container`: [`AwilixContainer`](../interfaces/AwilixContainer.md)<`T`\>) => `object`

#### Type declaration

<`T`\>(`container`): `object`

Gets passed the container and is expected to return an object
whose properties are accessible at construction time for the
configured resolver.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

##### Parameters

| Name |
| :------ |
| `container` | [`AwilixContainer`](../interfaces/AwilixContainer.md)<`T`\> |

##### Returns

`object`

-`object`: (optional) 

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:16
