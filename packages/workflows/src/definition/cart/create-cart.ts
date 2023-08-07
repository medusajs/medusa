import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"

import { Workflows } from "../../definitions"
import { CartHandlers } from "../../handlers"
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
      invoke: pipe(workflowInput, CartHandlers.attachRegionToCart),
    },
  ],
  [
    CreateCartActions.attachSalesChannel,
    {
      invoke: pipe(workflowInput, CartHandlers.attachSalesChannelToCart),
    },
  ],
  [
    CreateCartActions.createCart,
    {
      invoke: pipe(
        {
          invoke: [
            workflowInput.invoke,
            {
              from: CreateCartActions.attachRegion,
              alias: CartHandlers.createCart.aliases.CartRegion,
            },
            {
              from: CreateCartActions.attachContext,
              alias: CartHandlers.createCart.aliases.CartContext,
            },
            {
              from: CreateCartActions.attachCustomerDetails,
              alias: CartHandlers.createCart.aliases.CartCustomer,
            },
            {
              from: CreateCartActions.attachAddresses,
              alias: CartHandlers.createCart.aliases.CartAddresses,
            },
          ],
        },
        CartHandlers.createCart
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.removeCart.aliases.CreatedCart,
            },
          ],
        },
        CartHandlers.removeCart
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
              alias: CartHandlers.attachAddressesToCart.aliases.CartRegion,
            },
          ],
        },
        CartHandlers.attachAddressesToCart
      ),
    },
  ],
  [
    CreateCartActions.attachCustomerDetails,
    {
      invoke: pipe(workflowInput, CartHandlers.attachCustomerDetailsToCart),
    },
  ],
  [
    CreateCartActions.attachContext,
    {
      invoke: pipe(workflowInput, CartHandlers.attachContextToCart),
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
              alias: CartHandlers.attachLineItemsToCart.aliases.CreatedCart,
            },
            workflowInput.invoke,
          ],
        },
        CartHandlers.attachLineItemsToCart
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
            alias: CartHandlers.retrieveCart.aliases.CreatedCart,
          },
        },
        CartHandlers.retrieveCart
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
