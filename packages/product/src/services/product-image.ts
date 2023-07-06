import { Image } from "@models"
import { Context, DAL } from "@medusajs/types"

type InjectedDependencies = {
  productImageRepository: DAL.RepositoryService
}

export default class ProductImageService<TEntity extends Image = Image> {
  protected readonly productImageRepository_: DAL.RepositoryService

  constructor({ productImageRepository }: InjectedDependencies) {
    this.productImageRepository_ = productImageRepository
  }

  async upsert(urls: string[], sharedContext?: Context): Promise<TEntity[]> {
    return (await this.productImageRepository_.upsert!(
      urls,
      sharedContext
    )) as TEntity[]
  }
}
