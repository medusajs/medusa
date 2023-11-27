---
description: "Learn how to create a file service in a Medusa backend or a plugin."
---

# How to Create a File Service

In this document, you’ll learn how to create a file service in Medusa.

## Overview

In this guide, you’ll learn about the steps to implement a file service and the methods you’re required to implement in a file service. You can implement the file service within the Medusa backend codebase or in a plugin.

The file service you’ll be creating in this guide will be a local file service that allows you to upload files into your Medusa backend’s codebase. This is to give you a realistic example of the implementation of a file service. You’re free to implement the file service as required for your case.

---

## Prerequisites

### (Optional) Multer Types Package

If you’re using TypeScript, as instructed by this guide, you should install the Multer types package to resolve errors within your file service types.

To do that, run the following command in the directory of your Medusa backend or plugin:

```bash npm2yarn
npm install @types/multer
```

---

## Step 1: Create the File Service Class

A file service class is defined in a TypeScript or JavaScript file that’s created in the `src/services` directory. The class must extend the `AbstractFileService` class imported from the `@medusajs/medusa` package.

Based on services’ naming conventions, the file’s name should be the slug version of the file service’s name without `service`, and the class’s name should be the pascal case of the file service’s name following by `Service`.

For example, if you’re creating a local file service, the file name would be `local-file.ts`, whereas the class name would be `LocalFileService`.

:::tip

You can learn more about services and their naming convention in [this documentation](../services/overview.mdx).

:::

For example, create the file `src/services/local-file.ts` with the following content:

```ts title="src/services/local-file.ts"
import { AbstractFileService } from "@medusajs/medusa"
import {
  DeleteFileType,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "@medusajs/types"

class LocalFileService extends AbstractFileService {
  async upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new Error("Method not implemented.")
  }
  async uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new Error("Method not implemented.")
  }
  async delete(fileData: DeleteFileType): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    throw new Error("Method not implemented.")
  }
  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    throw new Error("Method not implemented.")
  }
  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    throw new Error("Method not implemented.")
  }
}

export default LocalFileService
```

This creates the service `LocalFileService` which, at the moment, adds a general implementation of the methods defined in the abstract class `AbstractFileService`. Notice that the methods' signatures require importing types from the `@medusajs/types` package.

:::tip

If you get errors regarding the types not being available in the `@medusajs/types` package, make sure that the latest version of the package is installed:

```bash npm2yarn
npm install @medusajs/types@latest
```

:::

### Using a Constructor

You can use a constructor to access services and resources registered in the dependency container, to define any necessary clients if you’re integrating a third-party storage service, and to access plugin options if your file service is defined in a plugin.

For example, the local service’s constructor could be useful to prepare the local upload directory:

```ts title="src/services/local-file.ts"
// ...
import * as fs from "fs"

class LocalFileService extends AbstractFileService {
  // can also be replaced by an environment variable
  // or a plugin option
  protected serverUrl = "http://localhost:9000"
  protected publicPath = "uploads"
  protected protectedPath = "protected-uploads"

  constructor(container) {
    super(container)

    // for public uploads
    if (!fs.existsSync(this.publicPath)) {
      fs.mkdirSync(this.publicPath)
    }

    // for protected uploads
    if (!fs.existsSync(this.protectedPath)) {
      fs.mkdirSync(this.protectedPath)
    }
  }

  // ...
}
```

Another example showcasing how to access resources using dependency injection:

<!-- eslint-disable prefer-rest-params -->

```ts title="src/services/local-file.ts"
type InjectedDependencies = {
  logger: Logger
}

class LocalFileService extends AbstractFileService {
  // ...
  protected logger_: Logger

  constructor({ logger }: InjectedDependencies) {
    super(...arguments)
    this.logger_ = logger
    // ...
  }
  // ...
}
```

You can access the plugin options in the second parameter passed to the constructor:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {
  protected serverUrl = "http://localhost:9000"
  // ...

  constructor(
    container,
    pluginOptions
  ) {
    super(container)
    
    if (pluginOptions?.serverUrl) {
      this.serverUrl = pluginOptions?.serverUrl
    }
    // ...
  }
  // ...
}
```

---

## Step 2: Implement Required Methods

In this section, you’ll learn about the required methods to implement in the file service.

### upload

This method is used to upload a file to the Medusa backend. You must handle the upload logic within this method.

This method accepts one parameter, which is a [multer file object](http://expressjs.com/en/resources/middleware/multer.html#file-information). The file is uploaded to a temporary directory by default. Among the file’s details, you can access the file’s path in the `path` property of the file object.

So, for example, you can create a read stream to the file’s content if necessary using the `fs` library:

```ts
fs.createReadStream(file.path)
```

Where `file` is the parameter passed to the `upload` method.

The method is expected to return an object that has the following properties:

- `url`: a string indicating the full accessible URL to the file.
- `key`: a string indicating the key used to reference the uploaded file. This is useful when retrieving the file later with other methods like the [getDownloadStream](#getdownloadstream).

An example implementation of this method for the local file service:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {

  async upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    const filePath = 
      `${this.publicPath}/${fileData.originalname}`
    fs.copyFileSync(fileData.path, filePath)
    return {
      url: `${this.serverUrl}/${filePath}`,
      key: filePath,
    }
  }

  // ...
}
```

:::tip

This example does not account for duplicate names to maintain simplicity in this guide. So, an uploaded file can replace another existing file that has the same name.

:::

### uploadProtected

This method is used to upload a file to the Medusa backend, but to a protected storage. Typically, this would be used to store files that shouldn’t be accessible by using the file’s URL or should only be accessible by authenticated users.

You must handle the upload logic and the file permissions or private storage configuration within this method.

