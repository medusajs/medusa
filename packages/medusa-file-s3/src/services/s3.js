import fs from "fs"
import aws from "aws-sdk"
import { AbstractFileService } from '@medusajs/medusa'

class S3Service extends AbstractFileService {
  constructor({}, options) {
    super({}, options)

    this.bucket_ = options.bucket
    this.s3Url_ = options.s3_url
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
  }

  upload(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      region: this.region_,
      endpoint: this.endpoint_,
    }, true)

    const s3 = new aws.S3()
    var params = {
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
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      region: this.region_,
      endpoint: this.endpoint_,
    }, true)

    const s3 = new aws.S3()
    var params = {
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
