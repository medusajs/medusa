# Class: OrderService

## Hierarchy

- `TransactionBaseService`<[`OrderService`](OrderService.md)\>

  ↳ **`OrderService`**

## Constructors

### constructor

• **new OrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;OrderService\&gt;.constructor

#### Defined in

[services/order.ts:107](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L107)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/order.ts:101](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L101)

___

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[services/order.ts:100](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L100)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/order.ts:90](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L90)

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[services/order.ts:94](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L94)

___

### draftOrderService\_

• `Protected` `Readonly` **draftOrderService\_**: [`DraftOrderService`](DraftOrderService.md)

#### Defined in

[services/order.ts:103](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L103)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/order.ts:105](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L105)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[services/order.ts:95](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L95)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[services/order.ts:96](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L96)

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[services/order.ts:102](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L102)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[services/order.ts:104](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L104)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/order.ts:97](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L97)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/order.ts:86](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L86)

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: typeof `OrderRepository`

#### Defined in

[services/order.ts:89](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L89)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[services/order.ts:91](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L91)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/order.ts:99](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L99)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/order.ts:92](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L92)

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[services/order.ts:93](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L93)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/order.ts:98](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L98)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/order.ts:87](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L87)

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

[services/order.ts:67](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L67)

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

[services/order.ts:813](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L813)

___

### archive

▸ **archive**(`orderId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1337](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1337)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### cancel

▸ **cancel**(`orderId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:964](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L964)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1274](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1274)

___

### capturePayment

▸ **capturePayment**(`orderId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1043](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1043)

___

### completeOrder

▸ **completeOrder**(`orderId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:451](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L451)

___

### createFromCart

▸ **createFromCart**(`cartId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:479](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L479)

___

### createFulfillment

▸ **createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `itemsToFulfill` | `FulFillmentItemType`[] |  |
| `config` | `Object` |  |
| `config.metadata?` | `Record`<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1146](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1146)

___

### createRefund

▸ **createRefund**(`orderId`, `refundAmount`, `reason`, `note?`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `refundAmount` | `number` |  |
| `reason` | `string` |  |
| `note?` | `string` |  |
| `config` | `Object` |  |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1363](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1363)

___

### createShipment

▸ **createShipment**(`orderId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `fulfillmentId` | `string` |  |
| `trackingLinks?` | `TrackingLink`[] |  |
| `config` | `Object` |  |
| `config.metadata` | `Record`<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:655](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L655)

___

### decorateTotals

▸ `Protected` **decorateTotals**(`order`, `totalsFields?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `order` | `Order` | `undefined` |
| `totalsFields` | `string`[] | `[]` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1412](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1412)

___

### existsByCartId

▸ **existsByCartId**(`cartId`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[services/order.ts:442](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L442)

___

### getFulfillmentItems

▸ `Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `items` | `FulFillmentItemType`[] |  |
| `transformer` | (`item`: `undefined` \| `LineItem`, `quantity`: `number`) => `unknown` |  |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[services/order.ts:1316](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1316)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Order`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Order`\> |  |
| `config` | `FindConfig`<`Order`\> |  |

#### Returns

`Promise`<`Order`[]\>

#### Defined in

[services/order.ts:155](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L155)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Order`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `QuerySelector`<`Order`\> |
| `config` | `FindConfig`<`Order`\> |

#### Returns

`Promise`<[`Order`[], `number`]\>

#### Defined in

[services/order.ts:184](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L184)

___

### registerReturnReceived

▸ **registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `receivedReturn` | `Return` |  |
| `customRefundAmount?` | `number` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:1515](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1515)

___

### retrieve

▸ **retrieve**(`orderId`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `config` | `FindConfig`<`Order`\> |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:324](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L324)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `config` | `FindConfig`<`Order`\> |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:364](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L364)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` |  |
| `config` | `FindConfig`<`Order`\> |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:403](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L403)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[services/order.ts:249](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L249)

___

### update

▸ **update**(`orderId`, `update`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `update` | `UpdateOrderInput` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.ts:876](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L876)

___

### updateBillingAddress

▸ `Protected` **updateBillingAddress**(`order`, `address`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `address` | `Address` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/order.ts:741](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L741)

___

### updateShippingAddress

▸ `Protected` **updateShippingAddress**(`order`, `address`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `address` | `Address` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/order.ts:781](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L781)

___

### validateFulfillmentLineItem

▸ `Protected` **validateFulfillmentLineItem**(`item`, `quantity`): ``null`` \| `LineItem`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `LineItem` |  |
| `quantity` | `number` |  |

#### Returns

``null`` \| `LineItem`

#### Defined in

[services/order.ts:1113](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/order.ts#L1113)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
