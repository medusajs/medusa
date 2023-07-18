import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ProductVariantService } from "../../services"
import {
  ProductVariantPricesCreateReq,
  UpdateVariantPricesData,
} from "../../types/product-variant"
import { MedusaError } from "@medusajs/utils"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: ProductVariantPricesCreateReq[]
}

export async function updateProductsVariantsPrices({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    products: ProductTypes.ProductDTO[]
    productsHandleVariantsIndexPricesMap: Map<
      ProductHandle,
      VariantIndexAndPrices
    >
  }
}) {
  const productVariantService: ProductVariantService = container.resolve(
    "productVariantService"
  )
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  const variantIdsPricesData: UpdateVariantPricesData[] = []
  const productsMap = new Map<string, ProductTypes.ProductDTO>(
    data.products.map((p) => [p.handle!, p])
  )

  for (const mapData of data.productsHandleVariantsIndexPricesMap.entries()) {
    const [handle, { index, prices }] = mapData

    const product = productsMap.get(handle)
    if (!product) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product with handle ${handle} not found`
      )
    }

    const variant = product.variants[index]
    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant with index ${index} not found in product with handle ${handle}`
      )
    }

    variantIdsPricesData.push({
      variantId: variant.id,
      prices,
    })
  }

  await productVariantServiceTx.updateVariantPrices(variantIdsPricesData)
}
