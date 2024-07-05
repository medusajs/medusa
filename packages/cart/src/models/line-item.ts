import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  DALUtils,
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Cart from "./cart"
import LineItemAdjustment from "./line-item-adjustment"
import LineItemTaxLine from "./line-item-tax-line"

type OptionalLineItemProps =
  | "is_discoutable"
  | "is_tax_inclusive"
  | "compare_at_unit_price"
  | "requires_shipping"
  | "cart"
  | DAL.SoftDeletableEntityDateColumns

const CartIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_line_item_cart_id",
  tableName: "cart_line_item",
  columns: "cart_id",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const VariantIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_line_item_variant_id",
  tableName: "cart_line_item",
  columns: "variant_id",
  where: "deleted_at IS NULL AND variant_id IS NOT NULL",
}).MikroORMIndex

const ProductIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_line_item_product_id",
  tableName: "cart_line_item",
  columns: "product_id",
  where: "deleted_at IS NULL AND product_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart_line_item",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart_line_item" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @CartIdIndex()
  @ManyToOne({
    entity: () => Cart,
    columnType: "text",
    fieldName: "cart_id",
    mapToPk: true,
  })
  cart_id: string

  @ManyToOne({ entity: () => Cart, persist: false })
  cart: Cart

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  subtitle: string | null = null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null = null

  @Property({ columnType: "integer" })
  quantity: number

  @VariantIdIndex()
  @Property({ columnType: "text", nullable: true })
  variant_id: string | null = null

  @ProductIdIndex()
  @Property({ columnType: "text", nullable: true })
  product_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_title: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_description: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_subtitle: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_type: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_collection: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_handle: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_sku: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_barcode: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_title: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  variant_option_values: Record<string, unknown> | null = null

  @Property({ columnType: "boolean" })
  requires_shipping = true

  @Property({ columnType: "boolean" })
  is_discountable = true

  @Property({ columnType: "boolean" })
  is_tax_inclusive = false

  @MikroOrmBigNumberProperty({ nullable: true })
  compare_at_unit_price?: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_compare_at_unit_price: BigNumberRawValue | null = null

  @MikroOrmBigNumberProperty()
  unit_price: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_unit_price: BigNumberRawValue

  @OneToMany(() => LineItemTaxLine, (taxLine) => taxLine.item, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  tax_lines = new Collection<LineItemTaxLine>(this)

  @OneToMany(() => LineItemAdjustment, (adjustment) => adjustment.item, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  adjustments = new Collection<LineItemAdjustment>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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

  @DeletedAtIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cali")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cali")
  }
}
