import { IOrderModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { OrderModuleService } from "@services"

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
          "orderItem",
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
              serviceName: "order",
              field: "order",
            },
          },
          orderAddress: {
            id: {
              linkable: "order_address_id",
              entity: "OrderAddress",
              primaryKey: "id",
              serviceName: "order",
              field: "orderAddress",
            },
          },
          orderChange: {
            id: {
              linkable: "order_change_id",
              entity: "OrderChange",
              primaryKey: "id",
              serviceName: "order",
              field: "orderChange",
            },
          },
          orderClaim: {
            id: {
              linkable: "order_claim_id",
              entity: "OrderClaim",
              primaryKey: "id",
              serviceName: "order",
              field: "orderClaim",
            },
            claim_id: {
              linkable: "claim_id",
              entity: "OrderClaim",
              primaryKey: "claim_id",
              serviceName: "order",
              field: "orderClaim",
            },
          },
          orderExchange: {
            id: {
              linkable: "order_exchange_id",
              entity: "OrderExchange",
              primaryKey: "id",
              serviceName: "order",
              field: "orderExchange",
            },
            exchange_id: {
              linkable: "exchange_id",
              entity: "OrderExchange",
              primaryKey: "exchange_id",
              serviceName: "order",
              field: "orderExchange",
            },
          },
          orderItem: {
            id: {
              linkable: "order_item_id",
              entity: "OrderItem",
              primaryKey: "id",
              serviceName: "order",
              field: "orderItem",
            },
          },
          orderLineItem: {
            id: {
              linkable: "order_line_item_id",
              entity: "OrderLineItem",
              primaryKey: "id",
              serviceName: "order",
              field: "orderLineItem",
            },
          },
          orderShippingMethod: {
            id: {
              linkable: "order_shipping_method_id",
              entity: "OrderShippingMethod",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShippingMethod",
            },
          },
          orderTransaction: {
            id: {
              linkable: "order_transaction_id",
              entity: "OrderTransaction",
              primaryKey: "id",
              serviceName: "order",
              field: "orderTransaction",
            },
          },
          return: {
            id: {
              linkable: "return_id",
              entity: "Return",
              primaryKey: "id",
              serviceName: "order",
              field: "return",
            },
          },
          returnReason: {
            id: {
              linkable: "return_reason_id",
              entity: "ReturnReason",
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
