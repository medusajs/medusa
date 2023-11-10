# FulfillmentService

Handles Fulfillments

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`FulfillmentService`**

## Constructors

### constructor

**new FulfillmentService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-11) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L48)

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

### fulfillmentProviderService\_

 `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L41)

___

### fulfillmentRepository\_

 `Protected` `Readonly` **fulfillmentRepository\_**: [`Repository`](Repository.md)<[`Fulfillment`](Fulfillment.md)\>

#### Defined in

[packages/medusa/src/services/fulfillment.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L42)

___

### lineItemRepository\_

 `Protected` `Readonly` **lineItemRepository\_**: [`Repository`](Repository.md)<[`LineItem`](LineItem.md)\> & { `findByReturn`: Method findByReturn  }

#### Defined in

[packages/medusa/src/services/fulfillment.ts:44](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L44)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L39)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productVariantInventoryService\_

 `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L46)

___

### shippingProfileService\_

 `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L40)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L38)

___

### trackingLinkRepository\_

 `Protected` `Readonly` **trackingLinkRepository\_**: [`Repository`](Repository.md)<[`TrackingLink`](TrackingLink.md)\>

#### Defined in

[packages/medusa/src/services/fulfillment.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L43)

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

### cancelFulfillment

**cancelFulfillment**(`fulfillmentOrId`): `Promise`<[`Fulfillment`](Fulfillment.md)\>

Cancels a fulfillment with the fulfillment provider. Will decrement the
fulfillment_quantity on the line items associated with the fulfillment.
Throws if the fulfillment has already been shipped.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fulfillmentOrId` | `string` \| [`Fulfillment`](Fulfillment.md) | the fulfillment object or id. |

#### Returns

`Promise`<[`Fulfillment`](Fulfillment.md)\>

-`Promise`: the result of the save operation
	-`Fulfillment`: 

#### Defined in

[packages/medusa/src/services/fulfillment.ts:261](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L261)

___

### createFulfillment

**createFulfillment**(`order`, `itemsToFulfill`, `custom?`): `Promise`<[`Fulfillment`](Fulfillment.md)[]\>

Creates an order fulfillment
If items needs to be fulfilled by different provider, we make
sure to partition those items, and create fulfillment for
those partitions.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`CreateFulfillmentOrder`](../index.md#createfulfillmentorder) | order to create fulfillment for |
| `itemsToFulfill` | [`FulFillmentItemType`](../index.md#fulfillmentitemtype)[] | the items in the order to fulfill |
| `custom` | [`Partial`](../index.md#partial)<[`Fulfillment`](Fulfillment.md)\> | potential custom values to add |

#### Returns

`Promise`<[`Fulfillment`](Fulfillment.md)[]\>

-`Promise`: the created fulfillments
	-`Fulfillment[]`: 
		-`Fulfillment`: 

#### Defined in

[packages/medusa/src/services/fulfillment.ts:206](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L206)

___

### createShipment

**createShipment**(`fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`Fulfillment`](Fulfillment.md)\>

Creates a shipment by marking a fulfillment as shipped. Adds
tracking links and potentially more metadata.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fulfillmentId` | `string` | the fulfillment to ship |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | tracking links for the shipment |
| `config` | [`CreateShipmentConfig`](../index.md#createshipmentconfig) | potential configuration settings, such as no_notification and metadata |

#### Returns

`Promise`<[`Fulfillment`](Fulfillment.md)\>

-`Promise`: the shipped fulfillment
	-`Fulfillment`: 

#### Defined in

[packages/medusa/src/services/fulfillment.ts:313](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L313)

___

### getFulfillmentItems\_

**getFulfillmentItems_**(`order`, `items`): `Promise`<(``null`` \| [`LineItem`](LineItem.md))[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`CreateFulfillmentOrder`](../index.md#createfulfillmentorder) | the order to get line items from |
| `items` | [`FulFillmentItemType`](../index.md#fulfillmentitemtype)[] | the items to get |

#### Returns

`Promise`<(``null`` \| [`LineItem`](LineItem.md))[]\>

-`Promise`: the line items generated by the transformer.
	-`(``null`` \| LineItem)[]`: 
		-```null`` \| LineItem`: (optional) 

#### Defined in

[packages/medusa/src/services/fulfillment.ts:110](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L110)

___

### partitionItems\_

**partitionItems_**(`shippingMethods`, `items`): [`FulfillmentItemPartition`](../index.md#fulfillmentitempartition)[]

#### Parameters

| Name |
| :------ |
| `shippingMethods` | [`ShippingMethod`](ShippingMethod.md)[] |
| `items` | [`LineItem`](LineItem.md)[] |

#### Returns

[`FulfillmentItemPartition`](../index.md#fulfillmentitempartition)[]

-`FulfillmentItemPartition[]`: 
	-`FulfillmentItemPartition`: 
		-`items`: 
		-`shipping_method`: A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of.

#### Defined in

[packages/medusa/src/services/fulfillment.ts:71](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L71)

___

### retrieve

**retrieve**(`fulfillmentId`, `config?`): `Promise`<[`Fulfillment`](Fulfillment.md)\>

Retrieves a fulfillment by its id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fulfillmentId` | `string` | the id of the fulfillment to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Fulfillment`](Fulfillment.md)\> | optional values to include with fulfillmentRepository query |

#### Returns

`Promise`<[`Fulfillment`](Fulfillment.md)\>

-`Promise`: the fulfillment
	-`Fulfillment`: 

#### Defined in

[packages/medusa/src/services/fulfillment.ts:168](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L168)

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

### validateFulfillmentLineItem\_

**validateFulfillmentLineItem_**(`item`, `quantity`): ``null`` \| [`LineItem`](LineItem.md)

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Description |
| :------ | :------ |
| `item` | `undefined` \| [`LineItem`](LineItem.md) | the line item to check has sufficient fulfillable quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| [`LineItem`](LineItem.md)

-```null`` \| LineItem`: (optional) a line item that has the requested fulfillment quantity
  set.

#### Defined in

[packages/medusa/src/services/fulfillment.ts:135](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/fulfillment.ts#L135)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`FulfillmentService`](FulfillmentService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`FulfillmentService`](FulfillmentService.md)

-`FulfillmentService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
