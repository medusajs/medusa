import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { DALUtils, generateEntityId } from "@medusajs/utils"
import Product from "./product"

type OptionalRelations = "products"

@Entity({ tableName: "image" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductImage {
  [OptionalProps]?: OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Index({ name: "IDX_product_image_url" })
  @Property({ columnType: "text" })
  url: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_image_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @ManyToMany(() => Product, (product) => product.images)
  products = new Collection<Product>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "img")
  }
}

export default ProductImage
