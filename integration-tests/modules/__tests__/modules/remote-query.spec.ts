import {
  ICustomerModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  RemoteQueryFunction,
} from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../..//helpers/create-admin-user"
import { adminHeaders } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Remote Query", () => {
      let appContainer
      let regionModule: IRegionModuleService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        regionModule = appContainer.resolve(Modules.REGION)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should fail to retrieve a single non-existing id", async () => {
        const region = await regionModule.createRegions({
          name: "Test Region",
          currency_code: "usd",
          countries: ["us"],
        })

        const getRegion = await remoteQuery({
          region: {
            fields: ["id", "currency_code"],
            __args: {
              id: region.id,
            },
          },
        })

        expect(getRegion).toEqual([
          {
            id: region.id,
            currency_code: "usd",
          },
        ])

        const getNonExistingRegion = remoteQuery(
          {
            region: {
              fields: ["id", "currency_code"],
              __args: {
                id: "region_123",
              },
            },
          },
          { throwIfKeyNotFound: true }
        )

        await expect(getNonExistingRegion).rejects.toThrow(
          "Region id not found: region_123"
        )
      })

      it("should fail if a expected relation is not found", async () => {
        const region = await regionModule.createRegions({
          name: "Test Region",
          currency_code: "usd",
          countries: ["us"],
        })

        const regionWithPayment = await regionModule.createRegions({
          name: "Test W/ Payment",
          currency_code: "brl",
          countries: ["br"],
        })

        const regionNoLink = await regionModule.createRegions({
          name: "No link",
          currency_code: "eur",
          countries: ["dk"],
        })

        await remoteLink.create([
          {
            [Modules.REGION]: {
              region_id: region.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: "pp_system_default_non_existent",
            },
          },
          {
            [Modules.REGION]: {
              region_id: regionWithPayment.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: "pp_system_default", // default payment provider auto created
            },
          },
        ])

        // Validate all relations, including the link
        await expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: regionNoLink.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            {
              throwIfRelationNotFound: true,
            }
          )
        ).rejects.toThrow(
          `RegionRegionPaymentPaymentProviderLink region_id not found: ${regionNoLink.id}`
        )

        // Only validate the relations with Payment. It doesn't fail because the link didn't return any data
        await expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: regionNoLink.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            undefined,
            {
              throwIfRelationNotFound: [Modules.PAYMENT],
            }
          )
        ).resolves.toHaveLength(1)

        // The link exists, but the payment doesn't
        await expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: region.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            {
              throwIfRelationNotFound: [Modules.PAYMENT],
            }
          )
        ).rejects.toThrow(
          "Payment id not found: pp_system_default_non_existent"
        )

        // everything is fine
        await expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: regionWithPayment.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            undefined,
            {
              throwIfRelationNotFound: [Modules.PAYMENT],
            }
          )
        ).resolves.toHaveLength(1)
      })
    })

    describe("Query", () => {
      let appContainer
      let query: RemoteQueryFunction

      let pricingModule: IPricingModuleService
      let productModule: IProductModuleService
      let customerModule: ICustomerModuleService
      let regionModule: IRegionModuleService

      let product
      let variant
      let variant2
      let region
      let customerGroup

      beforeAll(() => {
        appContainer = getContainer()
        query = appContainer.resolve(ContainerRegistrationKeys.QUERY)

        pricingModule = appContainer.resolve(Modules.PRICING)
        productModule = appContainer.resolve(Modules.PRODUCT)
        customerModule = appContainer.resolve(Modules.CUSTOMER)
        regionModule = appContainer.resolve(Modules.REGION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        /* customerGroup = await customerModule.createCustomerGroups({
          name: "VIP",
        })
        region = await regionModule.createRegions({
          name: "US",
          currency_code: "USD",
        })
        ;[product] = await productModule.createProducts([
          {
            title: "test product",
            variants: [
              {
                title: "test product variant",
              },
              {
                title: "test product variant 2",
              },
            ],
          },
        ])

        variant = product.variants[0]
        variant2 = product.variants[1]

        const priceSet = await createVariantPriceSet({
          container: appContainer,
          variantId: variant.id,
          prices: [],
        })

        await pricingModule.createPriceLists([
          {
            title: "test price list",
            description: "test",
            ends_at: new Date().toDateString(),
            starts_at: new Date().toDateString(),
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
        ])*/

        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          description: "test-giftcard-description",
          options: [{ title: "Denominations", values: ["100"] }],
          variants: [
            {
              title: "Test variant",
              prices: [{ currency_code: "usd", amount: 100 }],
              options: {
                Denominations: "100",
              },
            },
          ],
        }

        await api
          .post("/admin/products", payload, adminHeaders)
          .catch((err) => {
            console.log(err)
          })
      })

      it(`should perform cross module query and apply filters correctly to the correct modules`, async () => {
        const { data } = await query.graph({
          entity: "product",
          fields: ["id", "title", "variants.*", "variants.prices.amount"],
          filters: {
            variants: {
              prices: {
                amount: {
                  $gt: 100,
                },
              },
            },
          },
        })

        expect(data).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            title: "Test Giftcard",
            variants: [
              expect.objectContaining({
                title: "Test variant",
                prices: [],
              }),
            ],
          }),
        ])

        const { data: dataWithPrice } = await query.graph({
          entity: "product",
          fields: ["id", "title", "variants.*", "variants.prices.amount"],
          filters: {
            variants: {
              prices: {
                amount: {
                  $gt: 50,
                },
              },
            },
          },
        })

        expect(dataWithPrice).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            title: "Test Giftcard",
            variants: [
              expect.objectContaining({
                title: "Test variant",
                prices: [
                  expect.objectContaining({
                    amount: 100,
                  }),
                ],
              }),
            ],
          }),
        ])
      })
    })
  },
})
