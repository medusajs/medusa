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

[packages/medusa/src/services/fulfillment.ts:47](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L47)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:42](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L42)

___

### fulfillmentRepository\_

• `Protected` `Readonly` **fulfillmentRepository\_**: typeof `FulfillmentRepository`

#### Defined in

[packages/medusa/src/services/fulfillment.ts:43](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L43)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[packages/medusa/src/services/fulfillment.ts:45](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L45)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:40](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/fulfillment.ts:36](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L36)

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:41](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L41)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/fulfillment.ts:39](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L39)

___

### trackingLinkRepository\_

• `Protected` `Readonly` **trackingLinkRepository\_**: typeof `TrackingLinkRepository`

#### Defined in

[packages/medusa/src/services/fulfillment.ts:44](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L44)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/fulfillment.ts:37](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L37)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/fulfillment.ts:253](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L253)

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

[packages/medusa/src/services/fulfillment.ts:198](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L198)

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

[packages/medusa/src/services/fulfillment.ts:303](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L303)

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

[packages/medusa/src/services/fulfillment.ts:109](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L109)

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

[packages/medusa/src/services/fulfillment.ts:71](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L71)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Fulfillment`\>

Retrieves a fulfillment by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the fulfillment to retrieve |
| `config` | `FindConfig`<`Fulfillment`\> | optional values to include with fulfillmentRepository query |

#### Returns

`Promise`<`Fulfillment`\>

the fulfillment

#### Defined in

[packages/medusa/src/services/fulfillment.ts:166](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L166)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/fulfillment.ts:134](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/fulfillment.ts#L134)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
