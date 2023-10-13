---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`PaymentCollectionsResource`**

## Methods

### authorizePaymentSession

▸ **authorizePaymentSession**(`id`, `session_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-collections.ts:29](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/payment-collections.ts#L29)

___

### authorizePaymentSessionsBatch

▸ **authorizePaymentSessionsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePostPaymentCollectionsBatchSessionsAuthorizeReq`](internal-8.internal.StorePostPaymentCollectionsBatchSessionsAuthorizeReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-collections.ts:38](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/payment-collections.ts#L38)

___

### managePaymentSession

▸ **managePaymentSession**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePaymentCollectionSessionsReq`](internal-8.internal.StorePaymentCollectionSessionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-collections.ts:56](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/payment-collections.ts#L56)

___

### managePaymentSessionsBatch

▸ **managePaymentSessionsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePostPaymentCollectionsBatchSessionsReq`](internal-8.internal.StorePostPaymentCollectionsBatchSessionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-collections.ts:47](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/payment-collections.ts#L47)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`id`, `session_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsSessionRes`](../modules/internal-8.internal.md#storepaymentcollectionssessionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsSessionRes`](../modules/internal-8.internal.md#storepaymentcollectionssessionres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-collections.ts:65](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/payment-collections.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`StoreGetPaymentCollectionsParams`](internal-8.internal.StoreGetPaymentCollectionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-8.internal.md#storepaymentcollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-collections.ts:14](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/payment-collections.ts#L14)
