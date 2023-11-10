# ClaimItemService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ClaimItemService`**

## Constructors

### constructor

**new ClaimItemService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `Object` |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/claim-item.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L27)

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

### claimImageRepository\_

 `Protected` `Readonly` **claimImageRepository\_**: [`Repository`](Repository.md)<[`ClaimImage`](ClaimImage.md)\>

#### Defined in

[packages/medusa/src/services/claim-item.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L25)

___

### claimItemRepository\_

 `Protected` `Readonly` **claimItemRepository\_**: [`Repository`](Repository.md)<[`ClaimItem`](ClaimItem.md)\>

#### Defined in

[packages/medusa/src/services/claim-item.ts:23](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L23)

___

### claimTagRepository\_

 `Protected` `Readonly` **claimTagRepository\_**: [`Repository`](Repository.md)<[`ClaimTag`](ClaimTag.md)\>

#### Defined in

[packages/medusa/src/services/claim-item.ts:24](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L24)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/claim-item.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L22)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/claim-item.ts:21](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L21)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/claim-item.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L15)

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

### create

**create**(`data`): `Promise`<[`ClaimItem`](ClaimItem.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateClaimItemInput`](../index.md#createclaimiteminput) |

#### Returns

`Promise`<[`ClaimItem`](ClaimItem.md)\>

-`Promise`: 
	-`ClaimItem`: 

#### Defined in

[packages/medusa/src/services/claim-item.ts:44](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L44)

___

### list

**list**(`selector`, `config?`): `Promise`<[`ClaimItem`](ClaimItem.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`ClaimItem`](ClaimItem.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ClaimItem`](ClaimItem.md)\> | the config object for find |

#### Returns

`Promise`<[`ClaimItem`](ClaimItem.md)[]\>

-`Promise`: the result of the find operation
	-`ClaimItem[]`: 
		-`ClaimItem`: 

#### Defined in

[packages/medusa/src/services/claim-item.ts:206](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L206)

___

### retrieve

**retrieve**(`claimItemId`, `config?`): `Promise`<[`ClaimItem`](ClaimItem.md)\>

Gets a claim item by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `claimItemId` | `string` | id of ClaimItem to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ClaimItem`](ClaimItem.md)\> | configuration for the find operation |

#### Returns

`Promise`<[`ClaimItem`](ClaimItem.md)\>

-`Promise`: the ClaimItem
	-`ClaimItem`: 

#### Defined in

[packages/medusa/src/services/claim-item.ts:225](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L225)

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

**update**(`id`, `data`): `Promise`<[`ClaimItem`](ClaimItem.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`Promise`<[`ClaimItem`](ClaimItem.md)\>

-`Promise`: 
	-`ClaimItem`: 

#### Defined in

[packages/medusa/src/services/claim-item.ts:128](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/claim-item.ts#L128)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ClaimItemService`](ClaimItemService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ClaimItemService`](ClaimItemService.md)

-`ClaimItemService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