This method accepts one parameter, which is a [multer file object](http://expressjs.com/en/resources/middleware/multer.html#file-information). The file is uploaded to a temporary directory by default. Among the file’s details, you can access the file’s path in the `path` property of the file object.

So, for example, you can create a read stream to the file’s content if necessary using the `fs` library:

```ts
fs.createReadStream(file.path)
```

Where `file` is the parameter passed to the `uploadProtected` method.

The method is expected to return an object that has the following properties:

- `url`: a string indicating the full accessible URL to the file.
- `key`: a string indicating the key used to reference the uploaded file. This is useful when retrieving the file later with other methods like the [getDownloadStream](#getdownloadstream).

An example implementation of this method for the local file service:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {

  async uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    const filePath = 
      `${this.protectedPath}/${fileData.originalname}`
    fs.copyFileSync(fileData.path, filePath)
    return {
      url: `${this.serverUrl}/${filePath}`,
    }
  }

  // ...
}
```

### delete

This method is used to delete a file from storage. You must handle the delete logic within this method.

This method accepts one parameter, which is an object that holds a `fileKey` property. The value of this property is a string that acts as an identifier of the file to delete. Typically, this would be the returned `key` property by other methods, such as the `upload` method.

For example, for local file service, it could be the file name.

You can also pass custom properties to the object passed as a first parameter.

This method is not expected to return anything.

An example implementation of this method for the local file service:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {

  async delete(
    fileData: DeleteFileType
  ): Promise<void> {
    fs.rmSync(fileData.fileKey)
  }

  // ...
}
```

### getUploadStreamDescriptor

This method is used to upload a file using a write stream. This is useful if the file is being written through a stream rather than uploaded to the temporary directory.

The method accepts one parameter, which is an object that has the following properties:

- `name`: a string indicating the name of the file.
- `ext`: an optional string indicating the extension of the file.
- `isPrivate`: an optional boolean value indicating if the file should be uploaded to a private bucket or location. By convention, the default value of this property should be `true`

The method is expected to return an object having the following properties:

- `writeStream`: a write stream object.
- `promise`: A promise that should resolved when the writing process is done to finish the upload. This depends on the type of file service you’re creating.
- `url`: a string indicating the URL of the file once it’s uploaded.
- `fileKey`: a string indicating the identifier of your file in the storage. For example, for a local file service this can be the file name.

You can also return custom properties within the object.

An example implementation of this method for the local file service:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {

  async getUploadStreamDescriptor({
    name,
    ext,
    isPrivate = true,
  }: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    const filePath = `${isPrivate ? 
      this.publicPath : this.protectedPath
    }/${name}.${ext}`
    const writeStream = fs.createWriteStream(filePath)

    return {
      writeStream,
      promise: Promise.resolve(),
      url: `${this.serverUrl}/${filePath}`,
      fileKey: filePath,
    }
  }

  // ...
}
```

### getDownloadStream

This method is used to read a file using a read stream, typically for download.

The method accepts as a parameter an object having the following properties:

- `fileKey`: a string indicating the identifier of the file. This is typically the value returned by other methods like [upload](#upload).
- `isPrivate`: an optional boolean value indicating whether the file should be downloaded from the private bucket or storage location. By convention, this should default to `true`.

The method is expected to return a readable stream.

An example implementation of this method for the local file service:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {

  async getDownloadStream({
    fileKey,
    isPrivate = true,
  }: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    const filePath = `${isPrivate ? 
      this.publicPath : this.protectedPath
    }/${fileKey}`
    const readStream = fs.createReadStream(filePath)

    return readStream
  }

  // ...
}
```

### getPresignedDownloadUrl

The `getPresignedDownloadUrl` method is used to retrieve a download URL of the file. For some file services, such as S3, a presigned URL indicates a temporary URL to get access to a file.

If your file service doesn’t perform or offer a similar functionality, you can just return the URL to download the file.

The method accepts as a parameter an object having the following properties:

- `fileKey`: a string indicating the identifier of the file. This is typically the value returned by other methods like [upload](#upload).
- `isPrivate`: an optional boolean value indicating whether the file should be downloaded from the private bucket or storage location. By convention, this should default to `true`.

The method is expected to return a string, being the URL of the file.

An example implementation of this method for the local file service:

```ts title="src/services/local-file.ts"
class LocalFileService extends AbstractFileService {

  async getPresignedDownloadUrl({
    fileKey,
    isPrivate = true,
  }: GetUploadedFileType
  ): Promise<string> {
    const filePath = `${isPrivate ? 
      this.publicPath : this.protectedPath
    }/${fileKey}`
    return `${this.serverUrl}/${filePath}`
  }

  // ...
}
```

---

## Step 3: Run Build Command

In the directory of the Medusa backend, run the `build` command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

:::note

This section explains how to test out your implementation if the file service was created in the Medusa backend codebase. You can refer to the [plugin documentation](../plugins/create.mdx#test-your-plugin) on how to test a plugin.

:::

Run your backend to test it out:

```bash npm2yarn
npx medusa develop
```

Then, try uploading a file, for example, using the [Upload File API Route](https://docs.medusajs.com/api/admin#uploads_postuploads). The file should be uploaded based on the logic you’ve implemented.

### (Optional) Accessing the File

:::note

This step is only useful if you're implementing a local file service.

:::

Since the file is uploaded to a local directory `uploads`, you need to configure a static route in express that allows accessing the files within the `uploads` directory.

To do that, create the file `src/api/index.ts` with the following content:

```ts title="src/api/middlewares.ts"
import type { MiddlewaresConfig } from "@medusajs/medusa"
import express from "express"

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/uploads",
      middlewares: [express.static(uploadDir)],
    },
  ],
}
```

---

## See Also

- [How to create a plugin](../plugins/create.mdx)
- [How to publish a plugin](../plugins/publish.mdx)
