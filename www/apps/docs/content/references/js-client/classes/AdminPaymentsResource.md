---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPaymentsResource

## Hierarchy

- `default`

  ↳ **`AdminPaymentsResource`**

## Methods

### capturePayment

▸ **capturePayment**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-8.internal.md#adminpaymentres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-8.internal.md#adminpaymentres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payments.ts:27](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payments.ts#L27)

___

### refundPayment

▸ **refundPayment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRefundRes`](../modules/internal-8.internal.md#adminrefundres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPaymentRefundsReq`](internal-8.internal.AdminPostPaymentRefundsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRefundRes`](../modules/internal-8.internal.md#adminrefundres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payments.ts:35](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payments.ts#L35)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-8.internal.md#adminpaymentres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPaymentsParams`](internal-8.internal.GetPaymentsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-8.internal.md#adminpaymentres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/payments.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/payments.ts#L12)
