import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"

jest.setTimeout(30000)

describe("product", () => {
  let medusaContainer
  let productService

  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    await initDb({ cwd })
    shutdownServer = shutdownServer = await startBootstrapApp({ cwd })
    medusaContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    await db.teardown()
  })

  describe("product service", () => {
    it("should create variant prices correctly in service creation", async () => {
      productService = medusaContainer.resolve("productService")

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

    it("should fail to create a variant without options on for a product with options", async () => {
      const payload = {
        title: "test-product",
        handle: "test-product",
        options: [{ title: "test-option" }],
        variants: [
          {
            title: "test-variant",
            inventory_quantity: 10,
            sku: "test",
            prices: [{ amount: "100", currency_code: "usd" }],
          },
        ],
      }

      let error

      try {
        await productService.create(payload)
      } catch (err) {
        error = err
      }

      expect(error.message).toEqual(
        "Product options length does not match variant options length. Product has 1 and variant has 0."
      )
    })

    it("should create a product and variant without options", async () => {
      const payload = {
        title: "test-product",
        handle: "test-product",
        variants: [
          {
            title: "test-variant",
            inventory_quantity: 10,
            sku: "test",
            prices: [{ amount: "100", currency_code: "usd" }],
          },
        ],
      }

      const { id } = await productService.create(payload)

      const result = await productService.retrieve(id, {
        relations: [
          "options",
          "variants",
          "variants.prices",
          "variants.options",
        ],
      })

      expect(result).toEqual(
        expect.objectContaining({
          options: [],
          variants: [
            expect.objectContaining({
              prices: [
                expect.objectContaining({ amount: 100, currency_code: "usd" }),
              ],
            }),
          ],
        })
      )
    })
  })
})
