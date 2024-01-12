import { Context, ProductTypes } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { ProductCollection } from "@models"

type UpdateProductCollection = ProductTypes.UpdateProductCollectionDTO & {
  products?: string[]
}

type CreateProductCollection = ProductTypes.CreateProductCollectionDTO & {
  products?: string[]
}

// eslint-disable-next-line max-len
export class ProductCollectionRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  ProductCollection
) {
  async create(
    data: CreateProductCollection[],
    context: Context = {}
  ): Promise<ProductCollection[]> {
    const productCollections = data.map((collectionData) => {
      if (collectionData.product_ids) {
        collectionData.products = collectionData.product_ids

        delete collectionData.product_ids
      }

      return collectionData
    })

    return await super.create(productCollections, context)
  }

  async update(
    data: UpdateProductCollection[],
    context: Context = {}
  ): Promise<ProductCollection[]> {
    const productCollections = data.map((collectionData) => {
      if (collectionData.product_ids) {
        collectionData.products = collectionData.product_ids

        delete collectionData.product_ids
      }

      return collectionData
    })

    return await super.update(productCollections, context)
  }
}
