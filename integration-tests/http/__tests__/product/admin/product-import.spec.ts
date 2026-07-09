import { csv2json, json2csv } from "json-2-csv"
import { batchProductsWorkflow } from "@medusajs/core-flows"
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

          let csvContents = prepareCSVForImport(fileContent, testcase.delimiter)

          // Mirror a real export round-trip: the exporter now emits option ids,
          // so the re-import LINKS base-product's existing (exclusive) options
          // instead of recreating them. Without the ids the import would create
          // fresh options, orphaning the originals (which are then garbage
          // collected) and dropping the variants' option values. The created
          // row (proposed-product) keeps empty ids so new options are created.
          const sizeOptionId = baseProduct.options.find(
            (option: any) => option.title === "size"
          )!.id
          const colorOptionId = baseProduct.options.find(
            (option: any) => option.title === "color"
          )!.id
          const rowsWithOptionIds = csv2json(csvContents)
          rowsWithOptionIds.forEach((row: any) => {
            // Set the id columns on EVERY row (empty for non-base rows). If a
            // row is left without the key, json2csv serializes it as the string
            // "undefined", which the importer would treat as a real option id.
            const isBaseProduct = row["Product Id"] === baseProduct.id
            row["Variant Option 1 Id"] = isBaseProduct ? sizeOptionId : ""
            row["Variant Option 2 Id"] = isBaseProduct ? colorOptionId : ""
          })
          csvContents = json2csv(rowsWithOptionIds)

          const { form, meta } = getUploadReq({
            name: "test.csv",
            content: csvContents,
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

      describe("with the new product option columns", () => {
        // Option resolution on import is strictly by Id: a row with a
        // "Variant Option N Id" links the existing option, a row without one
        // creates a new option. There is no find-or-create by title. The
        // exporter emits the Id column (normalize-for-export.ts), so an
        // export -> import round-trip re-links existing options instead of
        // duplicating them.
        //
        // Global (non-exclusive) option titles are unique (partial unique
        // index on product_option). Sharing one global option across products
        // is therefore done via the Id column, NOT by repeating its title with
        // Is Exclusive = false on multiple rows (which the constraint rejects).
        //
        // Builds a CSV by reusing the products-comma.csv fixture and injecting
        // the new Variant Option N Id / Is Exclusive columns.
        const buildCsvWithOptionMeta = async ({
          option1Id,
          option2IsExclusive,
          onlyHandle,
        }: {
          option1Id?: string
          option2IsExclusive?: string
          onlyHandle?: string
        }) => {
          let fileContent = await fs.readFile(
            path.join(__dirname, "__fixtures__", "products-comma.csv"),
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

          let rows = csv2json(prepareCSVForImport(fileContent))
          if (onlyHandle !== undefined) {
            rows = rows.filter(
              (row: any) => row["Product Handle"] === onlyHandle
            )
          }
          rows.forEach((row: any) => {
            if (option1Id !== undefined) {
              row["Variant Option 1 Id"] = option1Id
            }
            if (option2IsExclusive !== undefined) {
              row["Variant Option 2 Is Exclusive"] = option2IsExclusive
            }
          })
          return json2csv(rows)
        }

        const importAndConfirm = async (csv: string) => {
          const { form, meta } = getUploadReq({
            name: "test.csv",
            content: csv,
          })
          const res = await api.post("/admin/products/import", form, meta)
          await api.post(
            `/admin/products/import/${res.data.transaction_id}/confirm`,
            {},
            meta
          )
        }

        it("links to an existing global option when Variant Option N Id is provided", async () => {
          const subscriberExecution = TestEventUtils.waitSubscribersExecution(
            `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
            eventBus
          )

          const globalSize = (
            await api.post(
              "/admin/product-options",
              {
                title: "size",
                values: ["large", "small"],
                is_exclusive: false,
              },
              adminHeaders
            )
          ).data.product_option

          const csv = await buildCsvWithOptionMeta({
            option1Id: globalSize.id,
          })

          await importAndConfirm(csv)
          await subscriberExecution

          const products = (
            await api.get(
              "/admin/products?fields=*options,*options.values",
              adminHeaders
            )
          ).data.products

          // Both products from the fixture should reference the SAME global
          // size option, not a freshly-created exclusive duplicate.
          products.forEach((p: any) => {
            const sizeOption = p.options.find((o: any) => o.title === "size")
            expect(sizeOption.id).toEqual(globalSize.id)
            expect(sizeOption.is_exclusive).toBe(false)
          })

          // No new "size" options were created.
          const sizeOptions = (
            await api.get("/admin/product-options?title=size", adminHeaders)
          ).data.product_options
          expect(sizeOptions).toHaveLength(1)
          expect(sizeOptions[0].id).toEqual(globalSize.id)
        })

        it("creates a global (non-exclusive) option when Is Exclusive is false and no Id is provided", async () => {
          const subscriberExecution = TestEventUtils.waitSubscribersExecution(
            `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
            eventBus
          )

          // Import a single new product whose "color" option has Is Exclusive =
          // false and no Id. With no Id the option is created.
          const csv = await buildCsvWithOptionMeta({
            option2IsExclusive: "false",
            onlyHandle: "proposed-product",
          })

          await importAndConfirm(csv)
          await subscriberExecution

          const products = (
            await api.get(
              "/admin/products?fields=handle,*options",
              adminHeaders
            )
          ).data.products
          const product = products.find(
            (p: any) => p.handle === "proposed-product"
          )

          const colorOption = product.options.find(
            (o: any) => o.title === "color"
          )
          expect(colorOption).toBeTruthy()
          expect(colorOption.is_exclusive).toBe(false)

          // Exactly one global "color" option exists — the one just created.
          const colorOptions = (
            await api.get(
              "/admin/product-options?title=color&is_exclusive=false",
              adminHeaders
            )
          ).data.product_options
          expect(colorOptions).toHaveLength(1)
          expect(colorOptions[0].id).toEqual(colorOption.id)
        })

        it("rejects creating a duplicate global option title during import processing", async () => {
          // A global "color" option already exists.
          await api.post(
            "/admin/product-options",
            { title: "color", values: ["red", "blue"], is_exclusive: false },
            adminHeaders
          )

          const { errors } = await batchProductsWorkflow(getContainer()).run({
            input: {
              create: [
                getProductFixture({
                  title: "Imported product",
                  shipping_profile_id: shippingProfile.id,
                  // A global "color" option whose title collides with the
                  // pre-existing one.
                  options: [
                    { title: "size", values: ["large"] },
                    { title: "color", values: ["green"], is_exclusive: false },
                  ],
                  variants: [
                    {
                      title: "Variant",
                      options: { size: "large", color: "green" },
                      prices: [{ currency_code: "usd", amount: 100 }],
                    },
                  ],
                } as any),
              ],
            } as any,
            throwOnError: false,
          })

          expect(errors.length).toBeGreaterThan(0)
          expect(
            errors.some((e: any) =>
              e.error?.message?.includes("already exists")
            )
          ).toBe(true)

          // No second global "color" option was created.
          const colorOptions = (
            await api.get(
              "/admin/product-options?title=color&is_exclusive=false",
              adminHeaders
            )
          ).data.product_options
          expect(colorOptions).toHaveLength(1)
        })

        it("creates an exclusive option per product when no Id and no Is Exclusive are provided (default)", async () => {
          const subscriberExecution = TestEventUtils.waitSubscribersExecution(
            `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
            eventBus
          )

          const csv = await buildCsvWithOptionMeta({})

          await importAndConfirm(csv)
          await subscriberExecution

          // Without an id, each imported product gets its own exclusive
          // "color" option. The fixture imports two products.
          const colorOptions = (
            await api.get(
              "/admin/product-options?title=color&is_exclusive=true",
              adminHeaders
            )
          ).data.product_options
          expect(colorOptions.length).toBeGreaterThanOrEqual(2)
          colorOptions.forEach((opt: any) => {
            expect(opt.is_exclusive).toBe(true)
          })
        })
      })
    })
  },
})
