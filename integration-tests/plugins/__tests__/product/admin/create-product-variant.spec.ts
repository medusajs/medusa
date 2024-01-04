import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import {
  simpleProductFactory,
  simpleRegionFactory,
} from "../../../../factories"

import { PricingModuleService } from "@medusajs/pricing"
import { ProductModuleService } from "@medusajs/product"
import { AxiosInstance } from "axios"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("POST /admin/products/:id/variants", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let variant

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
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

  it("should create a product variant with its price sets and prices through the workflow", async () => {
    const api = useApi()! as AxiosInstance
    const data = {
      title: "test variant create",
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
      material: "boo",
      mid_code: "234asdfadsf",
      hs_code: "asdfasdf234",
      origin_country: "DE",
      sku: "asdf",
      ean: "234",
      upc: "234",
      barcode: "asdf",
      inventory_quantity: 234,
      manage_inventory: true,
      allow_backorder: true,
      weight: 234,
      width: 234,
      height: 234,
      length: 234,
      metadata: { asdf: "asdf" },
      options: [{ option_id: "test-product-option-1", value: "test option" }],
    }

    let response = await api.post(
      `/admin/products/${product.id}/variants`,
      data,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "test variant create",
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

  it("should compensate creating product variants when error throws in future step", async () => {
    jest
      .spyOn(PricingModuleService.prototype, "create")
      .mockImplementation(() => {
        throw new Error("Random Error")
      })

    const productSpy = jest.spyOn(
      ProductModuleService.prototype,
      "deleteVariants"
    )

    const api = useApi()! as AxiosInstance
    const data = {
      title: "test variant create",
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
      material: "boo",
      mid_code: "234asdfadsf",
      hs_code: "asdfasdf234",
      origin_country: "DE",
      sku: "asdf",
      ean: "234",
      upc: "234",
      barcode: "asdf",
      inventory_quantity: 234,
      manage_inventory: true,
      allow_backorder: true,
      weight: 234,
      width: 234,
      height: 234,
      length: 234,
      metadata: { asdf: "asdf" },
      options: [{ option_id: "test-product-option-1", value: "test option" }],
    }

    await api
      .post(`/admin/products/${product.id}/variants`, data, adminHeaders)
      .catch((e) => e)

    expect(productSpy).toBeCalledWith([expect.any(String)])

    const getProductResponse = await api.get(
      `/admin/products/${product.id}`,
      adminHeaders
    )
    expect(getProductResponse.data.product.variants).toHaveLength(1)
  })
})
