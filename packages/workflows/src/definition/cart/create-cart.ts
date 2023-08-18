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
import { exportWorkflow, pipe } from "../../helper"

enum CreateCartActions {
  attachLineItems = "attachLineItems",
  findRegion = "findRegion",
  findSalesChannel = "findSalesChannel",
  createCart = "createCart",
  findOrCreateAddresses = "findOrCreateAddresses",
  findOrCreateCustomer = "findOrCreateCustomer",
  prepareCartData = "prepareCartData",
  removeCart = "removeCart",
  removeAddresses = "removeAddresses",
  setContext = "setContext",
  generateLineItems = "generateLineItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateCartActions.prepareCartData,
    noCompensation: true,
    saveResponse: true,
    next: [
      {
        action: CreateCartActions.findOrCreateCustomer,
        saveResponse: true,
        noCompensation: true,
      },
      {
        action: CreateCartActions.findSalesChannel,
        saveResponse: true,
        noCompensation: true,
      },
      {
        action: CreateCartActions.setContext,
        saveResponse: true,
        noCompensation: true,
      },
      {
        action: CreateCartActions.findRegion,
        noCompensation: true,
        saveResponse: true,
        next: {
          action: CreateCartActions.findOrCreateAddresses,
          noCompensation: true,
          next: {
            action: CreateCartActions.createCart,
            next: {
              action: CreateCartActions.generateLineItems,
              noCompensation: true,
              saveResponse: true,
              next: { 
                action: CreateCartActions.attachLineItems,
                noCompensation: true,
              }
            },
          },
        },
      },
    ],
  },
}

const handlers = new Map([
  [
    CreateCartActions.prepareCartData,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: CreateCartActions.prepareCartData,
          invoke: {
            from: CreateCartActions.prepareCartData,
          },
        },
        CartHandlers.createCartPrepareData
      ),
    },
  ],
  [
    CreateCartActions.findOrCreateCustomer,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.prepareCartData,
              alias: CustomerHandlers.findOrCreateCustomer.aliases.Customer,
            },
          ],
        },
        CustomerHandlers.findOrCreateCustomer
      ),
    },
  ],
  [
    CreateCartActions.findSalesChannel,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.prepareCartData,
            alias: SalesChannelHandlers.findSalesChannel.aliases.SalesChannel,
          },
        },
        SalesChannelHandlers.findSalesChannel
      ),
    },
  ],
  [
    CreateCartActions.setContext,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateCartActions.prepareCartData,
            alias: CommonHandlers.setContext.aliases.Context,
          },
        },
        CommonHandlers.setContext
      ),
    },
  ],
  [
    CreateCartActions.findRegion,
    {
      invoke: pipe(
        { 
          invoke: { 
            from: CreateCartActions.prepareCartData, 
            alias: RegionHandlers.findRegion.aliases.Region
          }
        },
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
            {
              from: CreateCartActions.prepareCartData,
              alias: AddressHandlers.findOrCreateAddresses.aliases.Addresses,
            },
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
    CreateCartActions.generateLineItems,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.prepareCartData,
              alias: CartHandlers.attachLineItemsToCart.aliases.LineItems
            },
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.attachLineItemsToCart.aliases.Cart,
            },
          ],
        },
        CartHandlers.generateLineItems
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
              from: CreateCartActions.generateLineItems,
              alias: CartHandlers.attachLineItemsToCart.aliases.LineItems
            },
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
])

WorkflowManager.register(Workflows.CreateCart, workflowSteps, handlers)

type CreateCartWorkflowOutput = Record<any, any>

export const createCart = exportWorkflow<
  CartWorkflow.CreateCartWorkflowInputDTO,
  CreateCartWorkflowOutput
>(Workflows.CreateCart, CreateCartActions.createCart)
