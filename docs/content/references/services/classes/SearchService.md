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

[medusa/src/services/search.ts:16](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L16)

## Properties

### isDefault

• **isDefault**: `boolean` = `true`

#### Overrides

AbstractSearchService.isDefault

#### Defined in

[medusa/src/services/search.ts:11](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L11)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[medusa/src/services/search.ts:13](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L13)

___

### options\_

• `Protected` `Readonly` **options\_**: `Record`<`string`, `unknown`\>

#### Overrides

AbstractSearchService.options\_

#### Defined in

[medusa/src/services/search.ts:14](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L14)

## Accessors

### options

• `get` **options**(): `Record`<`string`, `unknown`\>

#### Returns

`Record`<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.options

#### Defined in

utils/dist/search/abstract-service.d.ts:5

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

[medusa/src/services/search.ts:40](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L40)

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

[medusa/src/services/search.ts:28](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L28)

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

[medusa/src/services/search.ts:69](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L69)

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

[medusa/src/services/search.ts:60](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L60)

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

[medusa/src/services/search.ts:34](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L34)

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

[medusa/src/services/search.ts:50](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L50)

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

[medusa/src/services/search.ts:75](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L75)

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

[medusa/src/services/search.ts:86](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/search.ts#L86)
