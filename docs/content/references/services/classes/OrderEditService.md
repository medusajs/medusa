# Class: OrderEditService

## Hierarchy

- `TransactionBaseService`

  ↳ **`OrderEditService`**

## Constructors

### constructor

• **new OrderEditService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/order-edit.ts:65](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L65)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:60](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L60)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:62](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L62)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:59](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L59)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/order-edit.ts:52](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L52)

___

### orderEditItemChangeService\_

• `Protected` `Readonly` **orderEditItemChangeService\_**: [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:63](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L63)

___

### orderEditRepository\_

• `Protected` `Readonly` **orderEditRepository\_**: typeof `OrderEditRepository`

#### Defined in

[packages/medusa/src/services/order-edit.ts:55](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L55)

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:57](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L57)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:61](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L61)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:58](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L58)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/order-edit.ts:53](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L53)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CONFIRMED` | `string` |
| `CREATED` | `string` |
| `DECLINED` | `string` |
| `REQUESTED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/order-edit.ts:43](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L43)

## Methods

### addLineItem

▸ **addLineItem**(`orderEditId`, `data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `data` | `AddOrderEditLineItemInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:554](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L554)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### cancel

▸ **cancel**(`orderEditId`, `context?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.loggedInUserId?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:698](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L698)

___

### confirm

▸ **confirm**(`orderEditId`, `context?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.loggedInUserId?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:737](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L737)

___

### create

▸ **create**(`data`, `context`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateOrderEditInput` |
| `context` | `Object` |
| `context.loggedInUserId` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:214](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L214)

___

### decline

▸ **decline**(`orderEditId`, `context`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.declinedReason?` | `string` |
| `context.loggedInUserId?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:316](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L316)

___

### decorateTotals

▸ **decorateTotals**(`orderEdit`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEdit` | `OrderEdit` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:540](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L540)

___

### delete

▸ **delete**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:292](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L292)

___

### deleteClonedItems

▸ `Protected` **deleteClonedItems**(`orderEditId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:810](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L810)

___

### deleteItemChange

▸ **deleteItemChange**(`orderEditId`, `itemChangeId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemChangeId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:626](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L626)

___

### getTotals

▸ **getTotals**(`orderEditId`): `Promise`<{ `difference_due`: `number` ; `discount_total`: `number` ; `gift_card_tax_total`: `number` ; `gift_card_total`: `number` ; `shipping_total`: `number` ; `subtotal`: `number` ; `tax_total`: ``null`` \| `number` ; `total`: `number`  }\>

Compute and return the different totals from the order edit id

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |

#### Returns

`Promise`<{ `difference_due`: `number` ; `discount_total`: `number` ; `gift_card_tax_total`: `number` ; `gift_card_total`: `number` ; `shipping_total`: `number` ; `subtotal`: `number` ; `tax_total`: ``null`` \| `number` ; `total`: `number`  }\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:155](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L155)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`OrderEdit`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`OrderEdit`\> |
| `config?` | `FindConfig`<`OrderEdit`\> |

#### Returns

`Promise`<`OrderEdit`[]\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:143](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L143)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`OrderEdit`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`OrderEdit`\> & { `q?`: `string`  } |
| `config?` | `FindConfig`<`OrderEdit`\> |

#### Returns

`Promise`<[`OrderEdit`[], `number`]\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:119](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L119)

___

### refreshAdjustments

▸ **refreshAdjustments**(`orderEditId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:497](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L497)

___

### removeLineItem

▸ **removeLineItem**(`orderEditId`, `lineItemId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `lineItemId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:440](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L440)

___

### requestConfirmation

▸ **requestConfirmation**(`orderEditId`, `context?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.loggedInUserId?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:658](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L658)

___

### retrieve

▸ **retrieve**(`orderEditId`, `config?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `config` | `FindConfig`<`OrderEdit`\> |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:90](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L90)

___

### retrieveActive

▸ `Protected` **retrieveActive**(`orderId`, `config?`): `Promise`<`undefined` \| `OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `config` | `FindConfig`<`OrderEdit`\> |

#### Returns

`Promise`<`undefined` \| `OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:789](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L789)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

___

### update

▸ **update**(`orderEditId`, `data`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `data` | `Object` |
| `data.canceled_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.canceled_by?` | `string` |
| `data.changes?` | (`undefined` \| { type?: OrderEditItemChangeType \| undefined; order\_edit\_id?: string \| undefined; order\_edit?: { order\_id?: string \| undefined; order?: { readonly object?: "order" \| undefined; ... 51 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 27 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 7 ...)[] |
| `data.confirmed_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.confirmed_by?` | `string` |
| `data.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.created_by?` | `string` |
| `data.declined_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.declined_by?` | `string` |
| `data.declined_reason?` | `string` |
| `data.difference_due?` | `number` |
| `data.discount_total?` | `number` |
| `data.gift_card_tax_total?` | `number` |
| `data.gift_card_total?` | `number` |
| `data.id?` | `string` |
| `data.internal_note?` | `string` |
| `data.items?` | (`undefined` \| { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| ... 1 more ... \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated\_at?: {...)[] |
| `data.order?` | { readonly object?: "order" \| undefined; status?: OrderStatus \| undefined; fulfillment\_status?: FulfillmentStatus \| undefined; payment\_status?: PaymentStatus \| undefined; ... 48 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.order_id?` | `string` |
| `data.payment_collection?` | { type?: PaymentCollectionType \| undefined; status?: PaymentCollectionStatus \| undefined; description?: string \| null \| undefined; ... 13 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.payment_collection_id?` | `string` |
| `data.requested_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.requested_by?` | `string` |
| `data.shipping_total?` | `number` |
| `data.status?` | `OrderEditStatus` |
| `data.subtotal?` | `number` |
| `data.tax_total?` | ``null`` \| `number` |
| `data.total?` | `number` |
| `data.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.loadStatus?` |  |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:263](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L263)

___

### updateLineItem

▸ **updateLineItem**(`orderEditId`, `itemId`, `data`): `Promise`<`void`\>

Create or update order edit item change line item and apply the quantity
- If the item change already exists then update the quantity of the line item as well as the line adjustments
- If the item change does not exist then create the item change of type update and apply the quantity as well as update the line adjustments

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemId` | `string` |
| `data` | `Object` |
| `data.quantity` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:367](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L367)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderEditService`](OrderEditService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderEditService`](OrderEditService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### isOrderEditActive

▸ `Static` `Private` **isOrderEditActive**(`orderEdit`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEdit` | `OrderEdit` |

#### Returns

`boolean`

#### Defined in

[packages/medusa/src/services/order-edit.ts:856](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/order-edit.ts#L856)
