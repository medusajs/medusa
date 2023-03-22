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

[packages/medusa/src/services/search.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L18)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

AbstractSearchService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### isDefault

• **isDefault**: `boolean` = `true`

#### Overrides

AbstractSearchService.isDefault

#### Defined in

[packages/medusa/src/services/search.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L11)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/search.ts:15](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L15)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

AbstractSearchService.manager\_

#### Defined in

[packages/medusa/src/services/search.ts:13](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L13)

___

### options\_

• `Protected` `Readonly` **options\_**: `Record`<`string`, `unknown`\>

#### Overrides

AbstractSearchService.options\_

#### Defined in

[packages/medusa/src/services/search.ts:16](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L16)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

AbstractSearchService.transactionManager\_

#### Defined in

[packages/medusa/src/services/search.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L14)

## Accessors

### options

• `get` **options**(): `Record`<`string`, `unknown`\>

#### Returns

`Record`<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.options

#### Defined in

[packages/medusa/src/interfaces/search-service.ts:82](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/search-service.ts#L82)

## Methods

### addDocuments

▸ **addDocuments**(`indexName`, `documents`, `type`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `documents` | `unknown` |
| `type` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.addDocuments

#### Defined in

[packages/medusa/src/services/search.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L43)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### createIndex

▸ **createIndex**(`indexName`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `options` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.createIndex

#### Defined in

[packages/medusa/src/services/search.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L31)

___

### deleteAllDocuments

▸ **deleteAllDocuments**(`indexName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.deleteAllDocuments

#### Defined in

[packages/medusa/src/services/search.ts:72](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L72)

___

### deleteDocument

▸ **deleteDocument**(`indexName`, `document_id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `document_id` | `string` \| `number` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.deleteDocument

#### Defined in

[packages/medusa/src/services/search.ts:63](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L63)

___

### getIndex

▸ **getIndex**(`indexName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.getIndex

#### Defined in

[packages/medusa/src/services/search.ts:37](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L37)

___

### replaceDocuments

▸ **replaceDocuments**(`indexName`, `documents`, `type`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `documents` | `unknown` |
| `type` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.replaceDocuments

#### Defined in

[packages/medusa/src/services/search.ts:53](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L53)

___

### search

▸ **search**(`indexName`, `query`, `options`): `Promise`<{ `hits`: `unknown`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `query` | `unknown` |
| `options` | `unknown` |

#### Returns

`Promise`<{ `hits`: `unknown`[]  }\>

#### Overrides

AbstractSearchService.search

#### Defined in

[packages/medusa/src/services/search.ts:78](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L78)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### updateSettings

▸ **updateSettings**(`indexName`, `settings`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexName` | `string` |
| `settings` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

AbstractSearchService.updateSettings

#### Defined in

[packages/medusa/src/services/search.ts:89](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/search.ts#L89)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
