import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  kebabCase,
  Searchable,
} from "@medusajs/utils"
import Product from "./product"

const collectionHandleIndexName = "IDX_collection_handle_unique"
const collectionHandleIndexStatement = createPsqlIndexStatementHelper({
  name: collectionHandleIndexName,
  tableName: "product_collection",
  columns: ["handle"],
  unique: true,
  where: "deleted_at IS NULL",
})

collectionHandleIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_collection" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductCollection {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
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

  @OnInit()
  @BeforeCreate()
  onInit() {
    this.id = generateEntityId(this.id, "pcol")

    if (!this.handle && this.title) {
      this.handle = kebabCase(this.title)
    }
  }
}

export default ProductCollection
