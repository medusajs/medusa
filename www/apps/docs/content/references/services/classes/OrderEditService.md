# OrderEditService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`OrderEditService`**

## Constructors

### constructor

**new OrderEditService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-20) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/order-edit.ts:79](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L79)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:70](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L70)

___

### lineItemAdjustmentService\_

 `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L72)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L69)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

 `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L68)

___

### orderEditItemChangeService\_

 `Protected` `Readonly` **orderEditItemChangeService\_**: [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:73](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L73)

___

### orderEditRepository\_

 `Protected` `Readonly` **orderEditRepository\_**: [`Repository`](Repository.md)<[`OrderEdit`](OrderEdit.md)\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L64)

___

### orderService\_

 `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L66)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:71](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L71)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L67)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

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

[packages/medusa/src/services/order-edit.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L55)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### inventoryService\_

`Protected` `get` **inventoryService_**(): `undefined` \| [`IInventoryService`](../interfaces/IInventoryService.md)

#### Returns

`undefined` \| [`IInventoryService`](../interfaces/IInventoryService.md)

-`undefined \| IInventoryService`: (optional) 

#### Defined in

[packages/medusa/src/services/order-edit.ts:75](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L75)

## Methods

### addLineItem

**addLineItem**(`orderEditId`, `data`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `data` | [`AddOrderEditLineItemInput`](../index.md#addordereditlineiteminput) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:543](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L543)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cancel

**cancel**(`orderEditId`, `context?`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `context` | `object` |
| `context.canceledBy?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:689](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L689)

___

### confirm

**confirm**(`orderEditId`, `context?`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `context` | `object` |
| `context.confirmedBy?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:728](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L728)

___

### create

**create**(`data`, `context`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateOrderEditInput`](../index.md#createordereditinput) |
| `context` | `object` |
| `context.createdBy` | `string` |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:164](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L164)

___

### decline

**decline**(`orderEditId`, `context`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `context` | `object` |
| `context.declinedBy?` | `string` |
| `context.declinedReason?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:262](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L262)

___

### decorateTotals

**decorateTotals**(`orderEdit`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderEdit` | [`OrderEdit`](OrderEdit.md) | Order edit allows modifying items in an order, such as adding, updating, or deleting items from the original order. Once the order edit is confirmed, the changes are reflected on the original order. |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:492](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L492)

___

### delete

**delete**(`id`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:240](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L240)

___

### deleteClonedItems

`Protected` **deleteClonedItems**(`orderEditId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:810](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L810)

___

### deleteItemChange

**deleteItemChange**(`orderEditId`, `itemChangeId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `itemChangeId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:615](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L615)

___

### list

**list**(`selector`, `config?`): `Promise`<[`OrderEdit`](OrderEdit.md)[]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../index.md#selector)<[`OrderEdit`](OrderEdit.md)\> |
| `config?` | [`FindConfig`](../interfaces/FindConfig.md)<[`OrderEdit`](OrderEdit.md)\> |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)[]\>

-`Promise`: 
	-`OrderEdit[]`: 
		-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:156](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L156)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`OrderEdit`](OrderEdit.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../index.md#selector)<[`OrderEdit`](OrderEdit.md)\> & { `q?`: `string`  } |
| `config?` | [`FindConfig`](../interfaces/FindConfig.md)<[`OrderEdit`](OrderEdit.md)\> |

#### Returns

`Promise`<[[`OrderEdit`](OrderEdit.md)[], `number`]\>

-`Promise`: 
	-`OrderEdit[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/order-edit.ts:132](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L132)

___

### refreshAdjustments

**refreshAdjustments**(`orderEditId`, `config?`): `Promise`<`void`\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `orderEditId` | `string` |
| `config` | `object` |
| `config.preserveCustomAdjustments` | `boolean` | false |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:441](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L441)

___

### removeLineItem

**removeLineItem**(`orderEditId`, `lineItemId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `lineItemId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:384](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L384)

___

### requestConfirmation

**requestConfirmation**(`orderEditId`, `context?`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `context` | `object` |
| `context.requestedBy?` | `string` |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:647](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L647)

___

### retrieve

**retrieve**(`orderEditId`, `config?`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`OrderEdit`](OrderEdit.md)\> |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:104](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L104)

___

### retrieveActive

`Protected` **retrieveActive**(`orderId`, `config?`): `Promise`<`undefined` \| ``null`` \| [`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderId` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`OrderEdit`](OrderEdit.md)\> |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`undefined \| ``null`` \| OrderEdit`: (optional) 

#### Defined in

[packages/medusa/src/services/order-edit.ts:790](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L790)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`orderEditId`, `data`): `Promise`<[`OrderEdit`](OrderEdit.md)\>

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `data` | [`DeepPartial`](../index.md#deeppartial)<[`OrderEdit`](OrderEdit.md)\> |

#### Returns

`Promise`<[`OrderEdit`](OrderEdit.md)\>

-`Promise`: 
	-`OrderEdit`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:213](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L213)

___

### updateLineItem

**updateLineItem**(`orderEditId`, `itemId`, `data`): `Promise`<`void`\>

Create or update order edit item change line item and apply the quantity
- If the item change already exists then update the quantity of the line item as well as the line adjustments
- If the item change does not exist then create the item change of type update and apply the quantity as well as update the line adjustments

#### Parameters

| Name |
| :------ |
| `orderEditId` | `string` |
| `itemId` | `string` |
| `data` | `object` |
| `data.quantity` | `number` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit.ts:311](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L311)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`OrderEditService`](OrderEditService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`OrderEditService`](OrderEditService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

___

### isOrderEditActive

`Static` `Private` **isOrderEditActive**(`orderEdit`): `boolean`

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderEdit` | [`OrderEdit`](OrderEdit.md) | Order edit allows modifying items in an order, such as adding, updating, or deleting items from the original order. Once the order edit is confirmed, the changes are reflected on the original order. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/order-edit.ts:862](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order-edit.ts#L862)
