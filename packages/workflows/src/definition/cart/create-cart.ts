import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"

import { InputAlias, Workflows } from "../../definitions"
import { exportWorkflow, pipe } from "../../helper"
import { cartHandlers } from "../../handlers"

enum CreateCartActions {
  attachAddresses = "attachAddresses",
  attachCustomerDetails = "attachCustomerDetails",
  attachLineItems = "attachLineItems",
  attachRegion = "attachRegion",
  attachSalesChannel = "attachSalesChannel",
  createCart = "createCart",
  prepareCart = "prepareCart",
  removeCart = "removeCart",
  retrieveCart = "retrieveCart"
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateCartActions.prepareCart,
    noCompensation: true,
    next: [{
      action: CreateCartActions.attachCustomerDetails,
      noCompensation: true,
    }, {
      action: CreateCartActions.attachSalesChannel,
      noCompensation: true,
    }, {
      action: CreateCartActions.attachRegion,
      noCompensation: true,
      next: {
        action: CreateCartActions.attachAddresses,
        noCompensation: true,
        next: {
          action: CreateCartActions.createCart,
          noCompensation: true,
          next: {
            action: CreateCartActions.attachLineItems,
            noCompensation: true,
            next: {
              action: CreateCartActions.retrieveCart,
              noCompensation: true,
            }
          }
        }
      }
    }]
  },
}

const handlers = new Map([
  [
    CreateCartActions.prepareCart,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.Cart,
          invoke: {
            from: InputAlias.Cart,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.prepareCart
      )
    },
  ],
  [
    CreateCartActions.attachRegion,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.prepareCart,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.attachRegionToCart
      ),
    },
  ],
  [
    CreateCartActions.attachSalesChannel,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.prepareCart,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.attachSalesChannelToCart
      ),
    },
  ],
  [
    CreateCartActions.createCart,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.attachRegion,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.createCart
      ),
    },
  ],
  [
    CreateCartActions.attachAddresses,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.prepareCart,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.attachAddressesToCart
      ),
    },
  ],
  [
    CreateCartActions.attachCustomerDetails,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.prepareCart,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.attachCustomerDetailsToCart
      ),
    },
  ],
  [
    CreateCartActions.attachLineItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.createCart,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.attachLineItemsToCart
      ),
    },
  ],
  [
    CreateCartActions.retrieveCart,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.attachLineItems,
            alias: InputAlias.Cart,
          },
        },
        cartHandlers.retrieveCart
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateCart, workflowSteps, handlers)

type CreateCartWorkflowInput = Record<any, any>
type CreateCartWorkflowOutput = Record<any, any>

export const createCart = exportWorkflow<
  CreateCartWorkflowInput,
  CreateCartWorkflowOutput
>(Workflows.CreateCart, CreateCartActions.createCart)
