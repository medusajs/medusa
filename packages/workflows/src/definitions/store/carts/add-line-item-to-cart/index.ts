import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { CartDTO, WorkflowTypes } from "@medusajs/types"
import { CartHandlers } from "../../../../handlers"
import { getProductVariantsPricing } from "../../../../handlers/product/get-product-variant-pricing"
import { exportWorkflow, pipe } from "../../../../helper"
import { Workflows } from "../../../../workflows"
import { prepareAddLineItemToCartWorkflowData } from "./prepare-add-line-item-to-cart-data"

export enum Actions {
  prepare = "prepare",
  validateLineItemData = "validateLineItemData",
  getProductVariantPrice = "getProductVariantPrice",
  generateLineItem = "generateLineItem",
  generateAdjustments = "generateAdjustments",
  validateLineItemForCart = "validateLineItemForCart",
  confirmInventory = "confirmInventory",
  upsertLineItem = "upsertLineItem",
  updateShippingOnLineItems = "updateShippingOnLineItems",
  deleteShippingMethods = "deleteShippingMethods",
  refreshAdjustments = "refreshAdjustments",
  upsertPaymentSessions = "upsertPaymentSessions",
  result = "result",
}

export const steps: TransactionStepsDefinition = {
  next: [
    {
      action: Actions.getProductVariantPrice,
      noCompensation: true,
      next: {
        action: Actions.generateLineItem,
        noCompensation: true,
        next: {
          action: Actions.generateAdjustments,
          next: {
            action: Actions.validateLineItemForCart,
            next: {
              action: Actions.confirmInventory,
              saveResponse: false,
              next: {
                action: Actions.upsertLineItem,
                saveResponse: false,
                next: {
                  action: Actions.updateShippingOnLineItems,
                  noCompensation: true,
                  next: {
                    action: Actions.deleteShippingMethods,
                    noCompensation: true,
                    next: {
                      action: Actions.refreshAdjustments,
                      noCompensation: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
}

const handlers = new Map([
  [
    Actions.getProductVariantPrice,
    {
      invoke: pipe(
        {
          inputAlias: Actions.prepare,
          invoke: {
            from: Actions.prepare,
          },
          merge: true,
        },
        getProductVariantsPricing
      ),
    },
  ],
  [
    Actions.validateLineItemData,
    {
      invoke: pipe(
        {
          inputAlias: Actions.prepare,
          invoke: {
            from: Actions.prepare,
          },
          merge: true,
        },
        CartHandlers.validateShippingOptionForCart
      ),
    },
  ],
])

WorkflowManager.register(Workflows.AddLineItemToCart, steps, handlers)

export const addLineItemToCart = exportWorkflow<
  WorkflowTypes.CartWorkflow.AddLineItemToCartWorkflowDTO,
  CartDTO
>(
  Workflows.AddLineItemToCart,
  Actions.result,
  prepareAddLineItemToCartWorkflowData
)
