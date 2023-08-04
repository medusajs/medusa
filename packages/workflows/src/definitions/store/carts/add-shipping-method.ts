import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { Workflows } from "../../../definitions"
import { adjustFreeShippingOnCart } from "../../../handlers/store/carts/adjust-free-shipping"
import { cleanUpPaymentSessions } from "../../../handlers/store/carts/clean-up-payment-sessions"
import { cleanUpShippingMethods } from "../../../handlers/store/carts/clean-up-shipping-methods"
import { createShippingMethods } from "../../../handlers/store/carts/create-shipping-methods"
import { getShippingOptionPrice } from "../../../handlers/store/carts/get-shipping-option-price"
import { prepareAddShippingMethodToCartWorkflowData } from "../../../handlers/store/carts/prepare-add-shipping-method-to-cart-data"
import { retrieveCart } from "../../../handlers/store/carts/retrieve-cart"
import { ensureCorrectLineItemShipping } from "../../../handlers/store/carts/update-line-item-shipping"
import { updatePaymentSessions } from "../../../handlers/store/carts/update-payment-sessions"
import { validateShippingOptionForCart } from "../../../handlers/store/carts/validate-shipping-option-for-cart"
import { exportWorkflow, pipe } from "../../../helper"

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
  next: {
    action: AddShippingMethodWorkflowActions.prepare,
    noCompensation: true,
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
                  action:
                    AddShippingMethodWorkflowActions.cleanUpPaymentSessions,
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
  },
}

const handlers = new Map([
  [
    AddShippingMethodWorkflowActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: "input",
          invoke: {
            from: "input",
            alias: "input",
          },
        },
        prepareAddShippingMethodToCartWorkflowData
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.validateFulfillmentData,
    {
      invoke: pipe(
        {
          invoke: {
            from: AddShippingMethodWorkflowActions.prepare,
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
            from: AddShippingMethodWorkflowActions.prepare,
            alias: "lineItems",
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
              from: AddShippingMethodWorkflowActions.prepare,
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: "shippingOptionData",
            },
          ],
        },
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
              from: AddShippingMethodWorkflowActions.prepare,
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: "shippingOptionData",
            },
            {
              from: AddShippingMethodWorkflowActions.getOptionPrice,
              alias: "price",
            },
          ],
        },
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
              from: AddShippingMethodWorkflowActions.prepare,
              alias: "input",
            },
            {
              from: AddShippingMethodWorkflowActions.createShippingMethods,
              alias: "createdShippingMethods"
            },
          ],
        },
        cleanUpShippingMethods
      ),
    },
  ],
  [
    AddShippingMethodWorkflowActions.adjustFreeShipping,
    {
      invoke: pipe(
        {
          invoke: {
            from: AddShippingMethodWorkflowActions.prepare,
            alias: "input",
          },
        },
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
            from: AddShippingMethodWorkflowActions.prepare,
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
            from: AddShippingMethodWorkflowActions.prepare,
            alias: "input",
          },
        },
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
            from: AddShippingMethodWorkflowActions.prepare,
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

export const addShippingMethod = exportWorkflow(
  Workflows.AddShippingMethod,
  AddShippingMethodWorkflowActions.prepare
)
