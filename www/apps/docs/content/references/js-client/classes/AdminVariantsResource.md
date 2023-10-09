# Class: AdminVariantsResource

## Hierarchy

- `default`

  ↳ **`AdminVariantsResource`**

## Methods

### getInventory

▸ **getInventory**(`variantId`, `customHeaders?`): `ResponsePromise`<`AdminGetVariantsVariantInventoryRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | id of the variant to fetch inventory for |
| `customHeaders` | `Record`<`string`, `any`\> | custom headers |

#### Returns

`ResponsePromise`<`AdminGetVariantsVariantInventoryRes`\>

#### Defined in

[admin/variants.ts:60](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/variants.ts#L60)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminVariantsListRes`\>

List product variants

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetVariantsParams` | Query to filter variants by |
| `customHeaders` | `Record`<`string`, `any`\> | custom headers |

#### Returns

`ResponsePromise`<`AdminVariantsListRes`\>

A list of variants satisfying the criteria of the query

#### Defined in

[admin/variants.ts:19](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/variants.ts#L19)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminVariantsRes`\>

Get a product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Query to filter variants by |
| `query?` | `AdminGetVariantParams` | - |
| `customHeaders` | `Record`<`string`, `any`\> | custom headers |

#### Returns

`ResponsePromise`<`AdminVariantsRes`\>

A list of variants satisfying the criteria of the query

#### Defined in

[admin/variants.ts:39](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/variants.ts#L39)
