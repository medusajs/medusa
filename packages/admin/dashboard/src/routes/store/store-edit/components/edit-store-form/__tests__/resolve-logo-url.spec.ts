import { beforeEach, describe, expect, it, vi } from "vitest"

const { uploadCreate } = vi.hoisted(() => ({ uploadCreate: vi.fn() }))

vi.mock("../../../../../../lib/client", () => ({
  sdk: { admin: { upload: { create: uploadCreate } } },
}))

import { resolveLogoUrl } from "../resolve-logo-url"

describe("resolveLogoUrl", () => {
  beforeEach(() => {
    uploadCreate.mockReset()
  })

  it("returns null when the logo was removed", async () => {
    await expect(resolveLogoUrl(null)).resolves.toBeNull()
    expect(uploadCreate).not.toHaveBeenCalled()
  })

  it("keeps the current url when no new file was picked", async () => {
    await expect(
      resolveLogoUrl({ url: "https://example.com/logo.png" })
    ).resolves.toBe("https://example.com/logo.png")
    expect(uploadCreate).not.toHaveBeenCalled()
  })

  it("uploads a picked file and returns its url", async () => {
    const file = new File(["logo"], "logo.png", { type: "image/png" })
    uploadCreate.mockResolvedValue({
      files: [{ id: "file_1", url: "https://cdn.example.com/logo.png" }],
    })

    await expect(resolveLogoUrl({ url: "blob:preview", file })).resolves.toBe(
      "https://cdn.example.com/logo.png"
    )
    expect(uploadCreate).toHaveBeenCalledWith({ files: [file] })
  })

  it("rejects when the upload fails", async () => {
    const file = new File(["logo"], "logo.png", { type: "image/png" })
    uploadCreate.mockRejectedValue(new Error("Upload failed"))

    await expect(resolveLogoUrl({ url: "blob:preview", file })).rejects.toThrow(
      "Upload failed"
    )
  })
})
