# Class: AdminCurrenciesResource

## Hierarchy

- `default`

  ↳ **`AdminCurrenciesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCurrenciesListRes`](../modules/internal-4.md#admincurrencieslistres)\>

**`Description`**

Lists currencies.
 This feature is under development and may change in the future.
To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetCurrenciesParams`](internal-4.AdminGetCurrenciesParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCurrenciesListRes`](../modules/internal-4.md#admincurrencieslistres)\>

the list of currencies as well as the pagination properties.

#### Defined in

[medusa-js/src/resources/admin/currencies.ts:20](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/currencies.ts#L20)

___

### update

▸ **update**(`code`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCurrenciesRes`](../modules/internal-4.md#admincurrenciesres)\>

**`Description`**

Updates a currency
 This feature is under development and may change in the future.
To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code of the currency to update. |
| `payload` | [`AdminPostCurrenciesCurrencyReq`](internal-4.AdminPostCurrenciesCurrencyReq.md) | update to apply to currency. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCurrenciesRes`](../modules/internal-4.md#admincurrenciesres)\>

the updated currency.

#### Defined in

[medusa-js/src/resources/admin/currencies.ts:43](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/currencies.ts#L43)
