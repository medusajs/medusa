import {
  Cart,
  StorePostCartsCartShippingMethodReq
} from "@medusajs/medusa"
import {
  TransactionStepsDefinition,
  WorkflowHandler,
  WorkflowManager
} from "@medusajs/orchestration"
import { Workflows } from "../../../definitions"
import { exportWorkflow } from "../../../helper"

export type AddShippingMethodWorkflowInputData = {
  cart: Cart
} & StorePostCartsCartShippingMethodReq

export enum AddShippingMethodWorkflowActions {
  addShippingMethod = "addShippingMethod",
  validateLineItemShipping = "validateLineItemShipping",
  adjustFreeShipping = "adjustFreeShipping",
  setPaymentSessions = "setPaymentSessions",
  result = "result",
}

export const addShippingMethodWorkflowSteps: TransactionStepsDefinition = {
  next: {
    // Create Shipping Method
    action: AddShippingMethodWorkflowActions.addShippingMethod,
    saveResponse: true,
    next: [
      {
        // Ensure shipping is correct on Line Items
        action: AddShippingMethodWorkflowActions.validateLineItemShipping,
      },
      {
        // Ensure Discount applicability wrt. new Shipping Method
        action: AddShippingMethodWorkflowActions.adjustFreeShipping,
        next: {
          // Upsert Payment Sessions
          action: AddShippingMethodWorkflowActions.setPaymentSessions,
          // Retrieve Cart with totals
          next: {
            action: AddShippingMethodWorkflowActions.result,
            noCompensation: true,
          },
        },
      },
    ],
  },
}

const handlers = new Map<AddShippingMethodWorkflowActions, WorkflowHandler>([
  [
    AddShippingMethodWorkflowActions.addShippingMethod,
    {
      invoke: {},
      compensate: {},
    },
  ],
  [
    AddShippingMethodWorkflowActions.validateLineItemShipping,
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
    AddShippingMethodWorkflowActions.setPaymentSessions,
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
  AddShippingMethodWorkflowActions.addShippingMethod
)
