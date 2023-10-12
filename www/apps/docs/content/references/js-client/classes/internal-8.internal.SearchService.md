---
displayed_sidebar: jsClientSidebar
---

# Class: SearchService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).SearchService

## Hierarchy

- [`AbstractSearchService`](internal-8.AbstractSearchService.md)

  ↳ **`SearchService`**

## Properties

### isDefault

• **isDefault**: `boolean`

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[isDefault](internal-8.AbstractSearchService.md#isdefault)

#### Defined in

packages/medusa/dist/services/search.d.ts:9

___

### logger\_

• `Protected` `Readonly` **logger\_**: [`Logger`](../modules/internal-8.internal.md#logger)

#### Defined in

packages/medusa/dist/services/search.d.ts:10

___

### options\_

• `Protected` `Readonly` **options\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[options_](internal-8.AbstractSearchService.md#options_)

#### Defined in

packages/medusa/dist/services/search.d.ts:11

## Accessors

### options

• `get` **options**(): [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Returns

[`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

AbstractSearchService.options

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:5

## Methods

### addDocuments

▸ **addDocuments**(`indexName`, `documents`, `type`): `Promise`<`void`\>

Used to index documents by the search engine provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `documents` | `unknown` | documents array to be indexed |
| `type` | `string` | of documents to be added (e.g: products, regions, orders, etc) |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[addDocuments](internal-8.AbstractSearchService.md#adddocuments)

#### Defined in

packages/medusa/dist/services/search.d.ts:15

___

### createIndex

▸ **createIndex**(`indexName`, `options`): `Promise`<`void`\>

Used to create an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `options` | `unknown` | the options |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[createIndex](internal-8.AbstractSearchService.md#createindex)

#### Defined in

packages/medusa/dist/services/search.d.ts:13

___

### deleteAllDocuments

▸ **deleteAllDocuments**(`indexName`): `Promise`<`void`\>

Used to delete all documents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[deleteAllDocuments](internal-8.AbstractSearchService.md#deletealldocuments)

#### Defined in

packages/medusa/dist/services/search.d.ts:18

___

### deleteDocument

▸ **deleteDocument**(`indexName`, `document_id`): `Promise`<`void`\>

Used to delete document

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `document_id` | `string` \| `number` | the id of the document |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[deleteDocument](internal-8.AbstractSearchService.md#deletedocument)

#### Defined in

packages/medusa/dist/services/search.d.ts:17

___

### getIndex

▸ **getIndex**(`indexName`): `Promise`<`void`\>

Used to get an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name. |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[getIndex](internal-8.AbstractSearchService.md#getindex)

#### Defined in

packages/medusa/dist/services/search.d.ts:14

___

### replaceDocuments

▸ **replaceDocuments**(`indexName`, `documents`, `type`): `Promise`<`void`\>

Used to replace documents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name. |
| `documents` | `unknown` | array of document objects that will replace existing documents |
| `type` | `string` | type of documents to be replaced (e.g: products, regions, orders, etc) |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[replaceDocuments](internal-8.AbstractSearchService.md#replacedocuments)

#### Defined in

packages/medusa/dist/services/search.d.ts:16

___

### search

▸ **search**(`indexName`, `query`, `options`): `Promise`<{ `hits`: `unknown`[]  }\>

Used to search for a document in an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `query` | `unknown` | the search query |
| `options` | `unknown` | any options passed to the request object other than the query and indexName - additionalOptions contain any provider specific options |

#### Returns

`Promise`<{ `hits`: `unknown`[]  }\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[search](internal-8.AbstractSearchService.md#search)

#### Defined in

packages/medusa/dist/services/search.d.ts:19

___

### updateSettings

▸ **updateSettings**(`indexName`, `settings`): `Promise`<`void`\>

Used to update the settings of an index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexName` | `string` | the index name |
| `settings` | `unknown` | settings object |

#### Returns

`Promise`<`void`\>

returns response from search engine provider

#### Overrides

[AbstractSearchService](internal-8.AbstractSearchService.md).[updateSettings](internal-8.AbstractSearchService.md#updatesettings)

#### Defined in

packages/medusa/dist/services/search.d.ts:22
