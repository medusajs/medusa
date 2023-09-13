import { WorkflowArguments } from "../../helper"
import { UpdateProductsPreparedData } from "../product"

export async function reshapeAttachSalesChannelsData({
  data,
}: WorkflowArguments<{
  preparedData: UpdateProductsPreparedData
  productHandleAddedChannelsMap: Map<string, string[]>
}>) {
  return {
    alias: reshapeAttachSalesChannelsData.aliases.output,
    value: {
      productsHandleSalesChannelsMap:
        data.preparedData.productHandleAddedChannelsMap,
    },
  }
}

reshapeAttachSalesChannelsData.aliases = {
  products: "products",
  preparedData: "preparedData",
  output: "reshapeAttachSalesChannelsDataOutput",
}

export async function reshapeDetachSalesChannelsData({
  data,
}: WorkflowArguments<{
  preparedData: UpdateProductsPreparedData
  productHandleAddedChannelsMap: Map<string, string[]>
}>) {
  return {
    alias: reshapeAttachSalesChannelsData.aliases.output,
    value: {
      productsHandleSalesChannelsMap:
        data.preparedData.productHandleRemovedChannelsMap,
    },
  }
}

reshapeDetachSalesChannelsData.aliases = {
  products: "products",
  preparedData: "preparedData",
  output: "reshapeDetachSalesChannelsDataOutput",
}
