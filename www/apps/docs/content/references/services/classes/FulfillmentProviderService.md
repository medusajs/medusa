# FulfillmentProviderService

Helps retrieve fulfillment providers

## Hierarchy

- `TransactionBaseService`

  ↳ **`FulfillmentProviderService`**

## Constructors

### constructor

**new FulfillmentProviderService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | `FulfillmentProviderContainer` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/fulfillment-provider.ts:44](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L44)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

 `Protected` `Readonly` **container\_**: `FulfillmentProviderContainer`

#### Defined in

[medusa/src/services/fulfillment-provider.ts:40](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L40)

___

### fulfillmentProviderRepository\_

 `Protected` `Readonly` **fulfillmentProviderRepository\_**: `Repository`<`FulfillmentProvider`\>

#### Defined in

[medusa/src/services/fulfillment-provider.ts:42](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L42)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculatePrice

**calculatePrice**(`option`, `data`, `cart?`): `Promise`<`number`\>

#### Parameters

| Name |
| :------ |
| `option` | `ShippingOption` |
| `data` | Record<`string`, `unknown`\> |
| `cart?` | `Order` \| `Cart` |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:147](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L147)

___

### canCalculate

**canCalculate**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `option` | `CalculateOptionPriceInput` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:122](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L122)

___

### cancelFulfillment

**cancelFulfillment**(`fulfillment`): `Promise`<`Fulfillment`\>

#### Parameters

| Name |
| :------ |
| `fulfillment` | `Fulfillment` |

#### Returns

`Promise`<`Fulfillment`\>

-`Promise`: 
	-`Fulfillment`: 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:140](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L140)

___

### createFulfillment

**createFulfillment**(`method`, `items`, `order`, `fulfillment`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `method` | `ShippingMethod` |
| `items` | `LineItem`[] |
| `order` | `CreateFulfillmentOrder` |
| `fulfillment` | `Omit`<`Fulfillment`, ``"beforeInsert"``\> |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:107](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L107)

___

### createReturn

**createReturn**(`returnOrder`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `returnOrder` | `CreateReturnType` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:165](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L165)

___

### list

**list**(): `Promise`<`FulfillmentProvider`[]\>

#### Returns

`Promise`<`FulfillmentProvider`[]\>

-`Promise`: 
	-`FulfillmentProvider[]`: 
		-`FulfillmentProvider`: 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:67](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L67)

___

### listFulfillmentOptions

**listFulfillmentOptions**(`providerIds`): `Promise`<`FulfillmentOptions`[]\>

#### Parameters

| Name |
| :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<`FulfillmentOptions`[]\>

-`Promise`: 
	-`FulfillmentOptions[]`: 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:75](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L75)

___

### registerInstalledProviders

**registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `providers` | `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:53](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L53)

___

### retrieveDocuments

**retrieveDocuments**(`providerId`, `fulfillmentData`, `documentType`): `Promise`<`any`\>

Fetches documents from the fulfillment provider

#### Parameters

| Name | Description |
| :------ | :------ |
| `providerId` | `string` | the id of the provider |
| `fulfillmentData` | Record<`string`, `unknown`\> | the data relating to the fulfillment |
| `documentType` | ``"label"`` \| ``"invoice"`` | the typ of |

#### Returns

`Promise`<`any`\>

-`Promise`: document to fetch
	-`any`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:184](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L184)

___

### retrieveProvider

**retrieveProvider**(`providerId`): `any`

#### Parameters

| Name | Description |
| :------ | :------ |
| `providerId` | `string` | the provider id |

#### Returns

`any`

-`any`: (optional) the payment fulfillment provider

#### Defined in

[medusa/src/services/fulfillment-provider.ts:96](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L96)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### validateFulfillmentData

**validateFulfillmentData**(`option`, `data`, `cart`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `option` | `ShippingOption` |
| `data` | Record<`string`, `unknown`\> |
| `cart` | Record<`string`, `unknown`\> \| `Cart` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:127](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L127)

___

### validateOption

**validateOption**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `option` | `ShippingOption` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[medusa/src/services/fulfillment-provider.ts:160](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/fulfillment-provider.ts#L160)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentProviderService`](FulfillmentProviderService.md)

-`FulfillmentProviderService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
