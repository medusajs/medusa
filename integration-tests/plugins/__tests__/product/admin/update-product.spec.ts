import {
  useApi,
  useExpressServer,
} from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { simpleProductFactory } from "../../../../factories"

import { Region } from "@medusajs/medusa"
import { AxiosInstance } from "axios"
import path from "path"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_ISOLATE_PRICING_DOMAIN: true,
  MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
}

describe.skip("[Product & Pricing Module] POST /admin/products/:id", () => {
  let dbConnection
  let appContainer
  let express
  let product
  let variant

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    await startBootstrapApp({ cwd })
    appContainer = getContainer()
    express = useExpressServer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
  })

  beforeEach(async () => {
    const manager = dbConnection.manager
    await adminSeeder(dbConnection)
    await createDefaultRuleTypes(appContainer)

    await manager.insert(Region, {
      id: "test-region",
      name: "Test Region",
      currency_code: "usd",
      tax_rate: 0,
    })

    product = await simpleProductFactory(dbConnection, {
      id: "test-product-with-variant",
      variants: [
        {
          options: [{ option_id: "test-product-option-1", value: "test" }],
        },
      ],
      options: [
        {
          id: "test-product-option-1",
          title: "Test option 1",
        },
      ],
    })

    variant = product.variants[0]
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should update product variant price sets and prices", async () => {
    const api = useApi()
    const data = {
      title: "test product update",
      variants: [
        {
          id: variant.id,
          title: "test variant update",
          prices: [
            {
              amount: 66600,
              region_id: "test-region",
            },
            {
              amount: 55500,
              currency_code: "usd",
              region_id: null,
            },
          ],
        },
      ],
    }

    let response = await api.post(
      `/admin/products/${product.id}`,
      data,
      adminHeaders
    )

    response = await api.get(`/admin/products/${product.id}`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: variant.id,
            title: "test variant update",
            prices: expect.arrayContaining([
              expect.objectContaining({
                amount: 66600,
                currency_code: "usd",
                region_id: "test-region",
              }),
              expect.objectContaining({
                amount: 55500,
                currency_code: "usd",
              }),
            ]),
          }),
        ]),
      })
    )
  })

  it("should update money amounts if money amount id is present in prices", async () => {
    const priceSet = await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [
        {
          amount: 3000,
          currency_code: "usd",
          rules: {},
        },
      ],
    })

    const moneyAmountToUpdate = priceSet.money_amounts?.[0]

    const api = useApi()
    const data = {
      title: "test product update",
      variants: [
        {
          id: variant.id,
          title: "test variant update",
          prices: [
            {
              amount: 66600,
              region_id: "test-region",
            },
            {
              id: moneyAmountToUpdate?.id,
              amount: 2222,
              currency_code: "usd",
              region_id: null,
            },
          ],
        },
      ],
    }

    let response = await api.post(
      `/admin/products/${product.id}`,
      data,
      adminHeaders
    )

    response = await api.get(`/admin/products/${product.id}`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: variant.id,
            title: "test variant update",
            prices: expect.arrayContaining([
              expect.objectContaining({
                amount: 66600,
                currency_code: "usd",
                region_id: "test-region",
              }),
              expect.objectContaining({
                id: moneyAmountToUpdate?.id,
                amount: 2222,
                currency_code: "usd",
              }),
            ]),
          }),
        ]),
      })
    )
  })

  it("should add prices if price set is already present", async () => {
    const remoteLink = appContainer.resolve("remoteLink")
    const pricingModuleService = appContainer.resolve("pricingModuleService")

    const priceSet = await pricingModuleService.create({
      rules: [{ rule_attribute: "region_id" }],
      prices: [],
    })

    await remoteLink.create({
      productService: {
        variant_id: variant.id,
      },
      pricingService: {
        price_set_id: priceSet.id,
      },
    })

    const api = useApi()! as AxiosInstance

    const data = {
      title: "test product update",
      variants: [
        {
          id: variant.id,
          title: "test variant update",
          prices: [
            {
              amount: 123,
              region_id: "test-region",
            },
            {
              amount: 456,
              currency_code: "usd",
              region_id: null,
            },
          ],
        },
      ],
    }

    let response = await api.post(
      `/admin/products/${product.id}`,
      data,
      adminHeaders
    )

    response = await api.get(`/admin/products/${product.id}`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: variant.id,
            title: "test variant update",
            prices: expect.arrayContaining([
              expect.objectContaining({
                amount: 123,
                currency_code: "usd",
                region_id: "test-region",
              }),
              expect.objectContaining({
                amount: 456,
                currency_code: "usd",
              }),
            ]),
          }),
        ]),
      })
    )
  })
})
