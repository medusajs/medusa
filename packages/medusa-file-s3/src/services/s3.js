import fs from "fs"
import aws from "aws-sdk"
import { AbstractFileService } from '@medusajs/medusa'

class S3Service extends AbstractFileService {
  constructor({ }, options) {
    super({}, options)

    this.bucket_ = options.bucket

    // user is using legacy configuration
    // mapping it as per new options
    if (options.access_key_id) {
      options.accessKeyId = options.access_key_id
      options.secretAccessKey = options.secret_access_key
      delete options.access_key_id
      delete options.secret_access_key
      delete options.s3_url
    }

    // Remove parameters not supported by aws-sdk
    delete options.bucket

    this.awsOptions_ = options
  }

  upload(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update(this.awsOptions_, true)

    const s3 = new aws.S3()
    const params = {
      ACL: "public-read",
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: `${file.originalname}`,
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve({ url: data.Location })
      })
    })
  }

  async delete(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update(this.awsOptions_, true)

    const s3 = new aws.S3()
    const params = {
      Bucket: this.bucket_,
      Key: `${file}`,
    }

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  async getUploadStreamDescriptor(fileData) {
    throw new Error("Method not implemented.")
  }

  async getDownloadStream(fileData) {
    throw new Error("Method not implemented.")
  }

  async getPresignedDownloadUrl(fileData) {
    throw new Error("Method not implemented.")
  }
}

export default S3Service
