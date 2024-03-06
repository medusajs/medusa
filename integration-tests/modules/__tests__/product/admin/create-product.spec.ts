import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import productSeeder from "../../../../helpers/product-seeder"

import { AxiosInstance } from "axios"
import { getContainer } from "../../../../environment-helpers/use-container"
import {
  simpleProductFactory,
  simpleSalesChannelFactory,
} from "../../../../factories"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("/admin/products", () => {
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

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders)

      // await productSeeder(dbConnection)
      // await createDefaultRuleTypes(medusaContainer)
      // await simpleSalesChannelFactory(dbConnection, {
      //   name: "Default channel",
      //   id: "default-channel",
      //   is_default: true,
      // })
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
        // type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        // collection_id: "test-collection",
        // tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            // prices: [
            //   {
            //     currency_code: "usd",
            //     amount: 100,
            //   },
            //   {
            //     currency_code: "eur",
            //     amount: 45,
            //   },
            //   {
            //     currency_code: "dkk",
            //     amount: 30,
            //   },
            // ],
            // options: [{ value: "large" }, { value: "green" }],
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
          // profile_id: expect.stringMatching(/^sp_*/),
          thumbnail: "test-image.png",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )

      expect(response?.data.product.images).toEqual(
        expect.arrayContaining([
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
        ])
      )

      console.log(response?.data.product)

      expect(response?.data.product.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringMatching(/^variant_*/),
            title: "Test variant",
            // product_id: expect.stringMatching(/^prod_*/),
            updated_at: expect.any(String),
            created_at: expect.any(String),
            // prices: expect.arrayContaining([
            //   expect.objectContaining({
            //     id: expect.stringMatching(/^ma_*/),
            //     currency_code: "usd",
            //     amount: 100,
            //     // TODO: enable this in the Pricing Module PR
            //     // created_at: expect.any(String),
            //     // updated_at: expect.any(String),
            //     // variant_id: expect.stringMatching(/^variant_*/),
            //   }),
            //   expect.objectContaining({
            //     id: expect.stringMatching(/^ma_*/),
            //     currency_code: "eur",
            //     amount: 45,
            //     // TODO: enable this in the Pricing Module PR
            //     // created_at: expect.any(String),
            //     // updated_at: expect.any(String),
            //     // variant_id: expect.stringMatching(/^variant_*/),
            //   }),
            //   expect.objectContaining({
            //     id: expect.stringMatching(/^ma_*/),
            //     currency_code: "dkk",
            //     amount: 30,
            //     // TODO: enable this in the Pricing Module PR
            //     // created_at: expect.any(String),
            //     // updated_at: expect.any(String),
            //     // variant_id: expect.stringMatching(/^variant_*/),
            //   }),
            // ]),
            // options: expect.arrayContaining([
            //   expect.objectContaining({
            //     value: "large",
            //     created_at: expect.any(String),
            //     updated_at: expect.any(String),
            //     variant_id: expect.stringMatching(/^variant_*/),
            //     option_id: expect.stringMatching(/^opt_*/),
            //     id: expect.stringMatching(/^optval_*/),
            //   }),
            //   expect.objectContaining({
            //     value: "green",
            //     created_at: expect.any(String),
            //     updated_at: expect.any(String),
            //     variant_id: expect.stringMatching(/^variant_*/),
            //     option_id: expect.stringMatching(/^opt_*/),
            //     id: expect.stringMatching(/^optval_*/),
            //   }),
            // ]),
          }),
        ])
      )

      expect(response?.data.product.options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringMatching(/^opt_*/),
            // product_id: expect.stringMatching(/^prod_*/),
            title: "size",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.stringMatching(/^opt_*/),
            // product_id: expect.stringMatching(/^prod_*/),
            title: "color",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      )

      // tags: expect.arrayContaining([
      //   expect.objectContaining({
      //     id: expect.any(String),
      //     value: "123",
      //     created_at: expect.any(String),
      //     updated_at: expect.any(String),
      //   }),
      //   expect.objectContaining({
      //     id: expect.any(String),
      //     value: "456",
      //     created_at: expect.any(String),
      //     updated_at: expect.any(String),
      //   }),
      // ]),
      // type: expect.objectContaining({
      //   value: "test-type",
      //   created_at: expect.any(String),
      //   updated_at: expect.any(String),
      // }),
      // collection: expect.objectContaining({
      //   id: "test-collection",
      //   title: "Test collection",
      //   created_at: expect.any(String),
      //   updated_at: expect.any(String),
      // }),
    })

    it("should create a product that is not discountable", async () => {
      const api = useApi()! as AxiosInstance

      const payload = {
        title: "Test",
        discountable: false,
        description: "test-product-description",
        // type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        // collection_id: "test-collection",
        // tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            // prices: [{ currency_code: "usd", amount: 100 }],
            // options: [{ value: "large" }, { value: "green" }],
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
        // type: { value: "test-type 1" },
        images: ["test-image.png", "test-image-2.png"],
        // collection_id: "test-collection",
        // tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant 1",
            inventory_quantity: 10,
            // prices: [{ currency_code: "usd", amount: 100 }],
            // options: [{ value: "large" }, { value: "green" }],
          },
          {
            title: "Test variant 2",
            inventory_quantity: 10,
            // prices: [{ currency_code: "usd", amount: 100 }],
            // options: [{ value: "large" }, { value: "green" }],
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
        .get(
          `/admin/products/${productId}?fields=title,variants.title`,
          adminHeaders
        )
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
            // prices: [{ currency_code: "usd", amount: 100 }],
            // options: [{ value: "100" }],
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
          // type: { value: "test-type 1" },
          images: ["test-image.png", "test-image-2.png"],
          // collection_id: "test-collection",
          // tags: [{ value: "123" }, { value: "456" }],
          options: [{ title: "size" }, { title: "color" }],
          variants: [
            {
              title: "Test variant 1",
              inventory_quantity: 10,
              // prices: [{ currency_code: "usd", amount: 100 }],
              // options: [{ value: "large" }, { value: "green" }],
            },
            {
              title: "Test variant 2",
              inventory_quantity: 10,
              // prices: [{ currency_code: "usd", amount: 100 }],
              // options: [{ value: "large" }, { value: "green" }],
            },
          ],
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)

      // const variantIds = response.data.product.variants.map(
      //   (v: { id: string }) => v.id
      // )

      // const variantInventoryService = medusaContainer.resolve(
      //   "productVariantInventoryService"
      // )
      // const inventory = await variantInventoryService.listByVariant(variantIds)

      // expect(inventory).toHaveLength(2)
      // expect(inventory).toContainEqual(
      //   expect.objectContaining({
      //     variant_id: variantIds[0],
      //     required_quantity: 1,
      //   })
      // )
      // expect(inventory).toContainEqual(
      //   expect.objectContaining({
      //     variant_id: variantIds[1],
      //     required_quantity: 1,
      //   })
      // )
    })

    // it("should create prices with region_id and currency_code context", async () => {
    //   const api = useApi()! as AxiosInstance

    //   const data = {
    //     title: "test product",
    //     options: [{ title: "test-option" }],
    //     variants: [
    //       {
    //         title: "test variant",
    //         prices: [
    //           {
    //             amount: 66600,
    //             region_id: "test-region",
    //           },
    //           {
    //             amount: 55500,
    //             currency_code: "usd",
    //           },
    //         ],
    //         options: [{ value: "test-option" }],
    //       },
    //     ],
    //   }

    //   let response = await api.post(
    //     "/admin/products?relations=variants.prices",
    //     data,
    //     adminHeaders
    //   )

    //   expect(response.status).toEqual(200)
    //   expect(response.data).toEqual({
    //     product: expect.objectContaining({
    //       id: expect.any(String),
    //       title: "test product",
    //       variants: expect.arrayContaining([
    //         expect.objectContaining({
    //           id: expect.any(String),
    //           title: "test variant",
    //           prices: expect.arrayContaining([
    //             expect.objectContaining({
    //               amount: 66600,
    //               currency_code: "usd",
    //             }),
    //             expect.objectContaining({
    //               amount: 55500,
    //               currency_code: "usd",
    //             }),
    //           ]),
    //         }),
    //       ]),
    //     }),
    //   })

    //   const pricingModuleService: IPricingModuleService = appContainer.resolve(
    //     "pricingModuleService"
    //   )

    //   const [_, count] = await pricingModuleService.listAndCount()
    //   expect(count).toEqual(1)
    // })
  })
})
