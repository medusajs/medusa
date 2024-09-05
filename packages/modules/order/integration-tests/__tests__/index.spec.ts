import { IOrderModuleService } from "@medusajs/types"
import { Module, Modules } from "@medusajs/utils"
import { OrderModuleService } from "@services"
import { moduleIntegrationTestRunner } from "medusa-test-utils"

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: () => {
    describe("Order Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.ORDER, {
          service: OrderModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "order",
          "orderAddress",
          "orderChange",
          "orderClaim",
          "orderExchange",
          "orderLineItem",
          "orderShippingMethod",
          "orderTransaction",
          "return",
          "returnReason",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          order: {
            id: {
              linkable: "order_id",
              primaryKey: "id",
              serviceName: "order",
              field: "order",
            },
          },
          orderAddress: {
            id: {
              linkable: "order_address_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderAddress",
            },
          },
          orderChange: {
            id: {
              linkable: "order_change_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderChange",
            },
          },
          orderClaim: {
            id: {
              linkable: "order_claim_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderClaim",
            },
            claim_id: {
              linkable: "claim_id",
              primaryKey: "claim_id",
              serviceName: "order",
              field: "orderClaim",
            },
          },
          orderExchange: {
            id: {
              linkable: "order_exchange_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderExchange",
            },
            exchange_id: {
              linkable: "exchange_id",
              primaryKey: "exchange_id",
              serviceName: "order",
              field: "orderExchange",
            },
          },
          orderLineItem: {
            id: {
              linkable: "order_line_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderLineItem",
            },
          },
          orderShippingMethod: {
            id: {
              linkable: "order_shipping_method_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShippingMethod",
            },
          },
          orderTransaction: {
            id: {
              linkable: "order_transaction_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderTransaction",
            },
          },
          return: {
            id: {
              linkable: "return_id",
              primaryKey: "id",
              serviceName: "order",
              field: "return",
            },
          },
          returnReason: {
            id: {
              linkable: "return_reason_id",
              primaryKey: "id",
              serviceName: "order",
              field: "returnReason",
            },
          },
        })
      })
    })
  },
})
