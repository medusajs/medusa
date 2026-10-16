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
    ).rejects.toThrow(
      "Invalid request: Expected: 'ASC, DESC' for field 'pagination, order, title', but got: 'up'"
    )
  })

  it("reports a single query's own error rather than the batch's", async () => {
    const error = await zodValidator(StoreSearch, {
      entity: "product",
      pagination: { take: -1 },
    }).catch((e) => e)

    expect(error.message).not.toContain("queries")
    expect(error.message).toEqual(
      "Invalid request: Value for field 'pagination, take' too small, expected at least: '0'"
    )
  })

  it("reports a batch's own error rather than the single query's", async () => {
    const error = await zodValidator(StoreSearch, {
      queries: [{ entity: "product", pagination: { take: -1 } }],
    }).catch((e) => e)

    expect(error.message).toEqual(
      "Invalid request: Value for field 'queries, 0, pagination, take' too small, expected at least: '0'"
    )
  })
})
