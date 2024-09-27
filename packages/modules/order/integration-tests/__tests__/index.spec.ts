import { IOrderModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
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
              entity: "Order",
              primaryKey: "id",
              serviceName: "Order",
              field: "order",
            },
          },
          orderAddress: {
            id: {
              linkable: "order_address_id",
              entity: "OrderAddress",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderAddress",
            },
          },
          orderChange: {
            id: {
              linkable: "order_change_id",
              entity: "OrderChange",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderChange",
            },
          },
          orderClaim: {
            id: {
              linkable: "order_claim_id",
              entity: "OrderClaim",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderClaim",
            },
            claim_id: {
              linkable: "claim_id",
              entity: "OrderClaim",
              primaryKey: "claim_id",
              serviceName: "Order",
              field: "orderClaim",
            },
          },
          orderExchange: {
            id: {
              linkable: "order_exchange_id",
              entity: "OrderExchange",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderExchange",
            },
            exchange_id: {
              linkable: "exchange_id",
              entity: "OrderExchange",
              primaryKey: "exchange_id",
              serviceName: "Order",
              field: "orderExchange",
            },
          },
          orderLineItem: {
            id: {
              linkable: "order_line_item_id",
              entity: "OrderLineItem",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderLineItem",
            },
          },
          orderShippingMethod: {
            id: {
              linkable: "order_shipping_method_id",
              entity: "OrderShippingMethod",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderShippingMethod",
            },
          },
          orderTransaction: {
            id: {
              linkable: "order_transaction_id",
              entity: "OrderTransaction",
              primaryKey: "id",
              serviceName: "Order",
              field: "orderTransaction",
            },
          },
          return: {
            id: {
              linkable: "return_id",
              entity: "Return",
              primaryKey: "id",
              serviceName: "Order",
              field: "return",
            },
          },
          returnReason: {
            id: {
              linkable: "return_reason_id",
              entity: "ReturnReason",
              primaryKey: "id",
              serviceName: "Order",
              field: "returnReason",
            },
          },
        })
      })
    })
  },
})
