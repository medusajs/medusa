import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { WorkflowTypes } from "@medusajs/types"
import { adjustFreeShippingOnCart } from "../../../handlers/store/carts/adjust-free-shipping"
import { cleanUpPaymentSessions } from "../../../handlers/store/carts/clean-up-payment-sessions"
import { prepareAddShippingMethodToCartWorkflowData } from "../../../handlers/store/carts/prepare-add-shipping-method-to-cart-data"
import { retrieveCart } from "../../../handlers/store/carts/retrieve-cart"
import { ensureCorrectLineItemShipping } from "../../../handlers/store/carts/update-line-item-shipping"
import { updatePaymentSessions } from "../../../handlers/store/carts/update-payment-sessions"
import { validateShippingOptionForCart } from "../../../handlers/store/carts/validate-shipping-option-for-cart"
import { createShippingMethods } from "../../../handlers/store/shipping-methods/create-shipping-methods"
import { deleteShippingMethods } from "../../../handlers/store/shipping-methods/delete-shipping-methods"
import { prepareShippingMethodsForCreate } from "../../../handlers/store/shipping-methods/prepare-create-shipping-methods-data"
import { prepareDeleteShippingMethodsData } from "../../../handlers/store/shipping-methods/prepare-delete-shipping-methods-data"
import { restoreShippingMethods } from "../../../handlers/store/shipping-methods/restore-shipping-methods"
import { getShippingOptionPrice } from "../../../handlers/store/shipping-options/get-shipping-option-price"
import { prepareGetShippingOptionPriceData } from "../../../handlers/store/shipping-options/prepare-get-shipping-option-price-data"
import { exportWorkflow, pipe } from "../../../helper"
import { Workflows } from "../../../workflows"

export enum AddShippingMethodWorkflowActions {
  prepare = "prepare",
  validateFulfillmentData = "validateFulfillmentData",
  validateLineItemShipping = "validateLineItemShipping",
  getOptionPrice = "getOptionPrice",
  createShippingMethods = "createShippingMethods",
  cleanUpShippingMethods = "cleanUpShippingMethods",
  adjustFreeShipping = "adjustFreeShipping",
  cleanUpPaymentSessions = "cleanUpPaymentSessions",
  updatePaymentSessions = "updatePaymentSessions",
  result = "result",
}

export const addShippingMethodWorkflowSteps: TransactionStepsDefinition = {
  next: [
    {
      action: AddShippingMethodWorkflowActions.validateFulfillmentData,
      noCompensation: true,
    },
    {
      action: AddShippingMethodWorkflowActions.validateLineItemShipping,
      noCompensation: true,
      saveResponse: false,
      next: {
        action: AddShippingMethodWorkflowActions.getOptionPrice,
        noCompensation: true,
        next: {
          action: AddShippingMethodWorkflowActions.createShippingMethods,
          noCompensation: true,
          next: {
            action: AddShippingMethodWorkflowActions.cleanUpShippingMethods,
            saveResponse: false,
            next: {
              action: AddShippingMethodWorkflowActions.adjustFreeShipping,
              saveResponse: false,
              next: {
                action: AddShippingMethodWorkflowActions.cleanUpPaymentSessions,
                saveResponse: false,
                next: {
                  action:
                    AddShippingMethodWorkflowActions.updatePaymentSessions,
                  saveResponse: false,
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
  ],
}

const handlers = new Map([
  [
    AddShippingMethodWorkflowActions.validateFulfillmentData,
    {
      invoke: pipe(
        {
          inputAlias: "input",
          invoke: {
            from: "input",
            alias: "dataToValidate",
          },
        },
        validateShippingOptionForCart
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.validateLineItemShipping,
    {
      invoke: pipe(
        {
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        ensureCorrectLineItemShipping
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.getOptionPrice,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: "input",
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: "shippingOptionData",
            },
          ],
        },
        prepareGetShippingOptionPriceData,
        getShippingOptionPrice
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.createShippingMethods,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: "input",
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: "shippingOptionData",
            },
            {
              from: AddShippingMethodWorkflowActions.getOptionPrice,
              alias: "shippingOptionPrice",
            },
          ],
        },
        prepareShippingMethodsForCreate,
        createShippingMethods
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.cleanUpShippingMethods,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: "input",
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.createShippingMethods,
              alias: "shippingMethods",
            },
          ],
        },
        prepareDeleteShippingMethodsData,
        deleteShippingMethods
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: "input",
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.cleanUpShippingMethods,
              alias: "deletedShippingMethods",
            },
          ],
        },
        restoreShippingMethods
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.adjustFreeShipping,
    {
      invoke: pipe(
        {
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        adjustFreeShippingOnCart
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: "input",
              alias: "input",
            },
          ],
        },
        retrieveCart,
        adjustFreeShippingOnCart
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.cleanUpPaymentSessions,
    {
      invoke: pipe(
        {
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        retrieveCart,
        cleanUpPaymentSessions
      ),
      compensate: pipe(
        {
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        cleanUpPaymentSessions
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.updatePaymentSessions,
    {
      invoke: pipe(
        {
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        retrieveCart,
        updatePaymentSessions
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.result,
    {
      invoke: pipe(
        {
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        retrieveCart
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.AddShippingMethod,
  addShippingMethodWorkflowSteps,
  handlers
)

export const addShippingMethod = exportWorkflow<
  WorkflowTypes.CartWorkflow.AddShippingMethodToCartDTO,
  {
    value: any
  }
>(
  Workflows.AddShippingMethod,
  AddShippingMethodWorkflowActions.result,
  prepareAddShippingMethodToCartWorkflowData
)
