---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminPaymentCollectionsResource`**

## Methods

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionDeleteRes`](../modules/internal-8.internal.md#adminpaymentcollectiondeleteres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionDeleteRes`](../modules/internal-8.internal.md#adminpaymentcollectiondeleteres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payment-collections.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payment-collections.ts#L36)

___

### markAsAuthorized

▸ **markAsAuthorized**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-8.internal.md#adminpaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-8.internal.md#adminpaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payment-collections.ts:44](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payment-collections.ts#L44)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-8.internal.md#adminpaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`AdminGetPaymentCollectionsParams`](internal-8.internal.AdminGetPaymentCollectionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-8.internal.md#adminpaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payment-collections.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payment-collections.ts#L12)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-8.internal.md#adminpaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminUpdatePaymentCollectionsReq`](internal-8.internal.AdminUpdatePaymentCollectionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-8.internal.md#adminpaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payment-collections.ts:27](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payment-collections.ts#L27)
