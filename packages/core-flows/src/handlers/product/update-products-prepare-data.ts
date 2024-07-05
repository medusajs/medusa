import {
  BigNumberInput,
  ProductDTO,
  SalesChannelDTO,
  WorkflowTypes,
} from "@medusajs/types"
import { MedusaV2Flag } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type ProductWithSalesChannelsDTO = ProductDTO & {
  sales_channels?: SalesChannelDTO[]
}

type VariantPrice = {
  region_id?: string
  currency_code?: string
  amount: BigNumberInput
  min_quantity?: BigNumberInput
  max_quantity?: BigNumberInput
}

export type UpdateProductsPreparedData = {
  originalProducts: ProductWithSalesChannelsDTO[]
  productHandleAddedChannelsMap: Map<string, string[]>
  productHandleRemovedChannelsMap: Map<string, string[]>
  variantPricesMap: Map<string, VariantPrice[]>
}

export async function updateProductsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO>): Promise<UpdateProductsPreparedData> {
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  const variantPricesMap = new Map<string, VariantPrice[]>()
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
      take: null,
    }
  )

  const productsMap = new Map(products.map((product) => [product.id, product]))

  data.products.forEach((productInput) => {
    const removedChannels: string[] = []
    const addedChannels: string[] = []

    const currentProduct = productsMap.get(
      productInput.id
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

    for (const variantInput of productInput.variants || []) {
      if (variantInput.id) {
        variantPricesMap.set(variantInput.id, variantInput.prices || [])
      }

      if (isPricingDomainEnabled) {
        delete variantInput.prices
      }
    }

    productHandleAddedChannelsMap.set(currentProduct.handle!, addedChannels)
    productHandleRemovedChannelsMap.set(currentProduct.handle!, removedChannels)
  })

  return {
    originalProducts: products,
    productHandleAddedChannelsMap,
    productHandleRemovedChannelsMap,
    variantPricesMap,
  }
}

updateProductsPrepareData.aliases = {
  preparedData: "preparedData",
}
