---
displayed_sidebar: jsClientSidebar
---

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

[packages/medusa-js/src/resources/admin/uploads.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/uploads.ts#L12)

## Methods

### \_createPayload

▸ `Private` **_createPayload**(`file`): `FormData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`AdminCreateUploadPayload`](../modules/internal-10.md#admincreateuploadpayload) |

#### Returns

`FormData`

#### Defined in

[packages/medusa-js/src/resources/admin/uploads.ts:62](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/uploads.ts#L62)

___

### create

▸ **create**(`file`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-8.internal.md#adminuploadsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | [`AdminCreateUploadPayload`](../modules/internal-10.md#admincreateuploadpayload) | File or array of files to upload. |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-8.internal.md#adminuploadsres)\>

Uploaded file or files.

**`Description`**

Uploads at least one file to the specific fileservice that is installed in Medusa.

#### Defined in

[packages/medusa-js/src/resources/admin/uploads.ts:21](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/uploads.ts#L21)

___

### createProtected

▸ **createProtected**(`file`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-8.internal.md#adminuploadsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | [`AdminCreateUploadPayload`](../modules/internal-10.md#admincreateuploadpayload) | File or array of files to upload. |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUploadsRes`](../modules/internal-8.internal.md#adminuploadsres)\>

Uploaded file or files.

**`Description`**

Uploads at least one file with ACL or a non-public bucket to the specific fileservice that is installed in Medusa.

#### Defined in

[packages/medusa-js/src/resources/admin/uploads.ts:34](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/uploads.ts#L34)

___

### delete

▸ **delete**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminDeleteUploadsReq`](internal-8.internal.AdminDeleteUploadsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/uploads.ts:44](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/uploads.ts#L44)

___

### getPresignedDownloadUrl

▸ **getPresignedDownloadUrl**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUploadsDownloadUrlRes`](../modules/internal-8.internal.md#adminuploadsdownloadurlres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostUploadsDownloadUrlReq`](internal-8.internal.AdminPostUploadsDownloadUrlReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUploadsDownloadUrlRes`](../modules/internal-8.internal.md#adminuploadsdownloadurlres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/uploads.ts:53](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/uploads.ts#L53)
