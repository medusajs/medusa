import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { FulfillmentSetDTO, IFulfillmentModuleService } from "@medusajs/types"
import {
  initModules,
  moduleIntegrationTestRunner,
  SuiteOptions,
} from "medusa-test-utils/dist"
import { resolve } from "path"
import { createFullDataStructure } from "../../__fixtures__"
import { FulfillmentProviderService } from "@services"
import { FulfillmentProviderServiceFixtures } from "../../__fixtures__/providers"

jest.setTimeout(100000)

let moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      options: {
        config: {
          "test-provider": {},
        },
      },
    },
  ],
}

let providerId = "fixtures-fulfillment-provider_test-provider"

async function list(
  service: IFulfillmentModuleService,
  ...args: Parameters<IFulfillmentModuleService["list"]>
) {
  const [filters = {}, config = {}] = args

  const finalConfig = {
    relations: [
      "service_zones.geo_zones",
      "service_zones.shipping_options.shipping_profile",
      "service_zones.shipping_options.provider",
      "service_zones.shipping_options.type",
      "service_zones.shipping_options.rules",
      "service_zones.shipping_options.fulfillments.labels",
      "service_zones.shipping_options.fulfillments.items",
      "service_zones.shipping_options.fulfillments.delivery_address",
    ],
    ...config,
  }

  return await service.list(filters, finalConfig)
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
      it("should load and save all the providers on bootstrap with the correct is_enabled value", async () => {
        const databaseConfig = {
          schema: "public",
          clientUrl: MikroOrmWrapper.clientUrl,
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
                databaseConfig,
                providers: [
                  {
                    resolve: resolve(
                      process.cwd() +
                        "/integration-tests/__fixtures__/providers/default-provider"
                    ),
                    options: {
                      config: providersConfig,
                    },
                  },
                ],
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
          })
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
                databaseConfig,
                providers: [
                  {
                    resolve: resolve(
                      process.cwd() +
                        "/integration-tests/__fixtures__/providers/default-provider"
                    ),
                    options: {
                      config: providersConfig2,
                    },
                  },
                ],
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
          })
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

        await service.softDelete(fulfillmentSets[0].id)
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

        await service.restore(fulfillmentSets[0].id)
        const restoredFulfillmentSets = await list(service)
        expectSoftDeleted(restoredFulfillmentSets)
      })
    }),
})
