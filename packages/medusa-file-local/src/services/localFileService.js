import { FileService } from "medusa-interfaces"
import fs from "fs"

class LocalFileService extends FileService {
  // eslint-disable-next-line no-empty-pattern
  constructor({}, options) {
    super()
    this.base_url_ = process.env.BASE_URL
      ? process.env.BASE_URL
      : options.base_url
      ? options.base_url
      : "http://localhost:9000"
    this.upload_dir_ = process.env.UPLOAD_DIR
      ? process.env.UPLOAD_DIR
      : options.upload_dir
      ? options.upload_dir
      : "uploads/images"

    if (!fs.existsSync(this.upload_dir_)) {
      fs.mkdirSync(this.upload_dir_)
    }
  }

  upload(file) {
    return new Promise((resolve, _) => {
      fs.copyFile(
        file.path,
        `${this.upload_dir_}/${file.originalname}`,
        (err) => {
          if (err) {
            throw err
          }
          resolve({
            url: `${this.base_url_}/${this.upload_dir_}/${file.originalname}`,
          })
        }
      )
    })
  }

  delete(file) {
    return new Promise((resolve, _) => {
      fs.unlink(file, (err) => {
        if (err) {
          throw err
        }

        resolve("Ok")
      })
    })
  }
}

export default LocalFileService
