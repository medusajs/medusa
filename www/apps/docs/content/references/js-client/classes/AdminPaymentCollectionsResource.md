# Class: AdminPaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminPaymentCollectionsResource`**

## Methods

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionDeleteRes`](../modules/internal-15.md#adminpaymentcollectiondeleteres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionDeleteRes`](../modules/internal-15.md#adminpaymentcollectiondeleteres)\>

#### Defined in

[medusa-js/src/resources/admin/payment-collections.ts:36](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payment-collections.ts#L36)

___

### markAsAuthorized

▸ **markAsAuthorized**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-15.md#adminpaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-15.md#adminpaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/admin/payment-collections.ts:44](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payment-collections.ts#L44)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-15.md#adminpaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPaymentCollectionsParams`](internal-15.GetPaymentCollectionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-15.md#adminpaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/admin/payment-collections.ts:12](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payment-collections.ts#L12)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-15.md#adminpaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminUpdatePaymentCollectionsReq`](internal-15.AdminUpdatePaymentCollectionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPaymentCollectionsRes`](../modules/internal-15.md#adminpaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/admin/payment-collections.ts:27](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/payment-collections.ts#L27)
