import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "cart_shipping_method_adjustment" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodAdjustment extends AdjustmentLine {
  @ManyToOne({
    entity: () => ShippingMethod,
    cascade: [Cascade.PERSIST],
  })
  shipping_method: ShippingMethod

  @createPsqlIndexStatementHelper({
    name: "IDX_adjustment_shipping_method_id",
    tableName: "cart_shipping_method_adjustment",
    columns: "shipping_method_id",
    where: "deleted_at IS NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text" })
  shipping_method_id: string

  @createPsqlIndexStatementHelper({
    name: "IDX_shipping_method_adjustment_promotion_id",
    tableName: "cart_shipping_method_adjustment",
    columns: "promotion_id",
    where: "deleted_at IS NULL and promotion_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  promotion_id: string | null = null

  @createPsqlIndexStatementHelper({
    tableName: "cart_shipping_method_adjustment",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "casmadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casmadj")
  }
}
