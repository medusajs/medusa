# Class: AdminPublishableApiKeyResource

## Hierarchy

- `default`

  ↳ **`AdminPublishableApiKeyResource`**

## Methods

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

[medusa-js/src/resources/admin/publishable-api-keys.ts:45](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L45)

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

[medusa-js/src/resources/admin/publishable-api-keys.ts:62](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L62)

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

[medusa-js/src/resources/admin/publishable-api-keys.ts:31](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L31)

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

[medusa-js/src/resources/admin/publishable-api-keys.ts:16](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L16)

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

[medusa-js/src/resources/admin/publishable-api-keys.ts:70](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L70)

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

[medusa-js/src/resources/admin/publishable-api-keys.ts:53](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa-js/src/resources/admin/publishable-api-keys.ts#L53)
