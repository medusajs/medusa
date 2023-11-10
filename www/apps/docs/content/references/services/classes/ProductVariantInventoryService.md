# ProductVariantInventoryService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ProductVariantInventoryService`**

## Constructors

### constructor

**new ProductVariantInventoryService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-29.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L54)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`IEventBusService`](../interfaces/IEventBusService.md)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:44](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L44)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:38](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L38)

___

### productVariantService\_

 `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:43](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L43)

___

### salesChannelInventoryService\_

 `Protected` `Readonly` **salesChannelInventoryService\_**: [`SalesChannelInventoryService`](SalesChannelInventoryService.md)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L42)

___

### salesChannelLocationService\_

 `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:41](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L41)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:39](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L39)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### inventoryService\_

`Protected` `get` **inventoryService_**(): [`IInventoryService`](../interfaces/IInventoryService.md)

#### Returns

[`IInventoryService`](../interfaces/IInventoryService.md)

-`__joinerConfig`: 
-`adjustInventory`: 
-`confirmInventory`: 
-`createInventoryItem`: 
-`createInventoryItems`: 
-`createInventoryLevel`: 
-`createInventoryLevels`: 
-`createReservationItem`: 
-`createReservationItems`: 
-`deleteInventoryItem`: 
-`deleteInventoryItemLevelByLocationId`: 
-`deleteInventoryLevel`: 
-`deleteReservationItem`: 
-`deleteReservationItemByLocationId`: 
-`deleteReservationItemsByLineItem`: 
-`listInventoryItems`: 
-`listInventoryLevels`: 
-`listReservationItems`: 
-`restoreInventoryItem`: 
-`retrieveAvailableQuantity`: 
-`retrieveInventoryItem`: 
-`retrieveInventoryLevel`: 
-`retrieveReservationItem`: 
-`retrieveReservedQuantity`: 
-`retrieveStockedQuantity`: 
-`updateInventoryItem`: 
-`updateInventoryLevel`: 
-`updateInventoryLevels`: 
-`updateReservationItem`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L46)

___

### stockLocationService\_

`Protected` `get` **stockLocationService_**(): [`IStockLocationService`](../interfaces/IStockLocationService.md)

#### Returns

[`IStockLocationService`](../interfaces/IStockLocationService.md)

-`__joinerConfig`: 
-`create`: 
-`delete`: 
-`list`: 
-`listAndCount`: 
-`retrieve`: 
-`update`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:50](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L50)

## Methods

### adjustInventory

**adjustInventory**(`variantId`, `locationId`, `quantity`): `Promise`<`void`\>

Adjusts inventory of a variant on a location

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | variant id |
| `locationId` | `string` | location id |
| `quantity` | `number` | quantity to adjust |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:740](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L740)

___

### adjustReservationsQuantityByLineItem

**adjustReservationsQuantityByLineItem**(`lineItemId`, `variantId`, `locationId`, `quantity`): `Promise`<`void`\>

Adjusts the quantity of reservations for a line item by a given amount.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItemId` | `string` | The ID of the line item |
| `variantId` | `string` | The ID of the variant |
| `locationId` | `string` | The ID of the location to prefer adjusting quantities at |
| `quantity` | `number` | The amount to adjust the quantity by |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:530](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L530)

___

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### attachInventoryItem

**attachInventoryItem**(`attachments`): `Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

Attach a variant to an inventory item

#### Parameters

| Name |
| :------ |
| `attachments` | { `inventoryItemId`: `string` ; `requiredQuantity?`: `number` ; `variantId`: `string`  }[] |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

-`Promise`: the variant inventory item
	-`ProductVariantInventoryItem[]`: 
		-`ProductVariantInventoryItem`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:257](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L257)

**attachInventoryItem**(`variantId`, `inventoryItemId`, `requiredQuantity?`): `Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

#### Parameters

| Name |
| :------ |
| `variantId` | `string` |
| `inventoryItemId` | `string` |
| `requiredQuantity?` | `number` |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

-`Promise`: 
	-`ProductVariantInventoryItem[]`: 
		-`ProductVariantInventoryItem`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:264](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L264)

___

### confirmInventory

**confirmInventory**(`variantId`, `quantity`, `context?`): `Promise`<[`Boolean`](../index.md#boolean)\>

confirms if requested inventory is available

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | id of the variant to confirm inventory for |
| `quantity` | `number` | quantity of inventory to confirm is available |
| `context` | `object` | optionally include a sales channel if applicable |
| `context.salesChannelId?` | ``null`` \| `string` |

#### Returns

`Promise`<[`Boolean`](../index.md#boolean)\>

-`Promise`: boolean indicating if inventory is available
	-`Boolean`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:76](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L76)

___

### deleteReservationsByLineItem

**deleteReservationsByLineItem**(`lineItemId`, `variantId`, `quantity`): `Promise`<`void`\>

delete a reservation of variant quantity

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItemId` | `string` \| `string`[] | line item id |
| `variantId` | `string` | variant id |
| `quantity` | `number` | quantity to release |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:705](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L705)

___

### detachInventoryItem

**detachInventoryItem**(`inventoryItemId`, `variantId?`): `Promise`<`void`\>

Remove a variant from an inventory item

#### Parameters

| Name | Description |
| :------ | :------ |
| `inventoryItemId` | `string` | inventory item id |
| `variantId?` | `string` | variant id or undefined if all the variants will be affected |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:409](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L409)

___

### getAvailabilityContext

`Private` **getAvailabilityContext**(`variants`, `salesChannelId`, `existingContext?`): `Promise`<[`Required`](../types/Required.md)<[`AvailabilityContext`](../types/AvailabilityContext.md)\>\>

#### Parameters

