import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { IOrderModuleService } from "@medusajs/types"
import { Module, Modules } from "@medusajs/utils"
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
          "address",
          "adjustmentLine",
          "claimItemImage",
          "orderClaimItem",
          "orderClaim",
          "orderExchangeItem",
          "orderExchange",
          "lineItemAdjustment",
          "lineItemTaxLine",
          "lineItem",
          "orderChangeAction",
          "orderChange",
          "orderItem",
          "orderShippingMethod",
          "orderSummary",
          "order",
          "returnItem",
          "returnReason",
          "return",
          "shippingMethodAdjustment",
          "shippingMethodTaxLine",
          "shippingMethod",
          "taxLine",
          "transaction",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          address: {
            id: {
              linkable: "address_id",
              primaryKey: "id",
              serviceName: "order",
              field: "address",
            },
          },
          adjustmentLine: {
            id: {
              linkable: "adjustment_line_id",
              primaryKey: "id",
              serviceName: "order",
              field: "adjustmentLine",
            },
          },
          claimItemImage: {
            id: {
              linkable: "claim_item_image_id",
              primaryKey: "id",
              serviceName: "order",
              field: "claimItemImage",
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
          orderClaim: {
            id: {
              linkable: "order_claim_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderClaim",
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
          orderExchange: {
            id: {
              linkable: "order_exchange_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderExchange",
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
          lineItem: {
            id: {
              linkable: "line_item_id",
              primaryKey: "id",
              serviceName: "order",
              field: "lineItem",
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
          orderChange: {
            id: {
              linkable: "order_change_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderChange",
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
          orderShippingMethod: {
            id: {
              linkable: "order_shipping_method_id",
              primaryKey: "id",
              serviceName: "order",
              field: "orderShippingMethod",
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
          order: {
            id: {
              linkable: "order_id",
              primaryKey: "id",
              serviceName: "order",
              field: "order",
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
          shippingMethod: {
            id: {
              linkable: "shipping_method_id",
              primaryKey: "id",
              serviceName: "order",
              field: "shippingMethod",
            },
          },
          taxLine: {
            id: {
              linkable: "tax_line_id",
              primaryKey: "id",
              serviceName: "order",
              field: "taxLine",
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
        })
      })
    })
  },
})
