# Class: ClaimItemService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ClaimItemService`**

## Constructors

### constructor

• **new ClaimItemService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/claim-item.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L30)

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

### claimImageRepository\_

• `Protected` `Readonly` **claimImageRepository\_**: typeof `ClaimImageRepository`

#### Defined in

[packages/medusa/src/services/claim-item.ts:25](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L25)

___

### claimItemRepository\_

• `Protected` `Readonly` **claimItemRepository\_**: typeof `ClaimItemRepository`

#### Defined in

[packages/medusa/src/services/claim-item.ts:23](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L23)

___

### claimTagRepository\_

• `Protected` `Readonly` **claimTagRepository\_**: typeof `ClaimTagRepository`

#### Defined in

[packages/medusa/src/services/claim-item.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L24)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/claim-item.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L22)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/claim-item.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L21)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/claim-item.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L27)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/claim-item.ts:28](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L28)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/claim-item.ts:15](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L15)

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

▸ **create**(`data`): `Promise`<`ClaimItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateClaimItemInput` |

#### Returns

`Promise`<`ClaimItem`\>

#### Defined in

[packages/medusa/src/services/claim-item.ts:49](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L49)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ClaimItem`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ClaimItem`\> | the query object for find |
| `config` | `FindConfig`<`ClaimItem`\> | the config object for find |

#### Returns

`Promise`<`ClaimItem`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/claim-item.ts:221](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L221)

___

### retrieve

▸ **retrieve**(`claimItemId`, `config?`): `Promise`<`ClaimItem`\>

Gets a claim item by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `claimItemId` | `string` | id of ClaimItem to retrieve |
| `config` | `FindConfig`<`ClaimItem`\> | configuration for the find operation |

#### Returns

`Promise`<`ClaimItem`\>

the ClaimItem

#### Defined in

[packages/medusa/src/services/claim-item.ts:240](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L240)

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

▸ **update**(`id`, `data`): `Promise`<`ClaimItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`Promise`<`ClaimItem`\>

#### Defined in

[packages/medusa/src/services/claim-item.ts:139](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/claim-item.ts#L139)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ClaimItemService`](ClaimItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ClaimItemService`](ClaimItemService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
