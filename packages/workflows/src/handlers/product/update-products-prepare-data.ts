import { ProductDTO, SalesChannelDTO, WorkflowTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type ProductWithSalesChannelsDTO = ProductDTO & {
  sales_channels?: SalesChannelDTO[]
}

export type UpdateProductsPreparedData = {
  originalProducts: ProductWithSalesChannelsDTO[]
  productHandleAddedChannelsMap: Map<string, string[]>
  productHandleRemovedChannelsMap: Map<string, string[]>
}

export async function updateProductsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO>): Promise<UpdateProductsPreparedData> {
  const ids = data.products.map((product) => product.id)

  const productHandleAddedChannelsMap = new Map<string, string[]>()
  const productHandleRemovedChannelsMap = new Map<string, string[]>()

  const productService = container.resolve("productService")
  const productServiceTx = productService.withTransaction(context.manager)

  const products = await productServiceTx.list(
    // TODO: use RemoteQuery - sales_channels needs to be added to the joiner config
    { id: ids },
    {
      relations: [
        "variants",
        "variants.options",
        "images",
        "options",
        "tags",
        "collection",
        "sales_channels",
      ],
    }
  )

  data.products.forEach((productInput) => {
    const removedChannels: string[] = []
    const addedChannels: string[] = []

    const currentProduct = products.find(
      (p) => p.id === productInput.id
    ) as unknown as ProductWithSalesChannelsDTO

    if (productInput.sales_channels) {
      productInput.sales_channels.forEach((channel) => {
        if (
          !currentProduct.sales_channels?.find((sc) => sc.id === channel.id)
        ) {
          addedChannels.push(channel.id)
        }
      })

      currentProduct.sales_channels?.forEach((channel) => {
        if (!productInput.sales_channels!.find((sc) => sc.id === channel.id)) {
          removedChannels.push(channel.id)
        }
      })
    }

    productHandleAddedChannelsMap.set(currentProduct.handle!, addedChannels)
    productHandleRemovedChannelsMap.set(currentProduct.handle!, removedChannels)
  })

  return {
    originalProducts: products,
    productHandleAddedChannelsMap,
    productHandleRemovedChannelsMap,
  }
}

updateProductsPrepareData.aliases = {
  preparedData: "preparedData",
}
