import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/core"
import TaxRate from "./tax-rate"

const TABLE_NAME = "product_tax_rate"

const taxRateIdIndexName = "IDX_product_tax_rate_rate_id"

@Entity({ tableName: TABLE_NAME })
export default class ProductTaxRate {
  @PrimaryKey({ columnType: "text" })
  tax_rate_id!: string

  @PrimaryKey({ columnType: "text" })
  product_id!: string;

  [PrimaryKeyProp]?: ["tax_rate_id", "product_id"]

  @ManyToOne(() => TaxRate, {
    fieldName: "tax_rate_id",
    index: taxRateIdIndexName,
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  tax_rate: TaxRate

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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

  @Property({ columnType: "text", nullable: true })
  created_by: string | null = null
}
