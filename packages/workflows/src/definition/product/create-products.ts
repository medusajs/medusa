import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import {
  InventoryHandlers,
  MiddlewaresHandlers,
  ProductHandlers,
} from "../../handlers"

export enum CreateProductsActions {
  prepare = "prepare",
  createProducts = "createProducts",
  attachToSalesChannel = "attachToSalesChannel",
  attachShippingProfile = "attachShippingProfile",
  createPrices = "createPrices",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

export const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateProductsActions.prepare,
    noCompensation: true,
    next: {
      action: CreateProductsActions.createProducts,
      next: [
        {
          action: CreateProductsActions.attachShippingProfile,
          saveResponse: false,
        },
        {
          action: CreateProductsActions.attachToSalesChannel,
          saveResponse: false,
        },
        {
          action: CreateProductsActions.createPrices,
          next: {
            action: CreateProductsActions.createInventoryItems,
            next: {
              action: CreateProductsActions.attachInventoryItems,
            },
          },
        },
      ],
    },
  },
}

const handlers = new Map([
  [
    CreateProductsActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
          aggregate: true,
        },
        ProductHandlers.createProductsPrepareData
      ),
    },
  ],
  [
    CreateProductsActions.createProducts,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateProductsActions.prepare,
          },
          aggregate: true,
        },
        ProductHandlers.createProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: CreateProductsActions.createProducts,
            alias: ProductHandlers.removeProducts.aliases.products,
          },
          aggregate: true,
        },
        ProductHandlers.removeProducts
      ),
    },
  ],
  [
    CreateProductsActions.attachShippingProfile,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias:
                ProductHandlers.attachShippingProfileToProducts.aliases
                  .products,
            },
          ],
          aggregate: true,
        },
        ProductHandlers.attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias:
                ProductHandlers.detachShippingProfileFromProducts.aliases
                  .products,
            },
          ],
          aggregate: true,
        },
        ProductHandlers.detachShippingProfileFromProducts
      ),
    },
  ],
  [
    CreateProductsActions.attachToSalesChannel,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias:
                ProductHandlers.attachSalesChannelToProducts.aliases.products,
            },
          ],
          aggregate: true,
        },
        ProductHandlers.attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias:
                ProductHandlers.detachSalesChannelFromProducts.aliases.products,
            },
          ],
          aggregate: true,
        },
        ProductHandlers.detachSalesChannelFromProducts
      ),
    },
  ],
  [
    CreateProductsActions.createInventoryItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateProductsActions.createProducts,
            alias: InventoryHandlers.createInventoryItems.aliases.products,
          },
          aggregate: true,
        },
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: CreateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
          aggregate: true,
        },
        InventoryHandlers.removeInventoryItems
      ),
    },
  ],
  [
    CreateProductsActions.attachInventoryItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
          },
          aggregate: true,
        },
        InventoryHandlers.attachInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: CreateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
          },
          aggregate: true,
        },
        InventoryHandlers.detachInventoryItems
      ),
    },
  ],
  [
    CreateProductsActions.createPrices,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias:
                ProductHandlers.updateProductsVariantsPrices.aliases.products,
            },
          ],
          aggregate: true,
        },
        ProductHandlers.updateProductsVariantsPrices
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias:
                ProductHandlers.updateProductsVariantsPrices.aliases.products,
            },
          ],
          aggregate: true,
        },
        MiddlewaresHandlers.createProductsPrepareCreatePricesCompensation,
        ProductHandlers.updateProductsVariantsPrices
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO,
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, CreateProductsActions.createProducts)
