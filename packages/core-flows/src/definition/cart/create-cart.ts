import {
  AddressHandlers,
  CartHandlers,
  CommonHandlers,
  CustomerHandlers,
  RegionHandlers,
  SalesChannelHandlers,
} from "../../handlers"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { CartWorkflow } from "@medusajs/types"
import { Workflows } from "../../definitions"

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
  validateLineItemsForCart = "validateLineItemsForCart",
  confirmLineItemQuantities = "confirmLineItemQuantities",
  createLineItems = "createLineItems",
  refreshAdjustments = "refreshAdjustments",
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
            saveResponse: true,
            next: {
              action: CreateCartActions.generateLineItems,
              noCompensation: true,
              saveResponse: true,
              next: {
                action: CreateCartActions.validateLineItemsForCart,
                noCompensation: true,
                next: {
                  action: CreateCartActions.confirmLineItemQuantities,
                  noCompensation: true,
                  next: {
                    action: CreateCartActions.createLineItems,
                    saveResponse: true,
                    next: {
                      action: CreateCartActions.refreshAdjustments,
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
            alias: RegionHandlers.findRegion.aliases.Region,
          },
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
          merge: true,
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
            {
              from: CreateCartActions.findSalesChannel,
              alias: CartHandlers.createCart.aliases.SalesChannel,
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
              alias: CartHandlers.generateLineItems.aliases.LineItems,
            },
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.refreshAdjustments.aliases.Cart,
            },
          ],
        },
        CartHandlers.generateLineItems
      ),
    },
  ],
  [
    CreateCartActions.refreshAdjustments,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.generateLineItems,
              alias: CartHandlers.generateLineItems.aliases.LineItems,
            },
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.refreshAdjustments.aliases.Cart,
            },
          ],
        },
        CartHandlers.refreshAdjustments
      ),
    },
  ],
  [
    CreateCartActions.validateLineItemsForCart,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.generateLineItems,
              alias: CartHandlers.generateLineItems.aliases.LineItems,
            },
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.refreshAdjustments.aliases.Cart,
            },
          ],
        },
        CartHandlers.validateLineItemsForCart
      ),
    },
  ],
  [
    CreateCartActions.confirmLineItemQuantities,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.generateLineItems,
              alias: CartHandlers.generateLineItems.aliases.LineItems,
            },
            {
              from: CreateCartActions.createCart,
              alias: CartHandlers.refreshAdjustments.aliases.Cart,
            },
          ],
        },
        CartHandlers.confirmQuantitiesForLineItems
      ),
    },
  ],
  [
    CreateCartActions.createLineItems,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.generateLineItems,
              alias: CartHandlers.generateLineItems.aliases.LineItems,
            },
          ],
        },
        CartHandlers.createLineItems
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: CreateCartActions.createLineItems,
              alias: CartHandlers.createLineItems.aliases.CreatedLineItems,
            },
          ],
        },
        CartHandlers.removeLineItems
      ),
    },
  ]
])

WorkflowManager.register(Workflows.CreateCart, workflowSteps, handlers)

type CreateCartWorkflowOutput = Record<any, any>

export const createCart = exportWorkflow<
  CartWorkflow.CreateCartWorkflowInputDTO,
  CreateCartWorkflowOutput
>(Workflows.CreateCart, CreateCartActions.createCart)
