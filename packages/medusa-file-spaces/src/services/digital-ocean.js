import fs from "fs"
import aws from "aws-sdk"
import { parse } from "path"
import { AbstractFileService, FileServiceUploadResult } from "@medusajs/medusa"
import { EntityManager } from "typeorm"
import stream from "stream"

class DigitalOceanService extends AbstractFileService {
  constructor({}, options) {
    super()

    this.bucket_ = options.bucket
    this.spacesUrl_ = options.spaces_url?.replace(/\/$/, "")
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
  }

  upload(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update(
      {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
        region: this.region_,
        endpoint: this.endpoint_,
      },
      true
    )

    const parsedFilename = parse(file.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`
    const s3 = new aws.S3()
    var params = {
      ACL: "public-read",
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        if (this.spacesUrl_) {
          resolve({ url: `${this.spacesUrl_}/${data.Key}` })
        }

        resolve({ url: data.Location })
      })
    })
  }

  delete(file) {
    aws.config.setPromisesDependency(null)
    aws.config.update(
      {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
        region: this.region_,
        endpoint: this.endpoint_,
      },
      true
    )

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

export default DigitalOceanService
