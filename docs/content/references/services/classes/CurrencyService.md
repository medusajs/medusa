# Class: CurrencyService

## Hierarchy

- `TransactionBaseService`

  ↳ **`CurrencyService`**

## Constructors

### constructor

• **new CurrencyService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/currency.ts:32](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L32)

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

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: typeof `CurrencyRepository`

#### Defined in

[packages/medusa/src/services/currency.ts:28](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L28)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/currency.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L29)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/currency.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L30)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/currency.ts:25](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L25)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/currency.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L26)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/currency.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L21)

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

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Currency`[], `number`]\>

Lists currencies based on the provided parameters and includes the count of
currencies that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Currency`\> | an object that defines rules to filter currencies   by |
| `config` | `FindConfig`<`Currency`\> | object that defines the scope for what should be   returned |

#### Returns

`Promise`<[`Currency`[], `number`]\>

an array containing the currencies as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

[packages/medusa/src/services/currency.ts:81](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L81)

___

### retrieveByCode

▸ **retrieveByCode**(`code`): `Promise`<`Currency`\>

Return the currency

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The code of the currency that must be retrieve |

#### Returns

`Promise`<`Currency`\>

The currency

#### Defined in

[packages/medusa/src/services/currency.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L50)

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

▸ **update**(`code`, `data`): `Promise`<`undefined` \| `Currency`\>

Update a currency

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The code of the currency to update |
| `data` | `UpdateCurrencyInput` | The data that must be updated on the currency |

#### Returns

`Promise`<`undefined` \| `Currency`\>

The updated currency

#### Defined in

[packages/medusa/src/services/currency.ts:103](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/currency.ts#L103)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CurrencyService`](CurrencyService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CurrencyService`](CurrencyService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
