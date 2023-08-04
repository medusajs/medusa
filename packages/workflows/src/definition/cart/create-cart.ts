import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"

import { Workflows } from "../../definitions"
import { cartHandlers } from "../../handlers"
import { exportWorkflow, pipe } from "../../helper"

export enum CartInputAlias {
  Cart = "cart",
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
  retrieveCart = "retrieveCart",
  removeAddresses = "removeAddresses",
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
        next: {
          action: CreateCartActions.createCart,
          next: {
            action: CreateCartActions.attachLineItems,
            noCompensation: true,
            next: {
              action: CreateCartActions.retrieveCart,
              noCompensation: true,
            },
          },
        },
      },
    },
  ],
}

const workflowAlias = "cart"
const workflowInput = {
  inputAlias: workflowAlias,
  invoke: {
    from: workflowAlias,
    alias: workflowAlias,
  },
}

const handlers = new Map([
  [
    CreateCartActions.attachRegion,
    {
      invoke: pipe(workflowInput, cartHandlers.attachRegionToCart),
    },
  ],
  [
    CreateCartActions.attachSalesChannel,
    {
      invoke: pipe(workflowInput, cartHandlers.attachSalesChannelToCart),
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
              alias: cartHandlers.createCart.aliases.Cart,
            },
            {
              from: CreateCartActions.attachRegion,
              alias: cartHandlers.createCart.aliases.CartRegion,
            },
            {
              from: CreateCartActions.attachContext,
              alias: cartHandlers.createCart.aliases.CartContext,
            },
            {
              from: CreateCartActions.attachCustomerDetails,
              alias: cartHandlers.createCart.aliases.CartCustomer,
            },
            {
              from: CreateCartActions.attachAddresses,
              alias: cartHandlers.createCart.aliases.CartAddresses,
            },
          ],
        },
        cartHandlers.createCart
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.createCart,
              alias: cartHandlers.removeCart.aliases.CreatedCart,
            },
          ],
        },
        cartHandlers.removeCart
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
              alias: cartHandlers.attachAddressesToCart.aliases.CartRegion,
            },
          ],
        },
        cartHandlers.attachAddressesToCart
      ),
    },
  ],
  [
    CreateCartActions.attachCustomerDetails,
    {
      invoke: pipe(workflowInput, cartHandlers.attachCustomerDetailsToCart),
    },
  ],
  [
    CreateCartActions.attachContext,
    {
      invoke: pipe(workflowInput, cartHandlers.attachContextToCart),
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
              alias: cartHandlers.attachLineItemsToCart.aliases.CreatedCart,
            },
            workflowInput.invoke,
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
            alias: cartHandlers.retrieveCart.aliases.CreatedCart,
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
