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

[medusa/src/services/currency.ts:29](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L29)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<`Currency`\>

#### Defined in

[medusa/src/services/currency.ts:25](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L25)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/currency.ts:26](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L26)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/currency.ts:27](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L27)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/currency.ts:21](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L21)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/currency.ts:78](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L78)

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

[medusa/src/services/currency.ts:47](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L47)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/currency.ts:100](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/currency.ts#L100)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
