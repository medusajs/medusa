---
displayed_sidebar: jsClientSidebar
---

# Class: CurrencyService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).CurrencyService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`CurrencyService`**

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

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<[`Currency`](internal-3.Currency.md)\>

#### Defined in

packages/medusa/dist/services/currency.d.ts:19

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/currency.d.ts:20

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/currency.d.ts:21

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

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/currency.d.ts:16

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

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Currency`](internal-3.Currency.md)[], `number`]\>

Lists currencies based on the provided parameters and includes the count of
currencies that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Currency`](internal-3.Currency.md)\> | an object that defines rules to filter currencies by |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Currency`](internal-3.Currency.md)\> | object that defines the scope for what should be returned |

#### Returns

`Promise`<[[`Currency`](internal-3.Currency.md)[], `number`]\>

an array containing the currencies as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

packages/medusa/dist/services/currency.d.ts:40

___

### retrieveByCode

▸ **retrieveByCode**(`code`): `Promise`<[`Currency`](internal-3.Currency.md)\>

Return the currency

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The code of the currency that must be retrieve |

#### Returns

`Promise`<[`Currency`](internal-3.Currency.md)\>

The currency

#### Defined in

packages/medusa/dist/services/currency.d.ts:28

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

### update

▸ **update**(`code`, `data`): `Promise`<`undefined` \| [`Currency`](internal-3.Currency.md)\>

Update a currency

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The code of the currency to update |
| `data` | [`UpdateCurrencyInput`](../modules/internal-8.md#updatecurrencyinput) | The data that must be updated on the currency |

#### Returns

`Promise`<`undefined` \| [`Currency`](internal-3.Currency.md)\>

The updated currency

#### Defined in

packages/medusa/dist/services/currency.d.ts:47

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CurrencyService`](internal-8.internal.CurrencyService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CurrencyService`](internal-8.internal.CurrencyService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
