# Class: OrderService

## Hierarchy

- `TransactionBaseService`

  ↳ **`OrderService`**

## Constructors

### constructor

• **new OrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/order.ts:137](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L137)

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

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<`Address`\>

#### Defined in

[medusa/src/services/order.ts:128](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L128)

___

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[medusa/src/services/order.ts:127](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L127)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/order.ts:115](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L115)

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[medusa/src/services/order.ts:119](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L119)

___

### draftOrderService\_

• `Protected` `Readonly` **draftOrderService\_**: [`DraftOrderService`](DraftOrderService.md)

#### Defined in

[medusa/src/services/order.ts:130](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L130)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/order.ts:132](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L132)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/order.ts:133](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L133)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/order.ts:120](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L120)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[medusa/src/services/order.ts:121](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L121)

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[medusa/src/services/order.ts:129](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L129)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `IInventoryService`

#### Defined in

[medusa/src/services/order.ts:131](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L131)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/order.ts:122](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L122)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:7

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[medusa/src/services/order.ts:124](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L124)

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: `Repository`<`Order`\> & { `findOneWithRelations`: (`relations`: `FindOptionsRelations`<`Order`\>, `optionsWithoutRelations`: `Omit`<`FindManyOptions`<`Order`\>, ``"relations"``\>) => `Promise`<`Order`\> ; `findWithRelations`: (`relations`: `FindOptionsRelations`<`Order`\>, `optionsWithoutRelations`: `Omit`<`FindManyOptions`<`Order`\>, ``"relations"``\>) => `Promise`<`Order`[]\>  }

#### Defined in

[medusa/src/services/order.ts:114](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L114)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/order.ts:116](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L116)

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[medusa/src/services/order.ts:135](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L135)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/order.ts:126](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L126)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/order.ts:117](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L117)

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[medusa/src/services/order.ts:118](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L118)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/order.ts:125](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L125)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/order.ts:123](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L123)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `COMPLETED` | `string` |
| `FULFILLMENT_CANCELED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `GIFT_CARD_CREATED` | `string` |
| `ITEMS_RETURNED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `PLACED` | `string` |
| `REFUND_CREATED` | `string` |
| `REFUND_FAILED` | `string` |
| `RETURN_ACTION_REQUIRED` | `string` |
| `RETURN_REQUESTED` | `string` |
| `SHIPMENT_CREATED` | `string` |
| `SWAP_CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/order.ts:95](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L95)

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

### addShippingMethod

▸ **addShippingMethod**(`orderId`, `optionId`, `data?`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `optionId` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |
| `config` | `CreateShippingMethodDto` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:1019](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1019)

___

### archive

▸ **archive**(`orderId`): `Promise`<`Order`\>

Archives an order. It only alloved, if the order has been fulfilled
and payment has been captured.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to archive |

#### Returns

`Promise`<`Order`\>

the result of the update operation

#### Defined in

[medusa/src/services/order.ts:1555](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1555)

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

### cancel

▸ **cancel**(`orderId`): `Promise`<`Order`\>

Cancels an order.
Throws if fulfillment process has been initiated.
Throws if payment process has been initiated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |

#### Returns

`Promise`<`Order`\>

result of the update operation.

#### Defined in

[medusa/src/services/order.ts:1171](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1171)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`Order`\>

Cancels a fulfillment (if related to an order)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<`Order`\>

updated order

#### Defined in

[medusa/src/services/order.ts:1492](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1492)

___

### capturePayment

▸ **capturePayment**(`orderId`): `Promise`<`Order`\>

Captures payment for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to capture payment for. |

#### Returns

`Promise`<`Order`\>

result of the update operation.

#### Defined in

[medusa/src/services/order.ts:1260](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1260)

___

### completeOrder

▸ **completeOrder**(`orderId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to complete |

#### Returns

`Promise`<`Order`\>

the result of the find operation

#### Defined in

