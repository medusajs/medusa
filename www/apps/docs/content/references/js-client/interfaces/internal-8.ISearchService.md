---
displayed_sidebar: jsClientSidebar
---

# Interface: ISearchService

[internal](../modules/internal-8.md).ISearchService

## Implemented by

- [`AbstractSearchService`](../classes/internal-8.AbstractSearchService.md)

## Properties

### options

• **options**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/types/dist/search/interface.d.ts:2

## Methods

### addDocuments

▸ **addDocuments**(`indexName`, `documents`, `type`): `unknown`

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

#### Defined in

packages/types/dist/search/interface.d.ts:23

___

### createIndex

▸ **createIndex**(`indexName`, `options`): `unknown`

Used to create an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `options` | `unknown` | the options |

#### Returns

`unknown`

returns response from search engine provider

#### Defined in

packages/types/dist/search/interface.d.ts:9

___

### deleteAllDocuments

▸ **deleteAllDocuments**(`indexName`): `unknown`

Used to delete all documents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |

#### Returns

`unknown`

returns response from search engine provider

#### Defined in

packages/types/dist/search/interface.d.ts:44

___

### deleteDocument

▸ **deleteDocument**(`indexName`, `document_id`): `unknown`

Used to delete document

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `document_id` | `string` \| `number` | the id of the document |

#### Returns

`unknown`

returns response from search engine provider

#### Defined in

packages/types/dist/search/interface.d.ts:38

___

### getIndex

▸ **getIndex**(`indexName`): `unknown`

Used to get an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name. |

#### Returns

`unknown`

returns response from search engine provider

#### Defined in

packages/types/dist/search/interface.d.ts:15

___

### replaceDocuments

▸ **replaceDocuments**(`indexName`, `documents`, `type`): `unknown`

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

#### Defined in

packages/types/dist/search/interface.d.ts:31

___

### search

▸ **search**(`indexName`, `query`, `options`): `unknown`

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

#### Defined in

packages/types/dist/search/interface.d.ts:54

___

### updateSettings

▸ **updateSettings**(`indexName`, `settings`): `unknown`

Used to update the settings of an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `settings` | `unknown` | settings object |

#### Returns

`unknown`

returns response from search engine provider

#### Defined in

packages/types/dist/search/interface.d.ts:61
