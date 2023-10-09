# Class: AdminPaymentCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminPaymentCollectionsResource`**

## Methods

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`AdminPaymentCollectionDeleteRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentCollectionDeleteRes`\>

#### Defined in

[admin/payment-collections.ts:36](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payment-collections.ts#L36)

___

### markAsAuthorized

▸ **markAsAuthorized**(`id`, `customHeaders?`): `ResponsePromise`<`AdminPaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentCollectionsRes`\>

#### Defined in

[admin/payment-collections.ts:44](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payment-collections.ts#L44)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminPaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `AdminGetPaymentCollectionsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentCollectionsRes`\>

#### Defined in

[admin/payment-collections.ts:12](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payment-collections.ts#L12)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPaymentCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminUpdatePaymentCollectionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPaymentCollectionsRes`\>

#### Defined in

[admin/payment-collections.ts:27](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/payment-collections.ts#L27)