[medusa/src/services/order.ts:579](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L579)

___

### createFromCart

▸ **createFromCart**(`cartOrId`): `Promise`<`Order`\>

Creates an order from a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrId` | `string` \| `Cart` |

#### Returns

`Promise`<`Order`\>

resolves to the creation result.

#### Defined in

[medusa/src/services/order.ts:609](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L609)

___

### createFulfillment

▸ **createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<`Order`\>

Creates fulfillments for an order.
In a situation where the order has more than one shipping method,
we need to partition the order items, such that they can be sent
to their respective fulfillment provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |
| `itemsToFulfill` | `FulFillmentItemType`[] | items to fulfil. |
| `config` | `Object` | the config to cancel. |
| `config.location_id?` | `string` | - |
| `config.metadata?` | `Record`<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

result of the update operation.

#### Defined in

[medusa/src/services/order.ts:1365](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1365)

___

### createGiftCardsFromLineItem\_

▸ `Protected` **createGiftCardsFromLineItem_**(`order`, `lineItem`, `manager`): `Promise`<`GiftCard`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | `Order` |
| `lineItem` | `LineItem` |
| `manager` | `EntityManager` |

#### Returns

`Promise`<`GiftCard`\>[]

#### Defined in

[medusa/src/services/order.ts:799](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L799)

___

### createRefund

▸ **createRefund**(`orderId`, `refundAmount`, `reason`, `note?`, `config?`): `Promise`<`Order`\>

Refunds a given amount back to the customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to refund. |
| `refundAmount` | `number` | the amount to refund. |
| `reason` | `string` | the reason to refund. |
| `note?` | `string` | note for refund. |
| `config` | `Object` | the config for refund. |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

the result of the refund operation.

#### Defined in

[medusa/src/services/order.ts:1581](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1581)

___

### createShipment

▸ **createShipment**(`orderId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`Order`\>

Adds a shipment to the order to indicate that an order has left the
warehouse. Will ask the fulfillment provider for any documents that may
have been created in regards to the shipment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order that has been shipped |
| `fulfillmentId` | `string` | the fulfillment that has now been shipped |
| `trackingLinks?` | `TrackingLink`[] | array of tracking numebers   associated with the shipment |
| `config` | `Object` | the config of the order that has been shipped |
| `config.metadata` | `Record`<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

the resulting order following the update.

#### Defined in

[medusa/src/services/order.ts:853](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L853)

___

### decorateTotals

▸ **decorateTotals**(`order`, `totalsFields?`): `Promise`<`Order`\>

Calculate and attach the different total fields on the object

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | `Order` |
| `totalsFields?` | `string`[] |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:1778](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1778)

▸ **decorateTotals**(`order`, `context?`): `Promise`<`Order`\>

Calculate and attach the different total fields on the object

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | `Order` |
| `context?` | `TotalsContext` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:1780](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1780)

___

### decorateTotalsLegacy

