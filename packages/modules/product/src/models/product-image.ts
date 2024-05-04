import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import Product from "./product"

const imageUrlIndexName = "IDX_product_image_url"
const imageUrlIndexStatement = createPsqlIndexStatementHelper({
  name: imageUrlIndexName,
  tableName: "image",
  columns: ["url"],
  unique: false,
  where: "deleted_at IS NULL",
})

imageUrlIndexStatement.MikroORMIndex()
@Entity({ tableName: "image" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductImage {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  url: string

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

  @Index({ name: "IDX_product_image_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @ManyToMany(() => Product, (product) => product.images)
  products = new Collection<Product>(this)

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "img")
  }

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "img")
  }
}

export default ProductImage
