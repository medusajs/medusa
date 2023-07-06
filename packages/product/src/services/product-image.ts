import { Image } from "@models"
import { Context, DAL } from "@medusajs/types"
import { ProductImageRepository } from "@repositories"

type InjectedDependencies = {
  productImageRepository: DAL.RepositoryService
}

export default class ProductImageService<TEntity extends Image = Image> {
  protected readonly productImageRepository_: ProductImageRepository

  constructor({ productImageRepository }: InjectedDependencies) {
    this.productImageRepository_ =
      productImageRepository as ProductImageRepository
  }

  async upsert(urls: string[], sharedContext?: Context): Promise<TEntity[]> {
    return (await this.productImageRepository_.upsert!(
      urls,
      sharedContext
    )) as TEntity[]
  }
}
