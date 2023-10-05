---
displayed_sidebar: modules
---

# JoinerServiceConfig

## Properties

### alias

 `Optional` **alias**: [`JoinerServiceConfigAlias`](JoinerServiceConfigAlias.md) \| [`JoinerServiceConfigAlias`](JoinerServiceConfigAlias.md)[]

Property name to use as entrypoint to the service

#### Defined in

[packages/types/src/joiner/index.ts:38](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L38)

___

### args

 `Optional` **args**: [`Record`](../index.md#record)<`string`, `any`\>

Extra arguments to pass to the remoteFetchData callback

#### Defined in

[packages/types/src/joiner/index.ts:59](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L59)

___

### extends

 `Optional` **extends**: { `relationship`: [`JoinerRelationship`](../index.md#joinerrelationship) ; `serviceName`: `string`  }[]

#### Defined in

[packages/types/src/joiner/index.ts:52](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L52)

___

### fieldAlias

 `Optional` **fieldAlias**: [`Record`](../index.md#record)<`string`, `string` \| { `forwardArgumentsOnPath`: `string`[] ; `path`: `string`  }\>

alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })

#### Defined in

[packages/types/src/joiner/index.ts:42](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L42)

___

### primaryKeys

 **primaryKeys**: `string`[]

#### Defined in

[packages/types/src/joiner/index.ts:50](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L50)

___

### relationships

 `Optional` **relationships**: [`JoinerRelationship`](../index.md#joinerrelationship)[]

#### Defined in

[packages/types/src/joiner/index.ts:51](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L51)

___

### serviceName

 **serviceName**: `string`

#### Defined in

[packages/types/src/joiner/index.ts:34](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L34)
