import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import adminSeeder from "../../../../helpers/admin-seeder"
import productSeeder from "../../../../helpers/product-seeder"

import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { MedusaV2Flag } from "@medusajs/utils"
import { AxiosInstance } from "axios"
import { getContainer } from "../../../../environment-helpers/use-container"
import {
  simpleProductFactory,
  simpleSalesChannelFactory,
} from "../../../../factories"
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

// TODO SEE to use new test runner medusaIntegrationTestRunner({
//   env,
//   testSuite: ({ dbConnection, getContainer, api }) => {})

describe.skip("/admin/products", () => {
  let dbConnection
  let shutdownServer
  let medusaContainer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env })
    shutdownServer = await startBootstrapApp({ cwd, env })
    medusaContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  it("Should have loaded the product module", function () {
    const productRegistrationName =
      ModulesDefinition[Modules.PRODUCT].registrationName
    expect(
      medusaContainer.hasRegistration(productRegistrationName)
    ).toBeTruthy()
  })

  it("Should have enabled workflows feature flag", function () {
    const flagRouter = medusaContainer.resolve("featureFlagRouter")

    const workflowsFlag = flagRouter.isFeatureEnabled(MedusaV2Flag.key)

    expect(workflowsFlag).toBe(true)
  })

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await createDefaultRuleTypes(medusaContainer)

      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should create a product", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "Test",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [
              {
                currency_code: "usd",
                amount: 100,
              },
              {
                currency_code: "eur",
                amount: 45,
              },
              {
                currency_code: "dkk",
                amount: 30,
              },
            ],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response?.status).toEqual(200)
      expect(response?.data.product).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^prod_*/),
          title: "Test",
          discountable: true,
          is_giftcard: false,
          handle: "test",
          status: "draft",
          created_at: expect.any(String),
          updated_at: expect.any(String),
          profile_id: expect.stringMatching(/^sp_*/),
          images: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              url: "test-image.png",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.any(String),
              url: "test-image-2.png",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          thumbnail: "test-image.png",
          tags: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              value: "123",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.any(String),
              value: "456",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          type: expect.objectContaining({
            value: "test-type",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          collection: expect.objectContaining({
            id: "test-collection",
            title: "Test collection",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          options: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^opt_*/),
              product_id: expect.stringMatching(/^prod_*/),
              title: "size",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.stringMatching(/^opt_*/),
              product_id: expect.stringMatching(/^prod_*/),
              title: "color",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^variant_*/),
              product_id: expect.stringMatching(/^prod_*/),
              updated_at: expect.any(String),
              created_at: expect.any(String),
              title: "Test variant",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "usd",
                  amount: 100,
                  // TODO: enable this in the Pricing Module PR
                  // created_at: expect.any(String),
                  // updated_at: expect.any(String),
                  // variant_id: expect.stringMatching(/^variant_*/),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "eur",
                  amount: 45,
                  // TODO: enable this in the Pricing Module PR
                  // created_at: expect.any(String),
                  // updated_at: expect.any(String),
                  // variant_id: expect.stringMatching(/^variant_*/),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "dkk",
                  amount: 30,
                  // TODO: enable this in the Pricing Module PR
                  // created_at: expect.any(String),
                  // updated_at: expect.any(String),
                  // variant_id: expect.stringMatching(/^variant_*/),
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "large",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                  option_id: expect.stringMatching(/^opt_*/),
                  id: expect.stringMatching(/^optval_*/),
                }),
                expect.objectContaining({
                  value: "green",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                  option_id: expect.stringMatching(/^opt_*/),
                  id: expect.stringMatching(/^optval_*/),
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("should create a product that is not discountable", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "Test",
        discountable: false,
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response?.status).toEqual(200)
      expect(response?.data.product).toEqual(
        expect.objectContaining({
          discountable: false,
        })
      )
    })

    it("should sets the variant ranks when creating a product", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "Test product - 1",
        description: "test-product-description 1",
        type: { value: "test-type 1" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant 1",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
          {
            title: "Test variant 2",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const creationResponse = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(creationResponse?.status).toEqual(200)

      const productId = creationResponse?.data.product.id

      const response = await api
        .get(`/admin/products/${productId}`, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response?.data.product).toEqual(
        expect.objectContaining({
          title: "Test product - 1",
          variants: [
            expect.objectContaining({
              title: "Test variant 1",
            }),
            expect.objectContaining({
              title: "Test variant 2",
            }),
          ],
        })
      )
    })

    it("should create a giftcard", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response?.status).toEqual(200)

      expect(response?.data.product).toEqual(
        expect.objectContaining({
          title: "Test Giftcard",
          discountable: false,
        })
      )
    })

    it("should create variants with inventory items", async () => {
      const api = useApi()! as AxiosInstance

      const response = await api.post(
        `/admin/products`,
        {
          title: "Test product - 1",
          description: "test-product-description 1",
          type: { value: "test-type 1" },
          images: ["test-image.png", "test-image-2.png"],
          collection_id: "test-collection",
          tags: [{ value: "123" }, { value: "456" }],
          options: [{ title: "size" }, { title: "color" }],
          variants: [
            {
              title: "Test variant 1",
              inventory_quantity: 10,
              prices: [{ currency_code: "usd", amount: 100 }],
              options: [{ value: "large" }, { value: "green" }],
            },
            {
              title: "Test variant 2",
              inventory_quantity: 10,
              prices: [{ currency_code: "usd", amount: 100 }],
              options: [{ value: "large" }, { value: "green" }],
            },
          ],
        },
        { headers: { "x-medusa-access-token": "test_token" } }
      )

      expect(response.status).toEqual(200)

      const variantIds = response.data.product.variants.map(
        (v: { id: string }) => v.id
      )

      const variantInventoryService = medusaContainer.resolve(
        "productVariantInventoryService"
      )
      const inventory = await variantInventoryService.listByVariant(variantIds)

      expect(inventory).toHaveLength(2)
      expect(inventory).toContainEqual(
        expect.objectContaining({
          variant_id: variantIds[0],
          required_quantity: 1,
        })
      )
      expect(inventory).toContainEqual(
        expect.objectContaining({
          variant_id: variantIds[1],
          required_quantity: 1,
        })
      )
    })
  })

  describe("POST /admin/products/:id", () => {
    const toUpdateWithSalesChannels = "to-update-with-sales-channels"
    const toUpdateWithVariants = "to-update-with-variants"
    const toUpdate = "to-update"

    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await createDefaultRuleTypes(medusaContainer)

      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })

      await simpleSalesChannelFactory(dbConnection, {
        name: "Channel 3",
        id: "channel-3",
        is_default: true,
      })

      await simpleProductFactory(dbConnection, {
        title: "To update product",
        id: toUpdate,
      })

      await simpleProductFactory(dbConnection, {
        title: "To update product with channels",
        id: toUpdateWithSalesChannels,
        sales_channels: [
          { name: "channel 1", id: "channel-1" },
          { name: "channel 2", id: "channel-2" },
        ],
      })

      await simpleSalesChannelFactory(dbConnection, {
        name: "To be added",
        id: "to-be-added",
      })

      await simpleProductFactory(dbConnection, {
        title: "To update product with variants",
        id: toUpdateWithVariants,
        variants: [
          {
            id: "variant-1",
            title: "Variant 1",
          },
          {
            id: "variant-2",
            title: "Variant 2",
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should do a basic product update", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "New title",
        description: "test-product-description",
      }

      const response = await api
        .post(`/admin/products/${toUpdate}`, payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response?.status).toEqual(200)
      expect(response?.data.product).toEqual(
        expect.objectContaining({
          id: toUpdate,
          title: "New title",
          description: "test-product-description",
        })
      )
    })

    it("should update product and also update a variant and create a variant", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "New title",
        description: "test-product-description",
        variants: [
          {
            id: "variant-1",
            title: "Variant 1 updated",
          },
          {
            title: "Variant 3",
          },
        ],
      }

      const response = await api
        .post(`/admin/products/${toUpdateWithVariants}`, payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response?.status).toEqual(200)
      expect(response?.data.product).toEqual(
        expect.objectContaining({
          id: toUpdateWithVariants,
          title: "New title",
          description: "test-product-description",
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: "variant-1",
              title: "Variant 1 updated",
            }),
            expect.objectContaining({
              title: "Variant 3",
            }),
          ]),
        })
      )
    })

    it("should update product's sales channels", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "New title",
        description: "test-product-description",
        sales_channels: [{ id: "channel-2" }, { id: "channel-3" }],
      }

      const response = await api
        .post(
          `/admin/products/${toUpdateWithSalesChannels}?expand=sales_channels`,
          payload,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response?.status).toEqual(200)
      expect(response?.data.product).toEqual(
        expect.objectContaining({
          id: toUpdateWithSalesChannels,
          sales_channels: [
            expect.objectContaining({ id: "channel-2" }),
            expect.objectContaining({ id: "channel-3" }),
          ],
        })
      )
    })

    it("should update inventory when variants are updated", async () => {
      const api = useApi()! as AxiosInstance

      const variantInventoryService = medusaContainer.resolve(
        "productVariantInventoryService"
      )

      const payload = {
        title: "New title",
        description: "test-product-description",
        variants: [
          {
            id: "variant-1",
            title: "Variant 1 updated",
          },
          {
            title: "Variant 3",
          },
        ],
      }

      const response = await api
        .post(`/admin/products/${toUpdateWithVariants}`, payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      let inventory = await variantInventoryService.listInventoryItemsByVariant(
        "variant-2"
      )

      expect(response?.status).toEqual(200)
      expect(response?.data.product).toEqual(
        expect.objectContaining({
          id: toUpdateWithVariants,
          title: "New title",
          description: "test-product-description",
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: "variant-1",
              title: "Variant 1 updated",
            }),
            expect.objectContaining({
              title: "Variant 3",
            }),
          ]),
        })
      )

      expect(inventory).toEqual([]) // no inventory items for removed variant

      inventory = await variantInventoryService.listInventoryItemsByVariant(
        response?.data.product.variants.find((v) => v.title === "Variant 3").id
      )

      expect(inventory).toEqual([
        expect.objectContaining({ id: expect.any(String) }),
      ])
    })
  })
})
