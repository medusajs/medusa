import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Index,
  ManyToOne,
  OneToMany,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import Product from "./product"

@Entity({ tableName: "product_category" })
class ProductCategory {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: false})
  name: string

  @Property({ columnType: "text", default: '', nullable: false })
  description: string

  @Index({
    name: "IDX_product_category_handle",
    properties: ["handle"],
    expression:
      `CREATE UNIQUE INDEX "IDX_product_category_handle" ON "product_category" ("handle")`,
  })
  @Property({ columnType: "text", nullable: false })
  handle: string

  @Index({
    name: "IDX_product_category_path",
    properties: ["mpath"],
    expression:
      `CREATE INDEX "IDX_product_category_path" ON "product_category" ("mpath")`,
  })
  @Property({ columnType: "text" })
  mpath: string

  @Property({ columnType: "boolean", default: false })
  is_active: boolean

  @Property({ columnType: "boolean", default: false })
  is_internal: boolean

  @Property({ columnType: "numeric", nullable: false, default: 0 })
  rank: number

  @ManyToOne(() => ProductCategory)
  parent_category = new Collection<ProductCategory>(this);

  @OneToMany({
    entity: () => ProductCategory,
    mappedBy: productCategory => productCategory.parent_category
  })
  category_children = new Collection<ProductCategory>(this);

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
      this.handle = this.name.split(' ').join('_').toLowerCase()
    }
  }
}

export default ProductCategory
