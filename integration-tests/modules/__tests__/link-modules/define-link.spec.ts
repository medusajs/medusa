import { medusaIntegrationTestRunner } from "medusa-test-utils"
import CurrencyModule from "@medusajs/currency"
import RegionModule from "@medusajs/region"
import { defineLink } from "@medusajs/utils"
import { MedusaModule } from "@medusajs/modules-sdk"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("defineLink", () => {
      let appContainer
      let remoteQuery

      beforeAll(async () => {
        appContainer = getContainer()
        remoteQuery = appContainer.resolve("remoteQuery")
      })

      it("should generate a proper link definition", async () => {
        const currencyLinks = CurrencyModule.links
        const regionLinks = RegionModule.links as any // TODO fix typings for model.define with config object

        const link = defineLink(currencyLinks.currency, regionLinks.region)

        const linkDefinition = MedusaModule.getCustomLinks()
          .map((linkDefinition: any) => {
            const definition = linkDefinition(MedusaModule.getLoadedModules())
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
            },
            {
              serviceName: "region",
              primaryKey: "id",
              foreignKey: "region_id",
              alias: "region",
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
                primaryKey: "region_id",
                foreignKey: "id",
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
                primaryKey: "currency_code",
                foreignKey: "code",
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
