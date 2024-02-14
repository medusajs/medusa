import { BigNumberRawValue } from "@medusajs/types"
import {
  BigNumber,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Check,
  Collection,
  Entity,
  ManyToOne,
  OnInit,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { BeforeUpdate } from "typeorm"
import Order from "./order"
import ShippingMethodAdjustment from "./shipping-method-adjustment"
import ShippingMethodTaxLine from "./shipping-method-tax-line"

const shippingOptionIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method",
  columns: "shipping_option_id",
})

@Entity({ tableName: "order_shipping_method" })
@Check<ShippingMethod>({ expression: (columns) => `${columns.amount} >= 0` })
export default class ShippingMethod {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  order_id: string

  @ManyToOne({
    entity: () => Order,
    fieldName: "order_id",
    index: "IDX_order_shipping_method_order_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  order: Order

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "jsonb", nullable: true })
  description: string | null = null

  @Property({ columnType: "numeric" })
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "boolean" })
  is_tax_inclusive = false

  @Property({
    columnType: "text",
    nullable: true,
  })
  @shippingOptionIdIndex.MikroORMIndex()
  shipping_option_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(
    () => ShippingMethodTaxLine,
    (taxLine) => taxLine.shipping_method,
    {
      cascade: [Cascade.REMOVE],
    }
  )
  tax_lines = new Collection<ShippingMethodTaxLine>(this)

  @OneToMany(
    () => ShippingMethodAdjustment,
    (adjustment) => adjustment.shipping_method,
    {
      cascade: [Cascade.REMOVE],
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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordsm")

    const val = new BigNumber(this.raw_amount ?? this.amount)

    this.amount = val.numeric
    this.raw_amount = val.raw!
  }

  @BeforeUpdate()
  onUpdate() {
    const val = new BigNumber(this.raw_amount ?? this.amount)

    this.amount = val.numeric
    this.raw_amount = val.raw as BigNumberRawValue
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsm")

    const val = new BigNumber(this.raw_amount ?? this.amount)

    this.amount = val.numeric
    this.raw_amount = val.raw!
  }
}
