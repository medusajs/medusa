import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { updateProductsStep } from "../steps/update-products"
import {
  associateProductsWithSalesChannelsStep,
  detachProductsFromSalesChannelsStep,
} from "../../sales-channel"
import { useRemoteQueryStep } from "../../common"

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

export const updateProductsWorkflowId = "update-products"
export const updateProductsWorkflow = createWorkflow(
  updateProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    // TODO: Delete price sets for removed variants

    const toUpdateInput = transform({ input }, (data) => {
      if ((data.input as UpdateProductsStepInputProducts).products) {
        return (data.input as UpdateProductsStepInputProducts).products.map(
          (p) => ({
            ...p,
            sales_channels: undefined,
          })
        )
      } else {
        return {
          selector: (data.input as UpdateProductsStepInputSelector).selector,
          update: {
            ...(data.input as UpdateProductsStepInputSelector).update,
            sales_channels: undefined,
          },
        }
      }
    })

    const updatedProducts = updateProductsStep(toUpdateInput as any) // TODO: type

    const updatedProductIds = transform({ updatedProducts, input }, (data) => {
      if (
        !(data.input as UpdateProductsStepInputSelector).update.sales_channels
      ) {
        return []
      }

      let productIds = data.updatedProducts.map((p) => p.id)

      ;(data.input as UpdateProductsStepInputProducts).products?.forEach(
        (p) => {
          if (!p.sales_channels) {
            // these products don't update sales channels so we don't want to their previous channels
            productIds = productIds.filter((id) => id !== p.id)
          }
        }
      )

      return productIds
    })

    const currentLinks = useRemoteQueryStep({
      entry_point: "product_sales_channel",
      fields: ["product_id", "sales_channel_id"],
      variables: { product_id: updatedProductIds },
    })

    detachProductsFromSalesChannelsStep({ links: currentLinks })

    const salesChannelLinks = transform({ input, updatedProducts }, (data) => {
      if ((data.input as UpdateProductsStepInputSelector).selector) {
        if (
          !(data.input as UpdateProductsStepInputSelector).update.sales_channels
        ) {
          return []
        }
        return data.updatedProducts
          .map((p) => {
            return (
              data.input as UpdateProductsStepInputSelector
            ).update.sales_channels!.map((channel) => ({
              sales_channel_id: channel.id,
              product_id: p.id,
            }))
          })
          .flat()
      }

      return (data.input as UpdateProductsStepInputProducts).products
        .filter((input) => input.sales_channels)
        .map((input) => {
          return input.sales_channels!.map((salesChannel) => ({
            sales_channel_id: salesChannel.id,
            product_id: input.id as string,
          }))
        })
        .flat()
    })

    associateProductsWithSalesChannelsStep({ links: salesChannelLinks })

    return updatedProducts
  }
)
