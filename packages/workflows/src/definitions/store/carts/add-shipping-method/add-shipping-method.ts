import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { WorkflowTypes } from "@medusajs/types"
import {
  defaultStoreCartFields,
  defaultStoreCartRelations,
} from "@medusajs/utils"
import {
  CartHandlers,
  ShippingMethodHandlers,
  ShippingOptionHandlers,
} from "../../../../handlers"
import { exportWorkflow, pipe } from "../../../../helper"
import { Workflows } from "../../../../workflows"
import { prepareAddShippingMethodToCartWorkflowData } from "./prepare-add-shipping-method-to-cart-data"
import { prepareShippingMethodsForCreate } from "./prepare-create-shipping-methods-data"
import { prepareDeleteShippingMethodsData } from "./prepare-delete-shipping-methods-data"
import { prepareGetShippingOptionPriceData } from "./prepare-get-shipping-option-price-data"
import { setRetrieveConfig } from "./set-retrieve-config"

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
            from: "input",
            alias: "input",
          },
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
        ShippingMethodHandlers.createShippingMethods
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
        ShippingMethodHandlers.deleteShippingMethods
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
            from: "input",
            alias: "input",
          },
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
              from: "input",
              alias: "cart",
            },
          ],
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
            from: "input",
            alias: "cart",
          },
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
            from: "input",
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
            from: "input",
            alias: "cart",
          },
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
        setRetrieveConfig({
          relations: defaultStoreCartRelations,
          select: defaultStoreCartFields,
        }),
        CartHandlers.retrieveCart
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
