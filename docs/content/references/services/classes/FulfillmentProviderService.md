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

[medusa/src/services/fulfillment-provider.ts:44](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L44)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

• `Protected` `Readonly` **container\_**: `FulfillmentProviderContainer`

#### Defined in

[medusa/src/services/fulfillment-provider.ts:40](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L40)

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: `Repository`<`FulfillmentProvider`\>

#### Defined in

[medusa/src/services/fulfillment-provider.ts:42](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L42)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculatePrice

▸ **calculatePrice**(`option`, `data`, `cart?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |
| `data` | `Record`<`string`, `unknown`\> |
| `cart?` | `Order` \| `Cart` |

#### Returns

`Promise`<`number`\>

#### Defined in

[medusa/src/services/fulfillment-provider.ts:147](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L147)

___

### canCalculate

▸ **canCalculate**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `CalculateOptionPriceInput` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[medusa/src/services/fulfillment-provider.ts:122](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L122)

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

[medusa/src/services/fulfillment-provider.ts:140](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L140)

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

[medusa/src/services/fulfillment-provider.ts:107](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L107)

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

[medusa/src/services/fulfillment-provider.ts:165](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L165)

___

### list

▸ **list**(): `Promise`<`FulfillmentProvider`[]\>

#### Returns

`Promise`<`FulfillmentProvider`[]\>

#### Defined in

[medusa/src/services/fulfillment-provider.ts:67](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L67)

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

[medusa/src/services/fulfillment-provider.ts:75](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L75)

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

[medusa/src/services/fulfillment-provider.ts:53](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L53)

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

[medusa/src/services/fulfillment-provider.ts:184](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L184)

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

[medusa/src/services/fulfillment-provider.ts:96](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L96)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/fulfillment-provider.ts:127](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L127)

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

[medusa/src/services/fulfillment-provider.ts:160](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/fulfillment-provider.ts#L160)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
