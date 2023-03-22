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

[packages/medusa/src/services/order-edit-item-change.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L34)

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

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L30)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L26)

___

### orderItemChangeRepository\_

• `Protected` `Readonly` **orderItemChangeRepository\_**: typeof `OrderItemChangeRepository`

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L29)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:32](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L32)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L27)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |

#### Defined in

[packages/medusa/src/services/order-edit-item-change.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L21)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/order-edit-item-change.ts:86](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L86)

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

[packages/medusa/src/services/order-edit-item-change.ts:102](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L102)

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

[packages/medusa/src/services/order-edit-item-change.ts:73](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L73)

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

[packages/medusa/src/services/order-edit-item-change.ts:51](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/order-edit-item-change.ts#L51)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
