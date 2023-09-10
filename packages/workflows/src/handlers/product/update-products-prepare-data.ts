import { ProductDTO, ProductTypes } from "@medusajs/types"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { WorkflowArguments } from "../../helper"

type HandlerInput = { products: ProductTypes.UpdateProductDTO[] }

export type UpdateProductsPreparedData = {
  products: ProductDTO[]
  productHandleAddedChannelsMap: Map<string, string[]>
  productHandleRemovedChannelsMap: Map<string, string[]>
}

export async function updateProductsPrepareData({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<UpdateProductsPreparedData> {
  const ids = data.products.map((product) => product.id)

  const productHandleAddedChannelsMap = new Map<string, string[]>()
  const productHandleRemovedChannelsMap = new Map<string, string[]>()

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const products = await productModuleService.list({ id: ids })

  data.products.forEach((productInput) => {
    const removedChannels: string[] = []
    const addedChannels: string[] = []

    const currentProduct = products.find((p) => p.id === productInput.id)!

    if (productInput.sales_channels) {
      productInput.sales_channels.forEach((channel) => {
        if (!currentProduct.sales_channels.find((sc) => sc.id === channel.id)) {
          addedChannels.push(channel.id)
        }
      })

      currentProduct.sales_channels.forEach((channel) => {
        if (!productInput.sales_channels.find((sc) => sc.id === channel.id)) {
          removedChannels.push(channel.id)
        }
      })
    }

    productHandleAddedChannelsMap.set(currentProduct.handle, addedChannels)
    productHandleRemovedChannelsMap.set(currentProduct.handle, removedChannels)
  })

  return {
    products,
    productHandleAddedChannelsMap,
    productHandleRemovedChannelsMap,
  }
}

updateProductsPrepareData.aliases = {
  preparedData: "preparedData",
}
