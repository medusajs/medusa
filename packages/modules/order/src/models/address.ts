import { DAL } from "@medusajs/framework/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
  Searchable,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

type OptionalAddressProps = DAL.ModelDateColumns

const CustomerIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_address",
  columns: "customer_id",
})

@Entity({ tableName: "order_address" })
export default class OrderAddress {
  [OptionalProps]: OptionalAddressProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  @CustomerIdIndex.MikroORMIndex()
  customer_id: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  company: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  first_name: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  last_name: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  address_1: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  address_2: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  city: string | null = null

  @Property({ columnType: "text", nullable: true })
  country_code: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  province: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  postal_code: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  phone: string | null = null

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordaddr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordaddr")
  }
}
