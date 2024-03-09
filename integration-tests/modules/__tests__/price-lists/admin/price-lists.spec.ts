import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICustomerModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  PriceListStatus,
  PriceListType,
} from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Price Lists API", () => {
      let appContainer
      let product
      let product2
      let variant
      let variant2
      let region
      let customerGroup
      let pricingModule: IPricingModuleService
      let productModule: IProductModuleService
      let customerModule: ICustomerModuleService
      let regionModule: IRegionModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        customerGroup = await customerModule.createCustomerGroup({
          name: "VIP",
        })
        region = await regionModule.create({ name: "US", currency_code: "USD" })
        ;[product] = await productModule.create([{ title: "test product" }])

        await pricingModule.createRuleTypes([
          { name: "Customer Group ID", rule_attribute: "customer_group_id" },
          { name: "Region ID", rule_attribute: "region_id" },
        ])

        const [productOption] = await productModule.createOptions([
          { title: "Test option 1", product_id: product.id },
        ])

        ;[variant] = await productModule.createVariants([
          {
            product_id: product.id,
            title: "test product variant",
            options: [{ value: "test", option_id: productOption.id }],
          },
        ])
      })

      describe("GET /admin/price-lists", () => {
        it("should get all price lists and its prices with rules", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [],
          })

          await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              ends_at: new Date(),
              starts_at: new Date(),
              status: PriceListStatus.ACTIVE,
              type: PriceListType.OVERRIDE,
              prices: [
                {
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
              rules: {
                customer_group_id: [customerGroup.id],
              },
            },
          ])

          let response = await api.get(`/admin/price-lists`, adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.price_lists).toEqual([
            {
              id: expect.any(String),
              type: "override",
              description: "test",
              title: "test price list",
              status: "active",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                {
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 5000,
                  min_quantity: null,
                  max_quantity: null,
                  variant_id: variant.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            },
          ])

          response = await api.get(
            `/admin/price-lists?fields=id,created_at,rules,prices.rules,prices.amount`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.price_lists).toEqual([
            {
              id: expect.any(String),
              created_at: expect.any(String),
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                {
                  amount: 5000,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            },
          ])
        })
      })

      describe("GET /admin/price-lists/:id", () => {
        it("should retrieve a price list and its prices with rules", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [],
          })

          const [priceList] = await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              ends_at: new Date(),
              starts_at: new Date(),
              status: PriceListStatus.ACTIVE,
              type: PriceListType.OVERRIDE,
              prices: [
                {
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
              rules: {
                customer_group_id: [customerGroup.id],
              },
            },
          ])

          let response = await api.get(
            `/admin/price-lists/${priceList.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              type: "override",
              description: "test",
              title: "test price list",
              status: "active",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                {
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 5000,
                  min_quantity: null,
                  max_quantity: null,
                  variant_id: variant.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            })
          )

          response = await api.get(
            `/admin/price-lists/${priceList.id}?fields=id,prices.id,prices.amount`,
            adminHeaders
          )

          expect(response.data.price_list).toEqual({
            id: expect.any(String),
            prices: [
              {
                id: expect.any(String),
                amount: 5000,
              },
            ],
          })
        })

        it("should throw an error when price list is not found", async () => {
          const error = await api
            .get(`/admin/price-lists/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(error.response.status).toBe(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: "Price list with id: does-not-exist was not found",
          })
        })
      })
    })
  },
})
