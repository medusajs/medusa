import { ProductOptionValue } from "@models"
import { Context, DAL } from "@medusajs/types"
import {
  ProductOptionRepository,
  ProductOptionValueRepository,
} from "@repositories"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import {
  CreateProductOptionValueDTO,
  UpdateProductOptionValueDTO,
} from "../types/services/product-option-value"

type InjectedDependencies = {
  productOptionValueRepository: DAL.RepositoryService
}

export default class ProductOptionValueService<
  TEntity extends ProductOptionValue = ProductOptionValue
> {
  protected readonly productOptionValueRepository_: DAL.RepositoryService

  constructor({ productOptionValueRepository }: InjectedDependencies) {
    this.productOptionValueRepository_ =
      productOptionValueRepository as ProductOptionRepository
  }

  @InjectTransactionManager("productOptionValueRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return await this.productOptionValueRepository_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("productOptionValueRepository_")
  async upsert(
    data: (UpdateProductOptionValueDTO | CreateProductOptionValueDTO)[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.productOptionValueRepository_ as ProductOptionValueRepository
    ).upsert!(data, sharedContext)) as TEntity[]
  }
}
