# Class: SearchService

Default class that implements SearchService but provides stuv implementation for all methods

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`SearchService`**

## Constructors

### constructor

• **new SearchService**(`container`)

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `container` | `any` |

#### Overrides

SearchService.constructor

#### Defined in

[services/search.js:8](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L8)

## Properties

### isDefault

• **isDefault**: `boolean`

#### Defined in

[services/search.js:11](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L11)

---

### logger\_

• **logger\_**: `any`

#### Defined in

[services/search.js:13](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L13)

## Methods

### addDocuments

▸ **addDocuments**(`indexName`, `documents`, `type`): `void`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |
| `documents` | `any` |
| `type`      | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:28](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L28)

---

### createIndex

▸ **createIndex**(`indexName`, `options`): `void`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |
| `options`   | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:16](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L16)

---

### deleteAllDocuments

▸ **deleteAllDocuments**(`indexName`): `void`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:46](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L46)

---

### deleteDocument

▸ **deleteDocument**(`indexName`, `document_id`): `void`

#### Parameters

| Name          | Type  |
| :------------ | :---- |
| `indexName`   | `any` |
| `document_id` | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:40](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L40)

---

### getIndex

▸ **getIndex**(`indexName`): `void`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:22](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L22)

---

### replaceDocuments

▸ **replaceDocuments**(`indexName`, `documents`, `type`): `void`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |
| `documents` | `any` |
| `type`      | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:34](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L34)

---

### search

▸ **search**(`indexName`, `query`, `options`): `Object`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |
| `query`     | `any` |
| `options`   | `any` |

#### Returns

`Object`

| Name   | Type      |
| :----- | :-------- |
| `hits` | `never`[] |

#### Defined in

[services/search.js:52](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L52)

---

### updateSettings

▸ **updateSettings**(`indexName`, `settings`): `void`

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `indexName` | `any` |
| `settings`  | `any` |

#### Returns

`void`

#### Defined in

[services/search.js:59](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/search.js#L59)
