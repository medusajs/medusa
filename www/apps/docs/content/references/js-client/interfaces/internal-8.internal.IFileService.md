---
displayed_sidebar: jsClientSidebar
---

# Interface: IFileService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).IFileService

## Hierarchy

- [`TransactionBaseService`](../classes/internal-8.internal.TransactionBaseService.md)

  ↳ **`IFileService`**

## Implemented by

- [`AbstractFileService`](../classes/internal-8.internal.AbstractFileService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__configModule__](../classes/internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__container__](../classes/internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](../classes/internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[manager_](../classes/internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[transactionManager_](../classes/internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[atomicPhase_](../classes/internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### delete

▸ **delete**(`fileData`): `Promise`<`void`\>

remove file from fileservice

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`DeleteFileType`](../modules/internal-8.md#deletefiletype) | Remove file described by record |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:20

___

### getDownloadStream

▸ **getDownloadStream**(`fileData`): `Promise`<[`ReadableStream`](internal-8.ReadableStream.md)\>

download file from fileservice as stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`GetUploadedFileType`](../modules/internal-8.md#getuploadedfiletype) | file metadata relevant for fileservice to download the file |

#### Returns

`Promise`<[`ReadableStream`](internal-8.ReadableStream.md)\>

readable stream of the file to download

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:32

___

### getPresignedDownloadUrl

▸ **getPresignedDownloadUrl**(`fileData`): `Promise`<`string`\>

Generate a presigned download url to obtain a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`GetUploadedFileType`](../modules/internal-8.md#getuploadedfiletype) | file metadata relevant for fileservice to download the file |

#### Returns

`Promise`<`string`\>

presigned url to download the file

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:38

___

### getUploadStreamDescriptor

▸ **getUploadStreamDescriptor**(`fileData`): `Promise`<[`FileServiceGetUploadStreamResult`](../modules/internal-8.md#fileservicegetuploadstreamresult)\>

upload file to fileservice from stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`UploadStreamDescriptorType`](../modules/internal-8.md#uploadstreamdescriptortype) | file metadata relevant for fileservice to create and upload the file |

#### Returns

`Promise`<[`FileServiceGetUploadStreamResult`](../modules/internal-8.md#fileservicegetuploadstreamresult)\>

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:26

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](../classes/internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### upload

▸ **upload**(`file`): `Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

upload file to fileservice

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | `File` | Multer file from express multipart/form-data |

#### Returns

`Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:10

___

### uploadProtected

▸ **uploadProtected**(`file`): `Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

upload private file to fileservice

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | `File` | Multer file from express multipart/form-data |

#### Returns

`Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:15

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`IFileService`](internal-8.internal.IFileService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`IFileService`](internal-8.internal.IFileService.md)

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[withTransaction](../classes/internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
