# Class: AdminPublishableApiKeyResource

## Hierarchy

- `default`

  ↳ **`AdminPublishableApiKeyResource`**

## Methods

### addSalesChannelsBatch

▸ **addSalesChannelsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPublishableApiKeySalesChannelsBatchReq`](internal-21.AdminPostPublishableApiKeySalesChannelsBatchReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:82](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L82)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostPublishableApiKeysReq`](internal-21.AdminPostPublishableApiKeysReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:49](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L49)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:66](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L66)

___

### deleteSalesChannelsBatch

▸ **deleteSalesChannelsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeletePublishableApiKeySalesChannelsBatchReq`](internal-21.AdminDeletePublishableApiKeySalesChannelsBatchReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:91](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L91)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysListRes`](../modules/internal-21.md#adminpublishableapikeyslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`GetPublishableApiKeysParams`](internal-21.GetPublishableApiKeysParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysListRes`](../modules/internal-21.md#adminpublishableapikeyslistres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:35](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L35)

___

### listSalesChannels

▸ **listSalesChannels**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-21.md#adminsaleschannelslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPublishableApiKeySalesChannelsParams`](internal-21.GetPublishableApiKeySalesChannelsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-21.md#adminsaleschannelslistres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:100](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L100)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `Object` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:20](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L20)

___

### revoke

▸ **revoke**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-21.md#adminpublishableapikeysres)\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:74](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L74)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPublishableApiKeysPublishableApiKeyReq`](internal-21.AdminPostPublishableApiKeysPublishableApiKeyReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[medusa-js/src/resources/admin/publishable-api-keys.ts:57](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L57)
