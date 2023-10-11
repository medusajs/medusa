# Class: AdminPaymentsResource

## Hierarchy

- `default`

  ↳ **`AdminPaymentsResource`**

## Methods

### capturePayment

▸ **capturePayment**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-16.md#adminpaymentres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-16.md#adminpaymentres)\>

#### Defined in

[medusa-js/src/resources/admin/payments.ts:27](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payments.ts#L27)

___

### refundPayment

▸ **refundPayment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRefundRes`](../modules/internal-16.md#adminrefundres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPaymentRefundsReq`](internal-16.AdminPostPaymentRefundsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRefundRes`](../modules/internal-16.md#adminrefundres)\>

#### Defined in

[medusa-js/src/resources/admin/payments.ts:35](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payments.ts#L35)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-16.md#adminpaymentres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPaymentsParams`](internal-16.GetPaymentsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentRes`](../modules/internal-16.md#adminpaymentres)\>

#### Defined in

[medusa-js/src/resources/admin/payments.ts:12](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payments.ts#L12)
