# Class: PaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`PaymentCollectionsResource`**

## Methods

### authorize

▸ **authorize**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionRes`](../modules/internal-42.md#storepaymentcollectionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionRes`](../modules/internal-42.md#storepaymentcollectionres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:28](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/payment-collections.ts#L28)

___

### manageSessions

▸ **manageSessions**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionRes`](../modules/internal-42.md#storepaymentcollectionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StoreManagePaymentCollectionSessionRequest`](internal-42.StoreManagePaymentCollectionSessionRequest.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionRes`](../modules/internal-42.md#storepaymentcollectionres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:36](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/payment-collections.ts#L36)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`id`, `session_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionSessionRes`](../modules/internal-42.md#storepaymentcollectionsessionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `payload` | [`StoreRefreshPaymentCollectionSessionRequest`](internal-42.StoreRefreshPaymentCollectionSessionRequest.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionSessionRes`](../modules/internal-42.md#storepaymentcollectionsessionres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:45](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/payment-collections.ts#L45)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionRes`](../modules/internal-42.md#storepaymentcollectionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPaymentCollectionsParams`](internal-15.GetPaymentCollectionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePaymentCollectionRes`](../modules/internal-42.md#storepaymentcollectionres)\>

#### Defined in

[medusa-js/src/resources/payment-collections.ts:13](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/payment-collections.ts#L13)
