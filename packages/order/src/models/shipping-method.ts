import { BigNumberRawValue } from "@medusajs/types"
import {
  BigNumber,
  createPsqlIndexStatementHelper,
  generateEntityId,
  MikroOrmBigNumberProperty,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Order from "./order"
import ShippingMethodAdjustment from "./shipping-method-adjustment"
import ShippingMethodTaxLine from "./shipping-method-tax-line"

const ShippingOptionIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method",
  columns: "shipping_option_id",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method",
  columns: "order_id",
})

const OrderVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method",
  columns: ["order_id", "version"],
})

@Entity({ tableName: "order_shipping_method" })
@OrderVersionIndex.MikroORMIndex()
export default class ShippingMethod {
  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    columnType: "text",
    fieldName: "order_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne(() => Order, {
    persist: false,
  })
  order: Order

  @Property({
    columnType: "integer",
    defaultRaw: "1",
  })
  version: number = 1

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

  @Property({
    columnType: "text",
    nullable: true,
  })
  @ShippingOptionIdIndex.MikroORMIndex()
  shipping_option_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(
    () => ShippingMethodTaxLine,
    (taxLine) => taxLine.shipping_method,
    {
      cascade: [Cascade.PERSIST],
    }
  )
  tax_lines = new Collection<ShippingMethodTaxLine>(this)

  @OneToMany(
    () => ShippingMethodAdjustment,
    (adjustment) => adjustment.shipping_method,
    {
      cascade: [Cascade.PERSIST],
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
    this.order_id ??= this.order?.id
  }
  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsm")
    this.order_id ??= this.order?.id
  }
}
