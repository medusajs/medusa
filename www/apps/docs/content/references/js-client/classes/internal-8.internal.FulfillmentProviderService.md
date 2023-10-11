---
displayed_sidebar: jsClientSidebar
---

# Class: FulfillmentProviderService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).FulfillmentProviderService

Helps retrieve fulfillment providers

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`FulfillmentProviderService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### container\_

• `Protected` `Readonly` **container\_**: [`FulfillmentProviderContainer`](../modules/internal-8.md#fulfillmentprovidercontainer)

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:24

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: `Repository`<[`FulfillmentProvider`](internal-3.FulfillmentProvider.md)\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:25

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### calculatePrice

▸ **calculatePrice**(`option`, `data`, `cart?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`ShippingOption`](internal-3.ShippingOption.md) |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `cart?` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:39

___

### canCalculate

▸ **canCalculate**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`CalculateOptionPriceInput`](../modules/internal-8.md#calculateoptionpriceinput) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:36

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillment`): `Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillment` | [`Fulfillment`](internal-3.Fulfillment.md) |

#### Returns

`Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:38

___

### createFulfillment

▸ **createFulfillment**(`method`, `items`, `order`, `fulfillment`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | [`ShippingMethod`](internal-3.ShippingMethod.md) |
| `items` | [`LineItem`](internal-3.LineItem.md)[] |
| `order` | [`CreateFulfillmentOrder`](../modules/internal-8.md#createfulfillmentorder) |
| `fulfillment` | [`Omit`](../modules/internal-1.md#omit)<[`Fulfillment`](internal-3.Fulfillment.md), ``"beforeInsert"``\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:35

___

### createReturn

▸ **createReturn**(`returnOrder`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnOrder` | [`CreateReturnType`](../modules/internal-8.md#createreturntype) |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:41

___

### list

▸ **list**(): `Promise`<[`FulfillmentProvider`](internal-3.FulfillmentProvider.md)[]\>

#### Returns

`Promise`<[`FulfillmentProvider`](internal-3.FulfillmentProvider.md)[]\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:28

___

### listFulfillmentOptions

▸ **listFulfillmentOptions**(`providerIds`): `Promise`<[`FulfillmentOptions`](../modules/internal-8.md#fulfillmentoptions)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<[`FulfillmentOptions`](../modules/internal-8.md#fulfillmentoptions)[]\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:29

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

packages/medusa/dist/services/fulfillment-provider.d.ts:27

___

### retrieveDocuments

▸ **retrieveDocuments**(`providerId`, `fulfillmentData`, `documentType`): `Promise`<`any`\>

Fetches documents from the fulfillment provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the id of the provider |
| `fulfillmentData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the data relating to the fulfillment |
| `documentType` | ``"label"`` \| ``"invoice"`` | the typ of |

#### Returns

`Promise`<`any`\>

document to fetch

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:49

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

packages/medusa/dist/services/fulfillment-provider.d.ts:34

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### validateFulfillmentData

▸ **validateFulfillmentData**(`option`, `data`, `cart`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`ShippingOption`](internal-3.ShippingOption.md) |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `cart` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:37

___

### validateOption

▸ **validateOption**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`ShippingOption`](internal-3.ShippingOption.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/fulfillment-provider.d.ts:40

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