| Name |
| :------ |
| `variants` | `string`[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |
| `existingContext` | [`AvailabilityContext`](../types/AvailabilityContext.md) |

#### Returns

`Promise`<[`Required`](../types/Required.md)<[`AvailabilityContext`](../types/AvailabilityContext.md)\>\>

-`Promise`: 
	-`Required`: 
		-`AvailabilityContext`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:843](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L843)

___

### getVariantQuantityFromVariantInventoryItems

**getVariantQuantityFromVariantInventoryItems**(`variantInventoryItems`, `channelId`): `Promise`<`number`\>

Get the quantity of a variant from a list of variantInventoryItems
The inventory quantity of the variant should be equal to the inventory
item with the smallest stock, adjusted for quantity required to fulfill
the given variant.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantInventoryItems` | [`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[] | List of inventoryItems for a given variant, These must all be for the same variant |
| `channelId` | `string` | Sales channel id to fetch availability for |

#### Returns

`Promise`<`number`\>

-`Promise`: The available quantity of the variant from the inventoryItems
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:954](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L954)

___

### listByItem

**listByItem**(`itemIds`): `Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

list registered inventory items

#### Parameters

| Name | Description |
| :------ | :------ |
| `itemIds` | `string`[] | list inventory item ids |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

-`Promise`: list of inventory items
	-`ProductVariantInventoryItem[]`: 
		-`ProductVariantInventoryItem`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:179](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L179)

___

### listByVariant

**listByVariant**(`variantId`): `Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

List inventory items for a specific variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` \| `string`[] | variant id |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]\>

-`Promise`: variant inventory items for the variant id
	-`ProductVariantInventoryItem[]`: 
		-`ProductVariantInventoryItem`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:196](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L196)

___

### listInventoryItemsByVariant

**listInventoryItemsByVariant**(`variantId`): `Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)[]\>

lists inventory items for a given variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | variant id |

#### Returns

`Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)[]\>

-`Promise`: lidt of inventory items for the variant
	-`InventoryItemDTO[]`: 
		-`InventoryItemDTO`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:235](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L235)

___

### listVariantsByItem

**listVariantsByItem**(`itemId`): `Promise`<[`ProductVariant`](ProductVariant.md)[]\>

lists variant by inventory item id

#### Parameters

| Name | Description |
| :------ | :------ |
| `itemId` | `string` | item id |

#### Returns

`Promise`<[`ProductVariant`](ProductVariant.md)[]\>

-`Promise`: a list of product variants that are associated with the item id
	-`ProductVariant[]`: 
		-`ProductVariant`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:217](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L217)

___

### reserveQuantity

**reserveQuantity**(`variantId`, `quantity`, `context?`): `Promise`<`void` \| [`ReservationItemDTO`](../types/ReservationItemDTO.md)[]\>

Reserves a quantity of a variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | variant id |
| `quantity` | `number` | quantity to reserve |
| `context` | [`ReserveQuantityContext`](../types/ReserveQuantityContext.md) | optional parameters |

#### Returns

`Promise`<`void` \| [`ReservationItemDTO`](../types/ReservationItemDTO.md)[]\>

-`Promise`: 
	-`void \| ReservationItemDTO[]`: (optional) 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:439](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L439)

___

### retrieve

**retrieve**(`inventoryItemId`, `variantId`): `Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)\>

Retrieves a product variant inventory item by its inventory item ID and variant ID.

#### Parameters

| Name | Description |
| :------ | :------ |
| `inventoryItemId` | `string` | The ID of the inventory item to retrieve. |
| `variantId` | `string` | The ID of the variant to retrieve. |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)\>

-`Promise`: A promise that resolves with the product variant inventory item.
	-`ProductVariantInventoryItem`: 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:152](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L152)

___

### setProductAvailability

**setProductAvailability**(`products`, `salesChannelId`): `Promise`<([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[]\>

#### Parameters

| Name |
| :------ |
| `products` | ([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |

#### Returns

`Promise`<([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[]\>

-`Promise`: 
	-`(Product \| PricedProduct)[]`: 
		-`Product \| PricedProduct`: (optional) 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:910](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L910)

___

### setVariantAvailability

**setVariantAvailability**(`variants`, `salesChannelId`, `availabilityContext?`): `Promise`<[`ProductVariant`](ProductVariant.md)[] \| [`PricedVariant`](../types/PricedVariant.md)[]\>

#### Parameters

| Name |
| :------ |
| `variants` | [`ProductVariant`](ProductVariant.md)[] \| [`PricedVariant`](../types/PricedVariant.md)[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |
| `availabilityContext` | [`AvailabilityContext`](../types/AvailabilityContext.md) |

#### Returns

`Promise`<[`ProductVariant`](ProductVariant.md)[] \| [`PricedVariant`](../types/PricedVariant.md)[]\>

-`Promise`: 
	-`ProductVariant[] \| PricedVariant[]`: (optional) 

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:784](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L784)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### validateInventoryAtLocation

**validateInventoryAtLocation**(`items`, `locationId`): `Promise`<`void`\>

Validate stock at a location for fulfillment items

#### Parameters

| Name | Description |
| :------ | :------ |
| `items` | [`Omit`](../types/Omit.md)<[`LineItem`](LineItem.md), ``"beforeInsert"``\>[] | Fulfillment Line items to validate quantities for |
| `locationId` | `string` | Location to validate stock at |

#### Returns

`Promise`<`void`\>

-`Promise`: nothing if successful, throws error if not

#### Defined in

[packages/medusa/src/services/product-variant-inventory.ts:640](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/product-variant-inventory.ts#L640)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ProductVariantInventoryService`](ProductVariantInventoryService.md)

-`ProductVariantInventoryService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
