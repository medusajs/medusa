import { EntityRepository, In, Repository } from "typeorm"
import { Image } from "../models/image"

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  public async upsertImages(imageUrls: string[]) {
    const existingImages = await this.find({
      where: {
        url: In(imageUrls),
      },
    })
    const existingImagesMap = this.buildImagesMap_(existingImages)

    const upsertedImgs: Image[] = []

    for (const url of imageUrls) {
      const aImg = existingImagesMap.get(url)
      if (aImg) {
        upsertedImgs.push(aImg)
      } else {
        const newImg = this.create({ url })
        const savedImg = await this.save(newImg)
        upsertedImgs.push(savedImg)
      }
    }

    return upsertedImgs
  }

  private buildImagesMap_(images: Image[]): Map<string, Image> {
    return new Map(
      images.map<[string, Image]>((img) => [img.url, img])
    )
  }
}
