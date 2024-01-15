import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import {
  simpleCustomerGroupFactory,
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
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("POST /admin/price-lists/:id", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let variant
  let variant2
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
      id: "customer-group-2",
      name: "Test Group 2",
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
        {
          options: [{ option_id: "test-product-option-2", value: "test 2" }],
        },
      ],
      options: [
        {
          id: "test-product-option-1",
          title: "Test option 1",
        },
        {
          id: "test-product-option-2",
          title: "Test option 2",
        },
      ],
    })

    variant = product.variants[0]
    variant2 = product.variants[1]
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should update price lists successfully with prices", async () => {
    const var2PriceSet = await createVariantPriceSet({
      container: appContainer,
      variantId: variant2.id,
      prices: [],
    })

    const [priceList] = await pricingModuleService.createPriceLists([
      {
        title: "test price list",
        description: "test",
        ends_at: new Date(),
        starts_at: new Date(),
        status: PriceListStatus.ACTIVE,
        type: PriceListType.OVERRIDE,
        prices: [
          {
            amount: 3000,
            currency_code: "usd",
            price_set_id: var2PriceSet.id,
          },
        ],
      },
    ])

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
      name: "new price list name",
      description: "new price list description",
      customer_groups: [{ id: "customer-group-2" }],
      prices: [
        {
          variant_id: variant.id,
          amount: 5000,
          currency_code: "usd",
        },
        {
          id: priceList?.price_set_money_amounts?.[0].money_amount?.id,
          amount: 6000,
          currency_code: "usd",
          variant_id: variant2.id,
        },
      ],
    }

    await api.post(`admin/price-lists/${priceList.id}`, data, adminHeaders)

    const response = await api.get(
      `/admin/price-lists/${priceList.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.price_list).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        name: "new price list name",
        description: "new price list description",
        type: "override",
        status: "active",
        starts_at: expect.any(String),
        ends_at: expect.any(String),
        customer_groups: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            name: "Test Group 2",
            metadata: null,
          },
        ],
        prices: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            currency_code: "usd",
            amount: 5000,
            min_quantity: null,
            max_quantity: null,
            price_list_id: priceList.id,
            region_id: null,
            variant: expect.objectContaining({
              id: variant.id,
            }),
            variant_id: variant.id,
          }),
          expect.objectContaining({
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            currency_code: "usd",
            amount: 6000,
            min_quantity: null,
            max_quantity: null,
            price_list_id: priceList.id,
            region_id: null,
            variant: expect.objectContaining({
              id: variant2.id,
            }),
            variant_id: variant2.id,
          }),
        ]),
      })
    )
  })

  it("should not delete customer groups if customer_groups is not passed as a param", async () => {
    await createVariantPriceSet({
      container: appContainer,
      variantId: variant2.id,
      prices: [],
    })

    const [priceList] = await pricingModuleService.createPriceLists([
      {
        title: "test price list",
        description: "test",
        status: PriceListStatus.DRAFT,
        rules: {
          customer_group_id: ["customer-group-2"],
        },
        prices: [],
      },
    ])

    await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [],
    })

    const api = useApi() as any
    const data = {
      status: PriceListStatus.ACTIVE,
    }

    await api.post(`admin/price-lists/${priceList.id}`, data, adminHeaders)

    const response = await api.get(
      `/admin/price-lists/${priceList.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.price_list).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        customer_groups: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            name: "Test Group 2",
            metadata: null,
          },
        ],
      })
    )
  })
})
