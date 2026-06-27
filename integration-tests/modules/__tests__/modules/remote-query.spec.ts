import { RemoteJoiner } from "@medusajs/framework/orchestration"
import CustomerModule from "@medusajs/medusa/customer"
import RegionModule from "@medusajs/medusa/region"
import { MedusaModule } from "@medusajs/modules-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  IRegionModuleService,
  ModuleJoinerConfig,
  RemoteQueryFunction,
} from "@medusajs/types"
import { ContainerRegistrationKeys, defineLink, Modules } from "@medusajs/utils"
import { createAdminUser } from "../../..//helpers/create-admin-user"
import { adminHeaders } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
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

      beforeAll(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
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

      it("should fail to retrieve not passing primary key in filters", async () => {
        const noPk = remoteQuery(
          {
            region: {
              fields: ["id", "currency_code"],
            },
          },
          { throwIfKeyNotFound: true }
        )
        await expect(noPk).rejects.toThrow(
          "Region: Primary key(s) [id, iso_2] not found in filters"
        )

        const noPk2 = remoteQuery(
          {
            country: {
              fields: ["*"],
            },
          },
          { throwIfKeyNotFound: true }
        )
        await expect(noPk2).rejects.toThrow(
          "Country: Primary key(s) [id, iso_2] not found in filters"
        )

        const noPk3 = remoteQuery(
          {
            country: {
              fields: ["*"],
              __args: {
                iso_2: undefined,
              },
            },
          },
          { throwIfKeyNotFound: true }
        )
        await expect(noPk3).rejects.toThrow(
          "Country: Value for primary key iso_2 not found in filters"
        )

        const noPk4 = remoteQuery(
          {
            region: {
              fields: ["id", "currency_code"],
              __args: {
                id: null,
              },
            },
          },
          { throwIfKeyNotFound: true }
        )
        await expect(noPk4).rejects.toThrow(
          "Region: Value for primary key id not found in filters"
        )

        const noPk5 = remoteQuery(
          {
            region: {
              fields: ["id", "currency_code"],
              __args: {
                currency_code: "EUR",
              },
            },
          },
          { throwIfKeyNotFound: true }
        )
        await expect(noPk5).rejects.toThrow(
          "Region: Primary key(s) [id, iso_2] not found in filters"
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
          "PaymentProvider id not found: pp_system_default_non_existent"
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

      beforeAll(() => {
        appContainer = getContainer()
        query = appContainer.resolve(ContainerRegistrationKeys.QUERY)
      })

      let product
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          shipping_profile_id: shippingProfile.id,
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

        const res = await api
          .post("/admin/products", payload, adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        product = res.data.product
      })

      it(`should throw if not exists`, async () => {
        const err = await query
          .graph(
            {
              entity: "product",
              fields: ["id", "title", "variants.*", "variants.prices.amount"],
              filters: {
                id: "non-existing-id",
                variants: {
                  prices: {
                    amount: {
                      $gt: 100,
                    },
                  },
                },
              },
            },
            {
              throwIfKeyNotFound: true,
            }
          )
          .catch((err) => {
            return err
          })

        expect(err).toEqual(
          expect.objectContaining({
            message: expect.stringContaining(
              "Product id not found: non-existing-id"
            ),
          })
        )
      })

      it(`should support filtering using operators on a primary column`, async () => {
        const { data } = await query.graph({
          entity: "product",
          fields: ["id", "title"],
          filters: {
            id: {
              $in: [product.id],
            },
          },
        })

        expect(data).toEqual([
          expect.objectContaining({
            id: product.id,
            title: product.title,
          }),
        ])
      })

      it(`should perform cross module query and apply filters correctly to the correct modules [1]`, async () => {
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
      })

      it(`should perform cross module query and apply filters correctly to the correct modules [2]`, async () => {
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

      it("should handle multiple fieldAlias when multiple links between two modules are defined", async () => {
        const customer = CustomerModule.linkable.customer
        const customerGroup = CustomerModule.linkable.customerGroup

        const region = RegionModule.linkable.region
        const country = RegionModule.linkable.country

        defineLink(customer, region)
        defineLink(customerGroup, region)

        defineLink(customer, country)
        defineLink(customerGroup, country)

        const modulesLoaded = MedusaModule.getLoadedModules().map(
          (mod) => Object.values(mod)[0]
        )

        const servicesConfig_: ModuleJoinerConfig[] = []

        for (const mod of modulesLoaded || []) {
          if (!mod.__definition.isQueryable) {
            continue
          }

          servicesConfig_!.push(mod.__joinerConfig)
        }
        const linkDefinition = MedusaModule.getCustomLinks().map(
          (linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition
          }
        )
        servicesConfig_.push(...(linkDefinition as any))

        const remoteJoiner = new RemoteJoiner(
          servicesConfig_,
          (() => {}) as any
        )

        const fieldAlias = (remoteJoiner as any).getServiceConfig({
          entity: "Customer",
        }).fieldAlias

        expect(fieldAlias).toEqual(
          expect.objectContaining({
            account_holders: {
              path: "account_holder_link.account_holder",
              isList: true,
              entity: "Customer",
            },
            region: [
              {
                path: "region_link.region",
                isList: false,
                forwardArgumentsOnPath: ["region_link.region"],
                entity: "Customer",
              },
              {
                path: "region_link.region",
                isList: false,
                forwardArgumentsOnPath: ["region_link.region"],
                entity: "CustomerGroup",
              },
            ],
            country: [
              {
                path: "country_link.country",
                isList: false,
                forwardArgumentsOnPath: ["country_link.country"],
                entity: "Customer",
              },
              {
                path: "country_link.country",
                isList: false,
                forwardArgumentsOnPath: ["country_link.country"],
                entity: "CustomerGroup",
              },
            ],
          })
        )
      })
    })
  },
})
