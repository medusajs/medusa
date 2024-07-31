import { IEventBusModuleService } from "@medusajs/types"
import { TestEventUtils, medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import FormData from "form-data"
import fs from "fs/promises"
import path from "path"
import { ModuleRegistrationName } from "@medusajs/utils"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

const getUploadReq = (file: { name: string; content: string }) => {
  const form = new FormData()
  form.append("file", Buffer.from(file.content), file.name)
  return {
    form,
    meta: {
      headers: {
        ...adminHeaders.headers,
        ...form.getHeaders(),
      },
    },
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseCollection
    let baseType
    let baseProduct

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(ModuleRegistrationName.EVENT_BUS)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "base-collection" },
          adminHeaders
        )
      ).data.collection

      baseType = (
        await api.post(
          "/admin/product-types",
          { value: "test-type" },
          adminHeaders
        )
      ).data.product_type

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
          }),
          adminHeaders
        )
      ).data.product
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/products/export", () => {
      it("should import a previously exported products CSV file", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          "notification.notification.created",
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "exported-products.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(
          /prod_01J3CRPNVGRZ01A8GH8FQYK10Z/g,
          baseProduct.id
        )
        fileContent = fileContent.replace(
          /variant_01J3CRPNW5J6EBVVQP1TN33A58/g,
          baseProduct.variants[0].id
        )
        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/import). The payload and response changed as well.
        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 1,
          toUpdate: 1,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product import",
              description: `Product import of file test.csv completed successfully!`,
            }),
          })
        )

        const dbProducts = (await api.get("/admin/products", adminHeaders)).data
          .products

        expect(dbProducts).toHaveLength(2)
        expect(dbProducts).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: baseProduct.id,
              handle: "base-product",
              is_giftcard: false,
              thumbnail: "test-image.png",
              status: "draft",
              description: "test-product-description\ntest line 2",
              options: [
                expect.objectContaining({
                  title: "size",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "small",
                    }),
                    expect.objectContaining({
                      value: "large",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "color",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
              ],
              images: expect.arrayContaining([
                expect.objectContaining({
                  url: "test-image.png",
                }),
                expect.objectContaining({
                  url: "test-image-2.png",
                }),
              ]),
              tags: [
                expect.objectContaining({
                  value: "123",
                }),
                expect.objectContaining({
                  value: "456",
                }),
              ],
              type: expect.objectContaining({
                id: baseType.id,
              }),
              collection: expect.objectContaining({
                id: baseCollection.id,
              }),
              variants: [
                expect.objectContaining({
                  title: "Test variant",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: [
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 100,
                    }),
                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 45,
                    }),
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 30,
                    }),
                  ],
                  options: [
                    expect.objectContaining({
                      value: "large",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ],
                }),
                expect.objectContaining({
                  title: "Test variant 2",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: [
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 200,
                    }),
                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 65,
                    }),
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 50,
                    }),
                  ],
                  options: [
                    expect.objectContaining({
                      value: "small",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ],
                }),
              ],
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.any(String),
              handle: "proposed-product",
              is_giftcard: false,
              thumbnail: "test-image.png",
              status: "proposed",
              description: "test-product-description",
              options: [
                expect.objectContaining({
                  title: "size",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "large",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "color",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
              ],
              images: expect.arrayContaining([
                expect.objectContaining({
                  url: "test-image.png",
                }),
                expect.objectContaining({
                  url: "test-image-2.png",
                }),
              ]),
              tags: [
                expect.objectContaining({
                  value: "new-tag",
                }),
              ],
              type: expect.objectContaining({
                id: baseType.id,
              }),
              collection: null,
              variants: [
                expect.objectContaining({
                  title: "Test variant",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: [
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 100,
                    }),
                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 45,
                    }),
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 30,
                    }),
                  ],
                  options: [
                    expect.objectContaining({
                      value: "large",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ],
                }),
              ],
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ])
        )
      })

      it("should fail on invalid region in prices being present in the CSV", async () => {
        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "invalid-prices.csv"),
          { encoding: "utf-8" }
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const err = await api
          .post("/admin/products/import", form, meta)
          .catch((e) => e)
        expect(err.response.data.message).toEqual(
          "Region with ID reg_nonexistent not found"
        )
      })

      it("should ignore non-existent fields being present in the CSV that don't start with Product or Variant", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          "notification.notification.created",
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "unrelated-column.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 1,
          toUpdate: 0,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product import",
              description: `Product import of file test.csv completed successfully!`,
            }),
          })
        )
      })

      it("should fail on non-existent product fields being present in the CSV", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          "notification.notification.created",
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "invalid-column.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 1,
          toUpdate: 0,
        })

        await api
          .post(`/admin/products/import/${transactionId}/confirm`, {}, meta)
          // TODO: Currently the `setStepSuccess` waits for the whole workflow to finish before returning.
          .catch((e) => e)

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product import",
              description: `Failed to import products from file test.csv`,
            }),
          })
        )
      })
    })
  },
})
