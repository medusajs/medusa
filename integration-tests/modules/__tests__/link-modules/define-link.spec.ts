import { medusaIntegrationTestRunner } from "medusa-test-utils"

import CurrencyModule from "@medusajs/currency"
import { MedusaModule } from "@medusajs/modules-sdk"
import RegionModule from "@medusajs/region"
import ProductModule from "@medusajs/product"
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
          serviceName: "currencyCurrencyRegionRegionLink",
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
                region: "region_link.region",
              },
              relationship: {
                serviceName: "currencyCurrencyRegionRegionLink",
                primaryKey: "currency_code",
                foreignKey: "code",
                alias: "region_link",
                isList: false,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                currency: "currency_link.currency",
              },
              relationship: {
                serviceName: "currencyCurrencyRegionRegionLink",
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
          serviceName: "productProductVariantRegionRegionLink",
          isLink: true,
          alias: [
            {
              name: ["product_variant_region"],
              args: {
                entity: "LinkProductServiceProductVariantRegionRegion",
              },
            },
          ],
          primaryKeys: ["id", "product_variant_id", "region_id"],
          relationships: [
            {
              serviceName: "productService",
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
              serviceName: "productService",
              fieldAlias: {
                region: "region_link.region",
              },
              relationship: {
                serviceName: "productProductVariantRegionRegionLink",
                primaryKey: "product_variant_id",
                foreignKey: "id",
                alias: "region_link",
                isList: false,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                product_variant: "product_variant_link.product_variant",
              },
              relationship: {
                serviceName: "productProductVariantRegionRegionLink",
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
          serviceName: "currencyCurrencyRegionRegionLink",
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
                region: "region_link.region",
              },
              relationship: {
                serviceName: "currencyCurrencyRegionRegionLink",
                primaryKey: "currency_code",
                foreignKey: "code",
                alias: "region_link",
                isList: false,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                currency: "currency_link.currency",
              },
              relationship: {
                serviceName: "currencyCurrencyRegionRegionLink",
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

        expect(link.serviceName).toEqual("currencyCurrencyRegionRegionLink")
        expect(linkDefinition).toEqual({
          serviceName: "currencyCurrencyRegionRegionLink",
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
                regions: "region_link.region",
              },
              relationship: {
                serviceName: "currencyCurrencyRegionRegionLink",
                primaryKey: "currency_code",
                foreignKey: "code",
                alias: "region_link",
                isList: true,
              },
            },
            {
              serviceName: "region",
              fieldAlias: {
                currency: "currency_link.currency",
              },
              relationship: {
                serviceName: "currencyCurrencyRegionRegionLink",
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
  },
})
