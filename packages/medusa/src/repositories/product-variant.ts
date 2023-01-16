import { EntityRepository, FindManyOptions, Repository } from "typeorm"
import { ProductVariant } from "../models/product-variant"
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"

export type FindWithRelationsOptions = FindManyOptions<ProductVariant> & {
  order?: FindOptionsOrder<ProductVariant>
  withDeleted?: boolean
}

@EntityRepository(ProductVariant)
export class ProductVariantRepository extends Repository<ProductVariant> {}
