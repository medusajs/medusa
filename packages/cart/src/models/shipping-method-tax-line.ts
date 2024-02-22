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
    index: "IDX_tax_line_shipping_method_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  shipping_method: ShippingMethod

  @Property({ columnType: "text" })
  shipping_method_id: string

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_shipping_method_tax_line_tax_rate_id",
  })
  tax_rate_id?: string | null

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
