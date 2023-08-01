import { Cart, StorePostCartsCartShippingMethodReq } from "@medusajs/medusa"
import {
  TransactionStepsDefinition,
  WorkflowHandler,
  WorkflowManager,
} from "@medusajs/orchestration"
import { Workflows } from "../../../definitions"
import { exportWorkflow } from "../../../helper"

export type AddShippingMethodWorkflowInputData = {
  cart: Cart
} & StorePostCartsCartShippingMethodReq

export enum AddShippingMethodWorkflowActions {
  prepare = "prepare",
  validateFulfillmentData = "validateFulfillmentData",
  validateLineItemShipping = "validateLineItemShipping",
  getOptionPrice = "getOptionPrice",
  createShippingMethod = "createShippingMethod",
  cleanUpShippingMethods = "cleanUpShippingMethods",
  adjustFreeShipping = "adjustFreeShipping",
  prepareUpdatedCart = "prepareUpdatedCart",
  cleanUpPaymentSessions = "cleanUpPaymentSessions",
  updatePaymentSessions = "updatePaymentSessions",
  result = "result",
}

export const addShippingMethodWorkflowSteps: TransactionStepsDefinition = {
  next: {
    // retrieve cart + custom shipping options
    action: AddShippingMethodWorkflowActions.prepare,
    noCompensation: true,
    saveResponse: true,
    next: [
      {
        // validate fulfillment data
        action: AddShippingMethodWorkflowActions.validateFulfillmentData,
        noCompensation: true,
        saveResponse: true,
      },
      {
        // validate line item shipping
        action: AddShippingMethodWorkflowActions.validateLineItemShipping,
        noCompensation: true,
        next: {
          // get price of shipping option
          action: AddShippingMethodWorkflowActions.getOptionPrice,
          noCompensation: true,
          saveResponse: true,
          next: {
            // create the shipping method
            action: AddShippingMethodWorkflowActions.createShippingMethod,
            noCompensation: true,
            next: {
              // delete other shipping methods with same profile id
              action: AddShippingMethodWorkflowActions.cleanUpShippingMethods,
              next: {
                // adjust free shipping discount wrt new shipping method
                action: AddShippingMethodWorkflowActions.adjustFreeShipping,
                next: {
                  // retrieve cart with updated totals
                  action: AddShippingMethodWorkflowActions.prepareUpdatedCart,
                  noCompensation: true,
                  saveResponse: true,
                  next: {
                    // clean up payment sessions
                    action:
                      AddShippingMethodWorkflowActions.cleanUpPaymentSessions,
                    next: {
                      // update the payment sessions on the cart
                      action:
                        AddShippingMethodWorkflowActions.updatePaymentSessions,
                      // retrieve cart with totals
                      next: {
                        action: AddShippingMethodWorkflowActions.result,
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
  },
}

const handlers = new Map<AddShippingMethodWorkflowActions, WorkflowHandler>([
  [
    AddShippingMethodWorkflowActions.prepare,
    {
      invoke: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.validateFulfillmentData,
    {
      invoke: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.validateLineItemShipping,
    {
      invoke: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.getOptionPrice,
    {
      invoke: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.createShippingMethod,
    {
      invoke: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.cleanUpShippingMethods,
    {
      invoke: {},
      compensate: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.adjustFreeShipping,
    {
      invoke: {},
      compensate: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.prepareUpdatedCart,
    {
      invoke: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.cleanUpPaymentSessions,
    {
      invoke: {},
      compensate: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.updatePaymentSessions,
    {
      invoke: {},
      compensate: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.result,
    {
      invoke: {},
    },
  ],
])

WorkflowManager.register(
  Workflows.AddShippingMethod,
  addShippingMethodWorkflowSteps,
  handlers
)

export const addShippingMethod = exportWorkflow(
  Workflows.AddShippingMethod,
  AddShippingMethodWorkflowActions.prepare
)
