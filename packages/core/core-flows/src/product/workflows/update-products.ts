import { updateProductsStep } from "../steps/update-products"

import {
  CreateMoneyAmountDTO,
  ProductTypes,
  UpdateProductVariantWorkflowInputDTO,
} from "@medusajs/types"
import { arrayDifference, Modules } from "@medusajs/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import {
  createRemoteLinkStep,
  dismissRemoteLinkStep,
  useRemoteQueryStep,
} from "../../common"
import { upsertVariantPricesWorkflow } from "./upsert-variant-prices"
import { getVariantIdsForProductsStep } from "../steps/get-variant-ids-for-products"

type UpdateProductsStepInputSelector = {
  selector: ProductTypes.FilterableProductProps
  update: Omit<ProductTypes.UpdateProductDTO, "variants"> & {
    sales_channels?: { id: string }[]
    variants?: UpdateProductVariantWorkflowInputDTO[]
  }
}

type UpdateProductsStepInputProducts = {
  products: (Omit<ProductTypes.UpsertProductDTO, "variants"> & {
    sales_channels?: { id: string }[]
    variants?: UpdateProductVariantWorkflowInputDTO[]
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
        variants: p.variants?.map((v) => ({
          ...v,
          prices: undefined,
        })),
      })),
    }
  }

  return {
    selector: input.selector,
    update: {
      ...input.update,
      sales_channels: undefined,
      variants: input.update?.variants?.map((v) => ({
        ...v,
        prices: undefined,
      })),
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

function prepareVariantPrices({
  input,
  updatedProducts,
}: {
  updatedProducts: ProductTypes.ProductDTO[]
  input: WorkflowInput
}): {
  variant_id: string
  product_id: string
  prices?: CreateMoneyAmountDTO[]
}[] {
  if ("products" in input) {
    if (!input.products.length) {
      return []
    }

    // Note: We rely on the ordering of input and update here.
    return input.products.flatMap((product, i) => {
      if (!product.variants?.length) {
        return []
      }

      const updatedProduct = updatedProducts[i]
      return product.variants.map((variant, j) => {
        const updatedVariant = updatedProduct.variants[j]

        return {
          product_id: updatedProduct.id,
          variant_id: updatedVariant.id,
          prices: variant.prices,
        }
      })
    })
  }

  if (input.selector && input.update?.variants?.length) {
    return updatedProducts.flatMap((p) => {
      return input.update.variants!.map((variant, i) => ({
        product_id: p.id,
        variant_id: p.variants[i].id,
        prices: variant.prices,
      }))
    })
  }

  return []
}

function prepareToDeleteSalesChannelLinks({
  currentSalesChannelLinks,
}: {
  currentSalesChannelLinks: {
    product_id: string
    sales_channel_id: string
  }[]
}) {
  if (!currentSalesChannelLinks.length) {
    return []
  }

  return currentSalesChannelLinks.map(({ product_id, sales_channel_id }) => ({
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
  ): WorkflowResponse<ProductTypes.ProductDTO[]> => {
    const previousVariantIds = getVariantIdsForProductsStep(input)

    const toUpdateInput = transform({ input }, prepareUpdateProductInput)
    const updatedProducts = updateProductsStep(toUpdateInput)
    const updatedProductIds = transform(
      { updatedProducts, input },
      updateProductIds
    )

    const salesChannelLinks = transform(
      { input, updatedProducts },
      prepareSalesChannelLinks
    )

    const variantPrices = transform(
      { input, updatedProducts },
      prepareVariantPrices
    )

    const currentSalesChannelLinks = useRemoteQueryStep({
      entry_point: "product_sales_channel",
      fields: ["product_id", "sales_channel_id"],
      variables: { filters: { product_id: updatedProductIds } },
    })

    const toDeleteSalesChannelLinks = transform(
      { currentSalesChannelLinks },
      prepareToDeleteSalesChannelLinks
    )

    upsertVariantPricesWorkflow.runAsStep({
      input: { variantPrices, previousVariantIds },
    })

    dismissRemoteLinkStep(toDeleteSalesChannelLinks)

    createRemoteLinkStep(salesChannelLinks)

    return new WorkflowResponse(updatedProducts)
  }
)
