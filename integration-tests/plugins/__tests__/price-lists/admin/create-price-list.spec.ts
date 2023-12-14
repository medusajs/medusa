import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import {
  simpleCustomerGroupFactory,
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

describe("POST /admin/price-lists", () => {
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
    await simpleCustomerGroupFactory(dbConnection, {
      id: "customer-group-1",
      name: "Test Group",
    })

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

  it("should create price list and money amounts", async () => {
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
      customer_groups: [{ id: "customer-group-1" }],
      status: "active",
      prices: [
        {
          amount: 400,
          variant_id: variant.id,
          currency_code: "usd",
        },
      ],
    }

    const result = await api.post(`admin/price-lists`, data, adminHeaders)

    let response = await api.get(
      `/admin/price-lists/${result.data.price_list.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.price_list).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        name: "test price list",
        description: "test",
        type: "override",
        status: "active",
        starts_at: null,
        ends_at: null,
        customer_groups: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            name: "Test Group",
            metadata: null,
          },
        ],
        prices: [
          expect.objectContaining({
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            currency_code: "usd",
            amount: 400,
            min_quantity: null,
            max_quantity: null,
            price_list_id: expect.any(String),
            region_id: null,
            variant: expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              title: expect.any(String),
              product_id: expect.any(String),
              sku: null,
              barcode: null,
              ean: null,
              upc: null,
              variant_rank: 0,
              inventory_quantity: 10,
              allow_backorder: false,
              manage_inventory: true,
              hs_code: null,
              origin_country: null,
              mid_code: null,
              material: null,
              weight: null,
              length: null,
              height: null,
              width: null,
              metadata: null,
            }),
            variant_id: expect.any(String),
          }),
        ],
      })
    )
  })
})
