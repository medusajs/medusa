import path from "path"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"

jest.setTimeout(30000)

describe("/admin/products", () => {
  let medusaProcess
  let dbConnection
  let medusaContainer
  let productService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd } as any)
    const { container } = await bootstrapApp({ cwd })
    medusaContainer = container
    productService = medusaContainer.resolve("productService")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  it("should create variant prices correctly when propagating variants in service creation", async () => {
    const payload = {
      title: "test-product",
      handle: "test-product",
      options: [{ title: "test-option" }],
      variants: [
        {
          title: "test-variant",
          inventory_quantity: 10,
          sku: "test",
          options: [{ value: "large", title: "test-option" }],
          prices: [{ amount: "100", currency_code: "usd" }],
        },
      ],
    }

    const { id } = await productService.create(payload)

    const result = await productService.retrieve(id, {
      relations: ["variants", "variants.prices", "variants.options"],
    })

    expect(result).toEqual(
      expect.objectContaining({
        variants: [
          expect.objectContaining({
            options: [expect.objectContaining({ value: "large" })],
            prices: [
              expect.objectContaining({ amount: 100, currency_code: "usd" }),
            ],
          }),
        ],
      })
    )
  })
})
