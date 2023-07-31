import {
  TransactionHandlerType,
  TransactionPayload,
  TransactionStepHandler,
  TransactionStepsDefinition,
} from "@medusajs/orchestration"
import { defaultStoreCartFields, defaultStoreCartRelations } from "../../../api"
import { Cart } from "../../../models"
import { CartService } from "../../../services"
import {
  AddShippingMethodWorkflowInputData,
  InjectedDependencies,
} from "./types"

export enum AddShippingMethodWorkflowActions {
  addShippingMethod = "addShippingMethod",
  validateLineItemShipping = "validateLineItemShipping",
  adjustFreeShipping = "adjustFreeShipping",
  setPaymentSessions = "setPaymentSessions",
  result = "result",
}

export const workflowSteps: TransactionStepsDefinition = {
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

export function transactionHandler(
  dependencies: InjectedDependencies
): TransactionStepHandler {
  const { manager, container } = dependencies

  const command = {
    [AddShippingMethodWorkflowActions.addShippingMethod]: {
      [TransactionHandlerType.INVOKE]: async (
        data: AddShippingMethodWorkflowInputData
      ): Promise<Cart> => {
        // Add shipping method
        return {} as Cart
      },
      [TransactionHandlerType.COMPENSATE]: async (
        data: AddShippingMethodWorkflowInputData,
        { invoke }
      ) => {
        // Delete shipping method
        return {} as Cart
      },
    },

    // This step will need data from previous one, as it has to validate items wrt to the added shipping method
    [AddShippingMethodWorkflowActions.validateLineItemShipping]: {
      [TransactionHandlerType.INVOKE]: async (
        data: any // Data from AddShippingMethodWorkflowActions.addShippingMethod
      ): Promise<Cart> => {
        return {} as Cart
      },
      [TransactionHandlerType.COMPENSATE]: async (
        data: any, // Data from AddShippingMethodWorkflowActions.addShippingMethod
        { invoke }
      ) => {
        return {} as Cart
      },
    },

    // This step will need data from previous one, as it has to adjust discounts wrt to the added shipping method
    [AddShippingMethodWorkflowActions.adjustFreeShipping]: {
      [TransactionHandlerType.INVOKE]: async (
        data: any // Data from AddShippingMethodWorkflowActions.addShippingMethod
      ): Promise<Cart> => {
        return {} as Cart
      },
      [TransactionHandlerType.COMPENSATE]: async (
        data: any, // Data from AddShippingMethodWorkflowActions.addShippingMethod
        { invoke }
      ) => {
        return {} as Cart
      },
    },

    // This step will need data from previous one, as it has to adjust discounts wrt to the added shipping method
    [AddShippingMethodWorkflowActions.setPaymentSessions]: {
      [TransactionHandlerType.INVOKE]: async (): Promise<Cart> => {
        return {} as Cart
      },
      [TransactionHandlerType.COMPENSATE]: async ({ invoke }) => {
        return {} as Cart
      },
    },

    [AddShippingMethodWorkflowActions.result]: {
      [TransactionHandlerType.INVOKE]: async (
        data: AddShippingMethodWorkflowInputData,
        { invoke }
      ) => {
        const cartService = container.resolve("cartService") as CartService

        const cart = await cartService
          .withTransaction(manager)
          .retrieveWithTotals(data.cart.id, {
            select: defaultStoreCartFields,
            relations: defaultStoreCartRelations,
          })

        return cart
      },
    },
  }

  return (
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) => command[actionId][type](payload.data, payload.context)
}
