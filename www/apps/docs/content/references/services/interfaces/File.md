# File

Object containing file metadata and access information.

## Properties

### buffer

 **buffer**: [`Buffer`](../index.md#buffer)

`MemoryStorage` only: A Buffer containing the entire file.

#### Defined in

node_modules/@types/multer/index.d.ts:46

___

### destination

 **destination**: `string`

`DiskStorage` only: Directory to which this file has been uploaded.

#### Defined in

node_modules/@types/multer/index.d.ts:40

___

### encoding

 **encoding**: `string`

Value of the `Content-Transfer-Encoding` header for this file.

**Deprecated**

since July 2015

**See**

RFC 7578, Section 4.7

#### Defined in

node_modules/@types/multer/index.d.ts:29

___

### fieldname

 **fieldname**: `string`

Name of the form field associated with this file.

#### Defined in

node_modules/@types/multer/index.d.ts:21

___

### filename

 **filename**: `string`

`DiskStorage` only: Name of this file within `destination`.

#### Defined in

node_modules/@types/multer/index.d.ts:42

___

### mimetype

 **mimetype**: `string`

Value of the `Content-Type` header for this file.

#### Defined in

node_modules/@types/multer/index.d.ts:31

___

### originalname

 **originalname**: `string`

Name of the file on the uploader's computer.

#### Defined in

node_modules/@types/multer/index.d.ts:23

___

### path

 **path**: `string`

`DiskStorage` only: Full path to the uploaded file.

#### Defined in

node_modules/@types/multer/index.d.ts:44

___

### size

 **size**: `number`

Size of the file in bytes.

#### Defined in

node_modules/@types/multer/index.d.ts:33

___

### stream

 **stream**: [`Readable`](../classes/Readable.md)

A readable stream of this file. Only available to the `_handleFile`
callback for custom `StorageEngine`s.

#### Defined in

node_modules/@types/multer/index.d.ts:38
