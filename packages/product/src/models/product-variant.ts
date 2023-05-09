import { Entity, PrimaryKey } from "@mikro-orm/core"

@Entity({ tableName: "product_variant" })
export default class ProductVariant {
  @PrimaryKey({ columnType: "text" })
  id: string
}
