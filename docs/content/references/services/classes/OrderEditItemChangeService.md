# Class: OrderEditItemChangeService

## Hierarchy

- `TransactionBaseService`

  ↳ **`OrderEditItemChangeService`**

## Constructors

### constructor

• **new OrderEditItemChangeService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/order-edit-item-change.ts:33](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L33)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: `IEventBusService`

#### Defined in

[medusa/src/services/order-edit-item-change.ts:29](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L29)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/order-edit-item-change.ts:30](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L30)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### orderItemChangeRepository\_

• `Protected` `Readonly` **orderItemChangeRepository\_**: `Repository`<`OrderItemChange`\>

#### Defined in

[medusa/src/services/order-edit-item-change.ts:28](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L28)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/order-edit-item-change.ts:31](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L31)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |

#### Defined in

[medusa/src/services/order-edit-item-change.ts:22](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L22)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`OrderItemChange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateOrderEditItemChangeInput` |

#### Returns

`Promise`<`OrderItemChange`\>

#### Defined in

[medusa/src/services/order-edit-item-change.ts:81](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L81)

___

### delete

▸ **delete**(`itemChangeIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemChangeIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/order-edit-item-change.ts:97](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L97)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`OrderItemChange`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`OrderItemChange`\> |
| `config` | `FindConfig`<`OrderItemChange`\> |

#### Returns

`Promise`<`OrderItemChange`[]\>

#### Defined in

[medusa/src/services/order-edit-item-change.ts:69](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L69)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`OrderItemChange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config` | `FindConfig`<`OrderItemChange`\> |

#### Returns

`Promise`<`OrderItemChange`\>

#### Defined in

[medusa/src/services/order-edit-item-change.ts:48](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/order-edit-item-change.ts#L48)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderEditItemChangeService`](OrderEditItemChangeService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
