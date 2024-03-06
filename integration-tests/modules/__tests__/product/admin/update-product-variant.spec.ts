import {initDb, useDb} from "../../../../environment-helpers/use-db"
import {simpleProductFactory, simpleRegionFactory,} from "../../../../factories"

import {AxiosInstance} from "axios"
import adminSeeder from "../../../../helpers/admin-seeder"
import {
  createDefaultRuleTypes
} from "../../../helpers/create-default-rule-types"
import {createVariantPriceSet} from "../../../helpers/create-variant-price-set"
import {getContainer} from "../../../../environment-helpers/use-container"
import path from "path"
import {startBootstrapApp} from "../../../../environment-helpers/bootstrap-app"
import {useApi} from "../../../../environment-helpers/use-api"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

// TODO SEE to use new test runner medusaIntegrationTestRunner({
//   env,
//   testSuite: ({ dbConnection, getContainer, api }) => {})

describe.skip("POST /admin/products/:id/variants/:id", () => {
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
        {
          options: [{ option_id: "test-product-option-1", value: "test 2" }],
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

  it("should create product variant price sets and prices", async () => {
    const api = useApi()! as AxiosInstance
    const data = {
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
    }

    let response = await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
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
        },
      ],
    })

    const moneyAmountToUpdate = priceSet.money_amounts?.[0]

    const api = useApi()! as AxiosInstance
    const data = {
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
    }

    let response = await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
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
    await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [],
    })

    const api = useApi()! as AxiosInstance
    const data = {
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
    }

    let response = await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
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

  it("should update variant option value", async () => {
    const api = useApi()! as AxiosInstance

    const data = {
      options: [
        {
          option_id: "test-product-option-1",
          value: "updated",
        },
      ],
    }

    await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
      data,
      adminHeaders
    )

    const response = await api.get(
      `/admin/products/${product.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: variant.id,
            options: [
              expect.objectContaining({
                option_id: "test-product-option-1",
                value: "updated",
              }),
            ],
          }),
          expect.objectContaining({
            id: product.variants[1].id,
            options: [
              expect.objectContaining({
                option_id: "test-product-option-1",
                value: "test 2",
              }),
            ],
          }),
        ]),
      })
    )
  })

  it("should update variant metadata", async () => {
    const api = useApi()! as AxiosInstance

    const data = {
      metadata: {
        test: "string",
      },
    }

    await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
      data,
      adminHeaders
    )

    const response = await api.get(
      `/admin/products/${product.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: variant.id,
            metadata: {
              test: "string",
            },
          }),
        ]),
      })
    )
  })

  it("should remove options not present in update", async () => {
    const api = useApi()! as AxiosInstance

    product = await simpleProductFactory(dbConnection, {
      id: "test-product-with-multiple-options",
      variants: [
        {
          options: [
            { option_id: "test-product-multi-option-1", value: "test" },
            { option_id: "test-product-multi-option-2", value: "test value" },
          ],
        },
      ],
      options: [
        {
          id: "test-product-multi-option-1",
          title: "Test option 1",
        },
        {
          id: "test-product-multi-option-2",
          title: "Test option 2",
        },
      ],
    })

    variant = product.variants[0]

    const data = {
      options: [
        {
          option_id: "test-product-multi-option-1",
          value: "updated",
        },
      ],
    }

    await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
      data,
      adminHeaders
    )

    const response = await api.get(
      `/admin/products/${product.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: [
          expect.objectContaining({
            id: variant.id,
            options: [
              expect.objectContaining({
                option_id: "test-product-multi-option-1",
                value: "updated",
              }),
            ],
          }),
        ],
      })
    )
  })

  it("should update several options in the same api call", async () => {
    const api = useApi()! as AxiosInstance

    product = await simpleProductFactory(dbConnection, {
      id: "test-product-with-multiple-options",
      variants: [
        {
          options: [
            { option_id: "test-product-multi-option-1", value: "test" },
            { option_id: "test-product-multi-option-2", value: "test value" },
          ],
        },
      ],
      options: [
        {
          id: "test-product-multi-option-1",
          title: "Test option 1",
        },
        {
          id: "test-product-multi-option-2",
          title: "Test option 2",
        },
      ],
    })

    variant = product.variants[0]

    const data = {
      options: [
        {
          option_id: "test-product-multi-option-1",
          value: "updated",
        },
        {
          option_id: "test-product-multi-option-2",
          value: "updated 2",
        },
      ],
    }

    await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
      data,
      adminHeaders
    )

    const response = await api.get(
      `/admin/products/${product.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: [
          expect.objectContaining({
            id: variant.id,
            options: [
              expect.objectContaining({
                option_id: "test-product-multi-option-1",
                value: "updated",
              }),
              expect.objectContaining({
                option_id: "test-product-multi-option-2",
                value: "updated 2",
              }),
            ],
          }),
        ],
      })
    )
  })
})
