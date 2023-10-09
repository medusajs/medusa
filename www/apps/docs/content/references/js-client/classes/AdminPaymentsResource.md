# Class: AdminPaymentsResource

## Hierarchy

- `default`

  ↳ **`AdminPaymentsResource`**

## Methods

### capturePayment

▸ **capturePayment**(`id`, `customHeaders?`): `ResponsePromise`<`AdminPaymentRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentRes`\>

#### Defined in

[admin/payments.ts:27](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payments.ts#L27)

___

### refundPayment

▸ **refundPayment**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminRefundRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostPaymentRefundsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminRefundRes`\>

#### Defined in

[admin/payments.ts:35](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payments.ts#L35)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminPaymentRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `GetPaymentsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentRes`\>

#### Defined in

[admin/payments.ts:12](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payments.ts#L12)
