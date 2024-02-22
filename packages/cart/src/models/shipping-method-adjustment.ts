import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  Property
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "cart_shipping_method_adjustment" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodAdjustment extends AdjustmentLine {
  @ManyToOne({
    entity: () => ShippingMethod,
    persist: false,
  })
  shipping_method: ShippingMethod

  @Property({ columnType: "text", index: "IDX_adjustment_shipping_method_id" })
  shipping_method_id: string

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_shipping_method_adjustment_promotion_id",
  })
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
