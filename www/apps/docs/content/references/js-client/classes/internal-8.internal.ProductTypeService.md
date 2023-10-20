---
displayed_sidebar: jsClientSidebar
---

# Class: ProductTypeService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ProductTypeService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ProductTypeService`**

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### typeRepository\_

• `Protected` `Readonly` **typeRepository\_**: `Repository`<[`ProductType`](internal-3.ProductType.md)\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductType`](internal-3.ProductType.md)\>) => `Promise`<[[`ProductType`](internal-3.ProductType.md)[], `number`]\> ; `upsertType`: (`type?`: [`UpsertTypeInput`](../modules/internal-8.md#upserttypeinput)) => `Promise`<``null`` \| [`ProductType`](internal-3.ProductType.md)\>  }

#### Defined in

packages/medusa/dist/services/product-type.d.ts:6

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

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`ProductType`](internal-3.ProductType.md)[]\>

Lists product types

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ProductType`](internal-3.ProductType.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductType`](internal-3.ProductType.md)\> | the config to be used for find |

#### Returns

`Promise`<[`ProductType`](internal-3.ProductType.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product-type.d.ts:25

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`ProductType`](internal-3.ProductType.md)[], `number`]\>

Lists product types and adds count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ProductType`](internal-3.ProductType.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductType`](internal-3.ProductType.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`ProductType`](internal-3.ProductType.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product-type.d.ts:35

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<[`ProductType`](internal-3.ProductType.md)\>

Gets a product type by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the product to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductType`](internal-3.ProductType.md)\> | object that defines what should be included in the query response |

#### Returns

`Promise`<[`ProductType`](internal-3.ProductType.md)\>

the result of the find one operation.

#### Defined in

packages/medusa/dist/services/product-type.d.ts:18

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

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductTypeService`](internal-8.internal.ProductTypeService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductTypeService`](internal-8.internal.ProductTypeService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
