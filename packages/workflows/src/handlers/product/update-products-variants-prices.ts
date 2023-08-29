import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[]
}
type HandlerInput = {
  productsHandleVariantsIndexPricesMap: Map<
    ProductHandle,
    VariantIndexAndPrices[]
  >
  products: ProductTypes.ProductDTO[]
}

export async function updateProductsVariantsPrices({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>) {
  const { manager } = context
  const products = data.products
  const productsHandleVariantsIndexPricesMap =
    data.productsHandleVariantsIndexPricesMap

  const productVariantService = container.resolve("productVariantService")
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  const variantIdsPricesData: any[] = []
  const productsMap = new Map<string, ProductTypes.ProductDTO>(
    products.map((p) => [p.handle!, p])
  )

  for (const mapData of productsHandleVariantsIndexPricesMap.entries()) {
    const [handle, variantData] = mapData

    const product = productsMap.get(handle)
    if (!product) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product with handle ${handle} not found`
      )
    }

    variantData.forEach((item, index) => {
      const variant = product.variants[index]
      variantIdsPricesData.push({
        variantId: variant.id,
        prices: item.prices,
      })
    })
  }

  await productVariantServiceTx.updateVariantPrices(variantIdsPricesData)
}

updateProductsVariantsPrices.aliases = {
  products: "products",
}
