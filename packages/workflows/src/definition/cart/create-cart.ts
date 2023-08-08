import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { CartWorkflow } from "@medusajs/types"

import { Workflows } from "../../definitions"
import {
  AddressHandlers,
  CartHandlers,
  CommonHandlers,
  CustomerHandlers,
  RegionHandlers,
  SalesChannelHandlers,
} from "../../handlers"
import { aggregateData, exportWorkflow, pipe } from "../../helper"

enum CreateCartActions {
  setConfig = "setConfig",
  setContext = "setContext",
  attachLineItems = "attachLineItems",
  findRegion = "findRegion",
  findSalesChannel = "findSalesChannel",
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
      action: CreateCartActions.setConfig,
      noCompensation: true,
    },
    {
      action: CreateCartActions.findOrCreateCustomer,
      noCompensation: true,
    },
    {
      action: CreateCartActions.findSalesChannel,
      noCompensation: true,
    },
    {
      action: CreateCartActions.setContext,
      noCompensation: true,
    },
    {
      action: CreateCartActions.findRegion,
      noCompensation: true,
      next: {
        action: CreateCartActions.findOrCreateAddresses,
        noCompensation: true,
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
    CreateCartActions.setConfig,
    {
      invoke: pipe(
        getWorkflowInput(CommonHandlers.setConfig.aliases.Config),
        aggregateData(),
        CommonHandlers.setConfig
      ),
    },
  ],
  [
    CreateCartActions.findOrCreateCustomer,
    {
      invoke: pipe(
        getWorkflowInput(
          CustomerHandlers.findOrCreateCustomer.aliases.Customer
        ),
        CustomerHandlers.findOrCreateCustomer
      ),
    },
  ],
  [
    CreateCartActions.findSalesChannel,
    {
      invoke: pipe(
        getWorkflowInput(
          SalesChannelHandlers.findSalesChannel.aliases.SalesChannel
        ),
        SalesChannelHandlers.findSalesChannel
      ),
    },
  ],
  [
    CreateCartActions.setContext,
    {
      invoke: pipe(
        getWorkflowInput(CommonHandlers.setContext.aliases.Context),
        CommonHandlers.setContext
      ),
    },
  ],
  [
    CreateCartActions.findRegion,
    {
      invoke: pipe(
        getWorkflowInput(RegionHandlers.findRegion.aliases.Region),
        RegionHandlers.findRegion
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
              AddressHandlers.findOrCreateAddresses.aliases.Addresses
            ).invoke,
            {
              from: CreateCartActions.findRegion,
              alias: AddressHandlers.findOrCreateAddresses.aliases.Region,
            },
          ],
        },
        AddressHandlers.findOrCreateAddresses
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
              from: CreateCartActions.findRegion,
              alias: CartHandlers.createCart.aliases.Region,
            },
            {
              from: CreateCartActions.setContext,
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
              from: CreateCartActions.setConfig,
              alias: CommonHandlers.setConfig.aliases.Config,
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

type CreateCartWorkflowOutput = Record<any, any>

export const createCart = exportWorkflow<
  CartWorkflow.CreateCartWorkflowInputDTO,
  CreateCartWorkflowOutput
>(Workflows.CreateCart, CreateCartActions.retrieveCart)
