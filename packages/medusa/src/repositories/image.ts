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

    // TODO: remove if statement once this issue is resolved https://github.com/typeorm/typeorm/issues/9850
    if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
      const rawImages = await queryBuilder.execute()
      return rawImages.generatedMaps.map((d) => this.create(d)) as Image[]
    }

    const rawImages = await queryBuilder.returning("*").execute()
    return rawImages.generatedMaps.map((d) => this.create(d))
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

    imageUrls.forEach((url) => {
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
