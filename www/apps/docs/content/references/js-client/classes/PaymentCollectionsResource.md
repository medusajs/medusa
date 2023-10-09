# Class: PaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`PaymentCollectionsResource`**

## Methods

### authorizePaymentSession

▸ **authorizePaymentSession**(`id`, `session_id`, `customHeaders?`): `ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Defined in

[payment-collections.ts:29](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/payment-collections.ts#L29)

___

### authorizePaymentSessionsBatch

▸ **authorizePaymentSessionsBatch**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `StorePostPaymentCollectionsBatchSessionsAuthorizeReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Defined in

[payment-collections.ts:38](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/payment-collections.ts#L38)

___

### managePaymentSession

▸ **managePaymentSession**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `StorePaymentCollectionSessionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Defined in

[payment-collections.ts:56](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/payment-collections.ts#L56)

___

### managePaymentSessionsBatch

▸ **managePaymentSessionsBatch**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `StorePostPaymentCollectionsBatchSessionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Defined in

[payment-collections.ts:47](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/payment-collections.ts#L47)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`id`, `session_id`, `customHeaders?`): `ResponsePromise`<`StorePaymentCollectionsSessionRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `session_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StorePaymentCollectionsSessionRes`\>

#### Defined in

[payment-collections.ts:65](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/payment-collections.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `StoreGetPaymentCollectionsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StorePaymentCollectionsRes`\>

#### Defined in

[payment-collections.ts:14](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/payment-collections.ts#L14)
