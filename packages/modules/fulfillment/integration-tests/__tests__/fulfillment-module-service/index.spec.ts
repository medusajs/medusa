import { ModulesDefinition } from "@medusajs/framework/modules-sdk"
import {
  FulfillmentSetDTO,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { FulfillmentModuleService, FulfillmentProviderService } from "@services"
import {
  initModules,
  moduleIntegrationTestRunner,
  SuiteOptions,
} from "@medusajs/test-utils"
import { resolve } from "path"
import { createFullDataStructure } from "../../__fixtures__"
import { FulfillmentProviderServiceFixtures } from "../../__fixtures__/providers"

jest.setTimeout(60000)

let moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      id: "test-provider",
    },
  ],
}

let providerId = "fixtures-fulfillment-provider_test-provider"

async function list(
  service: IFulfillmentModuleService,
  ...args: Parameters<IFulfillmentModuleService["listFulfillmentSets"]>
) {
  const [filters = {}, config = {}] = args

  const finalConfig = {
    relations: [
      "service_zones.geo_zones",
      "service_zones.shipping_options.provider",
      "service_zones.shipping_options.type",
      "service_zones.shipping_options.rules",
      "service_zones.shipping_options.fulfillments.labels",
      "service_zones.shipping_options.fulfillments.items",
      "service_zones.shipping_options.fulfillments.delivery_address",
    ],
    ...config,
  }

  return await service.listFulfillmentSets(filters, finalConfig)
}

