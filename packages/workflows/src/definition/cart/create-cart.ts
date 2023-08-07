import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"

import { Workflows } from "../../definitions"
import { CartHandlers } from "../../handlers"
import { exportWorkflow, pipe } from "../../helper"

enum CreateCartActions {
  attachConfig = "attachConfig",
  attachContext = "attachContext",
  attachLineItems = "attachLineItems",
  attachRegion = "attachRegion",
  attachSalesChannel = "attachSalesChannel",
  createCart = "createCart",
  findOrCreateAddresses = "findOrCreateAddresses",
  findOrCreateCustomer = "findOrCreateCustomer",
  removeCart = "removeCart",
  removeAddresses = "removeAddresses",
  retrieveCart = "retrieveCart",
}

const workflowAlias = "cart"
const getWorkflowInput = (alias = workflowAlias) => ({
  inputAlias: workflowAlias,
  invoke: {
    from: workflowAlias,
    alias,
  },
})

const workflowSteps: TransactionStepsDefinition = {
  next: [
    {
      action: CreateCartActions.attachConfig,
      noCompensation: true,
    },
    {
      action: CreateCartActions.findOrCreateCustomer,
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
        action: CreateCartActions.findOrCreateAddresses,
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

const handlers = new Map([
  [
    CreateCartActions.attachConfig,
    {
      invoke: pipe(
        getWorkflowInput(CartHandlers.attachConfig.aliases.Config),
        CartHandlers.attachConfig
      ),
    },
  ],
  [
    CreateCartActions.attachSalesChannel,
    {
      invoke: pipe(
        getWorkflowInput(CartHandlers.attachSalesChannel.aliases.SalesChannel),
        CartHandlers.attachSalesChannel
      ),
    },
  ],
  [
    CreateCartActions.findOrCreateCustomer,
    {
      invoke: pipe(
        getWorkflowInput(CartHandlers.findOrCreateCustomer.aliases.Customer),
        CartHandlers.findOrCreateCustomer
      ),
    },
  ],
  [
    CreateCartActions.attachContext,
    {
      invoke: pipe(
        getWorkflowInput(CartHandlers.attachContext.aliases.Context),
        CartHandlers.attachContext
      ),
    },
  ],
  [
    CreateCartActions.attachRegion,
    {
      invoke: pipe(
        getWorkflowInput(CartHandlers.attachRegion.aliases.Region),
        CartHandlers.attachRegion
      ),
    },
  ],
  [
    CreateCartActions.findOrCreateAddresses,
    {
      invoke: pipe(
        {
          invoke: [
            getWorkflowInput(
              CartHandlers.findOrCreateAddresses.aliases.Addresses
            ).invoke,
            {
              from: CreateCartActions.attachRegion,
              alias: CartHandlers.findOrCreateAddresses.aliases.Region,
            },
          ],
        },
        CartHandlers.findOrCreateAddresses
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
              alias: CartHandlers.createCart.aliases.Region,
            },
            {
              from: CreateCartActions.attachContext,
              alias: CartHandlers.createCart.aliases.Context,
            },
            {
              from: CreateCartActions.findOrCreateCustomer,
              alias: CartHandlers.createCart.aliases.Customer,
            },
            {
              from: CreateCartActions.findOrCreateAddresses,
              alias: CartHandlers.createCart.aliases.Addresses,
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
              alias: CartHandlers.removeCart.aliases.Cart,
            },
          ],
        },
        CartHandlers.removeCart
      ),
    },
  ],
  [
    CreateCartActions.attachLineItems,
    {
      invoke: pipe(
        {
          invoke: [
            getWorkflowInput(
              CartHandlers.attachLineItemsToCart.aliases.LineItems
            ).invoke,
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.attachLineItemsToCart.aliases.Cart,
            },
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
          invoke: [
            {
              from: CreateCartActions.attachConfig,
              alias: CartHandlers.attachConfig.aliases.Config,
            },
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.retrieveCart.aliases.Cart,
            },
          ],
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
