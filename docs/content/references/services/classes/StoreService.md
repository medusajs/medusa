# Class: StoreService

## Hierarchy

- `TransactionBaseService`<[`StoreService`](StoreService.md)\>

  ↳ **`StoreService`**

## Constructors

### constructor

• **new StoreService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;StoreService\&gt;.constructor

#### Defined in

[services/store.ts:33](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L33)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: typeof `CurrencyRepository`

#### Defined in

[services/store.ts:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L30)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/store.ts:31](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/store.ts:26](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L26)

___

### storeRepository\_

• `Protected` `Readonly` **storeRepository\_**: typeof `StoreRepository`

#### Defined in

[services/store.ts:29](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L29)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/store.ts:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L27)

## Methods

### addCurrency

▸ **addCurrency**(`code`): `Promise`<`Store`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` |  |

#### Returns

`Promise`<`Store`\>

#### Defined in

[services/store.ts:219](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L219)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(): `Promise`<`Store`\>

#### Returns

`Promise`<`Store`\>

#### Defined in

[services/store.ts:56](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L56)

___

### getDefaultCurrency\_

▸ `Protected` **getDefaultCurrency_**(`code`): `Partial`<`Currency`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |

#### Returns

`Partial`<`Currency`\>

#### Defined in

[services/store.ts:113](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L113)

___

### removeCurrency

▸ **removeCurrency**(`code`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/store.ts:263](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L263)

___

### retrieve

▸ **retrieve**(`config?`): `Promise`<`Store`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `FindConfig`<`Store`\> |  |

#### Returns

`Promise`<`Store`\>

#### Defined in

[services/store.ts:92](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L92)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`data`): `Promise`<`Store`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `UpdateStoreInput` |  |

#### Returns

`Promise`<`Store`\>

#### Defined in

[services/store.ts:129](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/store.ts#L129)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`StoreService`](StoreService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`StoreService`](StoreService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
