import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  IFileService,
} from "@medusajs/medusa"
import fs from "fs"
import { parse } from "path"
import stream from "stream"

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
    const parsedFilename = parse(fileData.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`
    const fileUrl = `${this.backendUrl_}/${this.uploadDir_}/${fileKey}`

    const pass = new stream.PassThrough()
    const writeStream = fs.createWriteStream(`${this.uploadDir_}/${fileKey}`)

    pass.pipe(writeStream)

    const promise = new Promise((res, rej) => {
      writeStream.on("finish", res)
      writeStream.on("error", rej)
    })

    return { url: fileUrl, fileKey, writeStream: pass, promise }
  }

  async getDownloadStream(fileData): Promise<NodeJS.ReadableStream> {
    throw Error("Not implemented")
  }

  async getPresignedDownloadUrl(fileData): Promise<string> {
    throw Error("Not implemented")
  }
}

export default LocalService
