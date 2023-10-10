---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPublishableApiKeyResource

## Hierarchy

- `default`

  ↳ **`AdminPublishableApiKeyResource`**

## Methods

### addSalesChannelsBatch

▸ **addSalesChannelsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPublishableApiKeySalesChannelsBatchReq`](internal-8.internal.AdminPostPublishableApiKeySalesChannelsBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:82](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L82)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostPublishableApiKeysReq`](internal-8.internal.AdminPostPublishableApiKeysReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:49](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L49)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:66](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L66)

___

### deleteSalesChannelsBatch

▸ **deleteSalesChannelsBatch**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeletePublishableApiKeySalesChannelsBatchReq`](internal-8.internal.AdminDeletePublishableApiKeySalesChannelsBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:91](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L91)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysListRes`](../modules/internal-8.internal.md#adminpublishableapikeyslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`GetPublishableApiKeysParams`](internal-8.internal.GetPublishableApiKeysParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysListRes`](../modules/internal-8.internal.md#adminpublishableapikeyslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:35](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L35)

___

### listSalesChannels

▸ **listSalesChannels**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-8.internal.md#adminsaleschannelslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetPublishableApiKeySalesChannelsParams`](internal-8.internal.GetPublishableApiKeySalesChannelsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-8.internal.md#adminsaleschannelslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:100](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L100)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `Object` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:20](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L20)

___

### revoke

▸ **revoke**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPublishableApiKeysRes`](../modules/internal-8.internal.md#adminpublishableapikeysres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:74](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L74)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPublishableApiKeysPublishableApiKeyReq`](internal-8.internal.AdminPostPublishableApiKeysPublishableApiKeyReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa-js/src/resources/admin/publishable-api-keys.ts:57](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L57)
