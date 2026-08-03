import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

import CurrencyModule from "@medusajs/currency"
import { MedusaModule } from "@medusajs/modules-sdk"
import ProductModule from "@medusajs/product"
import RegionModule from "@medusajs/region"
import { defineLink } from "@medusajs/utils"

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
              hasMany: false,
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
              hasMany: false,
              args: {
                methodSuffix: "Regions",
              },
              deleteCascade: false,
            },
          ],
          extends: [
            {
              serviceName: "currency",
              entity: "Currency",
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
              entity: "Region",
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
              hasMany: false,
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
              hasMany: false,
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
              entity: "ProductVariant",
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
              entity: "Region",
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
              hasMany: false,
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
              hasMany: false,
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
              entity: "Currency",
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
              entity: "Region",
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
              hasMany: false,
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
              hasMany: true,
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
              entity: "Currency",
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
              entity: "Region",
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

      it("should generate a proper link with both sides using explicit isList=true", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(
          {
            linkable: currencyLinks.currency,
            isList: true,
          },
          {
            linkable: regionLinks.region,
            isList: true,
          }
        )

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
              hasMany: true,
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
              hasMany: true,
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
              entity: "Currency",
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
              entity: "Region",
              fieldAlias: {
                currencies: {
                  path: "currency_link.currency",
                  isList: true,
                  forwardArgumentsOnPath: ["currency_link.currency"],
                },
              },
              relationship: {
                serviceName: "CurrencyCurrencyRegionRegionLink",
                entity: "LinkCurrencyCurrencyRegionRegion",
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "currency_link",
                isList: true,
              },
            },
          ],
        })
      })

      it("should generate a proper link with both sides using explicit isList=false", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(
          {
            linkable: currencyLinks.currency,
            isList: false,
          },
          {
            linkable: regionLinks.region,
            isList: false,
          }
        )

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
              hasMany: false,
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
              hasMany: false,
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
              entity: "Currency",
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
              entity: "Region",
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

      it("should generate a read-only link definition with pluralized alias when isList is true", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        defineLink(
          {
            linkable: currencyLinks.currency,
            field: "region_id",
          },
          {
            linkable: regionLinks.region,
          },
          {
            readOnly: true,
            isList: true,
          }
        )

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.isReadOnlyLink && definition
          })
          .filter(Boolean)[0]

        expect(linkDefinition).toEqual({
          isLink: true,
          isReadOnlyLink: true,
          extends: [
            {
              serviceName: "currency",
              entity: "Currency",
              fieldAlias: undefined,
              relationship: {
                serviceName: "region",
                entity: "Region",
                primaryKey: "id",
                foreignKey: "region_id",
                alias: "region",
                isList: true,
              },
            },
            {
              serviceName: "currency",
              entity: "Currency",
              fieldAlias: undefined,
              relationship: {
                serviceName: "region",
                entity: "Region",
                primaryKey: "id",
                foreignKey: "region_id",
                alias: "regions",
                isList: true,
              },
            },
          ],
        })
      })

      it("should use a custom alias when provided in InputOptions for a regular link", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        const link = defineLink(currencyLinks.currency, {
          linkable: regionLinks.region,
          alias: "primary_region",
        })

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.serviceName === link.serviceName && definition
          })
          .filter(Boolean)[0]

        expect(link.serviceName).toEqual(
          "CurrencyCurrencyRegionPrimaryRegionLink"
        )
        expect(link.entryPoint).toEqual("currency_primary_region")
        expect(linkDefinition.relationships[1].alias).toEqual("primary_region")
        expect(linkDefinition.extends[0].fieldAlias).toHaveProperty(
          "primary_region"
        )
        expect(linkDefinition.extends[0].relationship.alias).toEqual(
          "primary_region_link"
        )
      })

      it("should allow two read-only links to the same module using distinct aliases", async () => {
        const currencyLinks = CurrencyModule.linkable
        const regionLinks = RegionModule.linkable

        defineLink(
          {
            linkable: currencyLinks.currency,
            field: "primary_region_id",
          },
          {
            linkable: regionLinks.region,
            alias: "primary_region",
          },
          { readOnly: true }
        )

        defineLink(
          {
            linkable: currencyLinks.currency,
            field: "secondary_region_id",
          },
          {
            linkable: regionLinks.region,
            alias: "secondary_region",
          },
          { readOnly: true }
        )

        const readOnlyLinks = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(
              MedusaModule.getAllJoinerConfigs()
            )
            return definition.isReadOnlyLink && definition
          })
          .filter(Boolean)

        const primaryLink = readOnlyLinks.find((d: any) =>
          d.extends.some(
            (e: any) => e.relationship?.alias === "primary_region"
          )
        )
        const secondaryLink = readOnlyLinks.find((d: any) =>
          d.extends.some(
            (e: any) => e.relationship?.alias === "secondary_region"
          )
        )

        expect(primaryLink).toBeDefined()
        expect(secondaryLink).toBeDefined()

        expect(primaryLink.extends[0].relationship).toMatchObject({
          alias: "primary_region",
          foreignKey: "primary_region_id",
          serviceName: "region",
        })
        expect(secondaryLink.extends[0].relationship).toMatchObject({
          alias: "secondary_region",
          foreignKey: "secondary_region_id",
          serviceName: "region",
        })
      })
    })
  },
})
