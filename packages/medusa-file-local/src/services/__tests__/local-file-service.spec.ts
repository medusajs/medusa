import fs from "fs"
import fsp from "fs/promises"
import stream from "stream"

jest.mock("fs")
jest.mock("fs/promises")

const mockedFs = fs as jest.Mocked<typeof fs>

import LocalFileService from "../local-file-service"

const defaultBackendUrl = "http://localhost:9000"
const defaultUploadDir = "uploads/images"

describe("LocalFileService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getUploadStreamDescriptor", () => {
    it("should return an object with a writeStream and a promise", async () => {
      const fileData = {
        name: "test",
        ext: "png",
      }

      mockedFs.createWriteStream.mockReturnValue(
        new stream.PassThrough() as any
      )

      const service = new LocalFileService({})
      const result = await service.getUploadStreamDescriptor(fileData)

      expect(fsp.mkdir).toHaveBeenCalledWith(defaultUploadDir, {
        recursive: true,
      })
      expect(fs.createWriteStream).toHaveBeenCalledWith(
        `${defaultUploadDir}/${fileData.name}.${fileData.ext}`
      )

      expect(result).toEqual({
        writeStream: expect.any(stream.PassThrough),
        promise: expect.objectContaining({
          then: expect.any(Function),
        }),
        url: `${defaultBackendUrl}/${defaultUploadDir}/${fileData.name}.${fileData.ext}`,
        fileKey: `${fileData.name}.${fileData.ext}`,
      })
      expect(result.promise.constructor.name).toBe("Promise")
    })
  })

  describe("getPresignedDownloadUrl", () => {
    it("should return a url", async () => {
      const fileData = {
        fileKey: "test.jpg",
      }

      const service = new LocalFileService({})
      const result = await service.getPresignedDownloadUrl(fileData)

      expect(result).toEqual(
        `${defaultBackendUrl}/${defaultUploadDir}/${fileData.fileKey}`
      )
    })

    it("should support constructor options", async () => {
      const fileData = {
        fileKey: "test.jpg",
      }
      const uploadDir = "test/files"
      const backendUrl = "http://test.com"

      const service = new LocalFileService(
        {},
        { backend_url: backendUrl, upload_dir: uploadDir }
      )
      const result = await service.getPresignedDownloadUrl(fileData)

      expect(result).toEqual(`${backendUrl}/${uploadDir}/${fileData.fileKey}`)
    })
  })

  describe("upload", () => {
    it("should return a url", async () => {
      const mockTimestamp = 1000000000000
      jest.spyOn(Date, "now").mockImplementationOnce(() => mockTimestamp)

      const fileData = {
        name: "test",
        ext: "jpg",
      }
      const file = {
        originalname: `${fileData.name}.${fileData.ext}`,
        path: `${fileData.name}.${fileData.ext}`,
      } as Express.Multer.File

      const service = new LocalFileService({})
      const result = await service.upload(file)

      const expectedFileKey = `${fileData.name}-${mockTimestamp}.${fileData.ext}`
      const expectedFilePath = `${defaultUploadDir}/${expectedFileKey}`

      expect(fsp.copyFile).toHaveBeenCalledWith(file.path, expectedFilePath)
      expect(result).toEqual({
        url: `${defaultBackendUrl}/${expectedFilePath}`,
      })
    })
  })

  describe("unlink", () => {
    it("should call fs.unlink", async () => {
      const fileData = {
        fileKey: "test.jpg",
      }

      const service = new LocalFileService({})
      await service.delete(fileData)

      expect(fsp.unlink).toHaveBeenCalledWith(
        `${defaultUploadDir}/${fileData.fileKey}`
      )
    })
  })

  describe("getDownloadStream", () => {
    it("should call fs.createReadStream", async () => {
      const fileData = {
        fileKey: "test.jpg",
      }

      const service = new LocalFileService({})
      await service.getDownloadStream(fileData)

      expect(fs.createReadStream).toHaveBeenCalledWith(
        `${defaultUploadDir}/${fileData.fileKey}`
      )
    })
  })
})
