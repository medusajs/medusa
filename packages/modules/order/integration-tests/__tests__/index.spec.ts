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
          "orderLineItem",
          "orderLineItemAdjustment",
          "orderLineItemTaxLine",
          "orderShippingMethod",
          "orderShippingMethodAdjustment",
          "orderShippingMethodTaxLine",
          "orderTransaction",
          "orderChange",
          "orderChangeAction",
          "orderItem",
          "orderSummary",
          "orderShipping",
          "returnReason",
          "return",
          "returnItem",
          "orderClaim",
          "orderClaimItem",
          "orderClaimItemImage",
          "orderExchange",
          "orderExchangeItem",
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
          orderLineItem: {
            id: {
              linkable: "order_line_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderLineItem",
            },
          },
          orderLineItemAdjustment: {
            id: {
              linkable: "order_line_item_adjustment_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderLineItemAdjustment",
            },
          },
          orderLineItemTaxLine: {
            id: {
              linkable: "order_line_item_tax_line_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderLineItemTaxLine",
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
          orderShippingMethodAdjustment: {
            id: {
              linkable: "order_shipping_method_adjustment_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShippingMethodAdjustment",
            },
          },
          orderShippingMethodTaxLine: {
            id: {
              linkable: "order_shipping_method_tax_line_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShippingMethodTaxLine",
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
          orderChange: {
            id: {
              linkable: "order_change_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderChange",
            },
          },
          orderChangeAction: {
            id: {
              linkable: "order_change_action_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderChangeAction",
            },
          },
          orderItem: {
            id: {
              linkable: "order_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderItem",
            },
          },
          orderSummary: {
            id: {
              linkable: "order_summary_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderSummary",
            },
          },
          orderShipping: {
            id: {
              linkable: "order_shipping_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShipping",
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
          return: {
            id: {
              linkable: "return_id",
              primaryKey: "id",
              serviceName: "order",
              field: "return",
            },
          },
          returnItem: {
            id: {
              linkable: "return_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "returnItem",
            },
          },
          orderClaim: {
            id: {
              linkable: "order_claim_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderClaim",
            },
          },
          orderClaimItem: {
            id: {
              linkable: "order_claim_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderClaimItem",
            },
          },
          orderClaimItemImage: {
            id: {
              linkable: "order_claim_item_image_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderClaimItemImage",
            },
          },
          orderExchange: {
            id: {
              linkable: "order_exchange_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderExchange",
            },
          },
          orderExchangeItem: {
            id: {
              linkable: "order_exchange_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderExchangeItem",
            },
          },
        })
      })
    })
  },
})
