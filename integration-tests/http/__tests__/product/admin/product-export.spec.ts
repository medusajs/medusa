import { IEventBusModuleService } from "@medusajs/types"
import { CommonEvents, Modules } from "@medusajs/utils"
import os from "os"
import fs from "fs/promises"
import {
  TestEventUtils,
  medusaIntegrationTestRunner,
} from "@medusajs/test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"
import { csv2json } from "json-2-csv"

jest.setTimeout(50000)

const getCSVContents = async (filePath: string) => {
  const asLocalPath = filePath.replace("http://localhost:9000", os.tmpdir())
  const fileContent = await fs.readFile(asLocalPath, { encoding: "utf-8" })
  await fs.rm(path.dirname(asLocalPath), { recursive: true, force: true })
  const csvRows = csv2json(fileContent)

  return csvRows.reduce<any[]>((result, row) => {
    const rowCopy = { ...row }
    Object.keys(rowCopy).forEach((col) => {
      if (
        col.includes("Updated At") ||
        col.includes("Created At") ||
        col.includes("Deleted At")
      ) {
        rowCopy[col] = "<DateTime>"
      }
      if (col.includes("Id") || col.startsWith("Product Category ")) {
        rowCopy[col] = "<ID>"
      }
    })

    result.push(rowCopy)
    return result
  }, [])
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseProduct
    let proposedProduct

    let baseCollection
    let publishedCollection

    let baseType
    let baseRegion
    let baseCategory
    let baseTag1
    let baseTag2
    let newTag
    let shippingProfile

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

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

      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "base-collection" },
          adminHeaders
        )
      ).data.collection

      publishedCollection = (
        await api.post(
          "/admin/collections",
          { title: "proposed-collection" },
          adminHeaders
        )
      ).data.collection

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      baseType = (
        await api.post(
          "/admin/product-types",
          { value: "test-type" },
          adminHeaders
        )
      ).data.product_type

      baseCategory = (
        await api.post(
          "/admin/product-categories",
          { name: "Test", is_internal: false, is_active: true },
          adminHeaders
        )
      ).data.product_category

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

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
            description: "test-product-description\ntest line 2",
            shipping_profile_id: shippingProfile.id,
            collection_id: baseCollection.id,
            type_id: baseType.id,
            categories: [{ id: baseCategory.id }],
            tags: [{ id: baseTag1.id }, { id: baseTag2.id }],
            variants: [
              {
                title: "Test variant",
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
                options: {
                  size: "large",
                  color: "green",
                },
              },
              {
                title: "Test variant 2",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 200,
                  },
                  {
                    currency_code: "eur",
                    amount: 65,
                  },
                  {
                    currency_code: "dkk",
                    amount: 50,
                  },
                ],
                options: {
                  size: "small",
                  color: "green",
                },
              },
            ],
          }),
          adminHeaders
        )
      ).data.product

      proposedProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Proposed product",
            status: "proposed",
            tags: [{ id: newTag.id }],
            type_id: baseType.id,
            shipping_profile_id: shippingProfile.id,
          }),
          adminHeaders
        )
      ).data.product
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/products/export", () => {
      it("should export a csv file containing the expected products", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/export). The payload and response changed as well.
        const batchJobRes = await api.post(
          "/admin/products/export",
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product export",
              description: "Product export completed successfully!",
              file: expect.objectContaining({
                url: expect.stringContaining("-product-exports.csv"),
                filename: expect.any(String),
                mimeType: "text/csv",
              }),
            }),
          })
        )

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        expect(exportedFileContents).toHaveLength(3)
        expect(exportedFileContents).toEqual(
          expect.arrayContaining([
            {
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description\ntest line 2",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "base-product",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "draft",
              "Product Subtitle": "",
              "Product Tag 1": "tag-123",
              "Product Tag 2": "tag-456",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Base product",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Thumbnail": "",
              "Variant Hs Code": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "large",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price DKK": 30,
              "Variant Price EUR": 45,
              "Variant Price USD": 100,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
            {
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description\ntest line 2",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "base-product",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "draft",
              "Product Subtitle": "",
              "Product Tag 1": "tag-123",
              "Product Tag 2": "tag-456",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Base product",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Hs Code": "",
              "Variant Thumbnail": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "small",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price DKK": 50,
              "Variant Price EUR": 65,
              "Variant Price USD": 200,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant 2",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
            {
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "proposed-product",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "proposed",
              "Product Subtitle": "",
              "Product Tag 1": "new-tag",
              "Product Tag 2": "",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Proposed product",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Hs Code": "",
              "Variant Thumbnail": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "large",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price DKK": 30,
              "Variant Price EUR": 45,
              "Variant Price USD": 100,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
          ])
        )
      })

      it("should export a csv file with categories", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const batchJobRes = await api.post(
          `/admin/products/export?id=${baseProduct.id}&fields=*categories`,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        expect(exportedFileContents).toHaveLength(2)
        expect(exportedFileContents).toEqual(
          expect.arrayContaining([
            {
              "Product Category 1": expect.any(String),
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description\ntest line 2",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "base-product",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "draft",
              "Product Subtitle": "",
              "Product Tag 1": "tag-123",
              "Product Tag 2": "tag-456",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Base product",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Hs Code": "",
              "Variant Thumbnail": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "large",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price DKK": 30,
              "Variant Price EUR": 45,
              "Variant Price USD": 100,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
            {
              "Product Category 1": expect.any(String),
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description\ntest line 2",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "base-product",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "draft",
              "Product Subtitle": "",
              "Product Tag 1": "tag-123",
              "Product Tag 2": "tag-456",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Base product",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Thumbnail": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Hs Code": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "small",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price DKK": 50,
              "Variant Price EUR": 65,
              "Variant Price USD": 200,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant 2",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
          ])
        )
      })

      it("should export a csv file with region prices", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const productWithRegionPrices = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "Product with prices",
              shipping_profile_id: shippingProfile.id,
              tags: [{ id: baseTag1.id }, { id: baseTag2.id }],
              variants: [
                {
                  title: "Test variant",
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                    {
                      currency_code: "usd",
                      rules: {
                        region_id: baseRegion.id,
                      },
                      amount: 45,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            }),
            adminHeaders
          )
        ).data.product

        const batchJobRes = await api.post(
          "/admin/products/export?id=" + productWithRegionPrices.id,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )
        expect(exportedFileContents).toHaveLength(1)
        expect(exportedFileContents).toEqual(
          expect.arrayContaining([
            {
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "product-with-prices",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "draft",
              "Product Subtitle": "",
              "Product Tag 1": "tag-123",
              "Product Tag 2": "tag-456",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Product with prices",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Hs Code": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Thumbnail": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "large",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price Test Region [USD]": 45,
              "Variant Price USD": 100,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
          ])
        )
      })

      it("should export a csv file filtered by specific products", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        // BREAKING: We don't support setting batch size in the export anymore
        const batchJobRes = await api.post(
          `/admin/products/export?id=${proposedProduct.id}`,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        expect(exportedFileContents).toHaveLength(1)
        expect(exportedFileContents).toEqual(
          expect.arrayContaining([
            {
              "Product Collection Id": expect.any(String),
              "Product Created At": expect.any(String),
              "Product Deleted At": expect.any(String),
              "Product Description": "test-product-description",
              "Product Discountable": true,
              "Product External Id": expect.any(String),
              "Product Handle": "proposed-product",
              "Product Height": "",
              "Product Hs Code": "",
              "Product Id": expect.any(String),
              "Product Image 1": "test-image.png",
              "Product Image 2": "test-image-2.png",
              "Product Is Giftcard": false,
              "Product Length": "",
              "Product Material": "",
              "Product Mid Code": "",
              "Product Origin Country": "",
              "Product Status": "proposed",
              "Product Subtitle": "",
              "Product Tag 1": "new-tag",
              "Product Thumbnail": "test-image.png",
              "Product Title": "Proposed product",
              "Product Type Id": expect.any(String),
              "Product Updated At": expect.any(String),
              "Product Weight": "",
              "Product Width": "",
              "Variant Allow Backorder": false,
              "Variant Barcode": "",
              "Variant Created At": expect.any(String),
              "Variant Deleted At": expect.any(String),
              "Variant Ean": "",
              "Variant Height": "",
              "Variant Hs Code": "",
              "Variant Id": expect.any(String),
              "Variant Length": "",
              "Variant Manage Inventory": true,
              "Variant Material": "",
              "Variant Metadata": "",
              "Variant Mid Code": "",
              "Variant Thumbnail": "",
              "Variant Image 1": "test-image.png",
              "Variant Image 2": "test-image-2.png",
              "Variant Option 1 Name": "size",
              "Variant Option 1 Value": "large",
              "Variant Option 2 Name": "color",
              "Variant Option 2 Value": "green",
              "Variant Origin Country": "",
              "Variant Price DKK": 30,
              "Variant Price EUR": 45,
              "Variant Price USD": 100,
              "Variant Product Id": expect.any(String),
              "Variant Sku": "",
              "Variant Title": "Test variant",
              "Variant Upc": "",
              "Variant Updated At": expect.any(String),
              "Variant Variant Rank": 0,
              "Variant Weight": "",
              "Variant Width": "",
            },
          ])
        )
      })

      it("should export a csv file filtered by sales channel id", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        // Create a sales channel
        const salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Test Sales Channel" },
            adminHeaders
          )
        ).data.sales_channel

        // Create a product associated with the sales channel
        const productInSalesChannel = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "Product in sales channel",
              shipping_profile_id: shippingProfile.id,
            }),
            adminHeaders
          )
        ).data.product

        // Associate the product with the sales channel
        await api.post(
          `/admin/sales-channels/${salesChannel.id}/products`,
          { add: [productInSalesChannel.id] },
          adminHeaders
        )

        // Export products filtered by sales channel id
        const batchJobRes = await api.post(
          `/admin/products/export?sales_channel_id=${salesChannel.id}`,
          {},
          adminHeaders
        )

        const transactionId = batchJobRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        // Should only export the product in the sales channel, not baseProduct or proposedProduct
        expect(exportedFileContents).toHaveLength(1)
        expect(exportedFileContents[0]).toEqual(
          expect.objectContaining({
            "Product Title": "Product in sales channel",
            "Product Handle": "product-in-sales-channel",
          })
        )

        // Verify that baseProduct and proposedProduct are not in the export
        const exportedProductTitles = exportedFileContents.map(
          (row) => row["Product Title"]
        )
        expect(exportedProductTitles).not.toContain("Base product")
        expect(exportedProductTitles).not.toContain("Proposed product")
      })
    })
  },
})
