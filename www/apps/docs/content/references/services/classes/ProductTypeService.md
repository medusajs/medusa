# ProductTypeService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ProductTypeService`**

## Constructors

### constructor

**new ProductTypeService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `Object` |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/product-type.ts:12](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-type.ts#L12)

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

### typeRepository\_

 `Protected` `Readonly` **typeRepository\_**: [`Repository`](Repository.md)<[`ProductType`](ProductType.md)\> & { `findAndCountByDiscountConditionId`: Method findAndCountByDiscountConditionId ; `upsertType`: Method upsertType  }

#### Defined in

[packages/medusa/src/services/product-type.ts:10](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-type.ts#L10)

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

### list

**list**(`selector?`, `config?`): `Promise`<[`ProductType`](ProductType.md)[]\>

Lists product types

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`ProductType`](ProductType.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductType`](ProductType.md)\> | the config to be used for find |

#### Returns

`Promise`<[`ProductType`](ProductType.md)[]\>

-`Promise`: the result of the find operation
	-`ProductType[]`: 
		-`ProductType`: 

#### Defined in

[packages/medusa/src/services/product-type.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-type.ts#L52)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[[`ProductType`](ProductType.md)[], `number`]\>

Lists product types and adds count.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`ProductType`](ProductType.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductType`](ProductType.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`ProductType`](ProductType.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`ProductType[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/product-type.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-type.ts#L69)

___

### retrieve

**retrieve**(`id`, `config?`): `Promise`<[`ProductType`](ProductType.md)\>

Gets a product type by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | id of the product to get. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductType`](ProductType.md)\> | object that defines what should be included in the query response |

#### Returns

`Promise`<[`ProductType`](ProductType.md)\>

-`Promise`: the result of the find one operation.
	-`ProductType`: 

#### Defined in

[packages/medusa/src/services/product-type.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-type.ts#L27)

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

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductTypeService`](ProductTypeService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ProductTypeService`](ProductTypeService.md)

-`ProductTypeService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
