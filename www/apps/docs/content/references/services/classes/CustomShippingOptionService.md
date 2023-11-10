# CustomShippingOptionService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`CustomShippingOptionService`**

## Constructors

### constructor

**new CustomShippingOptionService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-6) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:18](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/custom-shipping-option.ts#L18)

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

### customShippingOptionRepository\_

 `Protected` **customShippingOptionRepository\_**: [`Repository`](Repository.md)<[`CustomShippingOption`](CustomShippingOption.md)\>

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/custom-shipping-option.ts#L16)

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

**create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Creates a custom shipping option

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TResult` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | `T` | the custom shipping option to create |

#### Returns

`Promise`<`TResult`\>

-`Promise`: resolves to the creation result

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:80](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/custom-shipping-option.ts#L80)

___

### list

**list**(`selector`, `config?`): `Promise`<[`CustomShippingOption`](CustomShippingOption.md)[]\>

Fetches all custom shipping options based on the given selector

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`CustomShippingOption`](CustomShippingOption.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`CustomShippingOption`](CustomShippingOption.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`CustomShippingOption`](CustomShippingOption.md)[]\>

-`Promise`: custom shipping options matching the query
	-`CustomShippingOption[]`: 
		-`CustomShippingOption`: 

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/custom-shipping-option.ts#L58)

___

### retrieve

**retrieve**(`id`, `config?`): `Promise`<[`CustomShippingOption`](CustomShippingOption.md)\>

Retrieves a specific shipping option.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the custom shipping option to retrieve. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`CustomShippingOption`](CustomShippingOption.md)\> | any options needed to query for the result. |

#### Returns

`Promise`<[`CustomShippingOption`](CustomShippingOption.md)\>

-`Promise`: the requested custom shipping option.
	-`CustomShippingOption`: 

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/custom-shipping-option.ts#L31)

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

**withTransaction**(`transactionManager?`): [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`CustomShippingOptionService`](CustomShippingOptionService.md)

-`CustomShippingOptionService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
