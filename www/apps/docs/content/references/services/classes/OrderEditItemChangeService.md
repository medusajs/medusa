# OrderEditItemChangeService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`OrderEditItemChangeService`**

## Constructors

### constructor

**new OrderEditItemChangeService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-21.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L34)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`IEventBusService`](../interfaces/IEventBusService.md)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L30)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L31)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### orderItemChangeRepository\_

 `Protected` `Readonly` **orderItemChangeRepository\_**: [`Repository`](Repository.md)<[`OrderItemChange`](OrderItemChange.md)\>

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L29)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L32)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L23)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`data`): `Promise`<[`OrderItemChange`](OrderItemChange.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateOrderEditItemChangeInput`](../types/CreateOrderEditItemChangeInput.md) |

#### Returns

`Promise`<[`OrderItemChange`](OrderItemChange.md)\>

-`Promise`: 
	-`OrderItemChange`: 

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L82)

___

### delete

**delete**(`itemChangeIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `itemChangeIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:98](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L98)

___

### list

**list**(`selector`, `config?`): `Promise`<[`OrderItemChange`](OrderItemChange.md)[]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`OrderItemChange`](OrderItemChange.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`OrderItemChange`](OrderItemChange.md)\> |

#### Returns

`Promise`<[`OrderItemChange`](OrderItemChange.md)[]\>

-`Promise`: 
	-`OrderItemChange[]`: 
		-`OrderItemChange`: 

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L70)

___

### retrieve

**retrieve**(`id`, `config?`): `Promise`<[`OrderItemChange`](OrderItemChange.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`OrderItemChange`](OrderItemChange.md)\> |

#### Returns

`Promise`<[`OrderItemChange`](OrderItemChange.md)\>

-`Promise`: 
	-`OrderItemChange`: 

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:49](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/order-edit-item-change.ts#L49)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`OrderEditItemChangeService`](OrderEditItemChangeService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
