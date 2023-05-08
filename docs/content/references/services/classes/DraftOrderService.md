# Class: DraftOrderService

Handles draft orders

**`Implements`**

## Hierarchy

- `TransactionBaseService`

  ↳ **`DraftOrderService`**

## Constructors

### constructor

• **new DraftOrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/draft-order.ts:67](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L67)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[medusa/src/services/draft-order.ts:61](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L61)

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[medusa/src/services/draft-order.ts:65](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L65)

___

### draftOrderRepository\_

• `Protected` `Readonly` **draftOrderRepository\_**: `Repository`<`DraftOrder`\>

#### Defined in

[medusa/src/services/draft-order.ts:57](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L57)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/draft-order.ts:60](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L60)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/draft-order.ts:62](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L62)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: `Repository`<`Order`\> & { `findOneWithRelations`: (`relations`: `FindOptionsRelations`<`Order`\>, `optionsWithoutRelations`: `Omit`<`FindManyOptions`<`Order`\>, ``"relations"``\>) => `Promise`<`Order`\> ; `findWithRelations`: (`relations`: `FindOptionsRelations`<`Order`\>, `optionsWithoutRelations`: `Omit`<`FindManyOptions`<`Order`\>, ``"relations"``\>) => `Promise`<`Order`[]\>  }

#### Defined in

[medusa/src/services/draft-order.ts:59](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L59)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: `Repository`<`Payment`\>

#### Defined in

[medusa/src/services/draft-order.ts:58](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L58)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/draft-order.ts:63](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L63)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/draft-order.ts:64](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L64)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/draft-order.ts:52](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L52)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`DraftOrder`\>

Creates a draft order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `DraftOrderCreateProps` | data to create draft order from |

#### Returns

`Promise`<`DraftOrder`\>

the created draft order

#### Defined in

[medusa/src/services/draft-order.ts:260](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L260)

___

### delete

▸ **delete**(`draftOrderId`): `Promise`<`undefined` \| `DraftOrder`\>

Deletes draft order idempotently.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` | id of draft order to delete |

#### Returns

`Promise`<`undefined` \| `DraftOrder`\>

empty promise

#### Defined in

[medusa/src/services/draft-order.ts:156](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L156)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`DraftOrder`[]\>

Lists draft orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | query object for find |
| `config` | `FindConfig`<`DraftOrder`\> | configurable attributes for find |

#### Returns

`Promise`<`DraftOrder`[]\>

list of draft orders

#### Defined in

[medusa/src/services/draft-order.ts:238](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L238)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`DraftOrder`[], `number`]\>

Lists draft orders alongside the count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | query selector to filter draft orders |
| `config` | `FindConfig`<`DraftOrder`\> | query config |

#### Returns

`Promise`<[`DraftOrder`[], `number`]\>

draft orders

#### Defined in

[medusa/src/services/draft-order.ts:180](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L180)

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

[medusa/src/services/draft-order.ts:421](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L421)

___

### retrieve

▸ **retrieve**(`draftOrderId`, `config?`): `Promise`<`DraftOrder`\>

Retrieves a draft order with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` | id of the draft order to retrieve |
| `config` | `FindConfig`<`DraftOrder`\> | query object for findOne |

#### Returns

`Promise`<`DraftOrder`\>

the draft order

#### Defined in

[medusa/src/services/draft-order.ts:98](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L98)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`DraftOrder`\>

Retrieves a draft order based on its associated cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id that the draft orders's cart has |
| `config` | `FindConfig`<`DraftOrder`\> | query object for findOne |

#### Returns

`Promise`<`DraftOrder`\>

the draft order

#### Defined in

[medusa/src/services/draft-order.ts:131](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L131)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `data`): `Promise`<`DraftOrder`\>

Updates a draft order with the given data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the draft order |
| `data` | `Object` | values to update the order with |
| `data.no_notification_order` | `boolean` | - |

#### Returns

`Promise`<`DraftOrder`\>

the updated draft order

#### Defined in

[medusa/src/services/draft-order.ts:450](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/draft-order.ts#L450)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DraftOrderService`](DraftOrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DraftOrderService`](DraftOrderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
