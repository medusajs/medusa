import { ProductTypes } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { updateProductsStep } from "../steps/update-products"

import {
  createLinkStep,
  removeRemoteLinkStep,
  useRemoteQueryStep,
} from "../../common"
import { arrayDifference } from "@medusajs/utils"
import { DeleteEntityInput, Modules } from "@medusajs/modules-sdk"

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
  if ("products" in input) {
    let productIds = updatedProducts.map((p) => p.id)
    const discardedProductIds: string[] = input.products
      .filter((p) => !p.sales_channels)
      .map((p) => p.id as string)
    return arrayDifference(productIds, discardedProductIds)
  }

  return !input.update.sales_channels ? [] : undefined
}

function prepareSalesChannelLinks({
  input,
  updatedProducts,
}: {
  updatedProducts: ProductTypes.ProductDTO[]
  input: WorkflowInput
}): Record<string, Record<string, any>>[] {
  if ("products" in input) {
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

  if (input.selector && input.update.sales_channels?.length) {
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
      variables: { product_id: updatedProductIds },
    })

    const toDeleteLinks = transform({ currentLinks }, prepareToDeleteLinks)

    removeRemoteLinkStep(toDeleteLinks as DeleteEntityInput[])

    const salesChannelLinks = transform(
      { input, updatedProducts },
      prepareSalesChannelLinks
    )

    createLinkStep(salesChannelLinks)

    return updatedProducts
  }
)