function expectSoftDeleted(
  fulfillmentSets: FulfillmentSetDTO[],
  { softDeleted = false } = {}
) {
  expect(fulfillmentSets).toHaveLength(1)

  let fulfillmentSet = fulfillmentSets[0]
  expect(!!fulfillmentSet.deleted_at).toEqual(softDeleted)
  expect(fulfillmentSet.service_zones).toHaveLength(1)

  let serviceZone = fulfillmentSet.service_zones[0]
  expect(!!serviceZone.deleted_at).toEqual(softDeleted)
  expect(serviceZone.geo_zones).toHaveLength(1)
  expect(serviceZone.shipping_options).toHaveLength(1)

  let geoZone = serviceZone.geo_zones[0]
  expect(!!geoZone.deleted_at).toEqual(softDeleted)

  let shippingOption = serviceZone.shipping_options[0]
  expect(!!shippingOption.deleted_at).toEqual(softDeleted)
  expect(!!shippingOption.shipping_profile.deleted_at).toEqual(false)
  expect(!!shippingOption.type.deleted_at).toEqual(softDeleted)
  expect(shippingOption.fulfillments).toHaveLength(1)
  expect(shippingOption.rules).toHaveLength(1)

  let rule = shippingOption.rules[0]
  expect(!!rule.deleted_at).toEqual(softDeleted)

  /**
   * We do not expect the fulfillment to be soft deleted when soft deleting parents entities
   */

  let fulfillment = shippingOption.fulfillments[0]
  expect(!!fulfillment.deleted_at).toEqual(false)
  expect(fulfillment.labels).toHaveLength(1)
  expect(fulfillment.items).toHaveLength(1)

  let label = fulfillment.labels[0]
  expect(!!label.deleted_at).toEqual(false)

  let item = fulfillment.items[0]
  expect(!!item.deleted_at).toEqual(false)

  let deliveryAddress = fulfillment.delivery_address
  expect(!!deliveryAddress.deleted_at).toEqual(false)
}

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  moduleOptions,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IFulfillmentModuleService>) =>
    describe("Fulfillment Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.FULFILLMENT, {
          service: FulfillmentModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "fulfillmentAddress",
          "fulfillmentItem",
          "fulfillmentLabel",
          "fulfillmentProvider",
          "fulfillmentSet",
          "fulfillment",
          "geoZone",
          "serviceZone",
          "shippingOptionRule",
          "shippingOptionType",
          "shippingOption",
          "shippingProfile",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          fulfillmentAddress: {
            id: {
              linkable: "fulfillment_address_id",
              entity: "FulfillmentAddress",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "fulfillmentAddress",
            },
          },
          fulfillmentItem: {
            id: {
              linkable: "fulfillment_item_id",
              entity: "FulfillmentItem",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "fulfillmentItem",
            },
          },
          fulfillmentLabel: {
            id: {
              linkable: "fulfillment_label_id",
              entity: "FulfillmentLabel",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "fulfillmentLabel",
            },
          },
          fulfillmentProvider: {
            id: {
              linkable: "fulfillment_provider_id",
              entity: "FulfillmentProvider",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "fulfillmentProvider",
            },
          },
          fulfillmentSet: {
            id: {
              linkable: "fulfillment_set_id",
              entity: "FulfillmentSet",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "fulfillmentSet",
            },
          },
          fulfillment: {
            id: {
              linkable: "fulfillment_id",
              entity: "Fulfillment",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "fulfillment",
            },
          },
          geoZone: {
            id: {
              linkable: "geo_zone_id",
              entity: "GeoZone",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "geoZone",
            },
          },
          serviceZone: {
            id: {
              linkable: "service_zone_id",
              entity: "ServiceZone",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "serviceZone",
            },
          },
          shippingOptionRule: {
            id: {
              linkable: "shipping_option_rule_id",
              entity: "ShippingOptionRule",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "shippingOptionRule",
            },
          },
          shippingOptionType: {
            id: {
              linkable: "shipping_option_type_id",
              entity: "ShippingOptionType",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "shippingOptionType",
            },
          },
          shippingOption: {
            id: {
              linkable: "shipping_option_id",
              entity: "ShippingOption",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "shippingOption",
            },
          },
          shippingProfile: {
            id: {
              linkable: "shipping_profile_id",
              entity: "ShippingProfile",
              primaryKey: "id",
              serviceName: "fulfillment",
              field: "shippingProfile",
            },
          },
        })
      })

      it("should load and save all the providers on bootstrap with the correct is_enabled value", async () => {
        const databaseConfig = {
          schema: "public",
          clientUrl: MikroOrmWrapper.clientUrl!,
        }

        const providersConfig = {}
        for (let i = 0; i < 10; i++) {
          providersConfig[`provider-${i}`] = {}
        }

        let moduleOptions = {
          databaseConfig,
          modulesConfig: {
            [Modules.FULFILLMENT]: {
              definition: ModulesDefinition[Modules.FULFILLMENT],
              options: {
                database: databaseConfig,
                providers: Object.keys(providersConfig).map((id) => ({
                  resolve: resolve(
                    process.cwd() +
                      "/integration-tests/__fixtures__/providers/default-provider"
                  ),
                  id,
                })),
              },
            },
          },
        }

        let { shutdown } = await initModules(moduleOptions)

        let fulfillmentProviders = await MikroOrmWrapper.forkManager().execute(
          `SELECT * FROM fulfillment_provider`
        )

        expect(fulfillmentProviders).toHaveLength(
          Object.keys(providersConfig).length + 1 // +1 for the default provider
        )

        for (const [name] of Object.entries(providersConfig)) {
          const provider = fulfillmentProviders.find((p) => {
            return (
              p.id ===
              FulfillmentProviderService.getRegistrationIdentifier(
                FulfillmentProviderServiceFixtures,
                name
              )
            )
          })!
          expect(provider).toBeDefined()
          expect(provider.is_enabled).toBeTruthy()
        }

        await shutdown()

        const providersConfig2 = {}
        for (let i = 10; i < 20; i++) {
          providersConfig2[`provider-${i}`] = {}
        }

        moduleOptions = {
          databaseConfig,
          modulesConfig: {
            [Modules.FULFILLMENT]: {
              definition: ModulesDefinition[Modules.FULFILLMENT],
              options: {
                database: databaseConfig,
                providers: Object.keys(providersConfig2).map((id) => ({
                  resolve: resolve(
                    process.cwd() +
                      "/integration-tests/__fixtures__/providers/default-provider"
                  ),
                  id,
                })),
              },
            },
          },
        }

        const medusaApp = await initModules(moduleOptions)
        shutdown = medusaApp.shutdown

        fulfillmentProviders = await MikroOrmWrapper.forkManager().execute(
          `SELECT * FROM fulfillment_provider`
        )

        expect(fulfillmentProviders).toHaveLength(
          Object.keys(providersConfig2).length +
            Object.keys(providersConfig).length +
            1 // +1 for the default provider
        )

        const allProviders = Object.assign(
          {},
          providersConfig,
          providersConfig2
        )

        for (const [name] of Object.entries(allProviders)) {
          const provider = fulfillmentProviders.find((p) => {
            return (
              p.id ===
              FulfillmentProviderService.getRegistrationIdentifier(
                FulfillmentProviderServiceFixtures,
                name
              )
            )
          })!
          expect(provider).toBeDefined()

          const isEnabled = !!providersConfig2[name]
          expect(provider.is_enabled).toEqual(isEnabled)
        }

        await shutdown().catch(() => void 0)
      })

      it("should soft delete and restore the data respecting the configured cascade", async () => {
        await createFullDataStructure(service, { providerId })

        let fulfillmentSets = await list(service)
        expectSoftDeleted(fulfillmentSets)

        /**
         * Soft delete the fulfillment set
         */

        await service.softDeleteFulfillmentSets([fulfillmentSets[0].id])
        const deletedFulfillmentSets = await list(
          service,
          {},
          {
            withDeleted: true,
          }
        )
        expectSoftDeleted(deletedFulfillmentSets, { softDeleted: true })

        /**
         * Restore the fulfillment set
         */

        await service.restoreFulfillmentSets([fulfillmentSets[0].id])
        const restoredFulfillmentSets = await list(service, {})
        expectSoftDeleted(restoredFulfillmentSets)
      })
    }),
})
