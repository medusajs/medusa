import { generateEntityId, kebabCase } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  EventArgs,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import Product from "./product"
import { DAL } from "@medusajs/types"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "product_category" })
class ProductCategory {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: false })
  name?: string

  @Property({ columnType: "text", default: "", nullable: false })
  description?: string

  @Unique({
    name: "IDX_product_category_handle",
    properties: ["handle"],
  })
  @Property({ columnType: "text", nullable: false })
  handle?: string

  @Index({
    name: "IDX_product_category_path",
    properties: ["mpath"],
  })
  @Property({ columnType: "text", nullable: false })
  mpath?: string

  @Property({ columnType: "boolean", default: false })
  is_active?: boolean

  @Property({ columnType: "boolean", default: false })
  is_internal?: boolean

  @Property({ columnType: "numeric", nullable: false, default: 0 })
  rank?: number

  @Property({ columnType: "text", nullable: true })
  parent_category_id?: string | null

  @ManyToOne(() => ProductCategory, { nullable: true })
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

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this)

  @BeforeCreate()
  async onCreate(args: EventArgs<ProductCategory>) {
    this.id = generateEntityId(this.id, "pcat")

    if (!this.handle) {
      this.handle = kebabCase(this.name)
    }

    const { em } = args
    const parentCategoryId = args.changeSet?.entity?.parent_category?.id
    let parentCategory: ProductCategory | null = null

    if (parentCategoryId) {
      parentCategory = await em.findOne(ProductCategory, parentCategoryId)
    }

    if (parentCategory) {
      this.mpath = `${parentCategory?.mpath}${this.id}.`
    } else {
      this.mpath = `${this.id}.`
    }
  }
}

export default ProductCategory
