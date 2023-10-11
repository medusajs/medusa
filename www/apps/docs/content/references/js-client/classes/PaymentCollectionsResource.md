# Class: PaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`PaymentCollectionsResource`**

## Methods

### authorizePaymentSession

▸ **authorizePaymentSession**(`id`, `session_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:29](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/payment-collections.ts#L29)

___

### authorizePaymentSessionsBatch

▸ **authorizePaymentSessionsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePostPaymentCollectionsBatchSessionsAuthorizeReq`](internal-42.StorePostPaymentCollectionsBatchSessionsAuthorizeReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:38](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/payment-collections.ts#L38)

___

### managePaymentSession

▸ **managePaymentSession**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePaymentCollectionSessionsReq`](internal-42.StorePaymentCollectionSessionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:56](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/payment-collections.ts#L56)

___

### managePaymentSessionsBatch

▸ **managePaymentSessionsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePostPaymentCollectionsBatchSessionsReq`](internal-42.StorePostPaymentCollectionsBatchSessionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:47](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/payment-collections.ts#L47)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`id`, `session_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsSessionRes`](../modules/internal-42.md#storepaymentcollectionssessionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsSessionRes`](../modules/internal-42.md#storepaymentcollectionssessionres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:65](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/payment-collections.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPaymentCollectionsParams`](internal-15.GetPaymentCollectionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionsRes`](../modules/internal-42.md#storepaymentcollectionsres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:14](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/payment-collections.ts#L14)
