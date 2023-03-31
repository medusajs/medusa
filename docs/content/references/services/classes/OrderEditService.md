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

[packages/medusa/src/services/order-edit.ts:68](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L68)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:63](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L63)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L65)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:62](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L62)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/order-edit.ts:54](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L54)

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:61](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L61)

___

### orderEditItemChangeService\_

• `Protected` `Readonly` **orderEditItemChangeService\_**: [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:66](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L66)

___

### orderEditRepository\_

• `Protected` `Readonly` **orderEditRepository\_**: typeof `OrderEditRepository`

#### Defined in

[packages/medusa/src/services/order-edit.ts:57](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L57)

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:59](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L59)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L64)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:60](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L60)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/order-edit.ts:55](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L55)

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

[packages/medusa/src/services/order-edit.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L45)

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

[packages/medusa/src/services/order-edit.ts:534](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L534)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### cancel

▸ **cancel**(`orderEditId`, `context?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.canceledBy?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:678](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L678)

___

### confirm

▸ **confirm**(`orderEditId`, `context?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.confirmedBy?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:717](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L717)

___

### create

▸ **create**(`data`, `context`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateOrderEditInput` |
| `context` | `Object` |
| `context.createdBy` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:156](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L156)

___

### decline

▸ **decline**(`orderEditId`, `context`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.declinedBy?` | `string` |
| `context.declinedReason?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:258](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L258)

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

[packages/medusa/src/services/order-edit.ts:491](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L491)

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

[packages/medusa/src/services/order-edit.ts:234](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L234)

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

[packages/medusa/src/services/order-edit.ts:790](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L790)

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

[packages/medusa/src/services/order-edit.ts:606](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L606)

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

[packages/medusa/src/services/order-edit.ts:148](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L148)

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

[packages/medusa/src/services/order-edit.ts:124](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L124)

___

### refreshAdjustments

▸ **refreshAdjustments**(`orderEditId`, `config?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `orderEditId` | `string` | `undefined` |
| `config` | `Object` | `undefined` |
| `config.preserveCustomAdjustments` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:439](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L439)

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

[packages/medusa/src/services/order-edit.ts:382](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L382)

___

### requestConfirmation

▸ **requestConfirmation**(`orderEditId`, `context?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.requestedBy?` | `string` |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:638](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L638)

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

[packages/medusa/src/services/order-edit.ts:95](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L95)

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

[packages/medusa/src/services/order-edit.ts:769](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L769)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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
| `data.changes?` | (`undefined` \| { type?: OrderEditItemChangeType \| undefined; order\_edit\_id?: string \| undefined; order\_edit?: { order\_id?: string \| undefined; order?: { readonly object?: "order" \| undefined; ... 52 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 27 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 7 ...)[] |
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
| `data.order?` | { readonly object?: "order" \| undefined; status?: OrderStatus \| undefined; fulfillment\_status?: FulfillmentStatus \| undefined; payment\_status?: PaymentStatus \| undefined; ... 49 more ...; updated\_at?: { ...; } \| undefined; } |
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

[packages/medusa/src/services/order-edit.ts:205](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L205)

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

[packages/medusa/src/services/order-edit.ts:309](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L309)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

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

[packages/medusa/src/services/order-edit.ts:836](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit.ts#L836)
