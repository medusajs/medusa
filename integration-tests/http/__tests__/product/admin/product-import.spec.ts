import { csv2json, json2csv } from "json-2-csv"
import {
  medusaIntegrationTestRunner,
  TestEventUtils,
} from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import { CommonEvents, Modules } from "@medusajs/utils"
import FormData from "form-data"
import fs from "fs/promises"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

const UNALLOWED_EXPORTED_COLUMNS = [
  "Product Is Giftcard",
  "Product Created At",
  "Product Updated At",
  "Product Deleted At",
  "Variant Product Id",
  "Variant Created At",
  "Variant Updated At",
  "Variant Deleted At",
]

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

function prepareCSVForImport(fileContents: string, delimiter: string = ",") {
  const CSVFileAsJSON = csv2json(fileContents, {
    delimiter: { field: delimiter },
  })
  CSVFileAsJSON.forEach((row) => {
    UNALLOWED_EXPORTED_COLUMNS.forEach((col) => {
      delete row[col]
    })
  })

  return json2csv(CSVFileAsJSON)
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let baseCollection
    let baseType
    let baseProduct
    let baseRegion
    let baseCategory
    let baseTag1
    let baseTag2
    let baseTag3
    let newTag
    let shippingProfile

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
    })

    beforeAll(async () => {
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

      baseTag1 = (
        await api.post(
          "/admin/product-tags",
          { value: "tag-123" },
          adminHeaders
        )
      ).data.product_tag

      baseTag2 = (
        await api.post(
          "/admin/product-tags",
          { value: "tag-123_1" },
          adminHeaders
        )
      ).data.product_tag

      baseTag3 = (
        await api.post(
          "/admin/product-tags",
          { value: "tag-456" },
          adminHeaders
        )
      ).data.product_tag

      newTag = (
        await api.post(
          "/admin/product-tags",
          { value: "new-tag" },
          adminHeaders
        )
      ).data.product_tag

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
            tags: [{ id: baseTag1.id }, { id: baseTag2.id }],
            shipping_profile_id: shippingProfile.id,
          }),
          adminHeaders
        )
      ).data.product

      baseRegion = (
        await api.post(
          "/admin/regions",
          {
            name: "Test region",
            currency_code: "USD",
          },
          adminHeaders
        )
      ).data.region

      baseCategory = (
        await api.post(
          "/admin/product-categories",
          { name: "Test", is_internal: false, is_active: true },
          adminHeaders
        )
      ).data.product_category

      await dbUtils.snapshot()
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/products/import", () => {
      // We want to ensure files with different delimiters are supported
      ;[
        {
          file: "products-comma.csv",
          name: "delimited with comma",
          delimiter: ",",
        },
        {
          file: "products-semicolon.csv",
          name: "delimited with semicolon",
          delimiter: ";",
        },
      ].forEach((testcase) => {
        it(`should import a previously exported products CSV file ${testcase.name}`, async () => {
          const subscriberExecution = TestEventUtils.waitSubscribersExecution(
            `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
            eventBus
          )

          let fileContent = await fs.readFile(
            path.join(__dirname, "__fixtures__", testcase.file),
            { encoding: "utf-8" }
          )

          fileContent = fileContent.replace(
            /prod_01J44RRJZ3M5F63NY82434RNM5/g,
            baseProduct.id
          )
          fileContent = fileContent.replace(
            /variant_01J44RRJZW1T9KQB6XG7Q6K61F/g,
            baseProduct.variants[0].id
          )

          fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
          fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)
          fileContent = fileContent.replace(/tag-123/g, baseTag1.id)
          fileContent = fileContent.replace(/tag-456/g, baseTag3.id)
          fileContent = fileContent.replace(/new-tag/g, newTag.id)

          fileContent = fileContent.replace(
            /import-shipping-profile*/g,
            shippingProfile.id
          )

          const { form, meta } = getUploadReq({
            name: "test.csv",
            content: prepareCSVForImport(fileContent, testcase.delimiter),
          })

          // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/import). The payload and response changed as well.
          const batchJobRes = await api.post(
            "/admin/products/import",
            form,
            meta
          )

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

          const dbProducts = (await api.get("/admin/products", adminHeaders))
            .data.products

          expect(dbProducts).toHaveLength(2)
          expect(dbProducts[0]).toEqual(
            expect.objectContaining({
              id: baseProduct.id,
              handle: "base-product",
              is_giftcard: false,
              thumbnail: "test-image.png",
              status: "draft",
              description: "test-product-description\ntest line 2",
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "size",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "large",
                    }),
                    expect.objectContaining({
                      value: "small",
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
              ]),
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
                  id: baseTag1.id,
                }),
                expect.objectContaining({
                  id: baseTag3.id,
                }),
              ],
              type: expect.objectContaining({
                id: baseType.id,
              }),
              collection: expect.objectContaining({
                id: baseCollection.id,
              }),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "Test variant",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 30,
                    }),
                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 45,
                    }),
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 100,
                    }),
                  ]),
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      value: "large",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "Test variant 2",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 50,
                    }),
                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 65,
                    }),
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 200,
                    }),
                  ]),
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      value: "small",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
              ]),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )

          expect(dbProducts[1]).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              handle: "proposed-product",
              is_giftcard: false,
              thumbnail: "test-image.png",
              status: "proposed",
              description: "test-product-description",
              options: expect.arrayContaining([
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
              ]),
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
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "Test variant",
                  allow_backorder: false,
                  manage_inventory: true,
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      currency_code: "dkk",
                      amount: 30,
                    }),
                    expect.objectContaining({
                      currency_code: "eur",
                      amount: 45,
                    }),
                    expect.objectContaining({
                      currency_code: "usd",
                      amount: 100,
                    }),
                  ]),
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      value: "large",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
              ]),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })
      })

      it("should import product with categories", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "product-with-categories.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/prod_\w*\d*/g, baseProduct.id)
        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)
        fileContent = fileContent.replace(/pcat_\w*\d*/g, baseCategory.id)
        fileContent = fileContent.replace(/tag-123/g, baseTag1.id)
        fileContent = fileContent.replace(/tag-456/g, baseTag3.id)
        fileContent = fileContent.replace(/new-tag/g, newTag.id)

        fileContent = fileContent.replace(
          /import-shipping-profile*/g,
          shippingProfile.id
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: prepareCSVForImport(fileContent),
        })

        const batchJobRes = await api.post("/admin/products/import", form, meta)

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()
        expect(batchJobRes.data.summary).toEqual({
          toCreate: 0,
          toUpdate: 1,
        })

        await api.post(
          `/admin/products/import/${transactionId}/confirm`,
          {},
          meta
        )

        await subscriberExecution
        const dbProducts = (
          await api.get("/admin/products?fields=*categories", adminHeaders)
        ).data.products

        expect(dbProducts).toHaveLength(1)
        expect(dbProducts[0]).toEqual(
          expect.objectContaining({
            id: baseProduct.id,
            categories: [expect.objectContaining({ id: baseCategory.id })],
          })
        )
      })

      it("should complain about non-existent fields being present in the CSV", async () => {
        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "unrelated-column.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)
        fileContent = fileContent.replace(/tag-123/g, baseTag1.id)
        fileContent = fileContent.replace(/tag-456/g, baseTag3.id)
        fileContent = fileContent.replace(/new-tag/g, newTag.id)

        fileContent = fileContent.replace(
          /import-shipping-profile*/g,
          shippingProfile.id
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: prepareCSVForImport(fileContent),
        })

        const batchJobRes = await api
          .post("/admin/products/import", form, meta)
          .catch((e) => e)

        expect(batchJobRes.response.data.message).toEqual(
          'Invalid column name(s) "Some field"'
        )
      })

      it("should successfully skip non-existent product fields being present in the CSV", async () => {
        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "invalid-column.csv"),
          { encoding: "utf-8" }
        )

        fileContent = fileContent.replace(/pcol_\w*\d*/g, baseCollection.id)
        fileContent = fileContent.replace(/ptyp_\w*\d*/g, baseType.id)

        fileContent = fileContent.replace(
          /import-shipping-profile*/g,
          shippingProfile.id
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: prepareCSVForImport(fileContent),
        })

        const batchJobRes = await api
          .post("/admin/products/import", form, meta)
          .catch((e) => e)

        expect(batchJobRes.response.data.message).toEqual(
          'Invalid column name(s) "Product field"'
        )
      })
    })
  },
})
