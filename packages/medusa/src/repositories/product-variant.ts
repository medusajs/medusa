import { FindManyOptions } from "typeorm"
import { ProductVariant } from "../models/product-variant"
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"
import { dataSource } from "../loaders/database"

export type FindWithRelationsOptions = FindManyOptions<ProductVariant> & {
  order?: FindOptionsOrder<ProductVariant>
  withDeleted?: boolean
}

export const ProductVariantRepository = dataSource.getRepository(ProductVariant)
export default ProductVariantRepository
