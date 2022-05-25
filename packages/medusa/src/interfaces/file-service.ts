export interface IFileService {
  /**
   * upload file to fileservice
   * @param file Multer file from express multipart/form-data
   * */
  upload(file: Express.Multer.File): void

  /**
   * remove file from fileservice
   * @param fileData Remove file described by record
   * */
  delete(fileData: Record<string, any>): void

  /**
   * upload file to fileservice from stream
   * @param fileData file metadata relevant for fileservice to create and upload the file
   * @param fileStream readable stream of the file to upload
   * */
  uploadStream(
    fileData: Record<string, any>,
    fileStream: NodeJS.ReadableStream
  ): Promise<string>

  /**
   * download file from fileservice as stream
   * @param file file metadata relevant for fileservice to download the file
   * @returns readable stream of the file to download
   * */
  downloadStream(file: Record<string, any>): Promise<NodeJS.ReadableStream>

  /**
   * Generate a presigned download url to obtain a file
   * @param file file metadata relevant for fileservice to download the file
   * @returns presigned url to download the file
   * */
  generatePresignedDownloadUrl(file: Record<string, any>): Promise<string>
}

export abstract class AbstractFileService implements IFileService {
  abstract upload(fileData: Express.Multer.File): void

  abstract delete(fileData: Record<string, any>): void

  uploadStream(
    fileData: Record<string, any>,
    fileStream: NodeJS.ReadableStream
  ): Promise<string> {
    throw new Error(
      "Batch operations are not implemented for this fileservice."
    )
  }

  downloadStream(file: Record<string, any>): Promise<NodeJS.ReadableStream> {
    throw new Error(
      "Batch operations are not implemented for this fileservice."
    )
  }

  generatePresignedDownloadUrl(file: Record<string, any>): Promise<string> {
    throw new Error(
      "Batch operations are not implemented for this fileservice."
    )
  }
}

export const isFileService = (object: any): boolean => {
  return object instanceof AbstractFileService
}