▸ `Protected` **decorateTotalsLegacy**(`order`, `totalsFields?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `order` | `Order` | `undefined` |
| `totalsFields` | `string`[] | `[]` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:1649](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1649)

___

### getFulfillmentItems

▸ `Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<`LineItem`[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to get line items from |
| `items` | `FulFillmentItemType`[] | the items to get |
| `transformer` | (`item`: `undefined` \| `LineItem`, `quantity`: `number`) => `unknown` | a function to apply to each of the items    retrieved from the order, should return a line item. If the transformer    returns an undefined value the line item will be filtered from the    returned array. |

#### Returns

`Promise`<`LineItem`[]\>

the line items generated by the transformer.

#### Defined in

[medusa/src/services/order.ts:1534](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1534)

___

### getTotalsRelations

▸ `Private` **getTotalsRelations**(`config`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `FindConfig`<`Order`\> |

#### Returns

`string`[]

#### Defined in

[medusa/src/services/order.ts:2043](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L2043)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Order`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Order`\> | the query object for find |
| `config` | `FindConfig`<`Order`\> | the config to be used for find |

#### Returns

`Promise`<`Order`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/order.ts:189](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L189)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Order`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `QuerySelector`<`Order`\> | the query object for find |
| `config` | `FindConfig`<`Order`\> | the config to be used for find |

#### Returns

`Promise`<[`Order`[], `number`]\>

the result of the find operation

#### Defined in

[medusa/src/services/order.ts:206](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L206)

___

### registerReturnReceived

▸ **registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount?`): `Promise`<`Order`\>

Handles receiving a return. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in sitautions where a custom refund amount is requested, but the
retuned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to return. |
| `receivedReturn` | `Return` | the received return |
| `customRefundAmount?` | `number` | the custom refund amount return |

#### Returns

`Promise`<`Order`\>

the result of the update operation

#### Defined in

[medusa/src/services/order.ts:1968](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1968)

___

### retrieve

▸ **retrieve**(`orderId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id or selector of order to retrieve |
| `config` | `FindConfig`<`Order`\> | config of order to retrieve |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[medusa/src/services/order.ts:390](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L390)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`Order`\>

Gets an order by cart id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id to find order |
| `config` | `FindConfig`<`Order`\> | the config to be used to find order |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[medusa/src/services/order.ts:486](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L486)

___

### retrieveByCartIdWithTotals

▸ **retrieveByCartIdWithTotals**(`cartId`, `options?`): `Promise`<`Order`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |
| `options` | `FindConfig`<`Order`\> |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:520](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L520)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | id of order to retrieve |
| `config` | `FindConfig`<`Order`\> | query config to get order by |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[medusa/src/services/order.ts:535](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L535)

___

### retrieveLegacy

▸ `Protected` **retrieveLegacy**(`orderIdOrSelector`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderIdOrSelector` | `string` \| `Selector`<`Order`\> |
| `config` | `FindConfig`<`Order`\> |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:430](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L430)

___

### retrieveWithTotals

▸ **retrieveWithTotals**(`orderId`, `options?`, `context?`): `Promise`<`Order`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `options` | `FindConfig`<`Order`\> |
| `context` | `TotalsContext` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[medusa/src/services/order.ts:469](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L469)

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

### transformQueryForTotals

▸ `Protected` **transformQueryForTotals**(`config`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `FindConfig`<`Order`\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `relations` | `undefined` \| `string`[] |
| `select` | `undefined` \| keyof `Order`[] |
| `totalsToSelect` | `undefined` \| keyof `Order`[] |

#### Defined in

[medusa/src/services/order.ts:312](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L312)

___

### update

▸ **update**(`orderId`, `update`): `Promise`<`Order`\>

Updates an order. Metadata updates should
use dedicated method, e.g. `setMetadata` etc. The function
will throw errors if metadata updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateOrderInput` | an object with the update values. |

#### Returns

`Promise`<`Order`\>

resolves to the update result.

#### Defined in

[medusa/src/services/order.ts:1082](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1082)

___

### updateBillingAddress

▸ `Protected` **updateBillingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to update |
| `address` | `Address` | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[medusa/src/services/order.ts:941](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L941)

___

### updateShippingAddress

▸ `Protected` **updateShippingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's shipping address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to update |
| `address` | `Address` | the value to set the shipping address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[medusa/src/services/order.ts:988](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L988)

___

### validateFulfillmentLineItem

▸ `Protected` **validateFulfillmentLineItem**(`item`, `quantity`): ``null`` \| `LineItem`

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `LineItem` | the line item to check has sufficient fulfillable   quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| `LineItem`

a line item that has the requested fulfillment quantity
  set.

#### Defined in

[medusa/src/services/order.ts:1332](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/order.ts#L1332)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderService`](OrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderService`](OrderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

utils/dist/common/transaction-base-service.d.ts:11
