# JoinerRelationship

 **JoinerRelationship**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `alias` | `string` | - |
| `args?` | Record<`string`, `any`\> | Extra arguments to pass to the remoteFetchData callback |
| `foreignKey` | `string` | - |
| `inverse?` | `boolean` | In an inverted relationship the foreign key is on the other service and the primary key is on the current service |
| `isInternalService?` | `boolean` | If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services |
| `isList?` | `boolean` | Force the relationship to return a list |
| `primaryKey` | `string` | - |
| `serviceName` | `string` | - |

#### Defined in

packages/types/dist/joiner/index.d.ts:1
