import { Image } from "@models"
import { Context, DAL } from "@medusajs/types"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"

type InjectedDependencies = {
  productImageRepository: DAL.RepositoryService
}

export default class ProductImageService<TEntity extends Image = Image> {
  protected readonly productImageRepository_: DAL.RepositoryService

  constructor({ productImageRepository }: InjectedDependencies) {
    this.productImageRepository_ = productImageRepository
  }

  @InjectTransactionManager("productImageRepository_")
  async upsert(
    urls: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productImageRepository_.upsert!(urls, sharedContext)
  }
}
