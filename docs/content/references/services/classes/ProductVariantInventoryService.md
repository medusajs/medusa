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

[medusa/src/services/product-variant-inventory.ts:49](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L49)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cacheService\_

• `Protected` `Readonly` **cacheService\_**: `ICacheService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:47](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L47)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: `IEventBusService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:46](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L46)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `IInventoryService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:45](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L45)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[medusa/src/services/product-variant-inventory.ts:38](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L38)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/product-variant-inventory.ts:43](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L43)

___

### salesChannelInventoryService\_

• `Protected` `Readonly` **salesChannelInventoryService\_**: [`SalesChannelInventoryService`](SalesChannelInventoryService.md)

#### Defined in

[medusa/src/services/product-variant-inventory.ts:42](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L42)

___

### salesChannelLocationService\_

• `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Defined in

[medusa/src/services/product-variant-inventory.ts:41](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L41)

___

### stockLocationService\_

• `Protected` `Readonly` **stockLocationService\_**: `IStockLocationService`

#### Defined in

[medusa/src/services/product-variant-inventory.ts:44](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L44)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/services/product-variant-inventory.ts:39](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L39)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/product-variant-inventory.ts:649](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L649)

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

[medusa/src/services/product-variant-inventory.ts:439](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L439)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/product-variant-inventory.ts:256](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L256)

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

[medusa/src/services/product-variant-inventory.ts:75](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L75)

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

[medusa/src/services/product-variant-inventory.ts:614](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L614)

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

[medusa/src/services/product-variant-inventory.ts:318](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L318)

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

[medusa/src/services/product-variant-inventory.ts:752](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L752)

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

[medusa/src/services/product-variant-inventory.ts:863](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L863)

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

[medusa/src/services/product-variant-inventory.ts:178](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L178)

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

[medusa/src/services/product-variant-inventory.ts:195](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L195)

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

[medusa/src/services/product-variant-inventory.ts:234](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L234)

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

[medusa/src/services/product-variant-inventory.ts:216](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L216)

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

[medusa/src/services/product-variant-inventory.ts:348](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L348)

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

[medusa/src/services/product-variant-inventory.ts:151](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L151)

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

[medusa/src/services/product-variant-inventory.ts:819](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L819)

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

[medusa/src/services/product-variant-inventory.ts:693](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L693)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/product-variant-inventory.ts:549](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/product-variant-inventory.ts#L549)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
