import FileProviderService from "../file-provider-service"

const buildService = (provider: Record<string, unknown>) => {
  return new FileProviderService({ fs_test: provider } as any)
}

describe("FileProviderService.deleteByUrl", () => {
  it("forwards the URL to a provider that implements it", async () => {
    const deleteByUrl = jest.fn().mockResolvedValue(undefined)
    const service = buildService({ deleteByUrl })

    await service.deleteByUrl("https://bucket.s3.amazonaws.com/a.png")

    expect(deleteByUrl).toHaveBeenCalledWith(
      "https://bucket.s3.amazonaws.com/a.png"
    )
  })

  it("resolves without throwing when the provider does not implement it", async () => {
    const service = buildService({})

    await expect(
      service.deleteByUrl("https://bucket.s3.amazonaws.com/a.png")
    ).resolves.toBeUndefined()
  })

  it("propagates an error raised by the provider", async () => {
    const deleteByUrl = jest
      .fn()
      .mockRejectedValue(new Error("storage unreachable"))
    const service = buildService({ deleteByUrl })

    await expect(
      service.deleteByUrl("https://bucket.s3.amazonaws.com/a.png")
    ).rejects.toThrow("storage unreachable")
  })
})
