---
displayed_sidebar: jsClientSidebar
---

# Class: AdminStoresResource

## Hierarchy

- `default`

  ↳ **`AdminStoresResource`**

## Methods

### addCurrency

▸ **addCurrency**(`currency_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStoresRes`](../modules/internal-8.internal.md#adminstoresres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency_code` | `string` | code of the currency to add |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStoresRes`](../modules/internal-8.internal.md#adminstoresres)\>

updated store.

**`Description`**

adds a currency to the store.

#### Defined in

[packages/medusa-js/src/resources/admin/store.ts:32](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/store.ts#L32)

___

### deleteCurrency

▸ **deleteCurrency**(`currency_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStoresRes`](../modules/internal-8.internal.md#adminstoresres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency_code` | `string` | currency code of the currency to delete from the store. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStoresRes`](../modules/internal-8.internal.md#adminstoresres)\>

updated store

**`Description`**

deletes a currency from the available store currencies

#### Defined in

[packages/medusa-js/src/resources/admin/store.ts:46](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/store.ts#L46)

___

### listPaymentProviders

▸ **listPaymentProviders**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentProvidersList`](../modules/internal-8.internal.md#adminpaymentproviderslist)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentProvidersList`](../modules/internal-8.internal.md#adminpaymentproviderslist)\>

a list of payment providers configured on the store

**`Description`**

Lists the store's payment providers

#### Defined in

[packages/medusa-js/src/resources/admin/store.ts:69](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/store.ts#L69)

___

### listTaxProviders

▸ **listTaxProviders**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxProvidersList`](../modules/internal-8.internal.md#admintaxproviderslist)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxProvidersList`](../modules/internal-8.internal.md#admintaxproviderslist)\>

a list of payment providers configured on the store

**`Description`**

Lists the store's payment providers

#### Defined in

[packages/medusa-js/src/resources/admin/store.ts:80](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/store.ts#L80)

___

### retrieve

▸ **retrieve**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminExtendedStoresRes`](../modules/internal-8.internal.md#adminextendedstoresres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminExtendedStoresRes`](../modules/internal-8.internal.md#adminextendedstoresres)\>

a medusa store

**`Description`**

gets a medusa store

#### Defined in

[packages/medusa-js/src/resources/admin/store.ts:58](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/store.ts#L58)

___

### update

▸ **update**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStoresRes`](../modules/internal-8.internal.md#adminstoresres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostStoreReq`](internal-8.internal.AdminPostStoreReq.md) | update to apply to the store. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStoresRes`](../modules/internal-8.internal.md#adminstoresres)\>

the updated store.

**`Description`**

Updates the store

#### Defined in

[packages/medusa-js/src/resources/admin/store.ts:18](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/store.ts#L18)
