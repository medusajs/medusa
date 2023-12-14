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

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("DELETE /admin/price-lists/:id", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let variant
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

    variant = product.variants[0]
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should delete price list prices by money amount ids", async () => {
    await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [
        {
          amount: 3000,
          currency_code: "usd",
        },
      ],
    })

    const api = useApi() as any
    const data = {
      name: "test price list",
      description: "test",
      type: "override",
      status: "active",
      prices: [
        {
          amount: 400,
          variant_id: variant.id,
          currency_code: "usd",
        },
        {
          amount: 4000,
          variant_id: variant.id,
          currency_code: "usd",
        },
      ],
    }

    const res = await api.post(`admin/price-lists`, data, adminHeaders)

    const priceListId = res.data.price_list.id
    let psmas = await pricingModuleService.listPriceSetMoneyAmounts(
      {
        price_list_id: [priceListId],
      },
      { relations: ["money_amount"] }
    )

    expect(psmas.length).toEqual(2)

    const deletePrice = psmas[0].money_amount
    const deleteRes = await api.delete(
      `/admin/price-lists/${priceListId}/prices/batch`,
      {
        data: {
          price_ids: [deletePrice?.id],
        },
        ...adminHeaders,
      }
    )
    expect(deleteRes.status).toEqual(200)

    psmas = await pricingModuleService.listPriceSetMoneyAmounts({
      price_list_id: [priceListId],
    })
    expect(psmas.length).toEqual(1)
  })
})
