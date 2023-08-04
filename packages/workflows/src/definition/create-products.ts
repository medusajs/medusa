import { InputAlias, Workflows } from "../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../helper"

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import {
  InventoryHandlers,
  MiddlewaresHandlers,
  ProductHandlers,
} from "../handlers"
import { aggregateData } from "../helper/aggregate"

export enum Actions {
  prepare = "prepare",
  createProducts = "createProducts",
  attachToSalesChannel = "attachToSalesChannel",
  attachShippingProfile = "attachShippingProfile",
  createPrices = "createPrices",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
  result = "result",
}

export const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.prepare,
    noCompensation: true,
    next: {
      action: Actions.createProducts,
      next: [
        {
          action: Actions.attachShippingProfile,
          saveResponse: false,
        },
        {
          action: Actions.attachToSalesChannel,
          saveResponse: false,
        },
        {
          action: Actions.createPrices,
          next: {
            action: Actions.createInventoryItems,
            next: {
              action: Actions.attachInventoryItems,
              next: {
                action: Actions.result,
                noCompensation: true,
              },
            },
          },
        },
      ],
    },
  },
}

const handlers = new Map([
  [
    Actions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
        },
        aggregateData(),
        MiddlewaresHandlers.createProductsPrepareData
      ),
    },
  ],
  [
    Actions.createProducts,
    {
      invoke: pipe(
        {
          invoke: {
            from: Actions.prepare,
          },
        },
        aggregateData(),
        ProductHandlers.createProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: ProductHandlers.removeProducts.aliases.products,
          },
        },
        aggregateData(),
        ProductHandlers.removeProducts
      ),
    },
  ],
  [
    Actions.attachShippingProfile,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.attachShippingProfileToProducts.aliases
                  .products,
            },
          ],
        },
        aggregateData(),
        ProductHandlers.attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.detachShippingProfileFromProducts.aliases
                  .products,
            },
          ],
        },
        aggregateData(),
        ProductHandlers.detachShippingProfileFromProducts
      ),
    },
  ],
  [
    Actions.attachToSalesChannel,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.attachSalesChannelToProducts.aliases.products,
            },
          ],
        },
        aggregateData(),
        ProductHandlers.attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.detachSalesChannelFromProducts.aliases.products,
            },
          ],
        },
        aggregateData(),
        ProductHandlers.detachSalesChannelFromProducts
      ),
    },
  ],
  [
    Actions.createInventoryItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: InventoryHandlers.createInventoryItems.aliases.products,
          },
        },
        aggregateData(),
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
        },
        aggregateData(),
        InventoryHandlers.removeInventoryItems
      ),
    },
  ],
  [
    Actions.attachInventoryItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias:
              InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
          },
        },
        aggregateData(),
        InventoryHandlers.attachInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias:
              InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
          },
        },
        aggregateData(),
        InventoryHandlers.detachInventoryItems
      ),
    },
  ],
  [
    Actions.createPrices,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.updateProductsVariantsPrices.aliases.products,
            },
          ],
        },
        aggregateData(),
        ProductHandlers.updateProductsVariantsPrices
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.updateProductsVariantsPrices.aliases.products,
            },
          ],
        },
        aggregateData(),
        MiddlewaresHandlers.createProductsPrepareCreatePricesCompensation,
        ProductHandlers.updateProductsVariantsPrices
      ),
    },
  ],
  [
    Actions.result,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
            },
            {
              from: Actions.createProducts,
              alias: ProductHandlers.listProducts.aliases.products,
            },
          ],
        },
        aggregateData(),
        ProductHandlers.listProducts
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO,
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, Actions.result)
