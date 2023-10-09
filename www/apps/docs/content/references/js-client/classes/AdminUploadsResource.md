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

[admin/uploads.ts:12](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/uploads.ts#L12)

## Methods

### \_createPayload

▸ `Private` **_createPayload**(`file`): `FormData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `AdminCreateUploadPayload` |

#### Returns

`FormData`

#### Defined in

[admin/uploads.ts:62](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/uploads.ts#L62)

___

### create

▸ **create**(`file`): `ResponsePromise`<`AdminUploadsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | `AdminCreateUploadPayload` | File or array of files to upload. |

#### Returns

`ResponsePromise`<`AdminUploadsRes`\>

Uploaded file or files.

**`Description`**

Uploads at least one file to the specific fileservice that is installed in Medusa.

#### Defined in

[admin/uploads.ts:21](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/uploads.ts#L21)

___

### createProtected

▸ **createProtected**(`file`): `ResponsePromise`<`AdminUploadsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | `AdminCreateUploadPayload` | File or array of files to upload. |

#### Returns

`ResponsePromise`<`AdminUploadsRes`\>

Uploaded file or files.

**`Description`**

Uploads at least one file with ACL or a non-public bucket to the specific fileservice that is installed in Medusa.

#### Defined in

[admin/uploads.ts:34](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/uploads.ts#L34)

___

### delete

▸ **delete**(`payload`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminDeleteUploadsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

#### Defined in

[admin/uploads.ts:44](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/uploads.ts#L44)

___

### getPresignedDownloadUrl

▸ **getPresignedDownloadUrl**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminUploadsDownloadUrlRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostUploadsDownloadUrlReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminUploadsDownloadUrlRes`\>

#### Defined in

[admin/uploads.ts:53](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/uploads.ts#L53)
