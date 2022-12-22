import fs from "fs"
import aws from "aws-sdk"
import { AbstractFileService } from "@medusajs/medusa"
const { getDefaultRoleAssumerWithWebIdentity } = require("@aws-sdk/client-sts")
const { defaultProvider } = require("@aws-sdk/credential-provider-node")
import stream from "stream"
class S3Service extends AbstractFileService {
  constructor(x, options) {
    super(x, options)

    this.bucket_ = options.bucket
    this.s3Url_ = options.s3_url
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
    this.auth = this.accessKeyId_
      ? {
          accessKeyId: this.accessKeyId_,
          secretAccessKey: this.secretAccessKey_,
        }
      : {
          credentialDefaultProvider: defaultProvider({
            roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity,
          }),
        }
  }

  upload(file) {
    this.updateAwsConfig()

    return this.uploadFile(file)
  }

  uploadProtected(file) {
    this.updateAwsConfig()

    return this.uploadFile(file, { acl: "private" })
  }

  uploadFile(file, options = { isProtected: false, acl: undefined }) {
    const s3 = new aws.S3()
    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
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

        resolve({ url: data.Location, key: data.Key })
      })
    })
  }

  async delete(file) {
    this.updateAwsConfig()

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

    const fileKey = `${fileData.name}.${fileData.ext}`
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
      url: `${this.s3Url_}/${fileKey}`,
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
      Expires: this.downloadUrlDuration,
    }

    return await s3.getSignedUrlPromise("getObject", params)
  }

  updateAwsConfig(additionalConfiguration = {}) {
    aws.config.setPromisesDependency(null)
    aws.config.update(
      {
        region: this.region_,
        endpoint: this.endpoint_,
        ...additionalConfiguration,
        ...this.auth,
      },
      true
    )
  }
}

export default S3Service
