import { PriceListStatus, PriceListType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe.skip("GET /store/products/:id", () => {
      let appContainer
      let product
      let variant
      let region
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        appContainer = getContainer()
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        region = (
          await api.post(
            "/admin/regions",
            {
              name: "Test Region",
              currency_code: "usd",
            },
            adminHeaders
          )
        ).data.region

        product = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "test1",
              status: "published",
              variants: [
                {
                  title: "Test taxes",
                  prices: [
                    {
                      amount: 3000,
                      currency_code: "eur",
                    },
                  ],
                },
              ],
            }),
            adminHeaders
          )
        ).data.product

        variant = product.variants[0]
      })

      it("should get product and its prices from price-list created through the price list workflow", async () => {
        const priceListResponse = await api.post(
          `/admin/price-lists`,
          {
            name: "test price list",
            description: "test",
            status: PriceListStatus.ACTIVE,
            type: PriceListType.SALE,
            prices: [
              {
                amount: 2500,
                currency_code: "usd",
                variant_id: variant.id,
              },
            ],
          },
          adminHeaders
        )

        let response = await api.get(
          `/store/products/${product.id}?currency_code=usd`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product.variants[0].prices).toHaveLength(2)
        expect(response.data.product.variants[0].prices).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            amount: 3000,
            min_quantity: null,
            max_quantity: null,
            price_list_id: null,
          }),
          expect.objectContaining({
            currency_code: "usd",
            amount: 2500,
            min_quantity: null,
            max_quantity: null,
            price_list_id: priceListResponse.data.price_list.id,
          }),
        ])
        expect(response.data.product.variants[0]).toEqual(
          expect.objectContaining({
            original_price: 3000,
            calculated_price: 2500,
            calculated_price_type: "sale",
          })
        )
      })

      it("should not list prices from price-list with customer groups if not logged in", async () => {
        const customerGroup = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP",
            },
            adminHeaders
          )
        ).data.customer_group
        const customerGroupId = customerGroup.id

        const priceListResponse = await api.post(
          `/admin/price-lists`,
          {
            name: "test price list",
            description: "test",
            status: PriceListStatus.ACTIVE,
            type: PriceListType.SALE,
            prices: [
              {
                amount: 2500,
                currency_code: "usd",
                variant_id: variant.id,
              },
            ],
            customer_groups: [{ id: customerGroupId }],
          },
          adminHeaders
        )

        let response = await api.get(
          `/store/products/${product.id}?currency_code=usd`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product.variants[0].prices).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            amount: 3000,
            min_quantity: null,
            max_quantity: null,
            price_list_id: null,
          }),
        ])
        expect(response.data.product.variants[0]).toEqual(
          expect.objectContaining({
            original_price: 3000,
            calculated_price: 3000,
            calculated_price_type: null,
          })
        )
      })

      it("should list prices from price-list with customer groups", async () => {
        const customer = (
          await api.post(
            "/admin/customers",
            {
              email: "test5@email-pl.com",
              first_name: "John",
              last_name: "Deere",
            },
            adminHeaders
          )
        ).data.customer_group

        const authResponse = await api.post(
          "/store/auth",
          {
            email: "test5@email-pl.com",
            password: "test",
          },
          storeHeaders
        )

        const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

        const priceListResponse = await api.post(
          `/admin/price-lists`,
          {
            name: "test price list",
            description: "test",
            status: PriceListStatus.ACTIVE,
            type: PriceListType.SALE,
            prices: [
              {
                amount: 2500,
                currency_code: "usd",
                variant_id: variant.id,
              },
            ],
            customer_groups: [{ id: "customer-group-1" }],
          },
          adminHeaders
        )

        let response = await api.get(
          `/store/products/${product.id}?currency_code=usd`,
          {
            headers: {
              Cookie: authCookie,
              ...storeHeaders.headers,
            },
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data.product.variants[0].prices).toHaveLength(2)
        expect(response.data.product.variants[0].prices).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            amount: 3000,
            min_quantity: null,
            max_quantity: null,
            price_list_id: null,
          }),
          expect.objectContaining({
            currency_code: "usd",
            amount: 2500,
            min_quantity: null,
            max_quantity: null,
            price_list_id: priceListResponse.data.price_list.id,
          }),
        ])
        expect(response.data.product.variants[0]).toEqual(
          expect.objectContaining({
            original_price: 3000,
            calculated_price: 2500,
            calculated_price_type: "sale",
          })
        )
      })
    })
  },
})
