import path from "path"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { setPort, useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import adminSeeder from "../../../../helpers/admin-seeder"
import productSeeder from "../../../../helpers/product-seeder"

import { simpleSalesChannelFactory } from "../../../../factories"
import { AxiosInstance } from "axios"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/products", () => {
  let medusaProcess
  let dbConnection
  let express
  let medusaContainer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd } as any)
    const { app, port, container } = await bootstrapApp({ cwd })
    medusaContainer = container

    setPort(port)
    express = app.listen(port, () => {
      process.send?.(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  it("Should have loaded the product module", function () {
    const productRegistrationName =
      ModulesDefinition[Modules.PRODUCT].registrationName
    expect(
      medusaContainer.hasRegistration(productRegistrationName)
    ).toBeTruthy()
  })

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)

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
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "eur",
                  amount: 45,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "dkk",
                  amount: 30,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
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
  })
})
