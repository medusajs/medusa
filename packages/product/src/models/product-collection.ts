import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { DALUtils, generateEntityId, kebabCase } from "@medusajs/utils"
import Product from "./product"
import { DAL } from "@medusajs/types"

type OptionalRelations = "products"
type OptionalFields = DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "product_collection" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductCollection {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Unique({
    name: "IDX_product_collection_handle_unique",
    properties: ["handle"],
  })
  handle?: string

  @OneToMany(() => Product, (product) => product.collection)
  products = new Collection<Product>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Index({ name: "IDX_product_collection_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pcol")

    if (!this.handle) {
      this.handle = kebabCase(this.title)
    }
  }
}

export default ProductCollection
