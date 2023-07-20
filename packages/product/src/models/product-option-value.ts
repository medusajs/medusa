import {
  BeforeCreate,
  Entity,
  Index,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { ProductOption, ProductVariant } from "./index"

import { SoftDeletable } from "../utils"
import { generateEntityId } from "@medusajs/utils"

type OptionalFields =
  | "created_at"
  | "updated_at"
  | "allow_backorder"
  | "manage_inventory"
  | "option_id"
  | "variant_id"
type OptionalRelations = "product" | "option" | "variant"

@Entity({ tableName: "product_option_value" })
@SoftDeletable()
class ProductOptionValue {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ persist: false })
  option_id!: string

  @ManyToOne(() => ProductOption, {
    index: "IDX_product_option_value_option_id",
    fieldName: "option_id",
  })
  option: ProductOption

  @Property({ persist: false })
  variant_id!: string

  @ManyToOne(() => ProductVariant, {
    onDelete: "cascade",
    index: "IDX_product_option_value_variant_id",
    fieldName: "variant_id",
  })
  variant: ProductVariant

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_option_value_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "optval")
  }
}

export default ProductOptionValue
