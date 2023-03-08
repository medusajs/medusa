import { EntityRepository, In, Repository } from "typeorm"
import { Image } from "../models"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { RelationIdLoader } from "typeorm/query-builder/relation-id/RelationIdLoader"
import { RawSqlResultsToEntityTransformer } from "typeorm/query-builder/transformer/RawSqlResultsToEntityTransformer"

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  async insertBulk(data: QueryDeepPartialEntity<Image>[]): Promise<Image[]> {
    const queryBuilder = this.createQueryBuilder()
    const rawMoneyAmounts = await queryBuilder
      .insert()
      .into(Image)
      .values(data)
      .returning("*")
      .execute()

    const relationIdLoader = new RelationIdLoader(
      queryBuilder.connection,
      this.queryRunner,
      queryBuilder.expressionMap.relationIdAttributes
    )
    const rawRelationIdResults = await relationIdLoader.load(
      rawMoneyAmounts.raw
    )
    const transformer = new RawSqlResultsToEntityTransformer(
      queryBuilder.expressionMap,
      queryBuilder.connection.driver,
      rawRelationIdResults,
      [],
      this.queryRunner
    )

    return transformer.transform(
      rawMoneyAmounts.raw,
      queryBuilder.expressionMap.mainAlias!
    ) as Image[]
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
