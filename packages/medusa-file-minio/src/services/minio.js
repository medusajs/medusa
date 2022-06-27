import { AbstractFileService } from '@medusajs/medusa'
import aws from "aws-sdk"
import fs from "fs"

class MinioService extends AbstractFileService {
  
  constructor({}, options) {
    super({}, options)

    this.bucket_ = options.bucket
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.endpoint_ = options.endpoint
    this.s3ForcePathStyle_ = true
    this.signatureVersion_ = "v4"
  }

  upload(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      endpoint: this.endpoint_,
      s3ForcePathStyle: this.s3ForcePathStyle_,
      signatureVersion: this.signatureVersion_,
    }, true)

    const s3 = new aws.S3()
    const params = {
      ACL: "public-read",
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: `${file.originalname}`,
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        console.log(data, err)
        if (err) {
          reject(err)
          return
        }

        resolve({ url: data.Location })
      })
    })
  }

  delete(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      endpoint: this.endpoint_,
      s3ForcePathStyle: this.s3ForcePathStyle_,
      signatureVersion: this.signatureVersion_,
    }, true)

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

export default MinioService
