# Class: AdminCurrenciesResource

## Hierarchy

- `default`

  ↳ **`AdminCurrenciesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminCurrenciesListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetCurrenciesParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminCurrenciesListRes`\>

the list of currencies as well as the pagination properties.

**`Description`**

Lists currencies.
 This feature is under development and may change in the future.
To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.

#### Defined in

[admin/currencies.ts:20](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/currencies.ts#L20)

___

### update

▸ **update**(`code`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCurrenciesRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code of the currency to update. |
| `payload` | `AdminPostCurrenciesCurrencyReq` | update to apply to currency. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCurrenciesRes`\>

the updated currency.

**`Description`**

Updates a currency
 This feature is under development and may change in the future.
To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.

#### Defined in

[admin/currencies.ts:43](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/currencies.ts#L43)
