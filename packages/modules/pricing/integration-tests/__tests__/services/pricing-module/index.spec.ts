import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { IPricingModuleService } from "@medusajs/types"
import { Module, Modules } from "@medusajs/utils"
import { PricingModuleService } from "@services"

moduleIntegrationTestRunner<IPricingModuleService>({
  moduleName: Modules.PRICING,
  testSuite: () => {
    describe("PricingModule Service - Calculate Price", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.PRICING, {
          service: PricingModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "priceSet",
          "priceList",
          "price",
          "pricePreference",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          priceSet: {
            id: {
              linkable: "price_set_id",
              primaryKey: "id",
              serviceName: "pricingService",
              field: "priceSet",
            },
          },
          priceList: {
            id: {
              linkable: "price_list_id",
              primaryKey: "id",
              serviceName: "pricingService",
              field: "priceList",
            },
          },
          price: {
            id: {
              linkable: "price_id",
              primaryKey: "id",
              serviceName: "pricingService",
              field: "price",
            },
          },
          pricePreference: {
            id: {
              linkable: "price_preference_id",
              primaryKey: "id",
              serviceName: "pricingService",
              field: "pricePreference",
            },
          },
        })
      })
    })
  },
})
