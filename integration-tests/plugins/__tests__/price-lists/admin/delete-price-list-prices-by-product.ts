import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import {
  simpleProductFactory,
  simpleRegionFactory,
} from "../../../../factories"

import { IPricingModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"
import { AxiosInstance } from "axios"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("DELETE /admin/price-lists/:id/products/:productId/batch", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let variant1
  let priceSet
  let priceListId
  let pricingModuleService: IPricingModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    pricingModuleService = appContainer.resolve("pricingModuleService")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    const api = useApi()! as AxiosInstance

    await adminSeeder(dbConnection)
    await createDefaultRuleTypes(appContainer)

    await simpleRegionFactory(dbConnection, {
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

    variant1 = product.variants[0]

    priceSet = await createVariantPriceSet({
      container: appContainer,
      variantId: variant1.id,
      prices: [
        {
          amount: 3000,
          currency_code: "usd",
        },
      ],
    })

    const data = {
      name: "test price list",
      description: "test",
      type: "override",
      customer_groups: [],
      status: "active",
      prices: [
        {
          amount: 400,
          variant_id: variant1.id,
          currency_code: "usd",
        },
      ],
    }

    const priceListResult = await api.post(
      `admin/price-lists`,
      data,
      adminHeaders
    )
    priceListId = priceListResult.data.price_list.id
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should delete prices in batch based on product ids", async () => {
    const api = useApi()! as AxiosInstance

    let priceSetMoneyAmounts =
      await pricingModuleService.listPriceSetMoneyAmounts({
        price_set_id: [priceSet.id],
      })
    expect(priceSetMoneyAmounts.length).toEqual(2)

    const deleteRes = await api.delete(
      `/admin/price-lists/${priceListId}/products/prices/batch`,
      {
        headers: adminHeaders.headers,
        data: {
          product_ids: [product.id],
        },
      }
    )
    expect(deleteRes.status).toEqual(200)

    priceSetMoneyAmounts = await pricingModuleService.listPriceSetMoneyAmounts({
      price_set_id: [priceSet.id],
    })

    expect(priceSetMoneyAmounts.length).toEqual(1)
    expect(priceSetMoneyAmounts).toEqual([
      expect.objectContaining({
        price_list: null,
      }),
    ])
  })

  it("should delete prices based on single product id", async () => {
    const api = useApi()! as AxiosInstance

    let priceSetMoneyAmounts =
      await pricingModuleService.listPriceSetMoneyAmounts({
        price_set_id: [priceSet.id],
      })
    expect(priceSetMoneyAmounts.length).toEqual(2)

    const deleteRes = await api.delete(
      `/admin/price-lists/${priceListId}/products/${product.id}/prices`,
      adminHeaders
    )
    expect(deleteRes.status).toEqual(200)

    priceSetMoneyAmounts = await pricingModuleService.listPriceSetMoneyAmounts({
      price_set_id: [priceSet.id],
    })

    expect(priceSetMoneyAmounts.length).toEqual(1)
    expect(priceSetMoneyAmounts).toEqual([
      expect.objectContaining({
        price_list: null,
      }),
    ])
  })
})
