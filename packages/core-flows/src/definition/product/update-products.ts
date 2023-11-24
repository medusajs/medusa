import { ProductTypes, WorkflowTypes } from "@medusajs/types"

import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../../definitions"
import { InventoryHandlers, ProductHandlers } from "../../handlers"
import * as MiddlewareHandlers from "../../handlers/middlewares"
import { detachSalesChannelFromProducts } from "../../handlers/product"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"
import { CreateProductsActions } from "./create-products"
import { prepareCreateInventoryItems } from "./prepare-create-inventory-items"
import { UpdateProductVariantsActions } from "./update-product-variants"

export enum UpdateProductsActions {
  prepare = "prepare",
  updateProducts = "updateProducts",

  attachSalesChannels = "attachSalesChannels",
  detachSalesChannels = "detachSalesChannels",

  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
  detachInventoryItems = "detachInventoryItems",
  removeInventoryItems = "removeInventoryItems",
}

export const updateProductsWorkflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateProductsActions.prepare,
    noCompensation: true,
    next: {
      action: UpdateProductsActions.updateProducts,
      next: [
        {
          action: UpdateProductVariantsActions.upsertPrices,
          saveResponse: false,
        },
        {
          action: UpdateProductsActions.attachSalesChannels,
          saveResponse: false,
        },
        {
          action: UpdateProductsActions.detachSalesChannels,
          saveResponse: false,
        },
        {
          // for created variants
          action: UpdateProductsActions.createInventoryItems,
          next: {
            action: UpdateProductsActions.attachInventoryItems,
          },
        },
        {
          // for deleted variants
          action: UpdateProductsActions.detachInventoryItems,
          next: {
            action: UpdateProductsActions.removeInventoryItems,
          },
        },
      ],
    },
  },
}

const handlers = new Map<string, any>([
  [
    UpdateProductsActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
        },
        ProductHandlers.updateProductsPrepareData
      ),
    },
  ],
  [
    UpdateProductsActions.updateProducts,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: InputAlias.ProductsInputData,
              alias: ProductHandlers.updateProducts.aliases.products,
            },
            {
              from: UpdateProductsActions.prepare,
            },
          ],
        },
        ProductHandlers.updateProducts
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias: ProductHandlers.revertUpdateProducts.aliases.preparedData,
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                  .products,
            },
          ],
        },
        MiddlewareHandlers.updateProductsExtractDeletedVariants,
        ProductHandlers.revertUpdateProducts
      ),
    },
  ],
  [
    UpdateProductsActions.attachSalesChannels,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias: "preparedData",
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                ProductHandlers.attachSalesChannelToProducts.aliases.products,
            },
          ],
        },
        MiddlewareHandlers.mapData((d: any) => ({
          productsHandleSalesChannelsMap:
            d.preparedData.productHandleAddedChannelsMap,
        })),
        ProductHandlers.attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias: "preparedData",
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias: detachSalesChannelFromProducts.aliases.products,
            },
          ],
        },
        MiddlewareHandlers.mapData((d: any) => ({
          productsHandleSalesChannelsMap:
            d.preparedData.productHandleAddedChannelsMap,
        })),
        ProductHandlers.detachSalesChannelFromProducts
      ),
    },
  ],
  [
    UpdateProductsActions.detachSalesChannels,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias: "preparedData",
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                ProductHandlers.detachSalesChannelFromProducts.aliases.products,
            },
          ],
        },
        MiddlewareHandlers.mapData((d: any) => ({
          productsHandleSalesChannelsMap:
            d.preparedData.productHandleRemovedChannelsMap,
        })),
        ProductHandlers.detachSalesChannelFromProducts
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias: "preparedData",
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                ProductHandlers.attachSalesChannelToProducts.aliases.products,
            },
          ],
        },
        MiddlewareHandlers.mapData((d: any) => ({
          productsHandleSalesChannelsMap:
            d.preparedData.productHandleRemovedChannelsMap,
        })),
        ProductHandlers.attachSalesChannelToProducts
      ),
    },
  ],
  [
    UpdateProductsActions.createInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias:
                MiddlewareHandlers.updateProductsExtractCreatedVariants.aliases
                  .preparedData,
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                MiddlewareHandlers.updateProductsExtractCreatedVariants.aliases
                  .products,
            },
          ],
        },
        MiddlewareHandlers.updateProductsExtractCreatedVariants,
        prepareCreateInventoryItems,
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.removeInventoryItems
      ),
    },
  ],
  [
    UpdateProductsActions.attachInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
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
            from: UpdateProductsActions.attachInventoryItems,
            alias:
              InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.detachInventoryItems
      ),
    },
  ],
  [
    UpdateProductsActions.detachInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias:
                MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                  .preparedData,
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                  .products,
            },
          ],
        },
        MiddlewareHandlers.updateProductsExtractDeletedVariants,
        MiddlewareHandlers.useVariantsInventoryItems,
        InventoryHandlers.detachInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias:
                MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                  .preparedData,
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias:
                MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                  .products,
            },
          ],
        },
        MiddlewareHandlers.updateProductsExtractDeletedVariants,
        MiddlewareHandlers.useVariantsInventoryItems,
        InventoryHandlers.attachInventoryItems
      ),
    },
  ],
  [
    UpdateProductsActions.removeInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.detachInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.removeInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.removeInventoryItems,
              alias:
                InventoryHandlers.restoreInventoryItems.aliases.inventoryItems,
            },
          ],
        },
        InventoryHandlers.restoreInventoryItems
      ),
    },
  ],
  [
    UpdateProductVariantsActions.upsertPrices,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: InputAlias.ProductsInputData,
              alias: ProductHandlers.updateProducts.aliases.products,
            },
            {
              from: UpdateProductsActions.prepare,
            },
          ],
        },
        ProductHandlers.upsertVariantPrices
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductVariantsActions.upsertPrices,
            },
          ],
        },
        ProductHandlers.revertVariantPrices
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.UpdateProducts,
  updateProductsWorkflowSteps,
  handlers
)

export const updateProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO,
  ProductTypes.ProductDTO[]
>(Workflows.UpdateProducts, UpdateProductsActions.updateProducts)
