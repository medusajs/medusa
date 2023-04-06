# Class: AdminStoresResource

## Hierarchy

- `default`

  ↳ **`AdminStoresResource`**

## Methods

### addCurrency

▸ **addCurrency**(`currency_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

**`Description`**

adds a currency to the store.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency_code` | `string` | code of the currency to add |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

updated store.

#### Defined in

[medusa-js/src/resources/admin/store.ts:31](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/store.ts#L31)

___

### deleteCurrency

▸ **deleteCurrency**(`currency_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

**`Description`**

deletes a currency from the available store currencies

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency_code` | `string` | currency code of the currency to delete from the store. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

updated store

#### Defined in

[medusa-js/src/resources/admin/store.ts:45](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/store.ts#L45)

___

### listPaymentProviders

▸ **listPaymentProviders**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentProvidersList`](../modules/internal-28.md#adminpaymentproviderslist)\>

**`Description`**

Lists the store's payment providers

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentProvidersList`](../modules/internal-28.md#adminpaymentproviderslist)\>

a list of payment providers configured on the store

#### Defined in

[medusa-js/src/resources/admin/store.ts:68](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/store.ts#L68)

___

### listTaxProviders

▸ **listTaxProviders**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxProvidersList`](../modules/internal-28.md#admintaxproviderslist)\>

**`Description`**

Lists the store's payment providers

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxProvidersList`](../modules/internal-28.md#admintaxproviderslist)\>

a list of payment providers configured on the store

#### Defined in

[medusa-js/src/resources/admin/store.ts:79](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/store.ts#L79)

___

### retrieve

▸ **retrieve**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

**`Description`**

gets a medusa store

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

a medusa store

#### Defined in

[medusa-js/src/resources/admin/store.ts:57](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/store.ts#L57)

___

### update

▸ **update**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

**`Description`**

Updates the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostStoreReq`](internal-28.AdminPostStoreReq.md) | update to apply to the store. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminStoresRes`](../modules/internal-28.md#adminstoresres)\>

the updated store.

#### Defined in

[medusa-js/src/resources/admin/store.ts:17](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/store.ts#L17)
