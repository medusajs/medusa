import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../../../definitions"
import { adjustFreeShipping } from "../../../handlers/store/carts/adjust-free-shipping"
import { cleanUpPaymentSessions } from "../../../handlers/store/carts/clean-up-payment-sessions"
import { cleanUpShippingMethods } from "../../../handlers/store/carts/clean-up-shipping-methods"
import { getShippingOptionPrice } from "../../../handlers/store/carts/get-shipping-option-price"
import { prepareAddShippingMethodToCartWorkflowData } from "../../../handlers/store/carts/prepare-add-shipping-method-to-cart-data"
import { retrieveCart } from "../../../handlers/store/carts/retrieve-cart"
import { updateLineItemShipping } from "../../../handlers/store/carts/update-line-item-shipping"
import { updatePaymentSessions } from "../../../handlers/store/carts/update-payment-sessions"
import { validateShippingOptionForCart } from "../../../handlers/store/carts/validate-shipping-option-for-cart"
import { exportWorkflow, pipe } from "../../../helper"

export type AddShippingMethodWorkflowInputData = {
  cart: any // Cart
}
// & StorePostCartsCartShippingMethodReq

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
    // retrieve cart + custom shipping options
    action: AddShippingMethodWorkflowActions.prepare,
    noCompensation: true,
    next: [
      {
        // validate fulfillment data
        action: AddShippingMethodWorkflowActions.validateFulfillmentData,
        noCompensation: true,
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
            action: AddShippingMethodWorkflowActions.createShippingMethods,
            noCompensation: true,
            next: {
              // delete other shipping methods with same profile id
              action: AddShippingMethodWorkflowActions.cleanUpShippingMethods,
              saveResponse: false,
              next: {
                // adjust free shipping discount wrt new shipping method
                action: AddShippingMethodWorkflowActions.adjustFreeShipping,
                saveResponse: false,
                next: {
                  // clean up payment sessions
                  action:
                    AddShippingMethodWorkflowActions.cleanUpPaymentSessions,
                  saveResponse: false,
                  next: {
                    // update the payment sessions on the cart
                    action:
                      AddShippingMethodWorkflowActions.updatePaymentSessions,
                    saveResponse: false,
                    // retrieve cart with totals
                    next: {
                      action: AddShippingMethodWorkflowActions.result,
                      noCompensation: true,
                      saveResponse: false,
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
          inputAlias: InputAlias.AddShippingMethodInputData,
          invoke: {
            from: InputAlias.AddShippingMethodInputData,
            alias: InputAlias.AddShippingMethodInputData,
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
            alias: InputAlias.ShippingOptionToValidate,
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
            alias: InputAlias.LineItems,
          },
        },
        updateLineItemShipping
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
              alias: InputAlias.PreparedAddShippingMethodToCartData,
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: InputAlias.ValidatedShippingOptionData,
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
              alias: InputAlias.PreparedAddShippingMethodToCartData,
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: InputAlias.ValidatedShippingOptionData,
            },
            {
              from: AddShippingMethodWorkflowActions.getOptionPrice,
              alias: InputAlias.ShippingOptionPrice,
            },
          ],
        },
        getShippingOptionPrice
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
              alias: InputAlias.PreparedAddShippingMethodToCartData,
            },
            {
              from: AddShippingMethodWorkflowActions.createShippingMethods,
              alias: InputAlias.CreatedShippingMethods,
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
            alias: InputAlias.PreparedAddShippingMethodToCartData,
          },
        },
        adjustFreeShipping
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
            alias: InputAlias.PreparedAddShippingMethodToCartData,
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
            alias: InputAlias.PreparedAddShippingMethodToCartData,
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
            alias: InputAlias.PreparedAddShippingMethodToCartData,
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
