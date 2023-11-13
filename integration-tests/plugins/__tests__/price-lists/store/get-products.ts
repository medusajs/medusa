import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import {
  simpleProductFactory,
  simpleRegionFactory,
} from "../../../../factories"

import {
  IPricingModuleService,
  PriceListStatus,
  PriceListType,
} from "@medusajs/types"
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
  MEDUSA_FF_ISOLATE_PRICING_DOMAIN: true,
  MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
}

describe("[Product & Pricing Module] POST /admin/price-lists", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let variant
  let priceSetId
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
      status: "published",
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

    const priceSet = await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [
        {
          amount: 3000,
          currency_code: "usd",
          rules: {},
        },
        {
          amount: 4000,
          currency_code: "usd",
          rules: {},
        },
      ],
      rules: [],
    })

    priceSetId = priceSet.id
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should list product and prices from price-list", async () => {
    const [{ id: priceListId }] = await pricingModuleService.createPriceLists([
      {
        title: "test price list",
        description: "test",
        status: PriceListStatus.ACTIVE,
        type: PriceListType.SALE,
        prices: [
          {
            amount: 2500,
            currency_code: "usd",
            price_set_id: priceSetId,
          },
        ],
      },
    ])

    const api = useApi() as any

    let response = await api.get(
      `/store/products/${product.id}?currency_code=usd`
    )

    expect(response.status).toEqual(200)
    expect(response.data.product.variants[0].prices).toHaveLength(2)
    expect(response.data.product.variants[0].prices).toEqual([
      expect.objectContaining({
        currency_code: "usd",
        amount: 2500,
        min_quantity: null,
        max_quantity: null,
        price_list_id: priceListId,
      }),
      expect.objectContaining({
        currency_code: "usd",
        amount: 3000,
        min_quantity: null,
        max_quantity: null,
        price_list_id: null,
      }),
    ])
    expect(response.data.product.variants[0]).toEqual(
      expect.objectContaining({
        original_price: 3000,
        calculated_price: 2500,
        calculated_price_type: "sale",
      })
    )
  })
})
