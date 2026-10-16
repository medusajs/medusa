import { zodValidator } from "@medusajs/framework"
import { StoreSearch } from "../validators"

describe("StoreSearch", () => {
  it.each(["asc", "desc", "Asc", "dEsC", "ASC", "DESC"])(
    "accepts the %s order direction and upper-cases it",
    async (direction) => {
      const single = await zodValidator(StoreSearch, {
        entity: "product",
        pagination: { order: { title: direction } },
      })

      expect(single).toEqual({
        entity: "product",
        pagination: { order: { title: direction.toUpperCase() } },
      })

      const batched = await zodValidator(StoreSearch, {
        queries: [
          { entity: "product", pagination: { order: { title: direction } } },
        ],
      })

      expect(batched).toEqual({
        queries: [
          {
            entity: "product",
            pagination: { order: { title: direction.toUpperCase() } },
          },
        ],
      })
    }
  )

  it("rejects an unknown order direction", async () => {
    await expect(
      zodValidator(StoreSearch, {
        entity: "product",
        pagination: { order: { title: "up" } },
      })
    ).rejects.toThrow("Invalid request: Field 'queries' is required")
  })
})
