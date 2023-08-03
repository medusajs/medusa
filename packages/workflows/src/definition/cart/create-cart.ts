import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"

import { Workflows } from "../../definitions"
import { exportWorkflow, pipe } from "../../helper"
import { cartHandlers } from "../../handlers"

export enum CartInputAlias {
  Cart = "cart",
  RemovedCart = "removedCart",
}

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
          inputAlias: CartInputAlias.Cart,
          invoke: {
            from: CartInputAlias.Cart,
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
            alias: CartInputAlias.Cart,
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
