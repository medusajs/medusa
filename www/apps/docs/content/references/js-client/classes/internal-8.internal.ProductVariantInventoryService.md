---
displayed_sidebar: jsClientSidebar
---

# Class: ProductVariantInventoryService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ProductVariantInventoryService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ProductVariantInventoryService`**

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

### cacheService\_

• `Protected` `Readonly` **cacheService\_**: [`ICacheService`](../interfaces/internal-8.ICacheService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:32

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`IEventBusService`](../interfaces/internal-8.IEventBusService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:31

___

### getAvailabilityContext

• `Private` **getAvailabilityContext**: `any`

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:132

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`IInventoryService`](../interfaces/internal-8.IInventoryService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:30

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:24

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:28

___

### salesChannelInventoryService\_

• `Protected` `Readonly` **salesChannelInventoryService\_**: [`SalesChannelInventoryService`](internal-8.internal.SalesChannelInventoryService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:27

___

### salesChannelLocationService\_

• `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](internal-8.internal.SalesChannelLocationService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:26

___

### stockLocationService\_

• `Protected` `Readonly` **stockLocationService\_**: [`IStockLocationService`](../interfaces/internal-8.IStockLocationService.md)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:29

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:25

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

### adjustInventory

▸ **adjustInventory**(`variantId`, `locationId`, `quantity`): `Promise`<`void`\>

Adjusts inventory of a variant on a location

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | variant id |
| `locationId` | `string` | location id |
| `quantity` | `number` | quantity to adjust |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:130

___

### adjustReservationsQuantityByLineItem

▸ **adjustReservationsQuantityByLineItem**(`lineItemId`, `variantId`, `locationId`, `quantity`): `Promise`<`void`\>

Adjusts the quantity of reservations for a line item by a given amount.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItemId` | `string` | The ID of the line item |
| `variantId` | `string` | The ID of the variant |
| `locationId` | `string` | The ID of the location to prefer adjusting quantities at |
| `quantity` | `number` | The amount to adjust the quantity by |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:109

___

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

### attachInventoryItem

▸ **attachInventoryItem**(`attachments`): `Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

Attach a variant to an inventory item

#### Parameters

| Name | Type |
| :------ | :------ |
| `attachments` | { `inventoryItemId`: `string` ; `requiredQuantity?`: `number` ; `variantId`: `string`  }[] |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

the variant inventory item

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:83

▸ **attachInventoryItem**(`variantId`, `inventoryItemId`, `requiredQuantity?`): `Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantId` | `string` |
| `inventoryItemId` | `string` |
| `requiredQuantity?` | `number` |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:88

___

### confirmInventory

▸ **confirmInventory**(`variantId`, `quantity`, `context?`): `Promise`<[`Boolean`](../modules/internal-3.md#boolean)\>

confirms if requested inventory is available

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | id of the variant to confirm inventory for |
| `quantity` | `number` | quantity of inventory to confirm is available |
| `context?` | `Object` | optionally include a sales channel if applicable |
| `context.salesChannelId?` | ``null`` \| `string` | - |

#### Returns

`Promise`<[`Boolean`](../modules/internal-3.md#boolean)\>

boolean indicating if inventory is available

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:41

___

### deleteReservationsByLineItem

▸ **deleteReservationsByLineItem**(`lineItemId`, `variantId`, `quantity`): `Promise`<`void`\>

delete a reservation of variant quantity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItemId` | `string` \| `string`[] | line item id |
| `variantId` | `string` | variant id |
| `quantity` | `number` | quantity to release |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:123

___

### detachInventoryItem

▸ **detachInventoryItem**(`inventoryItemId`, `variantId?`): `Promise`<`void`\>

Remove a variant from an inventory item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inventoryItemId` | `string` | inventory item id |
| `variantId?` | `string` | variant id or undefined if all the variants will be affected |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:94

___

### getVariantQuantityFromVariantInventoryItems

▸ **getVariantQuantityFromVariantInventoryItems**(`variantInventoryItems`, `channelId`): `Promise`<`number`\>

Get the quantity of a variant from a list of variantInventoryItems
The inventory quantity of the variant should be equal to the inventory
item with the smallest stock, adjusted for quantity required to fulfill
the given variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantInventoryItems` | [`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[] | List of inventoryItems for a given variant, These must all be for the same variant |
| `channelId` | `string` | Sales channel id to fetch availability for |

#### Returns

`Promise`<`number`\>

The available quantity of the variant from the inventoryItems

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:144

___

### listByItem

▸ **listByItem**(`itemIds`): `Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

list registered inventory items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemIds` | `string`[] | list inventory item ids |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

list of inventory items

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:57

___

### listByVariant

▸ **listByVariant**(`variantId`): `Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

List inventory items for a specific variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` \| `string`[] | variant id |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]\>

variant inventory items for the variant id

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:63

___

### listInventoryItemsByVariant

▸ **listInventoryItemsByVariant**(`variantId`): `Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)[]\>

lists inventory items for a given variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | variant id |

#### Returns

`Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)[]\>

lidt of inventory items for the variant

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:75

___

### listVariantsByItem

▸ **listVariantsByItem**(`itemId`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

lists variant by inventory item id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemId` | `string` | item id |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

a list of product variants that are associated with the item id

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:69

___

### reserveQuantity

▸ **reserveQuantity**(`variantId`, `quantity`, `context?`): `Promise`<`void` \| [`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)[]\>

Reserves a quantity of a variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | variant id |
| `quantity` | `number` | quantity to reserve |
| `context?` | [`ReserveQuantityContext`](../modules/internal-8.md#reservequantitycontext) | optional parameters |

#### Returns

`Promise`<`void` \| [`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)[]\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:101

___

### retrieve

▸ **retrieve**(`inventoryItemId`, `variantId`): `Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)\>

Retrieves a product variant inventory item by its inventory item ID and variant ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inventoryItemId` | `string` | The ID of the inventory item to retrieve. |
| `variantId` | `string` | The ID of the variant to retrieve. |

#### Returns

`Promise`<[`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)\>

A promise that resolves with the product variant inventory item.

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:51

___

### setProductAvailability

▸ **setProductAvailability**(`products`, `salesChannelId`): `Promise`<([`Product`](internal-3.Product.md) \| [`PricedProduct`](../modules/internal-8.md#pricedproduct))[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | ([`Product`](internal-3.Product.md) \| [`PricedProduct`](../modules/internal-8.md#pricedproduct))[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |

#### Returns

`Promise`<([`Product`](internal-3.Product.md) \| [`PricedProduct`](../modules/internal-8.md#pricedproduct))[]\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:133

___

### setVariantAvailability

▸ **setVariantAvailability**(`variants`, `salesChannelId`, `availabilityContext?`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[] \| [`PricedVariant`](../modules/internal-8.md#pricedvariant)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variants` | [`ProductVariant`](internal-3.ProductVariant.md)[] \| [`PricedVariant`](../modules/internal-8.md#pricedvariant)[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |
| `availabilityContext?` | [`AvailabilityContext`](../modules/internal-8.md#availabilitycontext) |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[] \| [`PricedVariant`](../modules/internal-8.md#pricedvariant)[]\>

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:131

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

### validateInventoryAtLocation

▸ **validateInventoryAtLocation**(`items`, `locationId`): `Promise`<`void`\>

Validate stock at a location for fulfillment items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | [`Omit`](../modules/internal-1.md#omit)<[`LineItem`](internal-3.LineItem.md), ``"beforeInsert"``\>[] | Fulfillment Line items to validate quantities for |
| `locationId` | `string` | Location to validate stock at |

#### Returns

`Promise`<`void`\>

nothing if successful, throws error if not

#### Defined in

packages/medusa/dist/services/product-variant-inventory.d.ts:116

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
