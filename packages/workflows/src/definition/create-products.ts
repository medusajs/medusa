import { InputAlias, Workflows } from "../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  createProducts as createProductsHandler,
  removeProducts,
  RemoveProductsInputAlias,
} from "../handlers"
import { exportWorkflow, pipe, WorkflowArguments } from "../helper"

import { ProductTypes } from "@medusajs/types"
import { createProductsPrepareData } from "../handlers/pipes/create-products-prepare-data"
import {
  attachShippingProfileToProducts,
  AttachShippingProfileToProductsInputAlias,
} from "../handlers/product/attach-shipping-profile-to-products"
import { detachShippingProfileFromProducts } from "../handlers/product/detach-shipping-profile-from-products"
import {
  attachSalesChannelToProducts,
  AttachSalesChannelToProductsInputAlias,
} from "../handlers/product/attach-sales-channel-to-products"
import {
  detachSalesChannelFromProducts,
  DetachSalesChannelToProductsInputAlias,
} from "../handlers/product/detach-sales-channel-from-products"

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
            alias: InputAlias.ProductsInputData,
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
            alias: createProductsHandler.aliases.CreateProductsInputAlias,
          },
        },
        createProductsHandler
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: RemoveProductsInputAlias,
          },
        },
        ({ data }: WorkflowArguments & {}) => {},
        removeProducts
      ),
    },
  ],
  [
    Actions.attachShippingProfile,
    {
      invoke: pipe(
        {
          invoke: {
            from: Actions.prepare,
            alias: AttachShippingProfileToProductsInputAlias,
          },
        },
        attachShippingProfileToProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: InputAlias.Products,
          },
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
          invoke: {
            from: Actions.prepare,
            alias: AttachSalesChannelToProductsInputAlias,
          },
        },
        attachSalesChannelToProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: DetachSalesChannelToProductsInputAlias,
          },
        },
        detachSalesChannelFromProducts
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  ProductTypes.CreateProductDTO[],
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, Actions.createProducts)
