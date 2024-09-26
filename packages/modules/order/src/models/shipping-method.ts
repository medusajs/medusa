import { BigNumberRawValue } from "@medusajs/framework/types"
import {
  BigNumber,
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  MikroOrmBigNumberProperty,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import OrderShippingMethodAdjustment from "./shipping-method-adjustment"
import OrderShippingMethodTaxLine from "./shipping-method-tax-line"

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ShippingOptionIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method",
  columns: "shipping_option_id",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_shipping_method" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class OrderShippingMethod {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "jsonb", nullable: true })
  description: string | null = null

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "boolean" })
  is_tax_inclusive: boolean = false

  @Property({ columnType: "boolean", default: false })
  is_custom_amount: boolean = false

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
    () => OrderShippingMethodTaxLine,
    (taxLine) => taxLine.shipping_method,
    {
      cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
    }
  )
  tax_lines = new Collection<Rel<OrderShippingMethodTaxLine>>(this)

  @OneToMany(
    () => OrderShippingMethodAdjustment,
    (adjustment) => adjustment.shipping_method,
    {
      cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
    }
  )
  adjustments = new Collection<Rel<OrderShippingMethodAdjustment>>(this)

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

  @Property({ columnType: "timestamptz", nullable: true })
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordsm")
  }
  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsm")
  }
}
