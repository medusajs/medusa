# Class: ProductVariantInventoryService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductVariantInventoryService`**

## Constructors

### constructor

• **new ProductVariantInventoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product-variant-inventory.ts:48](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L48)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:6

___

### cacheService\_

• `Protected` `Readonly` **cacheService\_**: `ICacheService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:46](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L46)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: `IEventBusService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:45](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L45)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `IInventoryService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:44](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L44)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[medusa/src/services/product-variant-inventory.ts:37](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L37)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/product-variant-inventory.ts:42](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L42)

___

### salesChannelInventoryService\_

• `Protected` `Readonly` **salesChannelInventoryService\_**: [`SalesChannelInventoryService`](SalesChannelInventoryService.md)

#### Defined in

[medusa/src/services/product-variant-inventory.ts:41](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L41)

___

### salesChannelLocationService\_

• `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Defined in

[medusa/src/services/product-variant-inventory.ts:40](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L40)

___

### stockLocationService\_

• `Protected` `Readonly` **stockLocationService\_**: `IStockLocationService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:43](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L43)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/services/product-variant-inventory.ts:38](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L38)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:9

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

[medusa/src/services/product-variant-inventory.ts:617](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L617)

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

[medusa/src/services/product-variant-inventory.ts:427](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L427)

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

TransactionBaseService.atomicPhase\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:24

___

### attachInventoryItem

▸ **attachInventoryItem**(`variantId`, `inventoryItemId`, `requiredQuantity?`): `Promise`<`ProductVariantInventoryItem`\>

Attach a variant to an inventory item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | variant id |
| `inventoryItemId` | `string` | inventory item id |
| `requiredQuantity?` | `number` | quantity of variant to attach |

#### Returns

`Promise`<`ProductVariantInventoryItem`\>

the variant inventory item

#### Defined in

[medusa/src/services/product-variant-inventory.ts:255](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L255)

___

### confirmInventory

▸ **confirmInventory**(`variantId`, `quantity`, `context?`): `Promise`<`Boolean`\>

confirms if requested inventory is available

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | id of the variant to confirm inventory for |
| `quantity` | `number` | quantity of inventory to confirm is available |
| `context` | `Object` | optionally include a sales channel if applicable |
| `context.salesChannelId?` | ``null`` \| `string` | - |

#### Returns

`Promise`<`Boolean`\>

boolean indicating if inventory is available

#### Defined in

[medusa/src/services/product-variant-inventory.ts:74](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L74)

___

### deleteReservationsByLineItem

▸ **deleteReservationsByLineItem**(`lineItemId`, `variantId`, `quantity`): `Promise`<`void`\>

delete a reservation of variant quantity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItemId` | `string` | line item id |
| `variantId` | `string` | variant id |
| `quantity` | `number` | quantity to release |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/product-variant-inventory.ts:585](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L585)

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

[medusa/src/services/product-variant-inventory.ts:317](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L317)

___

### getAvailabilityContext

▸ `Private` **getAvailabilityContext**(`variants`, `salesChannelId`, `existingContext?`): `Promise`<`Required`<`AvailabilityContext`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variants` | `string`[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |
| `existingContext` | `AvailabilityContext` |

#### Returns

`Promise`<`Required`<`AvailabilityContext`\>\>

#### Defined in

[medusa/src/services/product-variant-inventory.ts:717](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L717)

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
| `variantInventoryItems` | `ProductVariantInventoryItem`[] | List of inventoryItems for a given variant, These must all be for the same variant |
| `channelId` | `string` | Sales channel id to fetch availability for |

#### Returns

`Promise`<`number`\>

The available quantity of the variant from the inventoryItems

#### Defined in

[medusa/src/services/product-variant-inventory.ts:824](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L824)

___

### listByItem

▸ **listByItem**(`itemIds`): `Promise`<`ProductVariantInventoryItem`[]\>

list registered inventory items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemIds` | `string`[] | list inventory item ids |

#### Returns

