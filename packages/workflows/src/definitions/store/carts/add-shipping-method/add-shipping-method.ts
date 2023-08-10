import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { CartDTO, WorkflowTypes } from "@medusajs/types"
import {
  CartHandlers,
  ShippingMethodHandlers,
  ShippingOptionHandlers,
} from "../../../../handlers"
import { exportWorkflow, pipe } from "../../../../helper"
import { Workflows } from "../../../../workflows"
import { prepareAddShippingMethodToCartWorkflowData } from "./prepare-add-shipping-method-to-cart-data"
import { prepareDeleteShippingMethodsData } from "./prepare-delete-shipping-methods-data"
import { setRetrieveConfig } from "./set-retrieve-config"

export enum AddShippingMethodWorkflowActions {
  prepare = "input",
  validateFulfillmentData = "validateFulfillmentData",
  validateLineItemShipping = "validateLineItemShipping",
  getOptionPrice = "getOptionPrice",
  createShippingMethods = "createShippingMethods",
  cleanUpShippingMethods = "cleanUpShippingMethods",
  adjustFreeShipping = "adjustFreeShipping",
  cleanUpPaymentSessions = "cleanUpPaymentSessions",
  updatePaymentSessions = "updatePaymentSessions",
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
          next: {
            action: AddShippingMethodWorkflowActions.cleanUpShippingMethods,
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
          inputAlias: AddShippingMethodWorkflowActions.prepare,
          invoke: {
            from: AddShippingMethodWorkflowActions.prepare,
          },
          merge: true,
        },
        CartHandlers.validateShippingOptionForCart
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
          },
          merge: true,
        },
        CartHandlers.ensureCorrectLineItemShipping
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
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
              alias: "shippingOptionData",
            },
          ],
          merge: true,
        },
        ShippingOptionHandlers.getShippingOptionPrice
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
            },
            {
              from: AddShippingMethodWorkflowActions.validateFulfillmentData,
            },
            {
              from: AddShippingMethodWorkflowActions.getOptionPrice,
            },
          ],
          merge: true,
        },
        ShippingMethodHandlers.createShippingMethods
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: AddShippingMethodWorkflowActions.createShippingMethods,
              alias: "shippingMethodsToDelete",
            },
          ],
        },
        ShippingMethodHandlers.deleteShippingMethods
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
              alias: "shippingMethods",
            },
          ],
        },
        prepareDeleteShippingMethodsData,
        ShippingMethodHandlers.deleteShippingMethods
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: AddShippingMethodWorkflowActions.prepare,
            },
            {
              from: AddShippingMethodWorkflowActions.cleanUpShippingMethods,
              alias: "deletedShippingMethods",
            },
          ],
          merge: true,
        },
        ShippingMethodHandlers.restoreShippingMethods
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
          },
          merge: true,
        },
        setRetrieveConfig({
          relations: [
            "discounts",
            "discounts.rule",
            "shipping_methods",
            "shipping_methods.shipping_option",
          ],
        }),
        CartHandlers.retrieveCart,
        CartHandlers.adjustFreeShippingOnCart
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: AddShippingMethodWorkflowActions.prepare,
            },
          ],
          merge: true,
        },
        setRetrieveConfig({
          relations: [
            "discounts",
            "discounts.rule",
            "shipping_methods",
            "shipping_methods.shipping_option",
          ],
        }),
        CartHandlers.retrieveCart,
        CartHandlers.adjustFreeShippingOnCart
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
          },
          merge: true,
        },
        setRetrieveConfig({
          relations: [
            "items.variant.product.profiles",
            "items.adjustments",
            "discounts.rule",
            "gift_cards",
            "shipping_methods.shipping_option",
            "billing_address",
            "shipping_address",
            "region",
            "region.tax_rates",
            "region.payment_providers",
            "payment_sessions",
            "customer",
          ],
        }),
        CartHandlers.retrieveCart,
        CartHandlers.cleanUpPaymentSessions
      ),
      compensate: pipe(
        {
          invoke: {
            from: AddShippingMethodWorkflowActions.prepare,
            alias: "input",
          },
        },
        CartHandlers.cleanUpPaymentSessions
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
          },
          merge: true,
        },
        setRetrieveConfig({
          relations: [
            "items.variant.product.profiles",
            "items.adjustments",
            "discounts.rule",
            "gift_cards",
            "shipping_methods.shipping_option",
            "billing_address",
            "shipping_address",
            "region",
            "region.tax_rates",
            "region.payment_providers",
            "payment_sessions",
            "customer",
          ],
        }),
        CartHandlers.retrieveCart,
        CartHandlers.updatePaymentSessions
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
  CartDTO
>(
  Workflows.AddShippingMethod,
  AddShippingMethodWorkflowActions.updatePaymentSessions,
  prepareAddShippingMethodToCartWorkflowData
)
