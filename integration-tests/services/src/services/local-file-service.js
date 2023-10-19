import { AbstractFileService } from "@medusajs/medusa"
import * as fs from "fs"
import mkdirp from "mkdirp"
import { resolve } from "path"
import stream from "stream"

export default class LocalFileService extends AbstractFileService {
  constructor({}, options) {
    super({}, options)
    this.upload_dir_ =
      process.env.UPLOAD_DIR ?? options.upload_dir ?? "uploads/images"

    if (!fs.existsSync(this.upload_dir_)) {
      fs.mkdirSync(this.upload_dir_)
    }
  }

  upload(file) {
    return new Promise((resolvePromise, reject) => {
      const path = resolve(this.upload_dir_, file.originalname)

      let content = ""
      if (file.filename) {
        content = fs.readFileSync(
          resolve(process.cwd(), "uploads", file.filename)
        )
      }

      const pathSegments = path.split("/")
      pathSegments.splice(-1)
      const dirname = pathSegments.join("/")
      mkdirp.sync(dirname, { recursive: true })

      fs.writeFile(path, content.toString(), (err) => {
        if (err) {
          reject(err)
        }

        resolvePromise({ url: path })
      })
    })
  }

  delete({ fileKey }) {
    return new Promise((resolvePromise, reject) => {
      const path = resolve(this.upload_dir_, fileKey)
      fs.unlink(path, (err) => {
        if (err) {
          reject(err)
        }

        resolvePromise("file unlinked")
      })
    })
  }

  async getUploadStreamDescriptor({ name, ext }) {
    const fileKey = `${name}.${ext}`
    const path = resolve(this.upload_dir_, fileKey)

    const isFileExists = fs.existsSync(path)
    if (!isFileExists) {
      await this.upload({ originalname: fileKey })
    }

    const pass = new stream.PassThrough()
    pass.pipe(fs.createWriteStream(path))

    return {
      writeStream: pass,
      promise: Promise.resolve(),
      url: `${this.upload_dir_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream({ fileKey }) {
    return new Promise((resolvePromise, reject) => {
      try {
        const path = resolve(this.upload_dir_, fileKey)
        const data = fs.readFileSync(path)
        const readable = stream.Readable()
        readable._read = function () {}
        readable.push(data.toString())
        readable.push(null)
        resolvePromise(readable)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getPresignedDownloadUrl({ fileKey }) {
    return `${this.upload_dir_}/${fileKey}`
  }
}
