# Class: AdminStoresResource

## Hierarchy

- `default`

  ↳ **`AdminStoresResource`**

## Methods

### addCurrency

▸ **addCurrency**(`currency_code`, `customHeaders?`): `ResponsePromise`<`AdminStoresRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency_code` | `string` | code of the currency to add |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminStoresRes`\>

updated store.

**`Description`**

adds a currency to the store.

#### Defined in

[admin/store.ts:32](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/store.ts#L32)

___

### deleteCurrency

▸ **deleteCurrency**(`currency_code`, `customHeaders?`): `ResponsePromise`<`AdminStoresRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency_code` | `string` | currency code of the currency to delete from the store. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminStoresRes`\>

updated store

**`Description`**

deletes a currency from the available store currencies

#### Defined in

[admin/store.ts:46](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/store.ts#L46)

___

### listPaymentProviders

▸ **listPaymentProviders**(`customHeaders?`): `ResponsePromise`<`AdminPaymentProvidersList`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentProvidersList`\>

a list of payment providers configured on the store

**`Description`**

Lists the store's payment providers

#### Defined in

[admin/store.ts:69](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/store.ts#L69)

___

### listTaxProviders

▸ **listTaxProviders**(`customHeaders?`): `ResponsePromise`<`AdminTaxProvidersList`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxProvidersList`\>

a list of payment providers configured on the store

**`Description`**

Lists the store's payment providers

#### Defined in

[admin/store.ts:80](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/store.ts#L80)

___

### retrieve

▸ **retrieve**(`customHeaders?`): `ResponsePromise`<`AdminExtendedStoresRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminExtendedStoresRes`\>

a medusa store

**`Description`**

gets a medusa store

#### Defined in

[admin/store.ts:58](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/store.ts#L58)

___

### update

▸ **update**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminStoresRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `AdminPostStoreReq` | update to apply to the store. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminStoresRes`\>

the updated store.

**`Description`**

Updates the store

#### Defined in

[admin/store.ts:18](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/store.ts#L18)
