# Class: AdminPublishableApiKeyResource

## Hierarchy

- `default`

  ↳ **`AdminPublishableApiKeyResource`**

## Methods

### addSalesChannelsBatch

▸ **addSalesChannelsBatch**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostPublishableApiKeySalesChannelsBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Defined in

[admin/publishable-api-keys.ts:82](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L82)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostPublishableApiKeysReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Defined in

[admin/publishable-api-keys.ts:49](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L49)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

#### Defined in

[admin/publishable-api-keys.ts:66](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L66)

___

### deleteSalesChannelsBatch

▸ **deleteSalesChannelsBatch**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminDeletePublishableApiKeySalesChannelsBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Defined in

[admin/publishable-api-keys.ts:91](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L91)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminPublishableApiKeysListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `GetPublishableApiKeysParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPublishableApiKeysListRes`\>

#### Defined in

[admin/publishable-api-keys.ts:35](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L35)

___

### listSalesChannels

▸ **listSalesChannels**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `GetPublishableApiKeySalesChannelsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsListRes`\>

#### Defined in

[admin/publishable-api-keys.ts:100](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L100)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `Object` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Defined in

[admin/publishable-api-keys.ts:20](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L20)

___

### revoke

▸ **revoke**(`id`, `customHeaders?`): `ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPublishableApiKeysRes`\>

#### Defined in

[admin/publishable-api-keys.ts:74](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L74)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostPublishableApiKeysPublishableApiKeyReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[admin/publishable-api-keys.ts:57](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L57)
