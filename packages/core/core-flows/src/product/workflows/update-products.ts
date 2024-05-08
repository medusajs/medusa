import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { updateProductsStep } from "../steps/update-products"
import { setProductsSalesChannelsStep } from "../../sales-channel/steps/set-products-sales-channels"

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

    const salesChannelLinks = transform({ input, updatedProducts }, (data) => {
      if ((data.input as UpdateProductsStepInputSelector).selector) {
        if (
          !(data.input as UpdateProductsStepInputSelector).update.sales_channels
        ) {
          return []
        }
        return data.updatedProducts.map((p) => {
          return {
            product_id: p.id,
            sales_channel_ids: (
              (data.input as UpdateProductsStepInputSelector).update
                .sales_channels || []
            ).map((channel) => channel.id),
          }
        })
      }

      return (data.input as UpdateProductsStepInputProducts).products
        .filter((input) => input.sales_channels)
        .map((input) => {
          return {
            product_id: input.id as string,
            sales_channel_ids: input.sales_channels!.map(
              (salesChannel) => salesChannel.id
            ),
          }
        })
    })

    setProductsSalesChannelsStep(salesChannelLinks)

    return updatedProducts
  }
)
