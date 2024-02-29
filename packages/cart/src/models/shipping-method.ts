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
  Check,
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
import ShippingMethodAdjustment from "./shipping-method-adjustment"
import ShippingMethodTaxLine from "./shipping-method-tax-line"

type OptionalShippingMethodProps =
  | "cart"
  | "is_tax_inclusive"
  | DAL.SoftDeletableEntityDateColumns

const CartIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_shipping_method_cart_id",
  tableName: "cart_shipping_method",
  columns: "cart_id",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const ShippingOptionIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_shipping_method_option_id",
  tableName: "cart_shipping_method",
  columns: "shipping_option_id",
  where: "deleted_at IS NULL AND shipping_option_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart_shipping_method",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart_shipping_method" })
@Check<ShippingMethod>({ expression: (columns) => `${columns.amount} >= 0` })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethod {
  [OptionalProps]?: OptionalShippingMethodProps

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
  name: string

  @Property({ columnType: "jsonb", nullable: true })
  description: string | null = null

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "boolean" })
  is_tax_inclusive = false

  @ShippingOptionIdIndex()
  @Property({ columnType: "text", nullable: true })
  shipping_option_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(
    () => ShippingMethodTaxLine,
    (taxLine) => taxLine.shipping_method,
    {
      cascade: [Cascade.PERSIST, "soft-remove"] as any,
    }
  )
  tax_lines = new Collection<ShippingMethodTaxLine>(this)

  @OneToMany(
    () => ShippingMethodAdjustment,
    (adjustment) => adjustment.shipping_method,
    {
      cascade: [Cascade.PERSIST, "soft-remove"] as any,
    }
  )
  adjustments = new Collection<ShippingMethodAdjustment>(this)

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
    this.id = generateEntityId(this.id, "casm")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casm")
  }
}
