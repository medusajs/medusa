# Class: AdminShippingProfilesResource

## Hierarchy

- `default`

  ↳ **`AdminShippingProfilesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostShippingProfilesReq`](internal.AdminPostShippingProfilesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal.md#adminshippingprofilesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L12)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:27](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L27)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesListRes`](../modules/internal.md#adminshippingprofileslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesListRes`](../modules/internal.md#adminshippingprofileslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:37](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L37)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal.md#adminshippingprofilesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:32](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L32)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostShippingProfilesProfileReq`](internal.AdminPostShippingProfilesProfileReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal.md#adminshippingprofilesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-profiles.ts:19](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L19)
