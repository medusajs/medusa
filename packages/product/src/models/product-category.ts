import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { generateEntityId } from "../utils"
import kebabCase from "lodash/kebabCase"

import Product from "./product"

@Entity({ tableName: "product_category" })
class ProductCategory {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: false })
  name: string

  @Property({ columnType: "text", default: "", nullable: false })
  description?: string

  @Index({
    name: "IDX_product_category_handle",
    properties: ["handle"],
    expression: `CREATE UNIQUE INDEX "IDX_product_category_handle" ON "product_category" ("handle")`,
  })
  @Property({ columnType: "text", nullable: false })
  handle?: string

  @Index({
    name: "IDX_product_category_path",
    properties: ["mpath"],
    expression: `CREATE INDEX "IDX_product_category_path" ON "product_category" ("mpath")`,
  })
  // TODO: mpath shouldn't be nullable, remove this when mpath is processed before create
  @Property({ columnType: "text", nullable: true })
  mpath?: string

  @Property({ columnType: "boolean", default: false })
  is_active?: boolean

  @Property({ columnType: "boolean", default: false })
  is_internal?: boolean

  @Property({ columnType: "numeric", nullable: false, default: 0 })
  rank?: number

  @ManyToOne(() => ProductCategory, { nullable: true })
  parent_category?: ProductCategory

  @OneToMany({
    entity: () => ProductCategory,
    mappedBy: (productCategory) => productCategory.parent_category,
  })
  category_children = new Collection<ProductCategory>(this)

  @Property({ onCreate: () => new Date(), columnType: "timestamptz" })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
  })
  updated_at: Date

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pcat")

    if (!this.handle) {
      this.handle = kebabCase(this.name)
    }
  }
}

export default ProductCategory
