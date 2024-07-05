import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import {
  DALUtils,
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"

const typeValueIndexName = "IDX_type_value_unique"
const typeValueIndexStatement = createPsqlIndexStatementHelper({
  name: typeValueIndexName,
  tableName: "product_type",
  columns: ["value"],
  unique: true,
  where: "deleted_at IS NULL",
})

typeValueIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_type" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductType {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "json", nullable: true })
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

  @Index({ name: "IDX_product_type_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @OnInit()
  @BeforeCreate()
  onInit() {
    this.id = generateEntityId(this.id, "ptyp")
  }
}

export default ProductType
