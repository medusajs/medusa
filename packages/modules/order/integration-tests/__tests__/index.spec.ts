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
          "address",
          "lineItem",
          "lineItemAdjustment",
          "lineItemTaxLine",
          "shippingMethod",
          "shippingMethodAdjustment",
          "shippingMethodTaxLine",
          "transaction",
          "orderChange",
          "orderChangeAction",
          "orderItem",
          "orderSummary",
          "orderShippingMethod",
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
          address: {
            id: {
              linkable: "address_id",
              primaryKey: "id",
              serviceName: "order",
              field: "address",
            },
          },
          lineItem: {
            id: {
              linkable: "line_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "lineItem",
            },
          },
          lineItemAdjustment: {
            id: {
              linkable: "line_item_adjustment_id",
              primaryKey: "id",
              serviceName: "order",
              field: "lineItemAdjustment",
            },
          },
          lineItemTaxLine: {
            id: {
              linkable: "line_item_tax_line_id",
              primaryKey: "id",
              serviceName: "order",
              field: "lineItemTaxLine",
            },
          },
          shippingMethod: {
            id: {
              linkable: "shipping_method_id",
              primaryKey: "id",
              serviceName: "order",
              field: "shippingMethod",
            },
          },
          shippingMethodAdjustment: {
            id: {
              linkable: "shipping_method_adjustment_id",
              primaryKey: "id",
              serviceName: "order",
              field: "shippingMethodAdjustment",
            },
          },
          shippingMethodTaxLine: {
            id: {
              linkable: "shipping_method_tax_line_id",
              primaryKey: "id",
              serviceName: "order",
              field: "shippingMethodTaxLine",
            },
          },
          transaction: {
            id: {
              linkable: "transaction_id",
              primaryKey: "id",
              serviceName: "order",
              field: "transaction",
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
          orderShippingMethod: {
            id: {
              linkable: "order_shipping_method_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShippingMethod",
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
              field: "orderClaimItem",
              linkable: "order_claim_item_id",
              primaryKey: "id",
              serviceName: "order",
            },
          },
          orderClaimItemImage: {
            id: {
              field: "orderClaimItemImage",
              linkable: "order_claim_item_image_id",
              primaryKey: "id",
              serviceName: "order",
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
              field: "orderExchangeItem",
              linkable: "order_exchange_item_id",
              primaryKey: "id",
              serviceName: "order",
            },
          },
        })
      })
    })
  },
})
