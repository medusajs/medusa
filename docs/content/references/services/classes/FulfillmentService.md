# Class: FulfillmentService

Handles Fulfillments

## Hierarchy

- `TransactionBaseService`

  ↳ **`FulfillmentService`**

## Constructors

### constructor

• **new FulfillmentService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/fulfillment.ts:47](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L47)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/fulfillment.ts:40](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L40)

___

### fulfillmentRepository\_

• `Protected` `Readonly` **fulfillmentRepository\_**: `Repository`<`Fulfillment`\>

#### Defined in

[medusa/src/services/fulfillment.ts:41](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L41)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<`LineItem`\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<`LineItem` & { `return_item`: `ReturnItem`  }[]\>  }

#### Defined in

[medusa/src/services/fulfillment.ts:43](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L43)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/fulfillment.ts:38](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L38)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[medusa/src/services/fulfillment.ts:45](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L45)

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[medusa/src/services/fulfillment.ts:39](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L39)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/fulfillment.ts:37](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L37)

___

### trackingLinkRepository\_

• `Protected` `Readonly` **trackingLinkRepository\_**: `Repository`<`TrackingLink`\>

#### Defined in

[medusa/src/services/fulfillment.ts:42](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L42)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentOrId`): `Promise`<`Fulfillment`\>

Cancels a fulfillment with the fulfillment provider. Will decrement the
fulfillment_quantity on the line items associated with the fulfillment.
Throws if the fulfillment has already been shipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentOrId` | `string` \| `Fulfillment` | the fulfillment object or id. |

#### Returns

`Promise`<`Fulfillment`\>

the result of the save operation

#### Defined in

[medusa/src/services/fulfillment.ts:260](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L260)

___

### createFulfillment

▸ **createFulfillment**(`order`, `itemsToFulfill`, `custom?`): `Promise`<`Fulfillment`[]\>

Creates an order fulfillment
If items needs to be fulfilled by different provider, we make
sure to partition those items, and create fulfillment for
those partitions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `CreateFulfillmentOrder` | order to create fulfillment for |
| `itemsToFulfill` | `FulFillmentItemType`[] | the items in the order to fulfill |
| `custom` | `Partial`<`Fulfillment`\> | potential custom values to add |

#### Returns

`Promise`<`Fulfillment`[]\>

the created fulfillments

#### Defined in

[medusa/src/services/fulfillment.ts:205](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L205)

___

### createShipment

▸ **createShipment**(`fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`Fulfillment`\>

Creates a shipment by marking a fulfillment as shipped. Adds
tracking links and potentially more metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the fulfillment to ship |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | tracking links for the shipment |
| `config` | `CreateShipmentConfig` | potential configuration settings, such as no_notification and metadata |

#### Returns

`Promise`<`Fulfillment`\>

the shipped fulfillment

#### Defined in

[medusa/src/services/fulfillment.ts:312](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L312)

___

### getFulfillmentItems\_

▸ **getFulfillmentItems_**(`order`, `items`): `Promise`<(``null`` \| `LineItem`)[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `CreateFulfillmentOrder` | the order to get line items from |
| `items` | `FulFillmentItemType`[] | the items to get |

#### Returns

`Promise`<(``null`` \| `LineItem`)[]\>

the line items generated by the transformer.

#### Defined in

[medusa/src/services/fulfillment.ts:109](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L109)

___

### partitionItems\_

▸ **partitionItems_**(`shippingMethods`, `items`): `FulfillmentItemPartition`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethods` | `ShippingMethod`[] |
| `items` | `LineItem`[] |

#### Returns

`FulfillmentItemPartition`[]

#### Defined in

[medusa/src/services/fulfillment.ts:70](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L70)

___

### retrieve

▸ **retrieve**(`fulfillmentId`, `config?`): `Promise`<`Fulfillment`\>

Retrieves a fulfillment by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the id of the fulfillment to retrieve |
| `config` | `FindConfig`<`Fulfillment`\> | optional values to include with fulfillmentRepository query |

#### Returns

`Promise`<`Fulfillment`\>

the fulfillment

#### Defined in

[medusa/src/services/fulfillment.ts:167](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L167)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### validateFulfillmentLineItem\_

▸ **validateFulfillmentLineItem_**(`item`, `quantity`): ``null`` \| `LineItem`

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `undefined` \| `LineItem` | the line item to check has sufficient fulfillable   quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| `LineItem`

a line item that has the requested fulfillment quantity
  set.

#### Defined in

[medusa/src/services/fulfillment.ts:134](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/services/fulfillment.ts#L134)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`FulfillmentService`](FulfillmentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentService`](FulfillmentService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/b41b6303c/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
