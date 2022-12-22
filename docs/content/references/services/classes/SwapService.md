# Class: SwapService

Handles swaps

## Hierarchy

- `TransactionBaseService`

  ↳ **`SwapService`**

## Constructors

### constructor

• **new SwapService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/swap.ts:93](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L93)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:80](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L80)

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:91](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L91)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:81](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L81)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:87](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L87)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:86](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L86)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:90](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L90)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:85](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L85)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/swap.ts:75](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L75)

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:82](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L82)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:89](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L89)

___

### returnService\_

• `Protected` `Readonly` **returnService\_**: [`ReturnService`](ReturnService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:83](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L83)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:88](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L88)

___

### swapRepository\_

• `Protected` `Readonly` **swapRepository\_**: typeof `SwapRepository`

#### Defined in

[packages/medusa/src/services/swap.ts:78](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L78)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:84](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L84)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/swap.ts:76](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L76)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `PAYMENT_COMPLETED` | `string` |
| `PROCESS_REFUND_FAILED` | `string` |
| `RECEIVED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |

#### Defined in

[packages/medusa/src/services/swap.ts:63](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L63)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### cancel

▸ **cancel**(`swapId`): `Promise`<`Swap`\>

Cancels a given swap if possible. A swap can only be canceled if all
related returns, fulfillments, and payments have been canceled. If a swap
is associated with a refund, it cannot be canceled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to cancel. |

#### Returns

`Promise`<`Swap`\>

the canceled swap.

#### Defined in

[packages/medusa/src/services/swap.ts:845](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L845)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`Swap`\>

Cancels a fulfillment (if related to a swap)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<`Swap`\>

updated swap

#### Defined in

[packages/medusa/src/services/swap.ts:1046](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L1046)

___

### create

▸ **create**(`order`, `returnItems`, `additionalItems?`, `returnShipping?`, `custom?`): `Promise`<`Swap`\>

Creates a swap from an order, with given return items, additional items
and an optional return shipping method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to base the swap off |
| `returnItems` | `Partial`<`ReturnItem`\>[] | the items to return in the swap |
| `additionalItems?` | `Pick`<`LineItem`, ``"variant_id"`` \| ``"quantity"``\>[] | the items to send to the customer |
| `returnShipping?` | `Object` | an optional shipping method for returning the returnItems |
| `returnShipping.option_id` | `string` | - |
| `returnShipping.price?` | `number` | - |
| `custom` | `Object` | contains relevant custom information. This object may  include no_notification which will disable sending notification when creating  swap. If set, it overrules the attribute inherited from the order |
| `custom.allow_backorder?` | `boolean` | - |
| `custom.idempotency_key?` | `string` | - |
| `custom.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Swap`\>

the newly created swap

#### Defined in

[packages/medusa/src/services/swap.ts:307](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L307)

___

### createCart

▸ **createCart**(`swapId`, `customShippingOptions?`): `Promise`<`Swap`\>

Creates a cart from the given swap. The cart can be used to pay
for differences associated with the swap. The swap represented by the
swapId must belong to the order. Fails if there is already a cart on the
swap.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `swapId` | `string` | `undefined` | the id of the swap to create the cart from |
| `customShippingOptions` | { `option_id`: `string` ; `price`: `number`  }[] | `[]` | the shipping options |

#### Returns

`Promise`<`Swap`\>

the swap with its cart_id prop set to the id of the new cart.

#### Defined in

[packages/medusa/src/services/swap.ts:556](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L556)

___

### createFulfillment

▸ **createFulfillment**(`swapId`, `config?`): `Promise`<`Swap`\>

Fulfills the additional items associated with the swap. Will call the
fulfillment providers associated with the shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to fulfill, |
| `config` | `CreateShipmentConfig` | optional configurations, includes optional metadata to attach to the shipment, and a no_notification flag. |

#### Returns

`Promise`<`Swap`\>

the updated swap with new status and fulfillments.

#### Defined in

[packages/medusa/src/services/swap.ts:907](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L907)

___

### createShipment

▸ **createShipment**(`swapId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`Swap`\>

Marks a fulfillment as shipped and attaches tracking numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap that has been shipped. |
| `fulfillmentId` | `string` | the id of the specific fulfillment that has been shipped |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | the tracking numbers associated with the shipment |
| `config` | `CreateShipmentConfig` | optional configurations, includes optional metadata to attach to the shipment, and a noNotification flag. |

#### Returns

`Promise`<`Swap`\>

the updated swap with new fulfillments and status.

#### Defined in

[packages/medusa/src/services/swap.ts:1077](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L1077)

___

### deleteMetadata

▸ **deleteMetadata**(`swapId`, `key`): `Promise`<`Swap`\>

Dedicated method to delete metadata for a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<`Swap`\>

resolves to the updated result.

#### Defined in

[packages/medusa/src/services/swap.ts:1155](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L1155)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Swap`[]\>

List swaps.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Swap`\> | the query object for find |
| `config` | `FindConfig`<`Swap`\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`Swap`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/swap.ts:277](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L277)

___

### processDifference

▸ **processDifference**(`swapId`): `Promise`<`Swap`\>

Process difference for the requested swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | id of a swap being processed |

#### Returns

`Promise`<`Swap`\>

processed swap

#### Defined in

[packages/medusa/src/services/swap.ts:400](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L400)

___

### registerCartCompletion

▸ **registerCartCompletion**(`swapId`): `Promise`<`Swap`\>

Register a cart completion

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | The id of the swap |

#### Returns

`Promise`<`Swap`\>

swap related to the cart

#### Defined in

[packages/medusa/src/services/swap.ts:694](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L694)

___

### registerReceived

▸ **registerReceived**(`id`): `Promise`<`Swap`\>

Registers the swap return items as received so that they cannot be used
as a part of other swaps/returns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | the id of the order with the swap. |

#### Returns

`Promise`<`Swap`\>

the resulting order

#### Defined in

[packages/medusa/src/services/swap.ts:1195](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L1195)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Swap`\>

Retrieves a swap with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the swap to retrieve |
| `config` | `Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } | the configuration to retrieve the swap |

#### Returns

`Promise`<`Swap`\>

the swap

#### Defined in

[packages/medusa/src/services/swap.ts:208](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L208)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `relations?`): `Promise`<`Swap`\>

Retrieves a swap based on its associated cart id

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartId` | `string` | `undefined` | the cart id that the swap's cart has |
| `relations` | `undefined` \| `string`[] | `[]` | the relations to retrieve swap |

#### Returns

`Promise`<`Swap`\>

the swap

#### Defined in

[packages/medusa/src/services/swap.ts:250](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L250)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

___

### transformQueryForCart

▸ `Protected` **transformQueryForCart**(`config`): `Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof `Cart`[]  }

Transform find config object for retrieval.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } | parsed swap find config |

#### Returns

`Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof `Cart`[]  }

transformed find swap config

#### Defined in

[packages/medusa/src/services/swap.ts:135](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L135)

___

### update

▸ **update**(`swapId`, `update`): `Promise`<`Swap`\>

Update the swap record.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | id of a swap to update |
| `update` | `Partial`<`Swap`\> | new data |

#### Returns

`Promise`<`Swap`\>

updated swap record

#### Defined in

[packages/medusa/src/services/swap.ts:523](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/swap.ts#L523)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SwapService`](SwapService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SwapService`](SwapService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
