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

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { createProductsPrepareData } from "../handlers/middlewares/create-products-prepare-data"
import { attachShippingProfileToProducts } from "../handlers/product/attach-shipping-profile-to-products"
import { detachShippingProfileFromProducts } from "../handlers/product/detach-shipping-profile-from-products"
import { attachSalesChannelToProducts } from "../handlers/product/attach-sales-channel-to-products"
import { detachSalesChannelFromProducts } from "../handlers/product/detach-sales-channel-from-products"
import { detachInventoryItems } from "../handlers/inventory/detach-inventory-items"
import { updateProductsVariantsPrices } from "../handlers/product/update-products-variants-prices"
import { createProductsPrepareCreatePricesCompensation } from "../handlers/middlewares/create-products-prepare-create-prices-compensation"
import { listProducts } from "../handlers/product/list-products"

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
            alias: createProductsHandler.aliases.input,
          },
        },
        createProductsHandler
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: removeProducts.aliases.products,
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
              from: Actions.prepare,
              alias: attachShippingProfileToProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: attachShippingProfileToProducts.aliases.products,
            },
          ],
        },
        attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
              alias: detachShippingProfileFromProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: detachShippingProfileFromProducts.aliases.products,
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
              from: Actions.prepare,
              alias: attachSalesChannelToProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: attachSalesChannelToProducts.aliases.products,
            },
          ],
        },
        attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
              alias: detachSalesChannelFromProducts.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: detachSalesChannelFromProducts.aliases.products,
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
            alias: createInventoryItems.aliases.products,
          },
        },
        createInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias: removeInventoryItems.aliases.inventoryItems,
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
            alias: attachInventoryItems.aliases.inventoryItems,
          },
        },
        attachInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias: detachInventoryItems.aliases.inventoryItems,
          },
        },
        detachInventoryItems
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
              alias: updateProductsVariantsPrices.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: updateProductsVariantsPrices.aliases.products,
            },
          ],
        },
        updateProductsVariantsPrices
      ),
      compensate: pipe(
        {
          invoke: [
            {
              from: Actions.prepare,
              alias: updateProductsVariantsPrices.aliases.input,
            },
            {
              from: Actions.createProducts,
              alias: updateProductsVariantsPrices.aliases.products,
            },
          ],
        },
        createProductsPrepareCreatePricesCompensation,
        updateProductsVariantsPrices
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
              alias: listProducts.aliases.inputData,
            },
            {
              from: Actions.createProducts,
              alias: listProducts.aliases.products,
            },
          ],
        },
        listProducts
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductInputDTO[],
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, Actions.createProducts)
