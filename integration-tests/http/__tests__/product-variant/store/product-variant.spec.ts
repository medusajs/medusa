import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { HttpTypes } from "@medusajs/framework/types"
import { IStoreModuleService } from "@medusajs/types"
import { ApiKeyType, Modules, ProductStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let appContainer
    let publishableKey
    let storeHeaders
    let store
    let region
    let shippingProfile

    const createProduct = async (payload: HttpTypes.AdminCreateProduct) => {
      const response = await api.post(
        "/admin/products?fields=*variants",
        payload,
        adminHeaders
      )

      return [response.data.product, response.data.product.variants || []]
    }

    const createSalesChannel = async (
      data: HttpTypes.AdminCreateSalesChannel,
      productIds: string[] = []
    ) => {
      const response = await api.post(
        "/admin/sales-channels",
        data,
        adminHeaders
      )

      const salesChannel = response.data.sales_channel

      if (productIds?.length) {
        await api.post(
          `/admin/sales-channels/${salesChannel.id}/products`,
          { add: productIds },
          adminHeaders
        )
      }

      return salesChannel
    }

    beforeAll(async () => {
      appContainer = getContainer()
      publishableKey = await generatePublishableKey(appContainer)
      storeHeaders = generateStoreHeaders({ publishableKey })

      await createAdminUser(dbConnection, adminHeaders, appContainer)

      const storeModule: IStoreModuleService = appContainer.resolve(
        Modules.STORE
      )

      const defaultStoreId = (await api.get("/admin/stores", adminHeaders)).data
        .stores?.[0]?.id

      if (defaultStoreId) {
        await storeModule.deleteStores(defaultStoreId)
      }

      store = await storeModule.createStores({
        name: "Store",
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "eur" },
        ],
      })

      region = (
        await api.post(
          "/admin/regions",
          { name: "Test Region", currency_code: "usd" },
          adminHeaders
        )
      ).data.region

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "default", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      await dbUtils.snapshot()
    })

    describe("GET /store/product-variants", () => {
      let product1
      let product2
      let variant1
      let variant2
      let salesChannel1
      let salesChannel2

      beforeEach(async () => {
        ;[product1, [variant1]] = await createProduct(
          getProductFixture({
            title: "Variant product 1",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
          })
        )
        ;[product2, [variant2]] = await createProduct(
          getProductFixture({
            title: "Variant product 2",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
          })
        )

        salesChannel1 = await createSalesChannel(
          { name: "sales channel one" },
          [product1.id]
        )

        salesChannel2 = await createSalesChannel(
          { name: "sales channel two" },
          [product2.id]
        )

        await api.post(
          `/admin/stores/${store.id}`,
          { default_sales_channel_id: salesChannel1.id },
          adminHeaders
        )
      })

      it("returns variants associated with the publishable key sales channel", async () => {
        await api.post(
          `/admin/api-keys/${publishableKey.id}/sales-channels`,
          { add: [salesChannel1.id] },
          adminHeaders
        )

        const response = await api.get("/store/product-variants", storeHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.variants).toEqual([
          expect.objectContaining({
            id: variant1.id,
            product_id: product1.id,
          }),
        ])
      })

      it("allows overriding the sales channel when it is within publishable key scope", async () => {
        await api.post(
          `/admin/api-keys/${publishableKey.id}/sales-channels`,
          { add: [salesChannel1.id, salesChannel2.id] },
          adminHeaders
        )

        const response = await api.get(
          `/store/product-variants?sales_channel_id[]=${salesChannel2.id}`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.variants).toEqual([
          expect.objectContaining({
            id: variant2.id,
            product_id: product2.id,
          }),
        ])
      })

      it("throws when filtering by a sales channel outside publishable key scope", async () => {
        await api.post(
          `/admin/api-keys/${publishableKey.id}/sales-channels`,
          { add: [salesChannel1.id] },
          adminHeaders
        )

        const error = await api
          .get(
            `/store/product-variants?sales_channel_id[]=${salesChannel2.id}`,
            storeHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "Requested sales channel is not part of the publishable key"
        )
      })
    })

    describe("GET /store/product-variants/:id", () => {
      let product1
      let product2
      let variant1
      let variant2
      let salesChannel1
      let salesChannel2

      beforeEach(async () => {
        ;[product1, [variant1]] = await createProduct(
          getProductFixture({
            title: "Variant product 1",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
          })
        )
        ;[product2, [variant2]] = await createProduct(
          getProductFixture({
            title: "Variant product 2",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
          })
        )

        salesChannel1 = await createSalesChannel(
          { name: "sales channel one" },
          [product1.id]
        )

        salesChannel2 = await createSalesChannel(
          { name: "sales channel two" },
          [product2.id]
        )

        await api.post(
          `/admin/api-keys/${publishableKey.id}/sales-channels`,
          { add: [salesChannel1.id] },
          adminHeaders
        )
      })

      it("retrieves a variant available to the publishable key", async () => {
        const response = await api.get(
          `/store/product-variants/${variant1.id}`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.variant).toEqual(
          expect.objectContaining({
            id: variant1.id,
            product_id: product1.id,
          })
        )
      })

      it("returns 404 when the variant is not available in the publishable key scope", async () => {
        const error = await api
          .get(`/store/product-variants/${variant2.id}`, storeHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          `Product variant with id: ${variant2.id} was not found`
        )
      })

      it("returns 404 when the variant does not exist", async () => {
        const error = await api
          .get(`/store/product-variants/not-real`, storeHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          "Product variant with id: not-real was not found"
        )
      })

      it("returns calculated price data when requested", async () => {
        const response = await api.get(
          `/store/product-variants/${variant1.id}?region_id=${region.id}&fields=calculated_price`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.variant).toEqual(
          expect.objectContaining({
            id: variant1.id,
            calculated_price: expect.objectContaining({
              calculated_amount: expect.any(Number),
              currency_code: "usd",
            }),
          })
        )
      })
    })

    describe("GET /store/product-variants inventory quantities", () => {
      it("returns inventory quantity scoped to publishable key sales channel", async () => {
        const container = getContainer()
        const channelService = container.resolve("sales_channel")
        const locationService = container.resolve("stock_location")
        const inventoryService = container.resolve("inventory")
        const productService = container.resolve("product")
        const pubKeyService = container.resolve("api_key")
        const linkService = container.resolve("remoteLink")

        const [channel] = await channelService.createSalesChannels([
          { name: "PK Sales Channel" },
        ])

        const product = await productService.createProducts({
          status: ProductStatus.PUBLISHED,
          title: "inventory product",
          options: [{ title: "size", values: ["large"] }],
          variants: [
            {
              title: "inv variant",
              options: { size: "large" },
            },
          ],
        })

        const [variant] = product.variants

        const [inventoryItem] = await inventoryService.createInventoryItems([
          { sku: "inv-sku" },
        ])

        const [location] = await locationService.createStockLocations([
          { name: "Warehouse" },
        ])

        await inventoryService.createInventoryLevels([
          {
            location_id: location.id,
            inventory_item_id: inventoryItem.id,
            stocked_quantity: 10,
          },
        ])

        const [pk] = await pubKeyService.createApiKeys([
          {
            title: "Variant PK",
            type: ApiKeyType.PUBLISHABLE,
            created_by: "test",
          },
        ])

        await linkService.create([
          {
            product: { product_id: product.id },
            sales_channel: { sales_channel_id: channel.id },
          },
          {
            sales_channel: { sales_channel_id: channel.id },
            stock_location: { stock_location_id: location.id },
          },
          {
            product: { variant_id: variant.id },
            inventory: { inventory_item_id: inventoryItem.id },
          },
          {
            api_key: { publishable_key_id: pk.id },
            sales_channel: { sales_channel_id: channel.id },
          },
        ])

        const response = await api.get(
          `/store/product-variants?fields=+inventory_quantity`,
          {
            headers: {
              "x-publishable-api-key": pk.token,
            },
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data.variants).toEqual([
          expect.objectContaining({
            id: variant.id,
            inventory_quantity: 10,
          }),
        ])
      })
    })
  },
})
