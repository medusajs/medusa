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
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

const ShippingMethodIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_tax_line_shipping_method_id",
  tableName: "cart_shipping_method_tax_line",
  columns: "shipping_method_id",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const TaxRateIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_shipping_method_tax_line_tax_rate_id",
  tableName: "cart_shipping_method_tax_line",
  columns: "tax_rate_id",
  where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart_shipping_method_tax_line",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart_shipping_method_tax_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodTaxLine extends TaxLine {
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

  @TaxRateIdIndex()
  @Property({ columnType: "text", nullable: true })
  tax_rate_id: string | null = null

  @DeletedAtIndex()
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
