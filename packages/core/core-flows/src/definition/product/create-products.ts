import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import {
  InventoryHandlers,
  MiddlewaresHandlers,
  ProductHandlers,
} from "../../handlers"
import { prepareCreateInventoryItems } from "./prepare-create-inventory-items"

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
          merge: true,
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
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
          merge: true,
          invoke: {
            from: CreateProductsActions.prepare,
          },
        },
        ProductHandlers.createProducts
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: CreateProductsActions.createProducts,
            alias: ProductHandlers.removeProducts.aliases.products,
          },
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
          merge: true,
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
        },
        ProductHandlers.attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          merge: true,
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
          merge: true,
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
        },
        ProductHandlers.attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          merge: true,
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
          merge: true,
          invoke: {
            from: CreateProductsActions.createProducts,
            alias: prepareCreateInventoryItems.aliases.products,
          },
        },
        prepareCreateInventoryItems,
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: CreateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
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
          merge: true,
          invoke: {
            from: CreateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.attachInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: CreateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
          },
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
          merge: true,
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
        },
        ProductHandlers.updateProductsVariantsPrices
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: CreateProductsActions.prepare,
              alias:
                MiddlewaresHandlers
                  .createProductsPrepareCreatePricesCompensation.aliases
                  .preparedData,
            },
            {
              from: CreateProductsActions.createProducts,
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
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO,
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, CreateProductsActions.createProducts)