`Promise`<`ProductVariantInventoryItem`[]\>

list of inventory items

#### Defined in

[medusa/src/services/product-variant-inventory.ts:177](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L177)

___

### listByVariant

▸ **listByVariant**(`variantId`): `Promise`<`ProductVariantInventoryItem`[]\>

List inventory items for a specific variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` \| `string`[] | variant id |

#### Returns

`Promise`<`ProductVariantInventoryItem`[]\>

variant inventory items for the variant id

#### Defined in

[medusa/src/services/product-variant-inventory.ts:194](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L194)

___

### listInventoryItemsByVariant

▸ **listInventoryItemsByVariant**(`variantId`): `Promise`<`InventoryItemDTO`[]\>

lists inventory items for a given variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | variant id |

#### Returns

`Promise`<`InventoryItemDTO`[]\>

lidt of inventory items for the variant

#### Defined in

[medusa/src/services/product-variant-inventory.ts:233](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L233)

___

### listVariantsByItem

▸ **listVariantsByItem**(`itemId`): `Promise`<`ProductVariant`[]\>

lists variant by inventory item id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemId` | `string` | item id |

#### Returns

`Promise`<`ProductVariant`[]\>

a list of product variants that are associated with the item id

#### Defined in

[medusa/src/services/product-variant-inventory.ts:215](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L215)

___

### reserveQuantity

▸ **reserveQuantity**(`variantId`, `quantity`, `context?`): `Promise`<`void` \| `ReservationItemDTO`[]\>

Reserves a quantity of a variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | variant id |
| `quantity` | `number` | quantity to reserve |
| `context` | `ReserveQuantityContext` | optional parameters |

#### Returns

`Promise`<`void` \| `ReservationItemDTO`[]\>

#### Defined in

[medusa/src/services/product-variant-inventory.ts:347](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L347)

___

### retrieve

▸ **retrieve**(`inventoryItemId`, `variantId`): `Promise`<`ProductVariantInventoryItem`\>

Retrieves a product variant inventory item by its inventory item ID and variant ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inventoryItemId` | `string` | The ID of the inventory item to retrieve. |
| `variantId` | `string` | The ID of the variant to retrieve. |

#### Returns

`Promise`<`ProductVariantInventoryItem`\>

A promise that resolves with the product variant inventory item.

#### Defined in

[medusa/src/services/product-variant-inventory.ts:150](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L150)

___

### setProductAvailability

▸ **setProductAvailability**(`products`, `salesChannelId`): `Promise`<(`Product` \| `PricedProduct`)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | (`Product` \| `PricedProduct`)[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |

#### Returns

`Promise`<(`Product` \| `PricedProduct`)[]\>

#### Defined in

[medusa/src/services/product-variant-inventory.ts:784](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L784)

___

### setVariantAvailability

▸ **setVariantAvailability**(`variants`, `salesChannelId`, `availabilityContext?`): `Promise`<`ProductVariant`[] \| `PricedVariant`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variants` | `ProductVariant`[] \| `PricedVariant`[] |
| `salesChannelId` | `undefined` \| `string` \| `string`[] |
| `availabilityContext` | `AvailabilityContext` |

#### Returns

`Promise`<`ProductVariant`[] \| `PricedVariant`[]\>

#### Defined in

[medusa/src/services/product-variant-inventory.ts:658](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L658)

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

utils/dist/common/transaction-base-service.d.ts:12

___

### validateInventoryAtLocation

▸ **validateInventoryAtLocation**(`items`, `locationId`): `Promise`<`void`\>

Validate stock at a location for fulfillment items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | `Omit`<`LineItem`, ``"beforeInsert"``\>[] | Fulfillment Line items to validate quantities for |
| `locationId` | `string` | Location to validate stock at |

#### Returns

`Promise`<`void`\>

nothing if successful, throws error if not

#### Defined in

[medusa/src/services/product-variant-inventory.ts:528](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-variant-inventory.ts#L528)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

utils/dist/common/transaction-base-service.d.ts:11
