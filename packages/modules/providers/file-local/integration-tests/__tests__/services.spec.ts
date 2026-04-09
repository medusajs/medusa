import { FileSystem } from "@medusajs/utils"
import fs from "fs/promises"
import path from "path"
import { LocalFileService } from "../../src/services/local-file"

jest.setTimeout(10000)

describe("Local File Plugin", () => {
  let localService: LocalFileService

  const fixtureImagePath =
    process.cwd() + "/integration-tests/__fixtures__/catphoto.jpg"

  const uploadDir = path.join(
    process.cwd(),
    "integration-tests/__tests__/uploads"
  )

  const fileSystem = new FileSystem(uploadDir)

  beforeAll(async () => {
    localService = new LocalFileService(
      {
        logger: console as any,
      },
      {
        upload_dir: uploadDir,
        backend_url: "http://localhost:9000/static",
      }
    )
  })

  afterAll(async () => {
    await fileSystem.cleanup()
  })

  it(`should upload, read, and then delete a public file successfully`, async () => {
    const fileContent = await fs.readFile(fixtureImagePath)
    const fixtureAsBase64 = fileContent.toString("base64")

    const resp = await localService.upload({
      filename: "catphoto.jpg",
      mimeType: "image/jpeg",
      content: fileContent as any,
      access: "public",
    })

    expect(resp).toEqual({
      key: expect.stringMatching(/catphoto.*\.jpg/),
      url: expect.stringMatching(
        /http:\/\/localhost:9000\/static\/.*catphoto.*\.jpg/
      ),
    })

    // For local file provider, we can verify the file exists on disk
    const fileKey = resp.key
    const baseDir = uploadDir
    const filePath = path.join(baseDir, fileKey)

    const fileOnDisk = await fs.readFile(filePath)

    const fileOnDiskAsBase64 = fileOnDisk.toString("base64")

    expect(fileOnDiskAsBase64).toEqual(fixtureAsBase64)

    const signedUrl = await localService.getPresignedDownloadUrl({
      fileKey: resp.key,
    })

    expect(signedUrl).toEqual(resp.url)

    const buffer = await localService.getAsBuffer({ fileKey: resp.key })
    expect(buffer).toEqual(fileContent)

    await localService.delete({ fileKey: resp.key })

    await expect(fs.access(filePath)).rejects.toThrow()
  })

  it("uploads using stream", async () => {
    const fileContent = await fs.readFile(fixtureImagePath)

    const { writeStream, promise } = await localService.getUploadStream({
      filename: "catphoto-stream.jpg",
      mimeType: "image/jpeg",
      access: "public",
    })

    writeStream.write(fileContent)
    writeStream.end()

    const resp = await promise

    expect(resp).toEqual({
      key: expect.stringMatching(/catphoto-stream.*\.jpg/),
      url: expect.stringMatching(
        /http:\/\/localhost:9000\/static\/.*catphoto-stream.*\.jpg/
      ),
    })

    const fileKey = resp.key
    const filePath = path.join(uploadDir, fileKey)

    const fileOnDisk = await fs.readFile(filePath)
    expect(fileOnDisk).toEqual(fileContent)

    const signedUrl = await localService.getPresignedDownloadUrl({
      fileKey: resp.key,
    })

    expect(signedUrl).toEqual(resp.url)

    const buffer = await localService.getAsBuffer({ fileKey: resp.key })
    expect(buffer).toEqual(fileContent)

    await localService.delete({ fileKey: resp.key })
    await expect(fs.access(filePath)).rejects.toThrow()
  })
})
