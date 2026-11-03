import fs from "fs/promises"
import os from "os"
import path from "path"
import { LocalFileService } from "../local-file"

describe("LocalFileService.deleteByUrl", () => {
  let uploadDir: string
  let service: LocalFileService

  beforeEach(async () => {
    uploadDir = await fs.mkdtemp(path.join(os.tmpdir(), "medusa-file-local-"))
    service = new LocalFileService({} as any, {
      upload_dir: uploadDir,
      backend_url: "http://localhost:9000/static",
    })
  })

  afterEach(async () => {
    await fs.rm(uploadDir, { recursive: true, force: true })
  })

  const upload = (filename = "image.png") =>
    service.upload({
      filename,
      mimeType: "image/png",
      content: Buffer.from("content").toString("base64"),
      access: "public",
    })

  it("deletes the file matching the uploaded URL", async () => {
    const { url, key } = await upload("nested/logo one.png")
    const filePath = path.join(uploadDir, key)

    await expect(fs.access(filePath)).resolves.toBeUndefined()

    await service.deleteByUrl(url)

    await expect(fs.access(filePath)).rejects.toThrow()
  })

  it("ignores URLs that don't belong to the provider", async () => {
    const { key } = await upload()
    const filePath = path.join(uploadDir, key)

    await service.deleteByUrl("https://example.com/static/image.png")
    await service.deleteByUrl("http://localhost:9000/static-other/image.png")

    await expect(fs.access(filePath)).resolves.toBeUndefined()
  })

  it("ignores malformed URLs", async () => {
    const { key } = await upload()
    const filePath = path.join(uploadDir, key)

    await service.deleteByUrl("not a url")

    await expect(fs.access(filePath)).resolves.toBeUndefined()
  })
})
