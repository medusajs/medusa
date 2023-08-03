import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"

import { Workflows } from "../../definitions"
import { exportWorkflow, pipe } from "../../helper"
import { cartHandlers } from "../../handlers"

export enum CartInputAlias {
  Cart = "cart",
  CartAddresses = "cartAddresses",
  CartRegion = "cartRegion",
  CartCustomer = "cartCustomer",
  CartContext = "cartContext",
  CartSalesChannel = "cartSalesChannel",
  CreatedCart = "createdCart"
}

enum CreateCartActions {
  attachAddresses = "attachAddresses",
  attachContext = "attachContext",
  attachCustomerDetails = "attachCustomerDetails",
  attachLineItems = "attachLineItems",
  attachRegion = "attachRegion",
  attachSalesChannel = "attachSalesChannel",
  createCart = "createCart",
  removeCart = "removeCart",
  retrieveCart = "retrieveCart"
}

const workflowSteps: TransactionStepsDefinition = {
  next: [
    {
      action: CreateCartActions.attachCustomerDetails,
      noCompensation: true,
    },
    {
      action: CreateCartActions.attachSalesChannel,
      noCompensation: true,
    },
    {
      action: CreateCartActions.attachContext,
      noCompensation: true,
    },
    {
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
    }
  ]
}

const workflowInput = {
  inputAlias: CartInputAlias.Cart,
  invoke: {
    from: CartInputAlias.Cart,
    alias: CartInputAlias.Cart,
  },
}

const handlers = new Map([
  [
    CreateCartActions.attachRegion,
    {
      invoke: pipe(
        workflowInput,
        cartHandlers.attachRegionToCart
      ),
    },
  ],
  [
    CreateCartActions.attachSalesChannel,
    {
      invoke: pipe(
        workflowInput,
        cartHandlers.attachSalesChannelToCart
      ),
    },
  ],
  [
    CreateCartActions.createCart,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.attachRegion,
              alias: CartInputAlias.Cart,
            },
            {
              from: CreateCartActions.attachRegion,
              alias: CartInputAlias.CartRegion,
            },
            {
              from: CreateCartActions.attachContext,
              alias: CartInputAlias.CartContext,
            },
            {
              from: CreateCartActions.attachCustomerDetails,
              alias: CartInputAlias.CartCustomer,
            },
            {
              from: CreateCartActions.attachAddresses,
              alias: CartInputAlias.CartAddresses,
            },
          ],
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
          invoke: [
            workflowInput.invoke,
            {
              from: CreateCartActions.attachRegion,
              alias: CartInputAlias.CartRegion,
            },
        ]
        },
        cartHandlers.attachAddressesToCart,
      ),
    },
  ],
  [
    CreateCartActions.attachCustomerDetails,
    {
      invoke: pipe(
        workflowInput,
        cartHandlers.attachCustomerDetailsToCart
      ),
    },
  ],
  [
    CreateCartActions.attachContext,
    {
      invoke: pipe(
        workflowInput,
        cartHandlers.attachContextToCart
      ),
    },
  ],
  [
    CreateCartActions.attachLineItems,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.createCart,
              alias: CartInputAlias.CreatedCart,
            },
            workflowInput.invoke
          ],
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
            from: CreateCartActions.createCart,
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
