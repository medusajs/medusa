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

[medusa/src/services/claim-item.ts:26](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L26)

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

### claimImageRepository\_

• `Protected` `Readonly` **claimImageRepository\_**: `Repository`<`ClaimImage`\>

#### Defined in

[medusa/src/services/claim-item.ts:24](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L24)

___

### claimItemRepository\_

• `Protected` `Readonly` **claimItemRepository\_**: `Repository`<`ClaimItem`\>

#### Defined in

[medusa/src/services/claim-item.ts:22](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L22)

___

### claimTagRepository\_

• `Protected` `Readonly` **claimTagRepository\_**: `Repository`<`ClaimTag`\>

#### Defined in

[medusa/src/services/claim-item.ts:23](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L23)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/claim-item.ts:21](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L21)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/claim-item.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L20)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/claim-item.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L14)

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

▸ **create**(`data`): `Promise`<`ClaimItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateClaimItemInput` |

#### Returns

`Promise`<`ClaimItem`\>

#### Defined in

[medusa/src/services/claim-item.ts:43](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L43)

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

[medusa/src/services/claim-item.ts:205](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L205)

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

[medusa/src/services/claim-item.ts:224](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L224)

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

[medusa/src/services/claim-item.ts:127](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/claim-item.ts#L127)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
