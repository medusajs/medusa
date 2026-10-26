import { zodValidator } from "@medusajs/framework"
import { AdminReindexSearchIndex } from "../validators"

describe("AdminReindexSearchIndex", () => {
  it.each([
    "2026-01-01T10:00Z",
    "2026-01-01T10:00+02:00",
    "2026-01-01T10:00:00Z",
    "2026-01-01T10:00:00.123+02:00",
  ])("accepts the %s since value", async (since) => {
    await expect(
      zodValidator(AdminReindexSearchIndex, { since })
    ).resolves.toEqual({ since })
  })

  it.each(["yesterday", "2026-01-01", "2026-01-01T10Z"])(
    "rejects the %s since value",
    async (since) => {
      await expect(
        zodValidator(AdminReindexSearchIndex, { since })
      ).rejects.toThrow()
    }
  )
})
