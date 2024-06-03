import { updateProductsStep } from "../steps/update-products"

import { Modules } from "@medusajs/modules-sdk"
import { ProductTypes } from "@medusajs/types"
import { arrayDifference } from "@medusajs/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import {
  createRemoteLinkStep,
  dismissRemoteLinkStep,
  useRemoteQueryStep,
} from "../../common"

type UpdateProductsStepInputSelector = {
  selector: ProductTypes.FilterableProductProps
  update: ProductTypes.UpdateProductDTO & {
    sales_channels?: { id: string }[]
  }
}

type UpdateProductsStepInputProducts = {
  products: (ProductTypes.UpsertProductDTO & {
    sales_channels?: { id: string }[]
  })[]
}

type UpdateProductsStepInput =
  | UpdateProductsStepInputSelector
  | UpdateProductsStepInputProducts

type WorkflowInput = UpdateProductsStepInput

function prepareUpdateProductInput({
  input,
}: {
  input: WorkflowInput
}): UpdateProductsStepInput {
  if ("products" in input) {
    if (!input.products.length) {
      return { products: [] }
    }

    return {
      products: input.products.map((p) => ({
        ...p,
        sales_channels: undefined,
      })),
    }
  }

  return {
    selector: input.selector,
    update: {
      ...input.update,
      sales_channels: undefined,
    },
  }
}

function updateProductIds({
  updatedProducts,
  input,
}: {
  updatedProducts: ProductTypes.ProductDTO[]
  input: WorkflowInput
}) {
  let productIds = updatedProducts.map((p) => p.id)

  if ("products" in input) {
    const discardedProductIds: string[] = input.products
      .filter((p) => !p.sales_channels)
      .map((p) => p.id as string)
    return arrayDifference(productIds, discardedProductIds)
  }

  return !input.update?.sales_channels ? [] : productIds
}

function prepareSalesChannelLinks({
  input,
  updatedProducts,
}: {
  updatedProducts: ProductTypes.ProductDTO[]
  input: WorkflowInput
}): Record<string, Record<string, any>>[] {
  if ("products" in input) {
    if (!input.products.length) {
      return []
    }

    return input.products
      .filter((p) => p.sales_channels)
      .flatMap((p) =>
        p.sales_channels!.map((sc) => ({
          [Modules.PRODUCT]: {
            product_id: p.id,
          },
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: sc.id,
          },
        }))
      )
  }

  if (input.selector && input.update?.sales_channels?.length) {
    return updatedProducts.flatMap((p) =>
      input.update.sales_channels!.map((channel) => ({
        [Modules.PRODUCT]: {
          product_id: p.id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: channel.id,
        },
      }))
    )
  }

  return []
}

function prepareToDeleteLinks({
  currentLinks,
}: {
  currentLinks: {
    product_id: string
    sales_channel_id: string
  }[]
}) {
  if (!currentLinks.length) {
    return []
  }

  return currentLinks.map(({ product_id, sales_channel_id }) => ({
    [Modules.PRODUCT]: {
      product_id,
    },
    [Modules.SALES_CHANNEL]: {
      sales_channel_id,
    },
  }))
}

export const updateProductsWorkflowId = "update-products"
export const updateProductsWorkflow = createWorkflow(
  updateProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    // TODO: Delete price sets for removed variants

    const toUpdateInput = transform({ input }, prepareUpdateProductInput)
    const updatedProducts = updateProductsStep(toUpdateInput)
    const updatedProductIds = transform(
      { updatedProducts, input },
      updateProductIds
    )

    const currentLinks = useRemoteQueryStep({
      entry_point: "product_sales_channel",
      fields: ["product_id", "sales_channel_id"],
      variables: { filters: { product_id: updatedProductIds } },
    })

    const toDeleteLinks = transform({ currentLinks }, prepareToDeleteLinks)

    dismissRemoteLinkStep(toDeleteLinks)

    const salesChannelLinks = transform(
      { input, updatedProducts },
      prepareSalesChannelLinks
    )

    createRemoteLinkStep(salesChannelLinks)

    return updatedProducts
  }
)
