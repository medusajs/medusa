import fs from "fs"
import aws from "aws-sdk"
import { AbstractFileService } from '@medusajs/medusa'

class MinioService extends AbstractFileService {
  
  constructor({}, options) {
    super()

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
    this.updateAwsConfig()

    const pass = new stream.PassThrough()

    const fileKey = `${fileData.name}-${Date.now()}.${fileData.ext}`
    const params = {
      ACL: fileData.acl ?? "private",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
    }

    const s3 = new aws.S3()
    return {
      writeStream: pass,
      promise: s3.upload(params).promise(),
      url: `${this.spacesUrl_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(fileData) {
    this.updateAwsConfig()

    const s3 = new aws.S3()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return s3.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl(fileData) {
    this.updateAwsConfig({
      signatureVersion: "v4",
    })

    const s3 = new aws.S3()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: 60, // 60 seconds
    }

    return await s3.getSignedUrlPromise("getObject", params)
  }

  updateAwsConfig(additionalConfiguration = {}) {
    aws.config.setPromisesDependency(null)
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      endpoint: this.endpoint_,
      s3ForcePathStyle: this.s3ForcePathStyle_,
      signatureVersion: this.signatureVersion_,
      ...additionalConfiguration,
    }, true)
  }
}

export default MinioService
