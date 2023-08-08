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
import { aggregateData } from "../../helper/aggregate"

export enum CreateProductsActions {
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
              next: {
                action: CreateProductsActions.result,
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
    CreateProductsActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
        },
        aggregateData(),
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
        },
        aggregateData(),
        ProductHandlers.createProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: CreateProductsActions.createProducts,
            alias: ProductHandlers.removeProducts.aliases.products,
          },
        },
        aggregateData(),
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
        },
        aggregateData(),
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
        },
        aggregateData(),
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
        },
        aggregateData(),
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
        },
        aggregateData(),
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
        },
        aggregateData(),
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: CreateProductsActions.createInventoryItems,
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
    CreateProductsActions.attachInventoryItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreateProductsActions.createInventoryItems,
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
            from: CreateProductsActions.createInventoryItems,
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
        },
        aggregateData(),
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
        },
        aggregateData(),
        MiddlewaresHandlers.createProductsPrepareCreatePricesCompensation,
        ProductHandlers.updateProductsVariantsPrices
      ),
    },
  ],
  [
    CreateProductsActions.result,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: CreateProductsActions.prepare,
            },
            {
              from: CreateProductsActions.createProducts,
              alias: "products",
            },
          ],
        },
        async ({ data }) => {
          return {
            alias: ProductHandlers.listProducts.aliases.ids,
            value: data.products.map((product) => product.id),
          }
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
>(Workflows.CreateProducts, CreateProductsActions.result)
