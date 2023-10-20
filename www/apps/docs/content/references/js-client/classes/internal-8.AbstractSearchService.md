---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractSearchService

[internal](../modules/internal-8.md).AbstractSearchService

## Hierarchy

- **`AbstractSearchService`**

  ↳ [`SearchService`](internal-8.internal.SearchService.md)

## Implements

- [`ISearchService`](../interfaces/internal-8.ISearchService.md)

## Properties

### isDefault

• `Readonly` `Abstract` **isDefault**: `any`

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:3

___

### options\_

• `Protected` `Readonly` **options\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:4

## Accessors

### options

• `get` **options**(): [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Returns

[`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[options](../interfaces/internal-8.ISearchService.md#options)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:5

## Methods

### addDocuments

▸ `Abstract` **addDocuments**(`indexName`, `documents`, `type`): `unknown`

Used to index documents by the search engine provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `documents` | `unknown` | documents array to be indexed |
| `type` | `string` | of documents to be added (e.g: products, regions, orders, etc) |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[addDocuments](../interfaces/internal-8.ISearchService.md#adddocuments)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:9

___

### createIndex

▸ `Abstract` **createIndex**(`indexName`, `options`): `unknown`

Used to create an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `options` | `unknown` | the options |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[createIndex](../interfaces/internal-8.ISearchService.md#createindex)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:7

___

### deleteAllDocuments

▸ `Abstract` **deleteAllDocuments**(`indexName`): `unknown`

Used to delete all documents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[deleteAllDocuments](../interfaces/internal-8.ISearchService.md#deletealldocuments)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:12

___

### deleteDocument

▸ `Abstract` **deleteDocument**(`indexName`, `document_id`): `unknown`

Used to delete document

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `document_id` | `string` \| `number` | the id of the document |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[deleteDocument](../interfaces/internal-8.ISearchService.md#deletedocument)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:11

___

### getIndex

▸ `Abstract` **getIndex**(`indexName`): `unknown`

Used to get an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name. |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[getIndex](../interfaces/internal-8.ISearchService.md#getindex)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:8

___

### replaceDocuments

▸ `Abstract` **replaceDocuments**(`indexName`, `documents`, `type`): `unknown`

Used to replace documents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name. |
| `documents` | `unknown` | array of document objects that will replace existing documents |
| `type` | `string` | type of documents to be replaced (e.g: products, regions, orders, etc) |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[replaceDocuments](../interfaces/internal-8.ISearchService.md#replacedocuments)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:10

___

### search

▸ `Abstract` **search**(`indexName`, `query`, `options`): `unknown`

Used to search for a document in an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `query` | ``null`` \| `string` | the search query |
| `options` | `unknown` | any options passed to the request object other than the query and indexName - additionalOptions contain any provider specific options |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[search](../interfaces/internal-8.ISearchService.md#search)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:13

___

### updateSettings

▸ `Abstract` **updateSettings**(`indexName`, `settings`): `unknown`

Used to update the settings of an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `settings` | `unknown` | settings object |

#### Returns

`unknown`

returns response from search engine provider

#### Implementation of

[ISearchService](../interfaces/internal-8.ISearchService.md).[updateSettings](../interfaces/internal-8.ISearchService.md#updatesettings)

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:14
