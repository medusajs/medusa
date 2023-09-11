import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import { Product } from "@models"
import ProductOptionValue from "./product-option-value"
import { DAL } from "@medusajs/types"

type OptionalFields =
  | "allow_backorder"
  | "manage_inventory"
  | "product"
  | "product_id"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "product_variant" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductVariant {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  @Unique({
    name: "IDX_product_variant_sku_unique",
    properties: ["sku"],
  })
  sku?: string | null

  @Property({ columnType: "text", nullable: true })
  @Unique({
    name: "IDX_product_variant_barcode_unique",
    properties: ["barcode"],
  })
  barcode?: string | null

  @Property({ columnType: "text", nullable: true })
  @Unique({
    name: "IDX_product_variant_ean_unique",
    properties: ["ean"],
  })
  ean?: string | null

  @Property({ columnType: "text", nullable: true })
  @Unique({
    name: "IDX_product_variant_upc_unique",
    properties: ["upc"],
  })
  upc?: string | null

  // Note: Upon serialization, this turns to a string. This is on purpose, because you would loose
  // precision if you cast numeric to JS number, as JS number is a float.
  // Ref: https://github.com/mikro-orm/mikro-orm/issues/2295
  @Property({ columnType: "numeric", default: 100 })
  inventory_quantity?: number = 100

  @Property({ columnType: "boolean", default: false })
  allow_backorder?: boolean = false

  @Property({ columnType: "boolean", default: true })
  manage_inventory?: boolean = true

  @Property({ columnType: "text", nullable: true })
  hs_code?: string | null

  @Property({ columnType: "text", nullable: true })
  origin_country?: string | null

  @Property({ columnType: "text", nullable: true })
  mid_code?: string | null

  @Property({ columnType: "text", nullable: true })
  material?: string | null

  @Property({ columnType: "numeric", nullable: true })
  weight?: number | null

  @Property({ columnType: "numeric", nullable: true })
  length?: number | null

  @Property({ columnType: "numeric", nullable: true })
  height?: number | null

  @Property({ columnType: "numeric", nullable: true })
  width?: number | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "numeric", nullable: true, default: 0 })
  variant_rank?: number | null

  @Property({ columnType: "text", nullable: true })
  product_id!: string

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

  @Index({ name: "IDX_product_variant_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @ManyToOne(() => Product, {
    onDelete: "cascade",
    index: "IDX_product_variant_product_id",
    fieldName: "product_id",
  })
  product!: Product

  @OneToMany(() => ProductOptionValue, (optionValue) => optionValue.variant, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE, "soft-remove" as any],
  })
  options = new Collection<ProductOptionValue>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "variant")
  }
}

export default ProductVariant
