import { FindManyOptions, FindOptionsOrder } from "typeorm"
import { dataSource } from "../loaders/database"
import { ProductVariant } from "../models/product-variant"

export type FindWithRelationsOptions = FindManyOptions<ProductVariant> & {
  order?: FindOptionsOrder<ProductVariant>
  withDeleted?: boolean
}

export const ProductVariantRepository = dataSource.getRepository(ProductVariant)
export default ProductVariantRepository
