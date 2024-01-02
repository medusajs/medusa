import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "address" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Address {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string | null

  @Property({ columnType: "text", nullable: true })
  company?: string | null

  @Property({ columnType: "text", nullable: true })
  first_name?: string | null

  @Property({ columnType: "text", nullable: true })
  last_name?: string | null

  @Property({ columnType: "text", nullable: true })
  address_1?: string | null

  @Property({ columnType: "text", nullable: true })
  address_2?: string | null

  @Property({ columnType: "text", nullable: true })
  city?: string | null

  @Property({ columnType: "text", nullable: true })
  country_code?: string | null

  @Property({ columnType: "text", nullable: true })
  province?: string | null

  @Property({ columnType: "text", nullable: true })
  postal_code?: string | null

  @Property({ columnType: "text", nullable: true })
  phone?: string | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

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
  deleted_at?: Date | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "addr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "addr")
  }
}
