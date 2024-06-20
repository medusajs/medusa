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
  Property,
  Rel,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import ShippingMethod from "./shipping-method"

const ShippingMethodIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_adjustment_shipping_method_id",
  tableName: "cart_shipping_method_adjustment",
  columns: "shipping_method_id",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const PromotionIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_shipping_method_adjustment_promotion_id",
  tableName: "cart_shipping_method_adjustment",
  columns: "promotion_id",
  where: "deleted_at IS NULL AND promotion_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart_shipping_method_adjustment",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart_shipping_method_adjustment" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodAdjustment extends AdjustmentLine {
  @ManyToOne({ entity: () => ShippingMethod, persist: false })
  shipping_method: Rel<ShippingMethod>

  @ShippingMethodIdIndex()
  @ManyToOne({
    entity: () => ShippingMethod,
    columnType: "text",
    fieldName: "shipping_method_id",
    mapToPk: true,
  })
  shipping_method_id: string

  @PromotionIdIndex()
  @Property({ columnType: "text", nullable: true })
  promotion_id: string | null = null

  @DeletedAtIndex()
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
