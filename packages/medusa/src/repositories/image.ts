import { EntityRepository, In, Repository } from "typeorm"
import { Image } from "../models"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  async insertBulk(data: QueryDeepPartialEntity<Image>[]): Promise<Image[]> {
    const queryBuilder = this.createQueryBuilder()
      .insert()
      .into(Image)
      .values(data)

    if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
      const rawMoneyAmounts = await queryBuilder.execute()
      return rawMoneyAmounts.generatedMaps.map((d) => this.create(d)) as Image[]
    }

    const rawMoneyAmounts = await queryBuilder.returning("*").execute()
    return rawMoneyAmounts.generatedMaps.map((d) => this.create(d))
  }

  public async upsertImages(imageUrls: string[]) {
    const existingImages = await this.find({
      where: {
        url: In(imageUrls),
      },
    })
    const existingImagesMap = new Map(
      existingImages.map<[string, Image]>((img) => [img.url, img])
    )

    const upsertedImgs: Image[] = []
    const imageToCreate: QueryDeepPartialEntity<Image>[] = []

    imageUrls.map(async (url) => {
      const aImg = existingImagesMap.get(url)
      if (aImg) {
        upsertedImgs.push(aImg)
      } else {
        const newImg = this.create({ url })
        imageToCreate.push(newImg as QueryDeepPartialEntity<Image>)
      }
    })

    if (imageToCreate.length) {
      const newImgs = await this.insertBulk(imageToCreate)
      upsertedImgs.push(...newImgs)
    }

    return upsertedImgs
  }
}
