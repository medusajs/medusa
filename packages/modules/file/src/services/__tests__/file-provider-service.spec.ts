import { FileProviderRegistrationPrefix } from "@types"
import FileProviderService from "../file-provider-service"

const buildService = (provider: Record<string, any>) =>
  new FileProviderService({
    [`${FileProviderRegistrationPrefix}test`]: provider,
  } as any)

describe("FileProviderService.deleteByUrl", () => {
  it("forwards the URL to the provider", async () => {
    const deleteByUrl = jest.fn().mockResolvedValue(undefined)
    const service = buildService({ deleteByUrl })

    await service.deleteByUrl("https://example.com/image.png")

    expect(deleteByUrl).toHaveBeenCalledWith("https://example.com/image.png")
  })

  it("does nothing when the provider doesn't support deleting by URL", async () => {
    const service = buildService({})

    await expect(
      service.deleteByUrl("https://example.com/image.png")
    ).resolves.toBeUndefined()
  })

  it("propagates provider errors", async () => {
    const service = buildService({
      deleteByUrl: jest.fn().mockRejectedValue(new Error("failed")),
    })

    await expect(
      service.deleteByUrl("https://example.com/image.png")
    ).rejects.toThrow("failed")
  })
})
