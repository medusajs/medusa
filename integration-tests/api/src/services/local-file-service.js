import { AbstractFileService } from "@medusajs/medusa"
import stream from "stream"
import { resolve } from "path"
import * as fs from "fs"

export default class LocalFileService extends AbstractFileService {
  constructor({}, options) {
    super({});
    this.upload_dir_ = process.env.UPLOAD_DIR ?? options.upload_dir ?? "uploads/images";

    if (!fs.existsSync(this.upload_dir_)) {
      fs.mkdirSync(this.upload_dir_);
    }
  }

  upload(file) {
    return new Promise((resolve, reject) => {
      const path = resolve(this.upload_dir_, file.originalname)
      fs.writeFile(path, "", err => {
        if (err) {
          reject(err);
        }

        resolve({ url: path });
      });
    });
  }

  delete({ name }) {
    return new Promise((resolve, _) => {
      const path = resolve(this.upload_dir_, name)
      fs.unlink(path, err => {
        if (err) {
          throw err;
        }

        resolve("file unlinked");
      });
    });
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
}
