import { Context } from "@medusajs/types"
import { Image } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils } from "@medusajs/utils"

// eslint-disable-next-line max-len
export class ProductImageRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Image
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async upsert(urls: string[], context: Context = {}): Promise<Image[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

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

    const existingImagesMap = new Map<string, Image>(
      existingImages.map<[string, Image]>((img) => [img.url, img])
    )

    const upsertedImgs: Image[] = []
    const imageToCreate: Image[] = []

    urls.forEach((url) => {
      const aImg = existingImagesMap.get(url)
      if (aImg) {
        upsertedImgs.push(aImg)
      } else {
        const newImg = (manager as SqlEntityManager).create(Image, { url })
        imageToCreate.push(newImg)
      }
    })

    if (imageToCreate.length) {
      manager.persist(imageToCreate)
      upsertedImgs.push(...imageToCreate)
    }

    return upsertedImgs
  }
}
