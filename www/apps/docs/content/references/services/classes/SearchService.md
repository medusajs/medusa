# SearchService

## Hierarchy

- [`AbstractSearchService`](AbstractSearchService.md)

  ↳ **`SearchService`**

## Constructors

### constructor

**new SearchService**(`«destructured»`, `options`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-36.md) |
| `options` | `any` |

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[constructor](AbstractSearchService.md#constructor)

#### Defined in

[packages/medusa/src/services/search.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L16)

## Properties

### isDefault

 **isDefault**: `boolean` = `true`

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[isDefault](AbstractSearchService.md#isdefault)

#### Defined in

[packages/medusa/src/services/search.ts:11](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L11)

___

### logger\_

 `Protected` `Readonly` **logger\_**: [`Logger`](../types/Logger-2.md)

#### Defined in

[packages/medusa/src/services/search.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L13)

___

### options\_

 `Protected` `Readonly` **options\_**: Record<`string`, `unknown`\>

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[options_](AbstractSearchService.md#options_)

#### Defined in

[packages/medusa/src/services/search.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L14)

## Accessors

### options

`get` **options**(): Record<`string`, `unknown`\>

#### Returns

Record<`string`, `unknown`\>

-`Record`: 
	-`string`: (optional) 
	-`unknown`: (optional) 

#### Inherited from

AbstractSearchService.options

#### Defined in

packages/utils/dist/search/abstract-service.d.ts:5

## Methods

### addDocuments

**addDocuments**(`indexName`, `documents`, `type`): `Promise`<`void`\>

Used to index documents by the search engine provider

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name |
| `documents` | `unknown` | documents array to be indexed |
| `type` | `string` | of documents to be added (e.g: products, regions, orders, etc) |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[addDocuments](AbstractSearchService.md#adddocuments)

#### Defined in

[packages/medusa/src/services/search.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L40)

___

### createIndex

**createIndex**(`indexName`, `options`): `Promise`<`void`\>

Used to create an index

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name |
| `options` | `unknown` | the options |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[createIndex](AbstractSearchService.md#createindex)

#### Defined in

[packages/medusa/src/services/search.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L28)

___

### deleteAllDocuments

**deleteAllDocuments**(`indexName`): `Promise`<`void`\>

Used to delete all documents

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[deleteAllDocuments](AbstractSearchService.md#deletealldocuments)

#### Defined in

[packages/medusa/src/services/search.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L69)

___

### deleteDocument

**deleteDocument**(`indexName`, `document_id`): `Promise`<`void`\>

Used to delete document

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name |
| `document_id` | `string` \| `number` | the id of the document |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[deleteDocument](AbstractSearchService.md#deletedocument)

#### Defined in

[packages/medusa/src/services/search.ts:60](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L60)

___

### getIndex

**getIndex**(`indexName`): `Promise`<`void`\>

Used to get an index

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name. |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[getIndex](AbstractSearchService.md#getindex)

#### Defined in

[packages/medusa/src/services/search.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L34)

___

### replaceDocuments

**replaceDocuments**(`indexName`, `documents`, `type`): `Promise`<`void`\>

Used to replace documents

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name. |
| `documents` | `unknown` | array of document objects that will replace existing documents |
| `type` | `string` | type of documents to be replaced (e.g: products, regions, orders, etc) |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[replaceDocuments](AbstractSearchService.md#replacedocuments)

#### Defined in

[packages/medusa/src/services/search.ts:50](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L50)

___

### search

**search**(`indexName`, `query`, `options`): `Promise`<{ `hits`: `unknown`[]  }\>

Used to search for a document in an index

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name |
| `query` | `unknown` | the search query |
| `options` | `unknown` | any options passed to the request object other than the query and indexName - additionalOptions contain any provider specific options |

#### Returns

`Promise`<{ `hits`: `unknown`[]  }\>

-`Promise`: returns response from search engine provider
	-``object``: (optional) 

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[search](AbstractSearchService.md#search)

#### Defined in

[packages/medusa/src/services/search.ts:75](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L75)

___

### updateSettings

**updateSettings**(`indexName`, `settings`): `Promise`<`void`\>

Used to update the settings of an index

#### Parameters

| Name | Description |
| :------ | :------ |
| `indexName` | `string` | the index name |
| `settings` | `unknown` | settings object |

#### Returns

`Promise`<`void`\>

-`Promise`: returns response from search engine provider

#### Overrides

[AbstractSearchService](AbstractSearchService.md).[updateSettings](AbstractSearchService.md#updatesettings)

#### Defined in

[packages/medusa/src/services/search.ts:86](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/search.ts#L86)
