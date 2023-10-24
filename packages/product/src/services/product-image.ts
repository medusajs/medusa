import { Modules } from "@medusajs/modules-sdk"
import { DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  composeMessage,
} from "@medusajs/utils"
import { Image } from "@models"
import { ProductImageRepository } from "@repositories"
import { InternalContext, ProductImageEvents } from "../types"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  productImageRepository: DAL.RepositoryService
}

export default class ProductImageService<TEntity extends Image = Image> {
  protected readonly productImageRepository_: DAL.RepositoryService

  constructor({ productImageRepository }: InjectedDependencies) {
    this.productImageRepository_ = productImageRepository
  }

  @InjectTransactionManager(doNotForceTransaction, "productImageRepository_")
  async upsert(
    urls: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], TEntity[], TEntity[]]> {
    const [images, updatedImages, insertedImages] = await (
      this.productImageRepository_ as ProductImageRepository
    ).upsert!(urls, sharedContext)

    sharedContext.messageAggregator?.save(
      updatedImages.map(({ id }) => {
        return composeMessage(ProductImageEvents.PRODUCT_IMAGE_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Image.name,
          context: sharedContext,
        })
      })
    )

    sharedContext.messageAggregator?.save(
      insertedImages.map(({ id }) => {
        return composeMessage(ProductImageEvents.PRODUCT_IMAGE_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Image.name,
          context: sharedContext,
        })
      })
    )

    return [images, updatedImages, insertedImages] as [
      TEntity[],
      TEntity[],
      TEntity[]
    ]
  }
}
