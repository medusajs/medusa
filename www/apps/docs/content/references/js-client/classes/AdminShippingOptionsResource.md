# Class: AdminShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`AdminShippingOptionsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-26.md#adminshippingoptionsres)\>

**`Description`**

creates a shipping option.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostShippingOptionsReq`](internal-26.AdminPostShippingOptionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-26.md#adminshippingoptionsres)\>

created shipping option.

#### Defined in

[medusa-js/src/resources/admin/shipping-options.ts:20](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/shipping-options.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

deletes a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of shipping option to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

deleted response

#### Defined in

[medusa-js/src/resources/admin/shipping-options.ts:50](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/shipping-options.ts#L50)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsListRes`](../modules/internal-26.md#adminshippingoptionslistres)\>

**`Description`**

lists shipping options matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetShippingOptionsParams`](internal-26.AdminGetShippingOptionsParams.md) | query for searching shipping options |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsListRes`](../modules/internal-26.md#adminshippingoptionslistres)\>

a list of shipping options matching the query.

#### Defined in

[medusa-js/src/resources/admin/shipping-options.ts:78](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/shipping-options.ts#L78)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-26.md#adminshippingoptionsres)\>

**`Description`**

get a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-26.md#adminshippingoptionsres)\>

the shipping option with the given id

#### Defined in

[medusa-js/src/resources/admin/shipping-options.ts:64](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/shipping-options.ts#L64)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-26.md#adminshippingoptionsres)\>

**`Description`**

updates a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to update. |
| `payload` | [`AdminPostShippingOptionsOptionReq`](internal-26.AdminPostShippingOptionsOptionReq.md) | update to apply to shipping option. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-26.md#adminshippingoptionsres)\>

the updated shipping option.

#### Defined in

[medusa-js/src/resources/admin/shipping-options.ts:35](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/shipping-options.ts#L35)
