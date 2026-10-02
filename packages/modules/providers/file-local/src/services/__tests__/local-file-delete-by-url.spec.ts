/**
 * `deleteByUrl` resolves a file's key from the public URL that the provider
 * itself produced on upload, since a product image only records its URL.
 */

import { LocalFileService } from "../local-file"

const makeService = (
  options: Record<string, unknown> = {}
): LocalFileService => {
  return new LocalFileService(
    {} as any,
    {
      upload_dir: "/tmp/static",
      backend_url: "http://localhost:9000/static",
      ...options,
    } as any
  )
}

const spyOnDelete = (service: LocalFileService) => {
  return jest
    .spyOn(service, "delete")
    .mockImplementation(() => Promise.resolve())
}

describe("LocalFileService.deleteByUrl", () => {
  it("round-trips every key shape through the provider's own URL builder", async () => {
    const service = makeService()
    const deleteSpy = spyOnDelete(service)

    const keys = [
      "image.png",
      "nested/dir/photo.jpeg",
      "a file with spaces.png",
      "weird&chars#1.png",
      "private-document.pdf",
    ]

    for (const key of keys) {
      const url = (service as any).getUploadFileUrl(key)

      await service.deleteByUrl(url)

      expect(deleteSpy).toHaveBeenCalledWith({ fileKey: key })
    }

    expect(deleteSpy).toHaveBeenCalledTimes(keys.length)
  })

  it("deletes the file a plain URL points at", async () => {
    const service = makeService()
    const deleteSpy = spyOnDelete(service)

    await service.deleteByUrl("http://localhost:9000/static/image.png")

    expect(deleteSpy).toHaveBeenCalledWith({ fileKey: "image.png" })
  })

  it("resolves keys against a base URL that has a sub-path and a trailing slash", async () => {
    const service = makeService({
      backend_url: "http://cdn.example.com/files/",
    })
    const deleteSpy = spyOnDelete(service)

    await service.deleteByUrl("http://cdn.example.com/files/a/b.png")

    expect(deleteSpy).toHaveBeenCalledWith({ fileKey: "a/b.png" })
  })

  it("rejects a URL from a foreign origin", async () => {
    const service = makeService()
    const deleteSpy = spyOnDelete(service)

    await expect(
      service.deleteByUrl("http://evil.com/static/image.png")
    ).rejects.toThrow("is not managed by this file provider")

    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it("rejects a URL outside the configured base path", async () => {
    const service = makeService()
    const deleteSpy = spyOnDelete(service)

    await expect(
      service.deleteByUrl("http://localhost:9000/other/image.png")
    ).rejects.toThrow("is not managed by this file provider")

    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it("rejects the base path itself and a path that merely shares its prefix", async () => {
    const service = makeService({ backend_url: "http://cdn.example.com/files" })
    const deleteSpy = spyOnDelete(service)

    await expect(
      service.deleteByUrl("http://cdn.example.com/files")
    ).rejects.toThrow("is not managed by this file provider")

    await expect(
      service.deleteByUrl("http://cdn.example.com/filesother/b.png")
    ).rejects.toThrow("is not managed by this file provider")

    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it("rejects a traversal that escapes the base path once normalized", async () => {
    const service = makeService()
    const deleteSpy = spyOnDelete(service)

    await expect(
      service.deleteByUrl("http://localhost:9000/static/../../etc/passwd")
    ).rejects.toThrow("is not managed by this file provider")

    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it("rejects a percent-encoded traversal rather than deleting outside the upload dir", async () => {
    const service = makeService()

    await expect(
      service.deleteByUrl(
        "http://localhost:9000/static/%2e%2e%2f%2e%2e%2fetc/passwd"
      )
    ).rejects.toThrow("Invalid file key")
  })

  it("rejects a malformed URL", async () => {
    const service = makeService()
    const deleteSpy = spyOnDelete(service)

    await expect(service.deleteByUrl("not-a-url")).rejects.toThrow()

    expect(deleteSpy).not.toHaveBeenCalled()
  })
})
