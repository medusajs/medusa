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
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_shipping_method_tax_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodTaxLine extends TaxLine {
  @ManyToOne({
    entity: () => ShippingMethod,
    cascade: [Cascade.REMOVE, Cascade.PERSIST, "soft-remove"] as any,
  })
  shipping_method: ShippingMethod

  @createPsqlIndexStatementHelper({
    name: "IDX_tax_line_shipping_method_id",
    tableName: "cart_shipping_method_tax_line",
    columns: "shipping_method_id",
    where: "deleted_at IS NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text" })
  shipping_method_id: string

  @createPsqlIndexStatementHelper({
    name: "IDX_shipping_method_tax_line_tax_rate_id",
    tableName: "cart_shipping_method_tax_line",
    columns: "tax_rate_id",
    where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  tax_rate_id: string | null = null

  @createPsqlIndexStatementHelper({
    tableName: "cart_shipping_method_tax_line",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "casmtxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casmtxl")
  }
}
