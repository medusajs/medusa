import { initDb, useDb } from "../../../environment-helpers/use-db"
import { setPort, useApi } from "../../../environment-helpers/use-api"
import { simpleCartFactory, simpleRegionFactory } from "../../../factories"

import { AxiosInstance } from "axios"
import { IPricingModuleService } from "@medusajs/types"
import adminSeeder from "../../../helpers/admin-seeder"
import { bootstrapApp } from "../../../environment-helpers/bootstrap-app"
import path from "path"
import setupServer from "../../../environment-helpers/setup-server"

jest.setTimeout(5000000)

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_ISOLATE_PRICING_DOMAIN: true,
  MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
}

describe("Link Modules", () => {
  let medusaContainer
  let dbConnection
  let express

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)

    const { container, app, port } = await bootstrapApp({ cwd, env })
    medusaContainer = container
    setPort(port)

    express = app.listen(port)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    express.close()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
    await simpleRegionFactory(dbConnection, {
      id: "region-1",
      currency_code: "usd",
    })
  })

  describe("get product price", () => {
    let ruleType
    let priceSet
    let productId
    const cartId = "test-cart"
    beforeEach(async () => {
      const pricingModuleService = medusaContainer.resolve(
        "pricingModuleService"
      )
      const api = useApi()! as AxiosInstance

      await simpleCartFactory(dbConnection, { id: cartId, region: "region-1" })

      const payload = {
        title: "Test",
        description: "test-product-description",
        images: ["test-image.png", "test-image-2.png"],
        variants: [
          {
            title: "Test variant",
            prices: [],
            options: [],
          },
        ],
      }

      const response = await api.post("/admin/products", payload, adminHeaders)

      productId = response.data.product.id
      const variant = response.data.product.variants[0]

      ruleType = await pricingModuleService.createRuleTypes([
        { name: "region_id", rule_attribute: "region_id" },
      ])

      priceSet = await pricingModuleService.create({
        rules: [{ rule_attribute: "region_id" }],
        prices: [
          {
            amount: 1000,
            currency_code: "usd",
            rules: { region_id: "region-1" },
          },
          {
            amount: 900,
            currency_code: "usd",
            rules: { region_id: "region-2" },
          },
        ],
      })

      const medusaApp = medusaContainer.resolve("medusaApp") as any

      await medusaApp.link.create({
        productService: {
          variant_id: variant.id,
        },
        pricingService: {
          price_set_id: priceSet.id,
        },
      })
    })

    it("Should values in a declared link", async () => {
      const api = useApi()! as AxiosInstance

      const response = await api.get(
        `/store/products/${productId}?cart_id=${cartId}`
      )

      console.warn(JSON.stringify(response.data.product.variants, null, 2))

      expect(response.data.product.variants[0].prices).toEqual([
        expect.objectContaining({
          amount: 1000,
          currency_code: "usd",
        }),
      ])
    })
  })
})
