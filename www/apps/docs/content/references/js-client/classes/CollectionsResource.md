# Class: CollectionsResource

## Hierarchy

- `default`

  ↳ **`CollectionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreCollectionsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `StoreGetCollectionsParams` | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCollectionsListRes`\>

**`Description`**

Retrieves a list of collections

#### Defined in

[collections.ts:28](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/collections.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreCollectionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCollectionsRes`\>

**`Description`**

Retrieves a single collection

#### Defined in

[collections.ts:17](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/collections.ts#L17)
