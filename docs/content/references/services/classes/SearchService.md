# Class: SearchService

## Hierarchy

- `AbstractSearchService`

  ↳ **`SearchService`**

## Constructors

### constructor

• **new SearchService**(`__namedParameters`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |
| `options` | `any` |

#### Overrides

AbstractSearchService.constructor

#### Defined in

[packages/medusa/src/services/search.ts:18](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L18)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

AbstractSearchService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### isDefault

• **isDefault**: `boolean` = `true`

#### Overrides

AbstractSearchService.isDefault

#### Defined in

[packages/medusa/src/services/search.ts:11](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L11)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/search.ts:15](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L15)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

AbstractSearchService.manager\_

#### Defined in

[packages/medusa/src/services/search.ts:13](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L13)

___

### options\_

• `Protected` `Readonly` **options\_**: `Record`<`string`, `unknown`\>

#### Overrides

AbstractSearchService.options\_

#### Defined in

[packages/medusa/src/services/search.ts:16](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L16)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

AbstractSearchService.transactionManager\_

#### Defined in

[packages/medusa/src/services/search.ts:14](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L14)

## Accessors

### options

• `get` **options**(): `Record`<`string`, `unknown`\>

#### Returns

`Record`<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.options

#### Defined in

[packages/medusa/src/interfaces/search-service.ts:82](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/search-service.ts#L82)

## Methods

### addDocuments

▸ **addDocuments**(`indexName`, `documents`, `type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `documents` | `unknown` |
| `type` | `string` |

#### Returns

`void`

#### Overrides

AbstractSearchService.addDocuments

#### Defined in

[packages/medusa/src/services/search.ts:43](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L43)

___

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

AbstractSearchService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### createIndex

▸ **createIndex**(`indexName`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `options` | `unknown` |

#### Returns

`void`

#### Overrides

AbstractSearchService.createIndex

#### Defined in

[packages/medusa/src/services/search.ts:31](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L31)

___

### deleteAllDocuments

▸ **deleteAllDocuments**(`indexName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |

#### Returns

`void`

#### Overrides

AbstractSearchService.deleteAllDocuments

#### Defined in

[packages/medusa/src/services/search.ts:61](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L61)

___

### deleteDocument

▸ **deleteDocument**(`indexName`, `document_id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `document_id` | `string` \| `number` |

#### Returns

`void`

#### Overrides

AbstractSearchService.deleteDocument

#### Defined in

[packages/medusa/src/services/search.ts:55](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L55)

___

### getIndex

▸ **getIndex**(`indexName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |

#### Returns

`void`

#### Overrides

AbstractSearchService.getIndex

#### Defined in

[packages/medusa/src/services/search.ts:37](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L37)

___

### replaceDocuments

▸ **replaceDocuments**(`indexName`, `documents`, `type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `documents` | `unknown` |
| `type` | `string` |

#### Returns

`void`

#### Overrides

AbstractSearchService.replaceDocuments

#### Defined in

[packages/medusa/src/services/search.ts:49](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L49)

___

### search

▸ **search**(`indexName`, `query`, `options`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `query` | `unknown` |
| `options` | `unknown` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `hits` | `unknown`[] |

#### Overrides

AbstractSearchService.search

#### Defined in

[packages/medusa/src/services/search.ts:67](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L67)

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

AbstractSearchService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### updateSettings

▸ **updateSettings**(`indexName`, `settings`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `settings` | `unknown` |

#### Returns

`void`

#### Overrides

AbstractSearchService.updateSettings

#### Defined in

[packages/medusa/src/services/search.ts:78](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/search.ts#L78)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SearchService`](SearchService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SearchService`](SearchService.md)

#### Inherited from

AbstractSearchService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
