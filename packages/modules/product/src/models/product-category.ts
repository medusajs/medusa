import {
  DALUtils,
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
  kebabCase,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  EventArgs,
  Filter,
  Index,
  ManyToMany,
  ManyToOne,
  OnInit,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Product from "./product"

const categoryHandleIndexName = "IDX_category_handle_unique"
const categoryHandleIndexStatement = createPsqlIndexStatementHelper({
  name: categoryHandleIndexName,
  tableName: "product_category",
  columns: ["handle"],
  unique: true,
  where: "deleted_at IS NULL",
})

const categoryMpathIndexName = "IDX_product_category_path"
const categoryMpathIndexStatement = createPsqlIndexStatementHelper({
  name: categoryMpathIndexName,
  tableName: "product_category",
  columns: ["mpath"],
  unique: false,
  where: "deleted_at IS NULL",
})

categoryMpathIndexStatement.MikroORMIndex()
categoryHandleIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_category" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductCategory {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text", nullable: false })
  name?: string

  @Searchable()
  @Property({ columnType: "text", default: "", nullable: false })
  description?: string

  @Searchable()
  @Property({ columnType: "text", nullable: false })
  handle?: string

  @Property({ columnType: "text", nullable: false })
  mpath?: string

  @Property({ columnType: "boolean", default: false })
  is_active?: boolean

  @Property({ columnType: "boolean", default: false })
  is_internal?: boolean

  @Property({
    columnType: "integer",
    nullable: false,
    default: 0,
  })
  rank: number

  @ManyToOne(() => ProductCategory, {
    columnType: "text",
    fieldName: "parent_category_id",
    nullable: true,
    mapToPk: true,
    onDelete: "cascade",
  })
  parent_category_id?: string | null

  @ManyToOne(() => ProductCategory, { nullable: true, persist: false })
  parent_category?: ProductCategory

  @OneToMany({
    entity: () => ProductCategory,
    mappedBy: (productCategory) => productCategory.parent_category,
  })
  category_children = new Collection<ProductCategory>(this)

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at?: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at?: Date

  @Index({ name: "IDX_product_category_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this)

  @OnInit()
  async onInit() {
    this.id = generateEntityId(this.id, "pcat")
    this.parent_category_id ??= this.parent_category?.id ?? null
  }

  @BeforeCreate()
  async onCreate(args: EventArgs<ProductCategory>) {
    this.id = generateEntityId(this.id, "pcat")
    this.parent_category_id ??= this.parent_category?.id ?? null

    if (!this.handle && this.name) {
      this.handle = kebabCase(this.name)
    }

    this.mpath = `${this.mpath ? this.mpath + "." : ""}${this.id}`
  }
}

export default ProductCategory
