# Class: AdminShippingProfilesResource

## Hierarchy

- `default`

  ↳ **`AdminShippingProfilesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminShippingProfilesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostShippingProfilesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminShippingProfilesRes`\>

#### Defined in

[admin/shipping-profiles.ts:12](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L12)

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

[admin/shipping-profiles.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L29)

___

### list

▸ **list**(`customHeaders?`): `ResponsePromise`<`AdminShippingProfilesListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminShippingProfilesListRes`\>

#### Defined in

[admin/shipping-profiles.ts:45](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L45)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminShippingProfilesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminShippingProfilesRes`\>

#### Defined in

[admin/shipping-profiles.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L37)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminShippingProfilesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostShippingProfilesProfileReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminShippingProfilesRes`\>

#### Defined in

[admin/shipping-profiles.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-profiles.ts#L20)
