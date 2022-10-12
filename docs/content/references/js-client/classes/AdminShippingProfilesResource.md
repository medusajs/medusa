# Class: AdminShippingProfilesResource

## Hierarchy

- `default`

  ↳ **`AdminShippingProfilesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-24.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostShippingProfilesReq`](internal-24.AdminPostShippingProfilesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-24.md#adminshippingprofilesres)\>

#### Defined in

[medusa-js/src/resources/admin/shipping-profiles.ts:12](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L12)

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

[medusa-js/src/resources/admin/shipping-profiles.ts:29](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L29)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesListRes`](../modules/internal-24.md#adminshippingprofileslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesListRes`](../modules/internal-24.md#adminshippingprofileslistres)\>

#### Defined in

[medusa-js/src/resources/admin/shipping-profiles.ts:45](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L45)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-24.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-24.md#adminshippingprofilesres)\>

#### Defined in

[medusa-js/src/resources/admin/shipping-profiles.ts:37](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L37)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-24.md#adminshippingprofilesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostShippingProfilesProfileReq`](internal-24.AdminPostShippingProfilesProfileReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingProfilesRes`](../modules/internal-24.md#adminshippingprofilesres)\>

#### Defined in

[medusa-js/src/resources/admin/shipping-profiles.ts:20](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L20)
