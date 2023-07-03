import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { deduplicateIfNecessary } from "../utils"
import { Context, DAL } from "@medusajs/types"
import { Image } from "@models"
import { BaseRepository } from "./base"

export class ProductImageRepository extends BaseRepository<Image> {
  constructor() {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<Image> = { where: {} },
    context: Context = {}
  ): Promise<Image[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

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
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

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
}
