---
displayed_sidebar: jsClientSidebar
---

# Class: DraftOrderService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).DraftOrderService

Handles draft orders

**`Implements`**

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`DraftOrderService`**

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

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](internal-8.internal.CartService.md)

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:40

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:44

___

### draftOrderRepository\_

• `Protected` `Readonly` **draftOrderRepository\_**: `Repository`<[`DraftOrder`](internal-3.DraftOrder.md)\>

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:36

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:39

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:41

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: `Repository`<[`Order`](internal-3.Order.md)\> & { `findOneWithRelations`: (`relations?`: `FindOptionsRelations`<[`Order`](internal-3.Order.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Order`](internal-3.Order.md)\>, ``"relations"``\>) => `Promise`<[`Order`](internal-3.Order.md)\> ; `findWithRelations`: (`relations?`: `FindOptionsRelations`<[`Order`](internal-3.Order.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Order`](internal-3.Order.md)\>, ``"relations"``\>) => `Promise`<[`Order`](internal-3.Order.md)[]\>  }

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:38

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: `Repository`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:37

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:42

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:43

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
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:32

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

### create

▸ **create**(`data`): `Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

Creates a draft order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`DraftOrderCreateProps`](../modules/internal-8.md#draftordercreateprops) | data to create draft order from |

#### Returns

`Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

the created draft order

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:85

___

### delete

▸ **delete**(`draftOrderId`): `Promise`<`undefined` \| [`DraftOrder`](internal-3.DraftOrder.md)\>

Deletes draft order idempotently.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` | id of draft order to delete |

#### Returns

`Promise`<`undefined` \| [`DraftOrder`](internal-3.DraftOrder.md)\>

empty promise

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:65

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`DraftOrder`](internal-3.DraftOrder.md)[]\>

Lists draft orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`DraftOrder`](internal-3.DraftOrder.md)\> | configurable attributes for find |

#### Returns

`Promise`<[`DraftOrder`](internal-3.DraftOrder.md)[]\>

list of draft orders

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:79

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`DraftOrder`](internal-3.DraftOrder.md)[], `number`]\>

Lists draft orders alongside the count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | query selector to filter draft orders |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`DraftOrder`](internal-3.DraftOrder.md)\> | query config |

#### Returns

`Promise`<[[`DraftOrder`](internal-3.DraftOrder.md)[], `number`]\>

draft orders

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:72

___

### registerCartCompletion

▸ **registerCartCompletion**(`draftOrderId`, `orderId`): `Promise`<`UpdateResult`\>

Registers a draft order as completed, when an order has been completed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` | id of draft order to complete |
| `orderId` | `string` | id of order completed from draft order cart |

#### Returns

`Promise`<`UpdateResult`\>

the created order

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:92

___

### retrieve

▸ **retrieve**(`draftOrderId`, `config?`): `Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

Retrieves a draft order with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` | id of the draft order to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`DraftOrder`](internal-3.DraftOrder.md)\> | query object for findOne |

#### Returns

`Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

the draft order

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:52

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

Retrieves a draft order based on its associated cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id that the draft orders's cart has |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`DraftOrder`](internal-3.DraftOrder.md)\> | query object for findOne |

#### Returns

`Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

the draft order

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:59

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

▸ **update**(`id`, `data`): `Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

Updates a draft order with the given data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the draft order |
| `data` | `Object` | values to update the order with |
| `data.no_notification_order` | `boolean` | - |

#### Returns

`Promise`<[`DraftOrder`](internal-3.DraftOrder.md)\>

the updated draft order

#### Defined in

packages/medusa/dist/services/draft-order.d.ts:99

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DraftOrderService`](internal-8.internal.DraftOrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DraftOrderService`](internal-8.internal.DraftOrderService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
