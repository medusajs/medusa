---
displayed_sidebar: jsClientSidebar
---

# Class: OrderEditService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).OrderEditService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`OrderEditService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:37

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `undefined` \| [`IInventoryService`](../interfaces/internal-8.IInventoryService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:41

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:39

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:36

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:35

___

### orderEditItemChangeService\_

• `Protected` `Readonly` **orderEditItemChangeService\_**: [`OrderEditItemChangeService`](internal-8.internal.OrderEditItemChangeService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:40

___

### orderEditRepository\_

• `Protected` `Readonly` **orderEditRepository\_**: `Repository`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:32

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](internal-8.internal.OrderService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:33

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:38

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:34

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

packages/medusa/dist/services/order-edit.d.ts:24

___

### isOrderEditActive

▪ `Static` `Private` **isOrderEditActive**: `any`

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:86

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addLineItem

▸ **addLineItem**(`orderEditId`, `data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `data` | [`AddOrderEditLineItemInput`](../modules/internal-8.md#addordereditlineiteminput) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:73

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### cancel

▸ **cancel**(`orderEditId`, `context?`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context?` | `Object` |
| `context.canceledBy?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:78

___

### confirm

▸ **confirm**(`orderEditId`, `context?`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context?` | `Object` |
| `context.confirmedBy?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:81

___

### create

▸ **create**(`data`, `context`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateOrderEditInput`](../modules/internal-8.md#createordereditinput) |
| `context` | `Object` |
| `context.createdBy` | `string` |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:48

___

### decline

▸ **decline**(`orderEditId`, `context`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context` | `Object` |
| `context.declinedBy?` | `string` |
| `context.declinedReason?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:53

___

### decorateTotals

▸ **decorateTotals**(`orderEdit`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEdit` | [`OrderEdit`](internal-3.OrderEdit.md) |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:72

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

packages/medusa/dist/services/order-edit.d.ts:52

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

packages/medusa/dist/services/order-edit.d.ts:85

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

packages/medusa/dist/services/order-edit.d.ts:74

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`OrderEdit`](internal-3.OrderEdit.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`OrderEdit`](internal-3.OrderEdit.md)\> |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)[]\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:47

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`OrderEdit`](internal-3.OrderEdit.md)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`OrderEdit`](internal-3.OrderEdit.md)\> & { `q?`: `string`  } |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`OrderEdit`](internal-3.OrderEdit.md)\> |

#### Returns

`Promise`<[[`OrderEdit`](internal-3.OrderEdit.md)[], `number`]\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:44

___

### refreshAdjustments

▸ **refreshAdjustments**(`orderEditId`, `config?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `config?` | `Object` |
| `config.preserveCustomAdjustments` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:69

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

packages/medusa/dist/services/order-edit.d.ts:68

___

### requestConfirmation

▸ **requestConfirmation**(`orderEditId`, `context?`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `context?` | `Object` |
| `context.requestedBy?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:75

___

### retrieve

▸ **retrieve**(`orderEditId`, `config?`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`OrderEdit`](internal-3.OrderEdit.md)\> |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:43

___

### retrieveActive

▸ `Protected` **retrieveActive**(`orderId`, `config?`): `Promise`<`undefined` \| ``null`` \| [`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`OrderEdit`](internal-3.OrderEdit.md)\> |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:84

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`orderEditId`, `data`): `Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `data` | `DeepPartial`<[`OrderEdit`](internal-3.OrderEdit.md)\> |

#### Returns

`Promise`<[`OrderEdit`](internal-3.OrderEdit.md)\>

#### Defined in

packages/medusa/dist/services/order-edit.d.ts:51

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

packages/medusa/dist/services/order-edit.d.ts:65

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderEditService`](internal-8.internal.OrderEditService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderEditService`](internal-8.internal.OrderEditService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
