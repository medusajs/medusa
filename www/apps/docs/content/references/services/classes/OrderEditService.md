# Class: OrderEditService

## Hierarchy

- `TransactionBaseService`

  ↳ **`OrderEditService`**

## Constructors

### constructor

• **new OrderEditService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/order-edit.ts:75](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L75)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/order-edit.ts:69](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L69)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `undefined` \| `IInventoryService`

#### Defined in

[medusa/src/services/order-edit.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L73)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[medusa/src/services/order-edit.ts:71](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L71)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/order-edit.ts:68](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L68)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[medusa/src/services/order-edit.ts:67](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L67)

___

### orderEditItemChangeService\_

• `Protected` `Readonly` **orderEditItemChangeService\_**: [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Defined in

[medusa/src/services/order-edit.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L72)

___

### orderEditRepository\_

• `Protected` `Readonly` **orderEditRepository\_**: `Repository`<`OrderEdit`\>

#### Defined in

[medusa/src/services/order-edit.ts:63](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L63)

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[medusa/src/services/order-edit.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L65)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/order-edit.ts:70](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L70)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/order-edit.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L66)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/order-edit.ts:54](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L54)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/order-edit.ts:541](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L541)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/order-edit.ts:687](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L687)

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

[medusa/src/services/order-edit.ts:726](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L726)

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

[medusa/src/services/order-edit.ts:162](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L162)

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

[medusa/src/services/order-edit.ts:260](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L260)

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

[medusa/src/services/order-edit.ts:490](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L490)

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

[medusa/src/services/order-edit.ts:238](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L238)

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

[medusa/src/services/order-edit.ts:808](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L808)

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

[medusa/src/services/order-edit.ts:613](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L613)

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

[medusa/src/services/order-edit.ts:154](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L154)

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

[medusa/src/services/order-edit.ts:130](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L130)

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

[medusa/src/services/order-edit.ts:439](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L439)

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

[medusa/src/services/order-edit.ts:382](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L382)

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

[medusa/src/services/order-edit.ts:645](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L645)

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

[medusa/src/services/order-edit.ts:102](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L102)

___

### retrieveActive

▸ `Protected` **retrieveActive**(`orderId`, `config?`): `Promise`<`undefined` \| ``null`` \| `OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `config` | `FindConfig`<`OrderEdit`\> |

#### Returns

`Promise`<`undefined` \| ``null`` \| `OrderEdit`\>

#### Defined in

[medusa/src/services/order-edit.ts:788](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L788)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`orderEditId`, `data`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `data` | `DeepPartial`<`OrderEdit`\> |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[medusa/src/services/order-edit.ts:211](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L211)

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

[medusa/src/services/order-edit.ts:309](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L309)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

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

[medusa/src/services/order-edit.ts:860](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/order-edit.ts#L860)
