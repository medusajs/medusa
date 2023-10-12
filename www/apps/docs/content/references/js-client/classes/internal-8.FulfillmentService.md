---
displayed_sidebar: jsClientSidebar
---

# Class: FulfillmentService

[internal](../modules/internal-8.md).FulfillmentService

Handles Fulfillments

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`FulfillmentService`**

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

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:31

___

### fulfillmentRepository\_

• `Protected` `Readonly` **fulfillmentRepository\_**: `Repository`<[`Fulfillment`](internal-3.Fulfillment.md)\>

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:32

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<[`LineItem`](internal-3.LineItem.md)\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<[`LineItem`](internal-3.LineItem.md) & { `return_item`: [`ReturnItem`](internal-3.ReturnItem.md)  }[]\>  }

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:34

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:29

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:35

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](internal-8.internal.ShippingProfileService.md)

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:30

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:28

___

### trackingLinkRepository\_

• `Protected` `Readonly` **trackingLinkRepository\_**: `Repository`<[`TrackingLink`](internal-3.TrackingLink.md)\>

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:33

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

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentOrId`): `Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

Cancels a fulfillment with the fulfillment provider. Will decrement the
fulfillment_quantity on the line items associated with the fulfillment.
Throws if the fulfillment has already been shipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentOrId` | `string` \| [`Fulfillment`](internal-3.Fulfillment.md) | the fulfillment object or id. |

#### Returns

`Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

the result of the save operation

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:87

___

### createFulfillment

▸ **createFulfillment**(`order`, `itemsToFulfill`, `custom?`): `Promise`<[`Fulfillment`](internal-3.Fulfillment.md)[]\>

Creates an order fulfillment
If items needs to be fulfilled by different provider, we make
sure to partition those items, and create fulfillment for
those partitions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`CreateFulfillmentOrder`](../modules/internal-8.md#createfulfillmentorder) | order to create fulfillment for |
| `itemsToFulfill` | [`FulFillmentItemType`](../modules/internal-8.md#fulfillmentitemtype)[] | the items in the order to fulfill |
| `custom?` | [`Partial`](../modules/internal-8.md#partial)<[`Fulfillment`](internal-3.Fulfillment.md)\> | potential custom values to add |

#### Returns

`Promise`<[`Fulfillment`](internal-3.Fulfillment.md)[]\>

the created fulfillments

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:78

___

### createShipment

▸ **createShipment**(`fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

Creates a shipment by marking a fulfillment as shipped. Adds
tracking links and potentially more metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the fulfillment to ship |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | tracking links for the shipment |
| `config?` | [`CreateShipmentConfig`](../modules/internal-8.md#createshipmentconfig) | potential configuration settings, such as no_notification and metadata |

#### Returns

`Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

the shipped fulfillment

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:96

___

### getFulfillmentItems\_

▸ **getFulfillmentItems_**(`order`, `items`): `Promise`<(``null`` \| [`LineItem`](internal-3.LineItem.md))[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`CreateFulfillmentOrder`](../modules/internal-8.md#createfulfillmentorder) | the order to get line items from |
| `items` | [`FulFillmentItemType`](../modules/internal-8.md#fulfillmentitemtype)[] | the items to get |

#### Returns

`Promise`<(``null`` \| [`LineItem`](internal-3.LineItem.md))[]\>

the line items generated by the transformer.

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:48

___

### partitionItems\_

▸ **partitionItems_**(`shippingMethods`, `items`): [`FulfillmentItemPartition`](../modules/internal-8.md#fulfillmentitempartition)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethods` | [`ShippingMethod`](internal-3.ShippingMethod.md)[] |
| `items` | [`LineItem`](internal-3.LineItem.md)[] |

#### Returns

[`FulfillmentItemPartition`](../modules/internal-8.md#fulfillmentitempartition)[]

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:37

___

### retrieve

▸ **retrieve**(`fulfillmentId`, `config?`): `Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

Retrieves a fulfillment by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the id of the fulfillment to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Fulfillment`](internal-3.Fulfillment.md)\> | optional values to include with fulfillmentRepository query |

#### Returns

`Promise`<[`Fulfillment`](internal-3.Fulfillment.md)\>

the fulfillment

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:67

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

### validateFulfillmentLineItem\_

▸ **validateFulfillmentLineItem_**(`item`, `quantity`): ``null`` \| [`LineItem`](internal-3.LineItem.md)

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `undefined` \| [`LineItem`](internal-3.LineItem.md) | the line item to check has sufficient fulfillable quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| [`LineItem`](internal-3.LineItem.md)

a line item that has the requested fulfillment quantity
  set.

#### Defined in

packages/medusa/dist/services/fulfillment.d.ts:60

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`FulfillmentService`](internal-8.FulfillmentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentService`](internal-8.FulfillmentService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
