import fs from "fs"
import aws from "aws-sdk"
import { FileService } from "medusa-interfaces"

class MinioService extends FileService {
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
    aws.config.setPromisesDependency()
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      endpoint: this.endpoint_,
      s3ForcePathStyle: this.s3ForcePathStyle_,
      signatureVersion: this.signatureVersion_,
    })

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
    aws.config.setPromisesDependency()
    aws.config.update({
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      endpoint: this.endpoint_,
      s3ForcePathStyle: this.s3ForcePathStyle_,
      signatureVersion: this.signatureVersion_,
    })

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
}

export default MinioService
