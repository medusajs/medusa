import { ProductDTO, ProductTypes, SalesChannelDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  products: (ProductTypes.UpdateProductDTO & {
    sales_channels?: SalesChannelDTO[]
  })[]
}

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
}: WorkflowArguments<HandlerInput>): Promise<UpdateProductsPreparedData> {
  const ids = data.products.map((product) => product.id)

  const productHandleAddedChannelsMap = new Map<string, string[]>()
  const productHandleRemovedChannelsMap = new Map<string, string[]>()

  const productService = container.resolve("productService")
  const productServiceTx = productService.withTransaction(context.manager)

  const products = await productServiceTx.list(
    { id: ids },
    { relations: ["variants", "sales_channels"] } // TODO: figure out relations from config arg
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
