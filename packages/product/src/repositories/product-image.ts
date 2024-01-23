import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { Image } from "@models"

// eslint-disable-next-line max-len
export class ProductImageRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Image
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async upsert(urls: string[], context: Context = {}): Promise<Image[]> {
    const data = urls.map((url) => ({ url }))

    return await super.upsert(data, context)
  }
}
