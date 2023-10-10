---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractFileService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractFileService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AbstractFileService`**

## Implements

- [`IFileService`](../interfaces/internal-8.internal.IFileService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[__configModule__](../interfaces/internal-8.internal.IFileService.md#__configmodule__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[__container__](../interfaces/internal-8.internal.IFileService.md#__container__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[__moduleDeclaration__](../interfaces/internal-8.internal.IFileService.md#__moduledeclaration__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[manager_](../interfaces/internal-8.internal.IFileService.md#manager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[transactionManager_](../interfaces/internal-8.internal.IFileService.md#transactionmanager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Implementation of

IFileService.activeManager\_

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

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[atomicPhase_](../interfaces/internal-8.internal.IFileService.md#atomicphase_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### delete

▸ `Abstract` **delete**(`fileData`): `Promise`<`void`\>

remove file from fileservice

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`DeleteFileType`](../modules/internal-8.md#deletefiletype) | Remove file described by record |

#### Returns

`Promise`<`void`\>

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[delete](../interfaces/internal-8.internal.IFileService.md#delete)

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:43

___

### getDownloadStream

▸ `Abstract` **getDownloadStream**(`fileData`): `Promise`<[`ReadableStream`](../interfaces/internal-8.ReadableStream.md)\>

download file from fileservice as stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`GetUploadedFileType`](../modules/internal-8.md#getuploadedfiletype) | file metadata relevant for fileservice to download the file |

#### Returns

`Promise`<[`ReadableStream`](../interfaces/internal-8.ReadableStream.md)\>

readable stream of the file to download

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[getDownloadStream](../interfaces/internal-8.internal.IFileService.md#getdownloadstream)

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:45

___

### getPresignedDownloadUrl

▸ `Abstract` **getPresignedDownloadUrl**(`fileData`): `Promise`<`string`\>

Generate a presigned download url to obtain a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`GetUploadedFileType`](../modules/internal-8.md#getuploadedfiletype) | file metadata relevant for fileservice to download the file |

#### Returns

`Promise`<`string`\>

presigned url to download the file

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[getPresignedDownloadUrl](../interfaces/internal-8.internal.IFileService.md#getpresigneddownloadurl)

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:46

___

### getUploadStreamDescriptor

▸ `Abstract` **getUploadStreamDescriptor**(`fileData`): `Promise`<[`FileServiceGetUploadStreamResult`](../modules/internal-8.md#fileservicegetuploadstreamresult)\>

upload file to fileservice from stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | [`UploadStreamDescriptorType`](../modules/internal-8.md#uploadstreamdescriptortype) | file metadata relevant for fileservice to create and upload the file |

#### Returns

`Promise`<[`FileServiceGetUploadStreamResult`](../modules/internal-8.md#fileservicegetuploadstreamresult)\>

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[getUploadStreamDescriptor](../interfaces/internal-8.internal.IFileService.md#getuploadstreamdescriptor)

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:44

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[shouldRetryTransaction_](../interfaces/internal-8.internal.IFileService.md#shouldretrytransaction_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### upload

▸ `Abstract` **upload**(`fileData`): `Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

upload file to fileservice

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | `File` | Multer file from express multipart/form-data |

#### Returns

`Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[upload](../interfaces/internal-8.internal.IFileService.md#upload)

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:41

___

### uploadProtected

▸ `Abstract` **uploadProtected**(`fileData`): `Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

upload private file to fileservice

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileData` | `File` | Multer file from express multipart/form-data |

#### Returns

`Promise`<[`FileServiceUploadResult`](../modules/internal-8.md#fileserviceuploadresult)\>

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[uploadProtected](../interfaces/internal-8.internal.IFileService.md#uploadprotected)

#### Defined in

packages/medusa/dist/interfaces/file-service.d.ts:42

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AbstractFileService`](internal-8.internal.AbstractFileService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AbstractFileService`](internal-8.internal.AbstractFileService.md)

#### Implementation of

[IFileService](../interfaces/internal-8.internal.IFileService.md).[withTransaction](../interfaces/internal-8.internal.IFileService.md#withtransaction)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
