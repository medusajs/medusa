import {
  AbstractFileService,
  DeleteFileType,
  FileServiceUploadResult,
  IFileService,
  UploadStreamDescriptorType
} from "@medusajs/medusa"
import fs from "fs"
import { parse } from "path"

class LocalService extends AbstractFileService implements IFileService {
  protected uploadDir_: string

  constructor({}, options) {
    super({}, options)

    this.uploadDir_ = options.upload_dir || "./uploads/images"
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file)
  }

  async uploadProtected(file: Express.Multer.File) {
    return await this.uploadFile(file, {})
  }

  async uploadFile(
    file: Express.Multer.File,
    options = {}
  ): Promise<{ url: string }> {
    const parsedFilename = parse(file.originalname)

    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    return new Promise((resolve, reject) => {
      // using copyFile, destinations will be created or overwritten
      fs.copyFile(file.path, `./${fileKey}`, (err) => {
        if (err) {
          throw err
        }

        resolve({ url: `${this.uploadDir_}/${fileKey}` })
      })
    })
  }

  async delete(file: DeleteFileType): Promise<void> {}

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType) {
    console.log("Not implemented")
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    const client = this.getClient()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return await client.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    const client = this.getClient({ signatureVersion: "v4" })

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadFileDuration_,
    }

    return await client.getSignedUrlPromise("getObject", params)
  }
}

export default LocalService
