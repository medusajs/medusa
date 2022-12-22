# Class: FulfillmentProviderService

Helps retrive fulfillment providers

## Hierarchy

- `TransactionBaseService`

  ↳ **`FulfillmentProviderService`**

## Constructors

### constructor

• **new FulfillmentProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `FulfillmentProviderContainer` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:42](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L42)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### container\_

• `Protected` `Readonly` **container\_**: `FulfillmentProviderContainer`

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:38](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L38)

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: typeof `FulfillmentProviderRepository`

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:40](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:35](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L35)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:36](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L36)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### calculatePrice

▸ **calculatePrice**(`option`, `data`, `cart?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |
| `data` | `Record`<`string`, `unknown`\> |
| `cart?` | `Cart` \| `Order` |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:146](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L146)

___

### canCalculate

▸ **canCalculate**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:121](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L121)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillment`): `Promise`<`Fulfillment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillment` | `Fulfillment` |

#### Returns

`Promise`<`Fulfillment`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:139](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L139)

___

### createFulfillment

▸ **createFulfillment**(`method`, `items`, `order`, `fulfillment`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `ShippingMethod` |
| `items` | `LineItem`[] |
| `order` | `CreateFulfillmentOrder` |
| `fulfillment` | `Omit`<`Fulfillment`, ``"beforeInsert"``\> |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:106](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L106)

___

### createReturn

▸ **createReturn**(`returnOrder`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnOrder` | `CreateReturnType` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:164](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L164)

___

### list

▸ **list**(): `Promise`<`FulfillmentProvider`[]\>

#### Returns

`Promise`<`FulfillmentProvider`[]\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:66](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L66)

___

### listFulfillmentOptions

▸ **listFulfillmentOptions**(`providerIds`): `Promise`<`FulfillmentOptions`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<`FulfillmentOptions`[]\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:74](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L74)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:52](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L52)

___

### retrieveDocuments

▸ **retrieveDocuments**(`providerId`, `fulfillmentData`, `documentType`): `Promise`<`any`\>

Fetches documents from the fulfillment provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the id of the provider |
| `fulfillmentData` | `Record`<`string`, `unknown`\> | the data relating to the fulfillment |
| `documentType` | ``"label"`` \| ``"invoice"`` | the typ of |

#### Returns

`Promise`<`any`\>

document to fetch

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:183](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L183)

___

### retrieveProvider

▸ **retrieveProvider**(`providerId`): `any`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the provider id |

#### Returns

`any`

the payment fulfillment provider

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:95](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L95)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

___

### validateFulfillmentData

▸ **validateFulfillmentData**(`option`, `data`, `cart`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |
| `data` | `Record`<`string`, `unknown`\> |
| `cart` | `Record`<`string`, `unknown`\> \| `Cart` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:126](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L126)

___

### validateOption

▸ **validateOption**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:159](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/fulfillment-provider.ts#L159)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
