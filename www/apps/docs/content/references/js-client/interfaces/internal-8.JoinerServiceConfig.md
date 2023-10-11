---
displayed_sidebar: jsClientSidebar
---

# Interface: JoinerServiceConfig

[internal](../modules/internal-8.md).JoinerServiceConfig

## Properties

### alias

• `Optional` **alias**: [`JoinerServiceConfigAlias`](internal-8.JoinerServiceConfigAlias.md) \| [`JoinerServiceConfigAlias`](internal-8.JoinerServiceConfigAlias.md)[]

Property name to use as entrypoint to the service

#### Defined in

packages/types/dist/joiner/index.d.ts:36

___

### args

• `Optional` **args**: [`Record`](../modules/internal.md#record)<`string`, `any`\>

Extra arguments to pass to the remoteFetchData callback

#### Defined in

packages/types/dist/joiner/index.d.ts:53

___

### extends

• `Optional` **extends**: { `relationship`: [`JoinerRelationship`](../modules/internal-8.md#joinerrelationship) ; `serviceName`: `string`  }[]

#### Defined in

packages/types/dist/joiner/index.d.ts:46

___

### fieldAlias

• `Optional` **fieldAlias**: [`Record`](../modules/internal.md#record)<`string`, `string` \| { `forwardArgumentsOnPath`: `string`[] ; `path`: `string`  }\>

alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })

#### Defined in

packages/types/dist/joiner/index.d.ts:40

___

### primaryKeys

• **primaryKeys**: `string`[]

#### Defined in

packages/types/dist/joiner/index.d.ts:44

___

### relationships

• `Optional` **relationships**: [`JoinerRelationship`](../modules/internal-8.md#joinerrelationship)[]

#### Defined in

packages/types/dist/joiner/index.d.ts:45

___

### serviceName

• **serviceName**: `string`

#### Defined in

packages/types/dist/joiner/index.d.ts:32
