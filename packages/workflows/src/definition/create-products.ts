import { InputAlias, Workflows } from "../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  attachInventoryItems,
  createInventoryItems,
  createProducts as createProductsHandler,
  removeInventoryItems,
  removeProducts,
} from "../handlers"
import { exportWorkflow, pipe } from "../helper"

import { ProductTypes } from "@medusajs/types"
import { createProductsPrepareData } from "../handlers/pipes/create-products-prepare-data"
import { attachShippingProfileToProducts } from "../handlers/product/attach-shipping-profile-to-products"
import { detachShippingProfileFromProducts } from "../handlers/product/detach-shipping-profile-from-products"
import { attachSalesChannelToProducts } from "../handlers/product/attach-sales-channel-to-products"
import { detachSalesChannelFromProducts } from "../handlers/product/detach-sales-channel-from-products"
import { detachInventoryItems } from "../handlers/inventory/detach-inventory-items"

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
            alias: createProductsPrepareData.aliases.input,
          },
        },
        createProductsPrepareData
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
            alias: createProductsHandler.aliases.createProductsInput,
          },
        },
        createProductsHandler
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: removeProducts.aliases.removeProductsProducts,
          },
        },
        removeProducts
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
              from: Actions.createProducts,
              alias:
                attachShippingProfileToProducts.aliases
                  .attachShippingProfileToProductsInputData,
            },
            {
              from: Actions.createProducts,
              alias:
                attachShippingProfileToProducts.aliases
                  .attachShippingProfileToProductsProducts,
            },
          ],
        },
        attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.createProducts,
              alias:
                detachShippingProfileFromProducts.aliases
                  .detachShippingProfileToProductsInputData,
            },
            {
              from: Actions.createProducts,
              alias:
                detachShippingProfileFromProducts.aliases
                  .detachShippingProfileToProductsProducts,
            },
          ],
        },
        detachShippingProfileFromProducts
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
              from: Actions.createProducts,
              alias:
                detachShippingProfileFromProducts.aliases
                  .detachShippingProfileToProductsInputData,
            },
            {
              from: Actions.createProducts,
              alias:
                detachShippingProfileFromProducts.aliases
                  .detachShippingProfileToProductsProducts,
            },
          ],
        },
        attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.createProducts,
              alias:
                detachShippingProfileFromProducts.aliases
                  .detachShippingProfileToProductsInputData,
            },
            {
              from: Actions.createProducts,
              alias:
                detachShippingProfileFromProducts.aliases
                  .detachShippingProfileToProductsProducts,
            },
          ],
        },
        detachSalesChannelFromProducts
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
            alias: createInventoryItems.aliases.createInventoryItemsProducts,
          },
        },
        createInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias: removeInventoryItems.aliases.removeInventoryItemsItems,
          },
        },
        removeInventoryItems
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
            alias: attachInventoryItems.aliases.attachInventoryItemsData,
          },
        },
        attachInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias: detachInventoryItems.aliases.detachInventoryItemsData,
          },
        },
        detachInventoryItems
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  ProductTypes.CreateProductDTO[],
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, Actions.createProducts)
