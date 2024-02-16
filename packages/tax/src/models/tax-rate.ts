import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

type OptionalTaxRateProps = DAL.EntityDateColumns

@Entity({ tableName: "tax_rate" })
export default class TaxRate {
  [OptionalProps]: OptionalTaxRateProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "real", nullable: true })
  rate: number | null = null

  @Property({ columnType: "text", nullable: true })
  code: string | null = null

  @Property({ columnType: "text" })
  name: string

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "txr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "txr")
  }
}
