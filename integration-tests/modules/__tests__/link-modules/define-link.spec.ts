import { medusaIntegrationTestRunner } from "medusa-test-utils"

import CurrencyModule from "@medusajs/currency"
import { MedusaModule } from "@medusajs/modules-sdk"
import ProductModule from "@medusajs/product"
import RegionModule from "@medusajs/region"
import { defineLink, defineReadOnlyLink, Modules } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("defineLink", () => {
      it("should generate a proper link definition", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(currencyLinks.currency, regionLinks.region)

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.serviceName === link.serviceName && definition
          })
          .filter(Boolean)[0]

        expect(link.serviceName).toEqual(linkDefinition.serviceName)
        expect(link.entryPoint).toEqual(linkDefinition.alias[0].name[0])
        expect(linkDefinition).toEqual({
          serviceName: "CurrencyCurrencyRegionRegionLink",
          isLink: true,
          alias: [
            {
              name: ["currency_region"],
              args: {
                entity: "LinkCurrencyCurrencyRegionRegion",
              },
            },
          ],
          primaryKeys: ["id", "currency_code", "region_id"],
          relationships: [
            {
              serviceName: "currency",
              entity: "Currency",
              primaryKey: "code",
              foreignKey: "currency_code",
              alias: "currency",
              args: {
                methodSuffix: "Currencies",
              },
              deleteCascade: false,
            },
            {
              serviceName: "region",
              entity: "Region",
              primaryKey: "id",
              foreignKey: "region_id",
              alias: "region",
              args: {
                methodSuffix: "Regions",
              },
              deleteCascade: false,
            },
          ],
          extends: [
            {
              serviceName: "currency",
              fieldAlias: {
                region: {
                  path: "region_link.region",
                  isList: false,
                  forwardArgumentsOnPath: ["region_link.region"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "currency_code",
                foreignKey: "code",
                alias: "region_link",
                isList: false,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                currency: {
                  path: "currency_link.currency",
                  isList: false,
                  forwardArgumentsOnPath: ["currency_link.currency"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "currency_link",
                isList: false,
              },
            },
          ],
        })
      })

      it("should generate a proper link definition with multi parts entity name", async () => {
        const productVariantLinks = ProductModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(
          productVariantLinks.productVariant,
          regionLinks.region
        )

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.serviceName === link.serviceName && definition
          })
          .filter(Boolean)[0]

        expect(link.serviceName).toEqual(linkDefinition.serviceName)
        expect(link.entryPoint).toEqual(linkDefinition.alias[0].name[0])
        expect(linkDefinition).toEqual({
          serviceName: "ProductProductVariantRegionRegionLink",
          isLink: true,
          alias: [
            {
              name: ["product_variant_region"],
              args: {
                entity: "LinkProductProductVariantRegionRegion",
              },
            },
          ],
          primaryKeys: ["id", "product_variant_id", "region_id"],
          relationships: [
            {
              serviceName: "product",
              entity: "ProductVariant",
              primaryKey: "id",
              foreignKey: "product_variant_id",
              alias: "product_variant",
              args: {
                methodSuffix: "ProductVariants",
              },
              deleteCascade: false,
            },
            {
              serviceName: "region",
              entity: "Region",
              primaryKey: "id",
              foreignKey: "region_id",
              alias: "region",
              args: {
                methodSuffix: "Regions",
              },
              deleteCascade: false,
            },
          ],
          extends: [
            {
              serviceName: "product",
              fieldAlias: {
                region: {
                  path: "region_link.region",
                  isList: false,
                  forwardArgumentsOnPath: ["region_link.region"],
                },
              },
              relationship: {
                serviceName: "ProductProductVariantRegionRegionLink",
                entity: "LinkProductProductVariantRegionRegion",
                primaryKey: "product_variant_id",
                foreignKey: "id",
                alias: "region_link",
                isList: false,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                product_variant: {
                  path: "product_variant_link.product_variant",
                  isList: false,
                  forwardArgumentsOnPath: [
                    "product_variant_link.product_variant",
                  ],
                },
              },
              relationship: {
                serviceName: "ProductProductVariantRegionRegionLink",
                entity: "LinkProductProductVariantRegionRegion",
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "product_variant_link",
                isList: false,
              },
            },
          ],
        })
      })

      it("should flag deleteCascade in the link definition", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(
          {
            linkable: currencyLinks.currency,
            deleteCascade: true,
          },
          regionLinks.region
        )

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.serviceName === link.serviceName && definition
          })
          .filter(Boolean)[0]

        expect(link.serviceName).toEqual(linkDefinition.serviceName)
        expect(link.entryPoint).toEqual(linkDefinition.alias[0].name[0])
        expect(linkDefinition).toEqual({
          serviceName: "CurrencyCurrencyRegionRegionLink",
          isLink: true,
          alias: [
            {
              name: ["currency_region"],
              args: {
                entity: "LinkCurrencyCurrencyRegionRegion",
              },
            },
          ],
          primaryKeys: ["id", "currency_code", "region_id"],
          relationships: [
            {
              serviceName: "currency",
              entity: "Currency",
              primaryKey: "code",
              foreignKey: "currency_code",
              alias: "currency",
              args: {
                methodSuffix: "Currencies",
              },
              deleteCascade: true,
            },
            {
              serviceName: "region",
              entity: "Region",
              primaryKey: "id",
              foreignKey: "region_id",
              alias: "region",
              args: {
                methodSuffix: "Regions",
              },
              deleteCascade: false,
            },
          ],
          extends: [
            {
              serviceName: "currency",
              fieldAlias: {
                region: {
                  path: "region_link.region",
                  isList: false,
                  forwardArgumentsOnPath: ["region_link.region"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "currency_code",
                foreignKey: "code",
                alias: "region_link",
                isList: false,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                currency: {
                  path: "currency_link.currency",
                  isList: false,
                  forwardArgumentsOnPath: ["currency_link.currency"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "currency_link",
                isList: false,
              },
            },
          ],
        })
      })

      it("should generate a proper link definition passing an object as option", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(currencyLinks.currency, {
          linkable: regionLinks.region,
          isList: true,
        })

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.serviceName === link.serviceName && definition
          })
          .filter(Boolean)[0]

        expect(link.serviceName).toEqual("CurrencyCurrencyRegionRegionLink")
        expect(linkDefinition).toEqual({
          serviceName: "CurrencyCurrencyRegionRegionLink",
          isLink: true,
          alias: [
            {
              name: ["currency_region"],
              args: {
                entity: "LinkCurrencyCurrencyRegionRegion",
              },
            },
          ],
          primaryKeys: ["id", "currency_code", "region_id"],
          relationships: [
            {
              serviceName: "currency",
              entity: "Currency",
              primaryKey: "code",
              foreignKey: "currency_code",
              alias: "currency",
              args: {
                methodSuffix: "Currencies",
              },
              deleteCascade: false,
            },
            {
              serviceName: "region",
              entity: "Region",
              primaryKey: "id",
              foreignKey: "region_id",
              alias: "region",
              args: {
                methodSuffix: "Regions",
              },
              deleteCascade: false,
            },
          ],
          extends: [
            {
              serviceName: "currency",
              fieldAlias: {
                regions: {
                  path: "region_link.region",
                  isList: true,
                  forwardArgumentsOnPath: ["region_link.region"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "currency_code",
                foreignKey: "code",
                alias: "region_link",
                isList: true,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                currency: {
                  path: "currency_link.currency",
                  isList: false,
                  forwardArgumentsOnPath: ["currency_link.currency"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "currency_link",
                isList: false,
              },
            },
          ],
        })
      })
    })

    it("should define read-only links", async () => {
      defineReadOnlyLink(
        CurrencyModule.linkable.currency,
        RegionModule.linkable.region
      )
      defineReadOnlyLink(
        {
          linkable: CurrencyModule.linkable.currency,
          field: "my_custom_currency_code",
        },
        RegionModule.linkable.region
      )
      defineReadOnlyLink(
        {
          linkable: CurrencyModule.linkable.currency,
          field: "my_custom_id",
        },
        {
          module: Modules.REGION,
          entity: "Country",
          field: "region_country_code_id",
          alias: "my_custom_region",
        }
      )
      defineReadOnlyLink(
        {
          linkable: CurrencyModule.linkable.currency,
          field: "custom_currency_id",
        },
        {
          linkable: CurrencyModule.linkable.currency,
          field: "country_code",
          alias: "custom_region_code",
        }
      )
      defineReadOnlyLink(
        {
          linkable: CurrencyModule.linkable.currency,
          field: "my_custom_id",
        },
        {
          module: Modules.REGION,
          entity: "Country",
          field: "region_country_code_id",
          alias: "my_custom_region",
        }
      )
      defineReadOnlyLink(
        {
          module: Modules.REGION,
          entity: "Country",
          field: "country_code",
        },
        {
          module: "Weather",
          field: "country_code_id",
          alias: "weather_forecast",
          isList: true,
        }
      )
      defineReadOnlyLink(
        {
          module: Modules.PRODUCT,
          field: "season_id",
        },
        {
          module: "Weather",
          field: "season_id",
          alias: "season_forecast",
        }
      )

      const linkDefinition = MedusaModule.getCustomLinks()
        .map((linkDefinition: any) => {
          const mods = MedusaModule.getAllJoinerConfigs()
          mods.push({
            serviceName: "Weather",
            primaryKeys: ["id"],
          })
          return linkDefinition(mods)
        })
        .filter((a) => a.isReadOnlyLink)

      const expectReadOnlyLinks = [
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Currency",
              entity: "Currency",
              relationship: expect.objectContaining({
                serviceName: "Region",
                entity: "Region",
                primaryKey: "id",
                foreignKey: "currency",
                alias: "region",
                isList: false,
              }),
            },
          ],
        }),
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Currency",
              entity: "Currency",
              relationship: expect.objectContaining({
                serviceName: "Region",
                entity: "Region",
                primaryKey: "id",
                foreignKey: "my_custom_currency_code",
                alias: "region",
                isList: false,
              }),
            },
          ],
        }),
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Currency",
              entity: "Currency",
              relationship: expect.objectContaining({
                serviceName: "Region",
                entity: "Country",
                primaryKey: "region_country_code_id",
                foreignKey: "my_custom_id",
                alias: "my_custom_region",
                isList: false,
              }),
            },
          ],
        }),
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Currency",
              entity: "Currency",
              relationship: expect.objectContaining({
                serviceName: "Currency",
                entity: "Currency",
                primaryKey: "code",
                foreignKey: "custom_currency_id",
                alias: "custom_region_code",
                isList: false,
              }),
            },
          ],
        }),
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Currency",
              entity: "Currency",
              relationship: expect.objectContaining({
                serviceName: "Region",
                entity: "Country",
                primaryKey: "region_country_code_id",
                foreignKey: "my_custom_id",
                alias: "my_custom_region",
                isList: false,
              }),
            },
          ],
        }),
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Region",
              entity: "Country",
              relationship: expect.objectContaining({
                serviceName: "Weather",
                primaryKey: "country_code_id",
                foreignKey: "country_code",
                alias: "weather_forecast",
                isList: true,
              }),
            },
          ],
        }),
        expect.objectContaining({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "Product",
              relationship: expect.objectContaining({
                serviceName: "Weather",
                primaryKey: "season_id",
                foreignKey: "season_id",
                alias: "season_forecast",
                isList: false,
              }),
            },
          ],
        }),
      ]

      expect(linkDefinition).toEqual(expectReadOnlyLinks)
    })
  },
})
