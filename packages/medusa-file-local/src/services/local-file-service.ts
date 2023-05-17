import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  IFileService,
} from "@medusajs/medusa"
import fs from "fs"
import { parse } from "path"

class LocalService extends AbstractFileService implements IFileService {
  protected uploadDir_: string
  protected backendUrl_: string

  constructor({}, options) {
    super({}, options)

    this.uploadDir_ = options.upload_dir || "uploads/images"
    this.backendUrl_ = options.backend_url || "http://localhost:9000"
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
      fs.copyFile(file.path, `${this.uploadDir_}/${fileKey}`, (err) => {
        if (err) {
          throw err
        }

        const fileUrl = `${this.backendUrl_}/${this.uploadDir_}/${fileKey}`

        resolve({ url: fileUrl })
      })
    })
  }

  async delete(file): Promise<void> {
    throw Error("Not implemented")
  }

  async getUploadStreamDescriptor(
    fileData
  ): Promise<FileServiceGetUploadStreamResult> {
    throw Error("Not implemented")
  }

  async getDownloadStream(fileData): Promise<NodeJS.ReadableStream> {
    throw Error("Not implemented")
  }

  async getPresignedDownloadUrl(fileData): Promise<string> {
    throw Error("Not implemented")
  }
}

export default LocalService
