import { Image } from "@models"
import { Context, DAL } from "@medusajs/types"

type InjectedDependencies = {
  productImageRepository: DAL.RepositoryService
}

export default class ProductImageService<TEntity = Image> {
  protected readonly productImageRepository_: DAL.RepositoryService<TEntity>

  constructor({ productImageRepository }: InjectedDependencies) {
    this.productImageRepository_ = productImageRepository
  }

  upsert(urls: string[], sharedContext?: Context) {
    return this.productImageRepository_.upsert!(urls, sharedContext)
  }
}
