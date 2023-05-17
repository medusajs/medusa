import {
  FilterableProductCollectionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductVariantProps,
  ProductCollectionDTO,
  ProductDTO,
  ProductTagDTO,
  ProductVariantDTO,
} from "./common"
import { FindConfig } from "../common"
import { SharedContext } from "../shared-context"

export interface IProductService {
  list<T = unknown>(
    filter: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    context?: SharedContext
  ): Promise<T[]>

  listTags<T = unknown>(
    filter: FilterableProductTagProps,
    config?: FindConfig<ProductVariantDTO>,
    context?: SharedContext
  ): Promise<T[]>

  listVariants<T = unknown>(
    filter: FilterableProductVariantProps,
    config?: FindConfig<ProductTagDTO>,
    context?: SharedContext
  ): Promise<T[]>

  listCollections<T = unknown>(
    filter: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    context?: SharedContext
  ): Promise<T[]>
}
