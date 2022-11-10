# Class: AdminUploadsResource

## Hierarchy

- `default`

  ↳ **`AdminUploadsResource`**

## Properties

### headers

• `Private` **headers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Content-Type` | `string` |

#### Defined in

[medusa-js/src/resources/admin/uploads.ts:14](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa-js/src/resources/admin/uploads.ts#L14)

## Methods

### create

▸ **create**(`file`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-28.md#adminuploadsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`IAdminPostUploadsFileReq`](internal-28.IAdminPostUploadsFileReq.md) |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-28.md#adminuploadsres)\>

#### Defined in

[medusa-js/src/resources/admin/uploads.ts:18](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa-js/src/resources/admin/uploads.ts#L18)

___

### createProtected

▸ **createProtected**(`file`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-28.md#adminuploadsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`IAdminPostUploadsFileReq`](internal-28.IAdminPostUploadsFileReq.md) |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-28.md#adminuploadsres)\>

#### Defined in

[medusa-js/src/resources/admin/uploads.ts:27](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa-js/src/resources/admin/uploads.ts#L27)

___

### delete

▸ **delete**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminDeleteUploadsReq`](internal-28.AdminDeleteUploadsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/uploads.ts:36](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa-js/src/resources/admin/uploads.ts#L36)

___

### getPresignedDownloadUrl

▸ **getPresignedDownloadUrl**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUploadsDownloadUrlRes`](../modules/internal-28.md#adminuploadsdownloadurlres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostUploadsDownloadUrlReq`](internal-28.AdminPostUploadsDownloadUrlReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUploadsDownloadUrlRes`](../modules/internal-28.md#adminuploadsdownloadurlres)\>

#### Defined in

[medusa-js/src/resources/admin/uploads.ts:45](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa-js/src/resources/admin/uploads.ts#L45)
