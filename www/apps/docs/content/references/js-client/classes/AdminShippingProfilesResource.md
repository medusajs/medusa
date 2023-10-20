---
displayed_sidebar: jsClientSidebar
---

# Class: AdminShippingProfilesResource

## Hierarchy

- `default`

  ↳ **`AdminShippingProfilesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-8.internal.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostShippingProfilesReq`](internal-8.internal.AdminPostShippingProfilesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-8.internal.md#adminshippingprofilesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L12)

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

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:29](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L29)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesListRes`](../modules/internal-8.internal.md#adminshippingprofileslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesListRes`](../modules/internal-8.internal.md#adminshippingprofileslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:45](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L45)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-8.internal.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-8.internal.md#adminshippingprofilesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:37](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L37)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-8.internal.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostShippingProfilesProfileReq`](internal-8.internal.AdminPostShippingProfilesProfileReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-8.internal.md#adminshippingprofilesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:20](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L20)
