---
displayed_sidebar: jsClientSidebar
---

# Class: ClaimService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ClaimService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ClaimService`**

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

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<[`Address`](internal-3.Address.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:50

___

### claimItemService\_

• `Protected` `Readonly` **claimItemService\_**: [`ClaimItemService`](internal-8.internal.ClaimItemService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:54

___

### claimRepository\_

• `Protected` `Readonly` **claimRepository\_**: `Repository`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:51

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:55

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:56

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](internal-8.FulfillmentService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:57

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<[`LineItem`](internal-3.LineItem.md)\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<[`LineItem`](internal-3.LineItem.md) & { `return_item`: [`ReturnItem`](internal-3.ReturnItem.md)  }[]\>  }

#### Defined in

packages/medusa/dist/services/claim.d.ts:53

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:58

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:59

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:65

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:60

___

### returnService\_

• `Protected` `Readonly` **returnService\_**: [`ReturnService`](internal-8.internal.ReturnService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:61

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: `Repository`<[`ShippingMethod`](internal-3.ShippingMethod.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:52

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:62

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:63

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/claim.d.ts:64

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/claim.d.ts:42

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

### cancel

▸ **cancel**(`id`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:109

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentId` | `string` |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:101

___

### create

▸ **create**(`data`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

Creates a Claim on an Order. Claims consists of items that are claimed and
optionally items to be sent as replacement for the claimed items. The
shipping address that the new items will be shipped to

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreateClaimInput`](../modules/internal-8.md#createclaiminput) | the object containing all data required to create a claim |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

created claim

#### Defined in

packages/medusa/dist/services/claim.d.ts:88

___

### createFulfillment

▸ **createFulfillment**(`id`, `config?`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the object containing all data required to create a claim |
| `config?` | `Object` | config object |
| `config.location_id?` | `string` | - |
| `config.metadata?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | config metadata |
| `config.no_notification?` | `boolean` | config no notification |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

created claim

#### Defined in

packages/medusa/dist/services/claim.d.ts:96

___

### createShipment

▸ **createShipment**(`id`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fulfillmentId` | `string` |
| `trackingLinks?` | { `tracking_number`: `string`  }[] |
| `config?` | `Object` |
| `config.metadata` | `Object` |
| `config.no_notification` | `undefined` |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:103

___

### getRefundTotalForClaimLinesOnOrder

▸ `Protected` **getRefundTotalForClaimLinesOnOrder**(`order`, `claimItems`): `Promise`<`number`\>

Finds claim line items on an order and calculates the refund amount.
There are three places too look:
- Order items
- Swap items
- Claim items (from previous claims)
Note, it will attempt to return early from each of these places to avoid having to iterate over all items every time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to find claim lines on |
| `claimItems` | [`CreateClaimItemInput`](../modules/internal-8.md#createclaimiteminput)[] | the claim items to match against |

#### Returns

`Promise`<`number`\>

the refund amount

#### Defined in

packages/medusa/dist/services/claim.d.ts:80

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ClaimOrder`](internal-3.ClaimOrder.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/claim.d.ts:115

___

### processRefund

▸ **processRefund**(`id`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:102

___

### retrieve

▸ **retrieve**(`claimId`, `config?`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `claimId` | `string` | id of the claim order to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ClaimOrder`](internal-3.ClaimOrder.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

the order document

#### Defined in

packages/medusa/dist/services/claim.d.ts:122

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

### update

▸ **update**(`id`, `data`): `Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | [`UpdateClaimInput`](../modules/internal-8.md#updateclaiminput) |

#### Returns

`Promise`<[`ClaimOrder`](internal-3.ClaimOrder.md)\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:67

___

### validateCreateClaimInput

▸ `Protected` **validateCreateClaimInput**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateClaimInput`](../modules/internal-8.md#createclaiminput) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/claim.d.ts:68

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ClaimService`](internal-8.internal.ClaimService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ClaimService`](internal-8.internal.ClaimService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
