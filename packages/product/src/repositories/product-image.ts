import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { Context, DAL } from "@medusajs/types"
import { Image, Product } from "@models"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class ProductImageRepository extends AbstractBaseRepository<Image> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Image> = { where: {} },
    context: Context = {}
  ): Promise<Image[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.find(
      Image,
      findOptions_.where as MikroFilterQuery<Image>,
      findOptions_.options as MikroOptions<Image>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Image> = { where: {} },
    context: Context = {}
  ): Promise<[Image[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      Image,
      findOptions_.where as MikroFilterQuery<Image>,
      findOptions_.options as MikroOptions<Image>
    )
  }

  async upsert(urls: string[], context: Context = {}): Promise<Image[]> {
    const existingImages = await this.find(
      {
        where: {
          url: {
            $in: urls,
          },
        },
      },
      context
    )

    const existingImagesMap = new Map(
      existingImages.map<[string, Image]>((img) => [img.url, img])
    )

    const upsertedImgs: Image[] = []
    const imageToCreate: RequiredEntityData<Image>[] = []

    urls.forEach((url) => {
      const aImg = existingImagesMap.get(url)
      if (aImg) {
        upsertedImgs.push(aImg)
      } else {
        const newImg = this.manager_.create(Image, { url })
        imageToCreate.push(newImg)
      }
    })

    if (imageToCreate.length) {
      const newImgs: Image[] = []
      imageToCreate.forEach((img) => {
        newImgs.push(this.manager_.create(Image, img))
      })

      await this.manager_.persistAndFlush(newImgs)
      upsertedImgs.push(...newImgs)
    }

    return upsertedImgs
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(Product, { id: { $in: ids } }, {})
  }

  async create(data: unknown[], context: Context = {}): Promise<Image[]> {
    throw new Error("Method not implemented.")
  }
}
