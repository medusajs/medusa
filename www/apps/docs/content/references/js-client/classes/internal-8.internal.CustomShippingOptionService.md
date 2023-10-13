---
displayed_sidebar: jsClientSidebar
---

# Class: CustomShippingOptionService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).CustomShippingOptionService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`CustomShippingOptionService`**

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

### customShippingOptionRepository\_

• `Protected` **customShippingOptionRepository\_**: `Repository`<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)\>

#### Defined in

packages/medusa/dist/services/custom-shipping-option.d.ts:12

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

▸ **create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Creates a custom shipping option

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`CreateCustomShippingOptionInput`](../modules/internal-8.md#createcustomshippingoptioninput) \| [`CreateCustomShippingOptionInput`](../modules/internal-8.md#createcustomshippingoptioninput)[] |
| `TResult` | `T` extends [`CreateCustomShippingOptionInput`](../modules/internal-8.md#createcustomshippingoptioninput)[] ? [`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)[] : [`CustomShippingOption`](internal-8.internal.CustomShippingOption.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `T` | the custom shipping option to create |

#### Returns

`Promise`<`TResult`\>

resolves to the creation result

#### Defined in

packages/medusa/dist/services/custom-shipping-option.d.ts:32

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)[]\>

Fetches all custom shipping options based on the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)[]\>

custom shipping options matching the query

#### Defined in

packages/medusa/dist/services/custom-shipping-option.d.ts:26

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)\>

Retrieves a specific shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the custom shipping option to retrieve. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)\> | any options needed to query for the result. |

#### Returns

`Promise`<[`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)\>

the requested custom shipping option.

#### Defined in

packages/medusa/dist/services/custom-shipping-option.d.ts:20

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

▸ **withTransaction**(`transactionManager?`): [`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
