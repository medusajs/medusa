---
displayed_sidebar: jsClientSidebar
---

# Class: AdminCurrenciesResource

## Hierarchy

- `default`

  ↳ **`AdminCurrenciesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCurrenciesListRes`](../modules/internal-4.md#admincurrencieslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetCurrenciesParams`](internal-4.AdminGetCurrenciesParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCurrenciesListRes`](../modules/internal-4.md#admincurrencieslistres)\>

the list of currencies as well as the pagination properties.

**`Description`**

Lists currencies.
 This feature is under development and may change in the future.
To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.

#### Defined in

[packages/medusa-js/src/resources/admin/currencies.ts:20](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/currencies.ts#L20)

___

### update

▸ **update**(`code`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCurrenciesRes`](../modules/internal-4.md#admincurrenciesres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code of the currency to update. |
| `payload` | [`AdminPostCurrenciesCurrencyReq`](internal-4.AdminPostCurrenciesCurrencyReq.md) | update to apply to currency. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCurrenciesRes`](../modules/internal-4.md#admincurrenciesres)\>

the updated currency.

**`Description`**

Updates a currency
 This feature is under development and may change in the future.
To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.

#### Defined in

[packages/medusa-js/src/resources/admin/currencies.ts:43](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/currencies.ts#L43)
