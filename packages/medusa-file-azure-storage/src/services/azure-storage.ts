import fs from "fs"
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerCreateOptions,
} from '@azure/storage-blob';
import { parse } from "path"
import {
  AbstractFileService,
  DeleteFileType,
  FileServiceUploadResult,
  GetUploadedFileType,
  IFileService,
  UploadStreamDescriptorType,
} from "@medusajs/medusa"
import stream from "stream"

class AzureStorageService extends AbstractFileService implements IFileService {
  private readonly PRIVATE_ACCESS_LEVEL: string = "private"
  protected blobServiceClient_: BlobServiceClient
  protected connectionString_: string
  protected publicContainerName_: string
  protected protectedContainerName_: string

  constructor({}, options) {
    super({}, options)

    this.connectionString_ = options.AZURE_STORAGE_CONNECTION_STRING as string
    this.publicContainerName_ = options.AZURE_STORAGE_PUBLIC_CONTAINER_NAME || 'public'
    this.protectedContainerName_ = options.AZURE_STORAGE_PROTECTED_CONTAINER_NAME || 'protected'

    if (!this.connectionString_) throw Error('Azure Storage accountKey not found')
  }

  protected async getBlockClient(containerName: string, blobName: string, options: ContainerCreateOptions = {}): Promise<BlockBlobClient> {

    this.blobServiceClient_ = BlobServiceClient.fromConnectionString(this.connectionString_)
    const containerClient = this.blobServiceClient_.getContainerClient(containerName);
    await containerClient.createIfNotExists(options)

    const blobClient = await containerClient.getBlockBlobClient(blobName);
    return blobClient
  }

  protected async getBlobClient(blobName: string, accessLevel?: string | unknown ) : Promise<BlockBlobClient> {
    const containerOptions : ContainerCreateOptions = {}
    let container = this.protectedContainerName_

    if(accessLevel !== this.PRIVATE_ACCESS_LEVEL){
      containerOptions.access = "container"
      container = this.publicContainerName_
    }
    return await this.getBlockClient(container, blobName, containerOptions)
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file)
  }

  async uploadProtected(file: Express.Multer.File) {
    //batch job didn't send access_level file
    //return await this.uploadFile(file, this.PRIVATE_ACCESS_LEVEL)
    return await this.uploadFile(file)
  }

  async uploadFile(file: Express.Multer.File, accessLevel: string = "public") {
    const parsedFilename = parse(file.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`
    const blobClient = await this.getBlobClient(fileKey, accessLevel)
    await blobClient.uploadStream(fs.createReadStream(file.path));

    return {
      url: blobClient.url,
      key: fileKey,
    }
  }

  async delete(file: DeleteFileType): Promise<void> {
    const blobClient = await this.getBlobClient(file.fileKey, file.acl)
    await blobClient.deleteIfExists()
  }

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType) {
    const fileKey = `${fileData.name}.${fileData.ext}`
    const pass = new stream.PassThrough()
    const blobClient = await this.getBlobClient(fileKey, fileData.acl)

    return {
      writeStream: pass,
      promise:  blobClient.uploadStream(pass),
      url: blobClient.url,
      fileKey,
    }
  }

  async getDownloadStream(fileData: GetUploadedFileType): Promise<NodeJS.ReadableStream> {
    const blobClient = await this.getBlobClient( fileData.fileKey, fileData.acl)
    const downloadResponse  = await blobClient.download();
    return downloadResponse.readableStreamBody as NodeJS.ReadableStream
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    const blobClient = await this.getBlobClient(fileData.fileKey, fileData.acl)
    return blobClient.url
  }
}

export default AzureStorageService
