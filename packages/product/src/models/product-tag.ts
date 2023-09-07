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

@Entity({ tableName: "product_tag" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductTag {
  [OptionalProps]?: OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_tag_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @ManyToMany(() => Product, (product) => product.tags)
  products = new Collection<Product>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ptag")
  }
}

export default ProductTag
