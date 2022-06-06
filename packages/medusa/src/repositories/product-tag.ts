import { EntityRepository, Repository } from "typeorm"
import { ProductTag } from "../models/product-tag"

@EntityRepository(ProductTag)
export class ProductTagRepository extends Repository<ProductTag> {
  public async listTagsByUsage(count = 10): Promise<ProductTag[]> {
    const tags = await this.query(
      `
        SELECT ID, O.USAGE_COUNT, PT.VALUE
        FROM PRODUCT_TAG PT
        LEFT JOIN
          (SELECT COUNT(*) AS USAGE_COUNT,
            PRODUCT_TAG_ID
            FROM PRODUCT_TAGS
            GROUP BY PRODUCT_TAG_ID) O ON O.PRODUCT_TAG_ID = PT.ID
        ORDER BY O.USAGE_COUNT DESC
        LIMIT $1`,
      [count]
    )

    return tags
  }
}
