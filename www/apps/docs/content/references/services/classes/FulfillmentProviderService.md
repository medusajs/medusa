# FulfillmentProviderService

Helps retrieve fulfillment providers

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`FulfillmentProviderService`**

## Constructors

### constructor

**new FulfillmentProviderService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | [`FulfillmentProviderContainer`](../index.md#fulfillmentprovidercontainer) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L45)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

 `Protected` `Readonly` **container\_**: [`FulfillmentProviderContainer`](../index.md#fulfillmentprovidercontainer)

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L41)

___

### fulfillmentProviderRepository\_

 `Protected` `Readonly` **fulfillmentProviderRepository\_**: [`Repository`](Repository.md)<[`FulfillmentProvider`](FulfillmentProvider.md)\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L43)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculatePrice

**calculatePrice**(`option`, `data`, `cart?`): `Promise`<`number`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `option` | [`ShippingOption`](ShippingOption.md) | A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information. |
| `data` | Record<`string`, `unknown`\> |
| `cart?` | [`Order`](Order.md) \| [`Cart`](Cart.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:148](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L148)

___

### canCalculate

**canCalculate**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `option` | [`CalculateOptionPriceInput`](../index.md#calculateoptionpriceinput) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:123](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L123)

___

### cancelFulfillment

**cancelFulfillment**(`fulfillment`): `Promise`<[`Fulfillment`](Fulfillment.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `fulfillment` | [`Fulfillment`](Fulfillment.md) | A Fulfillment is created once an admin can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a fulfillment provider, which typically integrates a third-party shipping service. Fulfillments can be associated with orders, claims, swaps, and returns. |

#### Returns

`Promise`<[`Fulfillment`](Fulfillment.md)\>

-`Promise`: 
	-`Fulfillment`: 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:141](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L141)

___

### createFulfillment

**createFulfillment**(`method`, `items`, `order`, `fulfillment`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `method` | [`ShippingMethod`](ShippingMethod.md) | A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of. |
| `items` | [`LineItem`](LineItem.md)[] |
| `order` | [`CreateFulfillmentOrder`](../index.md#createfulfillmentorder) |
| `fulfillment` | [`Omit`](../index.md#omit)<[`Fulfillment`](Fulfillment.md), ``"beforeInsert"``\> |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:108](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L108)

___

### createReturn

**createReturn**(`returnOrder`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `returnOrder` | [`CreateReturnType`](../index.md#createreturntype) |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:166](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L166)

___

### list

**list**(): `Promise`<[`FulfillmentProvider`](FulfillmentProvider.md)[]\>

#### Returns

`Promise`<[`FulfillmentProvider`](FulfillmentProvider.md)[]\>

-`Promise`: 
	-`FulfillmentProvider[]`: 
		-`FulfillmentProvider`: 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L68)

___

### listFulfillmentOptions

**listFulfillmentOptions**(`providerIds`): `Promise`<[`FulfillmentOptions`](../index.md#fulfillmentoptions)[]\>

#### Parameters

| Name |
| :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<[`FulfillmentOptions`](../index.md#fulfillmentoptions)[]\>

-`Promise`: 
	-`FulfillmentOptions[]`: 
		-`FulfillmentOptions`: 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L76)

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

[packages/medusa/src/services/fulfillment-provider.ts:54](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L54)

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

[packages/medusa/src/services/fulfillment-provider.ts:185](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L185)

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

[packages/medusa/src/services/fulfillment-provider.ts:97](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L97)

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

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### validateFulfillmentData

**validateFulfillmentData**(`option`, `data`, `cart`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `option` | [`ShippingOption`](ShippingOption.md) | A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information. |
| `data` | Record<`string`, `unknown`\> |
| `cart` | Record<`string`, `unknown`\> \| [`Cart`](Cart.md) |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:128](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L128)

___

### validateOption

**validateOption**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `option` | [`ShippingOption`](ShippingOption.md) | A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information. |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:161](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment-provider.ts#L161)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`FulfillmentProviderService`](FulfillmentProviderService.md)

-`FulfillmentProviderService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
