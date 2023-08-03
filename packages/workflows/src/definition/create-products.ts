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

let MiddlewaresHandler
const handlers = new Map([
  [
    Actions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
            alias: MiddlewaresHandlers.createProductsPrepareData.aliases.input,
          },
        },
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
            alias: ProductHandlers.createProducts.aliases.input,
          },
        },
        ProductHandlers.createProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: ProductHandlers.removeProducts.aliases.products,
          },
        },
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
              alias:
                ProductHandlers.attachShippingProfileToProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.attachShippingProfileToProducts.aliases
                  .products,
            },
          ],
        },
        ProductHandlers.attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
              alias:
                ProductHandlers.detachShippingProfileFromProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.detachShippingProfileFromProducts.aliases
                  .products,
            },
          ],
        },
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
              alias: ProductHandlers.attachSalesChannelToProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.attachSalesChannelToProducts.aliases.products,
            },
          ],
        },
        ProductHandlers.attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
              alias:
                ProductHandlers.detachSalesChannelFromProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.detachSalesChannelFromProducts.aliases.products,
            },
          ],
        },
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
              alias: ProductHandlers.updateProductsVariantsPrices.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.updateProductsVariantsPrices.aliases.products,
            },
          ],
        },
        ProductHandlers.updateProductsVariantsPrices
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
              alias: ProductHandlers.updateProductsVariantsPrices.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias:
                ProductHandlers.updateProductsVariantsPrices.aliases.products,
            },
          ],
        },
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
          inputAlias: InputAlias.ProductsInputData,
          invoke: [
            {
              from: InputAlias.ProductsInputData,
              alias: ProductHandlers.listProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: ProductHandlers.listProducts.aliases.products,
            },
          ],
        },
        ProductHandlers.listProducts
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductInputDTO[],
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, Actions.result)
