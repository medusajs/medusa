import { AbstractFileService } from "@medusajs/medusa"
import stream from "stream"
import * as fs from "fs"
import * as path from "path"

export default class LocalFileService extends AbstractFileService {
  // eslint-disable-next-line no-empty-pattern
  constructor({}, options) {
    super({})
    this.upload_dir_ =
      process.env.UPLOAD_DIR ?? options.upload_dir ?? "uploads/images"

    if (!fs.existsSync(this.upload_dir_)) {
      fs.mkdirSync(this.upload_dir_)
    }
  }

  async upload(file) {
    const uploadPath = path.join(
      this.upload_dir_,
      path.dirname(file.originalname)
    )

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

    const filePath = path.resolve(this.upload_dir_, file.originalname)
    fs.writeFile(filePath, "", (error) => {
      if (error) {
        throw error
      }
    })
    return { url: filePath }
  }

  async delete({ name }) {
    return new Promise((resolve, _) => {
      const path = resolve(this.upload_dir_, name)
      fs.unlink(path, (err) => {
        if (err) {
          throw err
        }

        resolve("file unlinked")
      })
    })
  }

  async getUploadStreamDescriptor({ name, ext }) {
    const fileKey = `${name}.${ext}`
    const filePath = path.resolve(this.upload_dir_, fileKey)

    const isFileExists = fs.existsSync(filePath)
    if (!isFileExists) {
      await this.upload({ originalname: fileKey })
    }

    const pass = new stream.PassThrough()
    pass.pipe(fs.createWriteStream(filePath))

    return {
      writeStream: pass,
      promise: Promise.resolve(),
      url: `${this.upload_dir_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(fileData) {
    const filePath = path.resolve(
      this.upload_dir_,
      fileData.fileKey + (fileData.ext ? `.${fileData.ext}` : "")
    )
    return fs.createReadStream(filePath)
  }
}
