import { MedusaModule, ModuleJoinerConfig } from "@medusajs/modules-sdk"
import { initDb, useDb } from "../../../environment-helpers/use-db"
import {
  initialize,
  runMigrations,
} from "@medusajs/link-modules"
import {
  initialize as initializePricingModoule,
  runMigrations as runPricingMigrations,
} from "@medusajs/pricing"
import {
  initialize as initializeProductModoule,
  runMigrations as runProductMigrations,
} from "@medusajs/product"
import { setPort, useApi } from "../../../environment-helpers/use-api"

import { AxiosInstance } from "axios"
import { IPricingModuleService } from "@medusajs/types"
import adminSeeder from "../../../helpers/admin-seeder"
import { bootstrapApp } from "../../../environment-helpers/bootstrap-app"
import path from "path"
import { runLinkMigrations } from "../../helpers/run-link-migrations"
import setupServer from "../../../environment-helpers/setup-server"
import { simpleRegionFactory } from "../../../factories"

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
  MEDUSA_FF_PRICING_INTEGRATION: true,
  MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
}

const dbConfig = {
  database: {
    clientUrl: DB_URL,
  },
}

describe("Link Modules", () => {
  // let links
  let pricingModuleService: IPricingModuleService
  let medusaContainer
  // let express

  // const dbConfig = {
  //   database: {
  //     clientUrl: DB_URL,
  //   },
  // }

  // beforeAll(async () => {
  //   const cwd = path.resolve(path.join(__dirname, "..", ".."))
  //   dbConnection = await initDb({ cwd } as any)
  //   const { app, port, container } = await bootstrapApp({ cwd })
  //   medusaContainer = container

  //   setPort(port)
  //   express = app.listen(port, () => {
  //     process.send?.(port)
  //   })

  //   // await runPricingMigrations({ options: dbConfig })

  //   pricingModuleService = await initializePricingModoule(dbConfig)
  //   // await initializeProductModoule(dbConfig)
  //   // await runMigrations({ options: dbConfig })
  //   links = await initialize(dbConfig) // linkDefinition

  //   pricingLink = links.productVariantPricingPriceSetLink
  // })

  // afterAll(async () => {
  //   jest.clearAllMocks()
  // })

  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    medusaProcess = await setupServer({
      cwd,
      env,
      verbose: true,
    } as any)
    const { container } = await bootstrapApp({ cwd })
    medusaContainer = container

    runLinkMigrations(container, { options: dbConfig })

    pricingModuleService = medusaContainer.resolve("pricingModuleService")

  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })


  beforeEach(async () => {
    await adminSeeder(dbConnection)
    const a = await simpleRegionFactory(dbConnection, { 
      id: 'region-1',
      currency_code: 'usd'
    })

    console.warn(a)
  })

  describe("get product price", () => {
    let ruleType
    let priceSet
    let productId
    let cartId 
    beforeEach(async () => {
      const api = useApi()! as AxiosInstance

      const cartResponse = await api.post(`/store/carts`, {
        region_id: 'region-1'
      }, adminHeaders)

      cartId = cartResponse.data.cart.id

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
            currency_code: "eur",
            rules: { region_id: "region-1" },
          },
          {
            amount: 900,
            currency_code: "usd",
            rules: { region_id: "region-2" },
          },
        ],
      })

      await pricingLink.create(variant.id, priceSet.id)
    })

    it.only("Should values in a declared link", async () => {
      const api = useApi()! as AxiosInstance

      const response = await api.get(
        `/store/products/${productId}?cart_id=${cartId}`
      )

      expect(response.data.product.variants[0].prices).toEqual([
        {
          amount: 1000,
          currency_code: "eur",
          region_id: "region-1",
        },
        {
          amount: 900,
          currency_code: "usd",
          region_id: "region-2",
        },
      ])
    })
  })
})
