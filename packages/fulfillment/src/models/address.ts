import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

type OptionalAddressProps = DAL.SoftDeletableEntityDateColumns

const FulfillmentDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_address",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "fulfillment_address" })
export default class Address {
  [OptionalProps]: OptionalAddressProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  company: string | null = null

  @Property({ columnType: "text", nullable: true })
  first_name: string | null = null

  @Property({ columnType: "text", nullable: true })
  last_name: string | null = null

  @Property({ columnType: "text", nullable: true })
  address_1: string | null = null

  @Property({ columnType: "text", nullable: true })
  address_2: string | null = null

  @Property({ columnType: "text", nullable: true })
  city: string | null = null

  @Property({ columnType: "text", nullable: true })
  country_code: string | null = null

  @Property({ columnType: "text", nullable: true })
  province: string | null = null

  @Property({ columnType: "text", nullable: true })
  postal_code: string | null = null

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

  @Property({ columnType: "timestamptz", nullable: true })
  @FulfillmentDeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fuladdr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fuladdr")
  }
}
